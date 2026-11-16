import { SupabaseClient } from "@supabase/supabase-js";
import { Database, DbConversation } from "@/types/database";

export interface CreateConversationParams {
  userId: string;
  title?: string;
}

export interface UpdateConversationParams {
  conversationId: string;
  userId: string;
  title: string;
}

/**
 * Fetch all conversations belonging to the authenticated user.
 */
export async function getUserConversations(
  client: SupabaseClient<Database>,
  userId: string
): Promise<{ data: DbConversation[] | null; error: Error | null }> {
  try {
    const { data, error } = await client
      .from("conversations")
      .select("*")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false });

    if (error) throw error;
    return { data, error: null };
  } catch (err: unknown) {
    const error = err instanceof Error ? err : new Error(String(err));
    return { data: null, error };
  }
}

/**
 * Fetch a single conversation by ID for an authorized user.
 */
export async function getConversationById(
  client: SupabaseClient<Database>,
  conversationId: string,
  userId: string
): Promise<{ data: DbConversation | null; error: Error | null }> {
  try {
    const { data, error } = await client
      .from("conversations")
      .select("*")
      .eq("id", conversationId)
      .eq("user_id", userId)
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (err: unknown) {
    const error = err instanceof Error ? err : new Error(String(err));
    return { data: null, error };
  }
}

/**
 * Create a new conversation for a user.
 */
export async function createConversation(
  client: SupabaseClient<Database>,
  { userId, title = "New Conversation" }: CreateConversationParams
): Promise<{ data: DbConversation | null; error: Error | null }> {
  try {
    const { data, error } = await client
      .from("conversations")
      .insert({
        user_id: userId,
        title,
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
 * Update the title of a conversation.
 */
export async function updateConversationTitle(
  client: SupabaseClient<Database>,
  { conversationId, userId, title }: UpdateConversationParams
): Promise<{ data: DbConversation | null; error: Error | null }> {
  try {
    const { data, error } = await client
      .from("conversations")
      .update({
        title,
        updated_at: new Date().toISOString(),
      })
      .eq("id", conversationId)
      .eq("user_id", userId)
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
 * Delete a conversation by ID. Cascades to delete related messages.
 */
export async function deleteConversation(
  client: SupabaseClient<Database>,
  conversationId: string,
  userId: string
): Promise<{ success: boolean; error: Error | null }> {
  try {
    const { error } = await client
      .from("conversations")
      .delete()
      .eq("id", conversationId)
      .eq("user_id", userId);

    if (error) throw error;
    return { success: true, error: null };
  } catch (err: unknown) {
    const error = err instanceof Error ? err : new Error(String(err));
    return { success: false, error };
  }
}

