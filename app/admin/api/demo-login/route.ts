import { NextResponse } from "next/server";
import { loginDemoAdmin } from "@/lib/admin";
import { z } from "zod";

const Schema = z.object({ email: z.string().email(), password: z.string().min(1) });

export async function POST(request: Request) {
  const parsed = Schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });
  const ok = await loginDemoAdmin(parsed.data.email, parsed.data.password);
  return ok ? NextResponse.json({ ok: true }) : NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
}
