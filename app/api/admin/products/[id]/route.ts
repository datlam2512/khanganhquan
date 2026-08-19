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

  // Không nằm trong products
  images: z.array(z.string()).max(12).default([]),
});


// ======================================================
// PUT
// ======================================================

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const supabase = await requireAdmin();

    if (!supabase) {
      return NextResponse.json(
        {
          error: "Supabase is not configured.",
        },
        {
          status: 503,
        },
      );
    }

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

    console.log("=================================");
    console.log("🔵 UPDATE PRODUCT ID:", id);

    // ==================================================
    // BODY
    // ==================================================

    const body = await request.json();

    console.log(
      "🔵 UPDATE PRODUCT BODY:",
      JSON.stringify(body, null, 2),
    );

    // ==================================================
    // VALIDATE
    // ==================================================

    const parsed = ProductSchema.safeParse(body);

    if (!parsed.success) {
      console.error(
        "❌ ZOD ERROR:",
        parsed.error.issues,
      );

      return NextResponse.json(
        {
          error: "Dữ liệu không hợp lệ.",
          details: parsed.error.issues,
        },
        {
          status: 400,
        },
      );
    }

    // ==================================================
    // TÁCH IMAGES
    // ==================================================

    const {
      images,
      ...productData
    } = parsed.data;

    console.log(
      "🔵 PRODUCT DATA:",
      productData,
    );

    console.log(
      "🖼️ IMAGES:",
      images,
    );

    // ==================================================
    // CHECK PRODUCT
    // ==================================================

    const {
      data: existingProduct,
      error: existingProductError,
    } = await supabase
      .from("products")
      .select("id")
      .eq("id", id)
      .maybeSingle();

    if (existingProductError) {
      console.error(
        "❌ CHECK PRODUCT ERROR:",
        existingProductError,
      );

      return NextResponse.json(
        {
          error: existingProductError.message,
        },
        {
          status: 400,
        },
      );
    }

    if (!existingProduct) {
      return NextResponse.json(
        {
          error: "Không tìm thấy sản phẩm.",
        },
        {
          status: 404,
        },
      );
    }

    // ==================================================
    // UPDATE PRODUCTS
    // ==================================================

    const {
      data: updatedProduct,
      error: updateProductError,
    } = await supabase
      .from("products")
      .update(productData)
      .eq("id", id)
      .select()
      .single();

    if (updateProductError) {
      console.error(
        "❌ UPDATE PRODUCT ERROR:",
        updateProductError,
      );

      return NextResponse.json(
        {
          error: updateProductError.message,
        },
        {
          status: 400,
        },
      );
    }

    console.log(
      "✅ PRODUCT UPDATED:",
      updatedProduct,
    );

    // ==================================================
    // DELETE ẢNH CŨ
    // ==================================================

    const {
      error: deleteImagesError,
    } = await supabase
      .from("product_images")
      .delete()
      .eq("product_id", id);

    if (deleteImagesError) {
      console.error(
        "❌ DELETE OLD IMAGES ERROR:",
        deleteImagesError,
      );

      return NextResponse.json(
        {
          error: deleteImagesError.message,
        },
        {
          status: 400,
        },
      );
    }

    console.log("🗑️ OLD PRODUCT IMAGES DELETED");

    // ==================================================
    // INSERT ẢNH MỚI
    // ==================================================

    if (images.length > 0) {
      const imageRows = images.map(
        (image_url, sort_order) => ({
          product_id: id,

          // QUAN TRỌNG:
          // bảng của bạn dùng image_url
          image_url,

          // thứ tự ảnh
          sort_order,

          // ảnh đầu tiên là primary
          is_primary: sort_order === 0,

          // Không cần id nếu DB tự generate UUID
          // Không cần created_at nếu DB có default
        }),
      );

      console.log(
        "🖼️ INSERT PRODUCT IMAGES:",
        imageRows,
      );

      const {
        error: insertImagesError,
      } = await supabase
        .from("product_images")
        .insert(imageRows);

      if (insertImagesError) {
        console.error(
          "❌ INSERT PRODUCT IMAGES ERROR:",
          insertImagesError,
        );

        return NextResponse.json(
          {
            error: insertImagesError.message,
          },
          {
            status: 400,
          },
        );
      }

      console.log(
        "✅ PRODUCT IMAGES INSERTED",
      );
    }

    console.log(
      "✅ UPDATE PRODUCT SUCCESS",
    );

    console.log("=================================");

    return NextResponse.json(
      {
        ok: true,
        data: updatedProduct,
        images,
        message:
          "Đã cập nhật sản phẩm và hình ảnh.",
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error(
      "❌ PUT /api/admin/products/[id] ERROR:",
      error,
    );

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Dữ liệu không hợp lệ.",
          details: error.issues,
        },
        {
          status: 400,
        },
      );
    }

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


// ======================================================
// DELETE
// ======================================================

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const supabase = await requireAdmin();

    if (!supabase) {
      return NextResponse.json(
        {
          error: "Supabase is not configured.",
        },
        {
          status: 503,
        },
      );
    }

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

    console.log(
      "🔴 DELETE PRODUCT ID:",
      id,
    );

    const {
      error,
    } = await supabase
      .from("products")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(
        "❌ DELETE PRODUCT ERROR:",
        error,
      );

      return NextResponse.json(
        {
          error: error.message,
        },
        {
          status: 400,
        },
      );
    }

    return NextResponse.json({
      ok: true,
      message: "Đã xóa sản phẩm.",
    });
  } catch (error) {
    console.error(
      "❌ DELETE PRODUCT ERROR:",
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