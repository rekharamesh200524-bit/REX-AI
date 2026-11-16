import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import {
  getConversationById,
  updateConversationTitle,
  deleteConversation,
} from "@/lib/db/conversations";

interface RouteParams {
  params: Promise<{ id: string }>;
}

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
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { data: conversation, error } = await getConversationById(
      supabase,
      conversationId,
      user.id
    );

    if (error || !conversation) {
      return NextResponse.json(
        { error: "Conversation not found or access denied." },
        { status: 404 }
      );
    }

    return NextResponse.json({ conversation });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: RouteParams) {
  try {
    const { id: conversationId } = await params;
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const title = typeof body.title === "string" ? body.title.trim() : "";

    if (!title) {
      return NextResponse.json(
        { error: "Title is required for renaming." },
        { status: 400 }
      );
    }

    const { data: conversation, error } = await updateConversationTitle(
      supabase,
      {
        conversationId,
        userId: user.id,
        title,
      }
    );

    if (error || !conversation) {
      return NextResponse.json(
        { error: "Failed to update conversation title." },
        { status: 500 }
      );
    }

    return NextResponse.json({ conversation });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: RouteParams) {
  try {
    const { id: conversationId } = await params;
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { success, error } = await deleteConversation(
      supabase,
      conversationId,
      user.id
    );

    if (error || !success) {
      return NextResponse.json(
        { error: "Failed to delete conversation." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, conversationId });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

