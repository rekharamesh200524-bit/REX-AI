import { SupabaseClient } from "@supabase/supabase-js";
import { Database, DbMessage, UserRole } from "@/types/database";

export interface CreateMessageParams {
  conversationId: string;
  role: UserRole;
  content: string;
}

/**
 * Fetch all messages for a specific conversation, ordered chronologically.
 * RLS ensures the caller only receives messages if they own the parent conversation.
 */
export async function getConversationMessages(
  client: SupabaseClient<Database>,
  conversationId: string
): Promise<{ data: DbMessage[] | null; error: Error | null }> {
  try {
    const { data, error } = await client
      .from("messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });

    if (error) throw error;
    return { data, error: null };
  } catch (err: unknown) {
    const error = err instanceof Error ? err : new Error(String(err));
    return { data: null, error };
  }
}

/**
 * Insert a message into a conversation.
 * RLS verifies that the authenticated user owns the target conversation.
 */
export async function createMessage(
  client: SupabaseClient<Database>,
  { conversationId, role, content }: CreateMessageParams
): Promise<{ data: DbMessage | null; error: Error | null }> {
  try {
    const { data, error } = await client
      .from("messages")
      .insert({
        conversation_id: conversationId,
        role,
        content,
      })
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (err: unknown) {
    const error = err instanceof Error ? err : new Error(String(err));
    return { data: null, error };
  }
}

/**
 * Delete a specific message by ID.
 */
export async function deleteMessage(
  client: SupabaseClient<Database>,
  messageId: string
): Promise<{ success: boolean; error: Error | null }> {
  try {
    const { error } = await client
      .from("messages")
      .delete()
      .eq("id", messageId);

    if (error) throw error;
    return { success: true, error: null };
  } catch (err: unknown) {
    const error = err instanceof Error ? err : new Error(String(err));
    return { success: false, error };
  }
}

