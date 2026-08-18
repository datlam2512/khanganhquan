import { NextResponse } from "next/server";
import { logoutDemoAdmin } from "@/lib/admin";
import { hasSupabaseConfig } from "@/lib/data";
import { createClient } from "@/lib/supabase/server";

export async function POST() {
  await logoutDemoAdmin();
  if (hasSupabaseConfig()) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }
  return NextResponse.json({ ok: true });
}
