import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin";

const ProductSchema = z.object({
  slug: z.string().min(1), product_code: z.string().optional().nullable(), category_id: z.string().uuid().optional().nullable(),
  name_vi: z.string().min(1), name_en: z.string().min(1), short_description_vi: z.string().optional(), short_description_en: z.string().optional(),
  description_vi: z.string().optional(), description_en: z.string().optional(), material_vi: z.string().optional(), material_en: z.string().optional(),
  standards_vi: z.string().optional(), standards_en: z.string().optional(), applications_vi: z.string().optional(), applications_en: z.string().optional(),
  search_keywords: z.string().optional(), main_image_path: z.string().optional().nullable(), published: z.boolean().default(true),
});

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await requireAdmin();
  if (!supabase) return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });
  const { id } = await params;
  const body = ProductSchema.parse(await request.json());
  const { data, error } = await supabase.from("products").update(body).eq("id", id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ data });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await requireAdmin();
  if (!supabase) return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });
  const { id } = await params;
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
