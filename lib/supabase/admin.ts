import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/types/database";

/**
 * Server-only Supabase Admin Client.
 *
 * CAUTION:
 * This client bypasses Row Level Security (RLS) using the SUPABASE_SERVICE_ROLE_KEY.
 * It must strictly NEVER be imported in client-side code, React components,
 * or exposed in any API response.
 */
export function createAdminSupabaseClient(): SupabaseClient<Database> {
  // Guard against accidental client-side invocation
  if (typeof window !== "undefined") {
    throw new Error(
      "SECURITY ERROR: createAdminSupabaseClient cannot be executed in the browser."
    );
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "Missing Supabase admin configuration. Ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local."
    );
  }

  return createClient<Database>(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

