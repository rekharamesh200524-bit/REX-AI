import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getConversationMessages, createMessage } from "@/lib/db/messages";
import { getConversationById } from "@/lib/db/conversations";
import { generateRexResponse } from "@/lib/services/rexAiService";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET: Retrieve all messages for a conversation
 */
export async function GET(_req: Request, { params }: RouteParams) {
  try {
    const { id: conversationId } = await params;
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }

    // Verify user owns the conversation
    const { data: conv, error: convError } = await getConversationById(
      supabase,
      conversationId,
      user.id
    );

    if (convError || !conv) {
      return NextResponse.json(
        { error: "Conversation not found or access denied." },
        { status: 404 }
      );
    }

    // Fetch messages (RLS also verifies ownership)
    const { data: messages, error: msgError } = await getConversationMessages(
      supabase,
      conversationId
    );

    if (msgError) {
      return NextResponse.json(
        { error: "Failed to load conversation messages." },
        { status: 500 }
      );
    }

    return NextResponse.json({ messages: messages || [] });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * POST: Send a message, save user message to database,
 * generate placeholder AI response, and save assistant message to database.
 */
export async function POST(req: Request, { params }: RouteParams) {
  try {
    const { id: conversationId } = await params;
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in to send messages." },
        { status: 401 }
      );
    }

    // Verify user owns conversation
    const { data: conv, error: convError } = await getConversationById(
      supabase,
      conversationId,
      user.id
    );

    if (convError || !conv) {
      return NextResponse.json(
        { error: "Conversation not found or access denied." },
        { status: 404 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const content = typeof body.content === "string" ? body.content.trim() : "";
    const model = typeof body.model === "string" ? body.model : "REX-4 Omni";

    if (!content) {
      return NextResponse.json(
        { error: "Message content cannot be empty." },
        { status: 400 }
      );
    }

    // 1. Save User Message in database
    const { data: userMessage, error: userMsgError } = await createMessage(
      supabase,
      {
        conversationId,
        role: "user",
        content,
      }
    );

    if (userMsgError || !userMessage) {
      return NextResponse.json(
        { error: "Failed to save user message to database." },
        { status: 500 }
      );
    }

    // 2. Generate Placeholder AI response (REX service layer)
    const aiResponse = await generateRexResponse(content, model);

    // 3. Save Assistant Message in database
    const { data: assistantMessage, error: aiMsgError } = await createMessage(
      supabase,
      {
        conversationId,
        role: "assistant",
        content: aiResponse.content,
      }
    );

    if (aiMsgError || !assistantMessage) {
      return NextResponse.json(
        {
          userMessage,
          error: "User message saved, but failed to save assistant message.",
        },
        { status: 500 }
      );
    }

    // Return both persisted messages and code snippet if any
    return NextResponse.json(
      {
        userMessage,
        assistantMessage,
        codeSnippet: aiResponse.codeSnippet,
      },
      { status: 201 }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

