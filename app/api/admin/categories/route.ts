import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin";

const Schema = z.object({
  slug: z.string().min(1),
  name_vi: z.string().min(1),
  name_en: z.string().min(1),
  description_vi: z.string().optional(),
  description_en: z.string().optional(),
  image: z.string().optional(),
  published: z.boolean().default(true),
});

export async function GET() {
  try {
    const s = await requireAdmin();
    if (!s) return NextResponse.json({ data: [] });
    const { data, error } = await s
      .from("categories")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ data });
  } catch (err) {
    console.error("GET /api/admin/categories error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Lỗi không xác định" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const s = await requireAdmin();
    if (!s) return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });
    const body = Schema.parse(await req.json());
    const { data, error } = await s.from("categories").insert(body).select().single();
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ data });
  } catch (err) {
    console.error("POST /api/admin/categories error:", err);
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Dữ liệu không hợp lệ", details: err.issues }, { status: 400 });
    }
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Lỗi không xác định" },
      { status: 500 },
    );
  }
}

export async function PUT(req: Request) {
  try {
    const s = await requireAdmin();
    if (!s) return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });
    const body = Schema.extend({ id: z.string().uuid() }).parse(await req.json());
    const { id, ...values } = body;
    const { data, error } = await s.from("categories").update(values).eq("id", id).select().single();
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ data });
  } catch (err) {
    console.error("PUT /api/admin/categories error:", err);
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Dữ liệu không hợp lệ", details: err.issues }, { status: 400 });
    }
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Lỗi không xác định" },
      { status: 500 },
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const s = await requireAdmin();
    if (!s) return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });
    const { id } = z.object({ id: z.string().uuid() }).parse(await req.json());
    const { error } = await s.from("categories").delete().eq("id", id);
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("DELETE /api/admin/categories error:", err);
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Dữ liệu không hợp lệ", details: err.issues }, { status: 400 });
    }
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Lỗi không xác định" },
      { status: 500 },
    );
  }
}
