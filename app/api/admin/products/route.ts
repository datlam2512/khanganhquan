import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin";

const SpecGroupSchema = z
  .array(z.record(z.string(), z.any()))
  .default([]);
const ProductSchema = z.object({
  slug: z.string().min(1),
  code: z.string().optional().nullable(),
  category_id: z.string().optional().nullable(),

  name_vi: z.string().min(1),
  name_en: z.string().min(1),

  short_vi: z.string().optional().default(""),
  short_en: z.string().optional().default(""),

  description_vi: z.string().optional().default(""),
  description_en: z.string().optional().default(""),

  material_vi: z.string().optional().default(""),
  material_en: z.string().optional().default(""),

  spec_groups_vi: SpecGroupSchema,
  spec_groups_en: SpecGroupSchema,

  published: z.boolean().default(true),

  // không nằm trong bảng products -> xử lý riêng
  image_path: z.string().optional().nullable(),
});

export async function POST(request: Request) {
  try {
    const supabase = await requireAdmin();
    if (!supabase)
      return NextResponse.json(
        { error: "Supabase is not configured." },
        { status: 503 },
      );

    const body = ProductSchema.parse(await request.json());
    const { image_path, ...productData } = body;

    const { data, error } = await supabase
      .from("products")
      .insert(productData)
      .select()
      .single();

    if (error)
      return NextResponse.json({ error: error.message }, { status: 400 });

    // Nếu có ảnh, tạo bản ghi ảnh chính trong product_images
    if (image_path) {
      const { error: imageError } = await supabase
        .from("product_images")
        .insert({
          product_id: data.id,
          image_url: image_path,
          is_primary: true,
          sort_order: 0,
        });

      if (imageError) {
        console.error("Insert product_images error:", imageError);
        // không rollback product, chỉ log lại để không chặn việc tạo sản phẩm
      }
    }

    return NextResponse.json({ data });
  } catch (err) {
    console.error("POST /api/admin/products error:", err);
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Dữ liệu không hợp lệ", details: err.issues },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Lỗi không xác định" },
      { status: 500 },
    );
  }
}
export async function GET() {
  const supabase = await requireAdmin();
  if (!supabase) return NextResponse.json({ data: [] });
  const { data, error } = await supabase
    .from("products")
    .select("*,categories(slug,name_vi,name_en)")
    .order("created_at", { ascending: false });
  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ data });
}
