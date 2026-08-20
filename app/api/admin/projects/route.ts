import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin";

const Schema = z.object({
  slug: z
    .string()
    .min(1, "Slug không được để trống")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug phải có dạng: du-an-cong-trinh"),
  title_vi: z.string().min(1),
  title_en: z.string().min(1),
  description_vi: z.string().optional(),
  description_en: z.string().optional(),
  location: z.string().optional(),
  year: z.coerce.number().int().optional().nullable(),
  equipment_vi: z.string().optional(),
  equipment_en: z.string().optional(),
  scope_vi: z.string().optional(),
  scope_en: z.string().optional(),
  cover_image_path: z.string().optional(),
  sort_order: z.coerce.number().int().default(0),
  published: z.boolean().default(true),
});

type ProjectImageRow = {
  id: string;
  image_path: string;
  sort_order: number | null;
};

type ProjectRow = Record<string, unknown> & {
  project_images?: ProjectImageRow[] | null;
};

export async function GET() {
  try {
    const s = await requireAdmin();
    if (!s) return NextResponse.json({ data: [] });

    const { data, error } = await s
      .from("projects")
      .select("*,project_images(id,image_path,sort_order)")
      .order("sort_order", { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    const rows = (data ?? []) as unknown as ProjectRow[];

    const mapped = rows.map((project) => ({
      ...project,
      gallery: [...(project.project_images ?? [])].sort(
        (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0),
      ),
    }));

    return NextResponse.json({ data: mapped });
  } catch (err) {
    console.error("GET /api/admin/projects error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Lỗi không xác định" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const s = await requireAdmin();
    if (!s)
      return NextResponse.json(
        { error: "Supabase is not configured." },
        { status: 503 },
      );
    const body = Schema.parse(await req.json());
    const { data, error } = await s
      .from("projects")
      .insert(body)
      .select()
      .single();
    if (error)
      return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ data });
  } catch (err) {
    console.error("POST /api/admin/projects error:", err);
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

export async function PUT(req: Request) {
  try {
    const s = await requireAdmin();
    if (!s)
      return NextResponse.json(
        { error: "Supabase is not configured." },
        { status: 503 },
      );
    const body = Schema.extend({ id: z.string().min(1) }).parse(
      await req.json(),
    );
    const { id, ...values } = body;
    const { data, error } = await s
      .from("projects")
      .update(values)
      .eq("id", id)
      .select()
      .single();
    if (error)
      return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ data });
  } catch (err) {
    console.error("PUT /api/admin/projects error:", err);
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

export async function DELETE(req: Request) {
  try {
    const s = await requireAdmin();
    if (!s)
      return NextResponse.json(
        { error: "Supabase is not configured." },
        { status: 503 },
      );
    const { id } = z.object({ id: z.string().min(1) }).parse(await req.json());
    const { error } = await s.from("projects").delete().eq("id", id);
    if (error)
      return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("DELETE /api/admin/projects error:", err);
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
