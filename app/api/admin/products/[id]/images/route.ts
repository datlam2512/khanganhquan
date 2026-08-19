import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin";

const Schema = z.object({
  images: z.array(z.string()).max(12),
});


// ======================================================
// PUT /api/admin/products/[id]/images
// ======================================================

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // --------------------------------------------------
    // 1. Check admin
    // --------------------------------------------------

    const supabase = await requireAdmin();

    if (!supabase) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        },
      );
    }

    // --------------------------------------------------
    // 2. Get product ID
    // --------------------------------------------------

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        {
          error: "Thiếu product id.",
        },
        {
          status: 400,
        },
      );
    }

    // --------------------------------------------------
    // 3. Read body
    // --------------------------------------------------

    const body = await request.json();

    // --------------------------------------------------
    // 4. Validate
    // --------------------------------------------------

    const parsed = Schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Dữ liệu ảnh không hợp lệ.",
          details: parsed.error.issues,
        },
        {
          status: 400,
        },
      );
    }

    const { images } = parsed.data;

    console.log("🖼️ UPDATE IMAGES PRODUCT:", id);
    console.log("🖼️ IMAGES:", images);

    // --------------------------------------------------
    // 5. Check product
    // --------------------------------------------------

    const {
      data: product,
      error: productError,
    } = await supabase
      .from("products")
      .select("id")
      .eq("id", id)
      .maybeSingle();

    if (productError) {
      return NextResponse.json(
        {
          error: productError.message,
        },
        {
          status: 400,
        },
      );
    }

    if (!product) {
      return NextResponse.json(
        {
          error: "Không tìm thấy sản phẩm.",
        },
        {
          status: 404,
        },
      );
    }

    // --------------------------------------------------
    // 6. Delete ảnh cũ
    // --------------------------------------------------

    const {
      error: removeError,
    } = await supabase
      .from("product_images")
      .delete()
      .eq("product_id", id);

    if (removeError) {
      console.error(
        "❌ DELETE PRODUCT IMAGES ERROR:",
        removeError,
      );

      return NextResponse.json(
        {
          error: removeError.message,
        },
        {
          status: 400,
        },
      );
    }

    // --------------------------------------------------
    // 7. Insert ảnh mới
    // --------------------------------------------------

if (images.length > 0) {
  const rows = images.map(
    (image_url, sort_order) => ({
      product_id: id,
      image_url,
      sort_order,
      is_primary: sort_order === 0,
    }),
  );

  const { error } = await supabase
    .from("product_images")
    .insert(rows);

  if (error) {
    return NextResponse.json(
      {
        error: error.message,
      },
      {
        status: 400,
      },
    );
  }
}

    // --------------------------------------------------
    // 8. Return
    // --------------------------------------------------

    return NextResponse.json(
      {
        ok: true,
        images,
        message: "Đã cập nhật hình ảnh.",
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error(
      "PUT /api/admin/products/[id]/images ERROR:",
      error,
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Lỗi không xác định.",
      },
      {
        status: 500,
      },
    );
  }
}