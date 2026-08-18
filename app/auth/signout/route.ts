import { NextResponse } from "next/server";
import { logoutDemoAdmin } from "@/lib/admin";
import { createClient } from "@/lib/supabase/server";
import { hasSupabaseConfig } from "@/lib/data";

export async function POST(request: Request) {
  await logoutDemoAdmin();
  if (hasSupabaseConfig()) {
    try { const supabase = await createClient(); await supabase.auth.signOut(); } catch {}
  }
  return NextResponse.redirect(new URL("/admin/login", request.url));
}
