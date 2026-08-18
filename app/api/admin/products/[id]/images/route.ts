import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin";
const Schema = z.object({ images: z.array(z.string()).max(12) });
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await requireAdmin();
  if (!supabase) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const body = Schema.parse(await request.json());
  const { error: removeError } = await supabase.from("product_images").delete().eq("product_id", id);
  if (removeError) return NextResponse.json({ error: removeError.message }, { status: 400 });
  if (body.images.length) {
    const rows = body.images.map((image_path, sort_order) => ({ product_id: id, image_path, sort_order }));
    const { error } = await supabase.from("product_images").insert(rows);
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  }
  return NextResponse.json({ ok: true });
}
