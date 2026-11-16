import { NextResponse } from "next/server";
import { isSupabaseConfigured, createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET() {
  const configured = isSupabaseConfigured();

  if (!configured) {
    return NextResponse.json({
      status: "pending_configuration",
      connected: false,
      message:
        "Supabase credentials are not configured yet or are using placeholder values in .env.local. Update NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY, then run the SQL migration in Supabase SQL Editor.",
      migrationPath: "supabase/migrations/20261116000000_rex_ai_initial_schema.sql",
      schema: {
        tables: ["users", "conversations", "messages"],
        security: "Row Level Security (RLS) enabled on all tables",
      },
    });
  }

  try {
    const supabase = await createServerSupabaseClient();
    // Verify connection by attempting to select from conversations
    const { error } = await supabase.from("conversations").select("id").limit(1);

    if (error) {
      return NextResponse.json(
        {
          status: "connection_error",
          connected: false,
          error: error.message,
          hint: "Ensure the migration script (supabase/migrations/20261116000000_rex_ai_initial_schema.sql) has been run in your Supabase SQL Editor.",
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      status: "connected",
      connected: true,
      application: "REX AI",
      message: "Successfully connected to Supabase PostgreSQL.",
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      {
        status: "error",
        connected: false,
        error: message,
      },
      { status: 500 }
    );
  }
}
