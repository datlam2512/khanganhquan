import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { hasSupabaseConfig } from "@/lib/data";
import { z } from "zod";

const EventSchema = z.object({
  page_path: z.string().max(500),
  session_id: z.string().max(200),
  device_type: z.string().max(40),
  browser: z.string().max(80),
  referrer: z.string().max(1000).optional().nullable(),
});

export async function POST(request: Request) {
  if (!hasSupabaseConfig()) return NextResponse.json({ ok: true });
  try {
    const body = EventSchema.parse(await request.json());
    const supabase = await createClient();
    const { error } = await supabase.from("analytics_events").insert({ event_type: "page_view", ...body });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Invalid event" }, { status: 400 });
  }
}
