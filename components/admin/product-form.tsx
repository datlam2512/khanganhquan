"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SpecGroupBuilder } from "@/components/admin/spec-group-builder";
import type { Category, Product, SpecGroup } from "@/lib/types";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ImageUploader } from "@/components/admin/image-uploader";
import { slugify } from "@/lib/utils";

type ProductFormProps = {
  categories: Category[];
  product?: Product;
};

type ApiResponse = {
  data?: unknown;
  error?: string;
  message?: string;
  details?: unknown;
};

type ProductFormState = {
  slug: string;
  code: string;

  category_id: string;

  name_vi: string;
  name_en: string;

  short_vi: string;
  short_en: string;

  description_vi: string;
  description_en: string;

  material_vi: string;
  material_en: string;

  spec_groups_vi: SpecGroup[];
  spec_groups_en: SpecGroup[];

  /**
   * Danh sách path ảnh trong Supabase Storage.
   *
   * Ví dụ:
   * [
   *   "products/abc/image.jpg"
   * ]
   */
  images: string[];

  published: boolean;
};

/**
 * Lấy tất cả ảnh của product.
 *
 * Product hiện tại của bạn có:
 *
 * product.images = [
 *   {
 *     imageUrl: "...",
 *     isPrimary: true
 *   }
 * ]
 */
function getProductImages(product?: Product): string[] {
  if (!product?.images?.length) {
    return [];
  }

  return product.images
    .map((image) => image.imageUrl)
    .filter(
      (imageUrl): imageUrl is string =>
        typeof imageUrl === "string" && imageUrl.trim().length > 0,
    );
}

/**
 * Lấy category ID.
 */
function getCategoryId(
  categories: Category[],
  product?: Product,
): string {
  if (!product) return "";

  return (
    categories.find(
      (category) => category.id === product.categoryId,
    )?.id ??
    product.categoryId ??
    ""
  );
}

export function ProductForm({
  categories,
  product,
}: ProductFormProps) {
  const router = useRouter();

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  // Popup xác nhận xóa
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  /**
   * State form
   */
  const [form, setForm] = useState<ProductFormState>({
    slug: product?.slug ?? "",
    code: product?.code ?? "",

    category_id: getCategoryId(categories, product),

    name_vi: product?.name ?? "",
    name_en: product?.nameEn ?? "",

    short_vi: product?.short ?? "",
    short_en: product?.shortEn ?? "",

    description_vi: product?.description ?? "",
    description_en: product?.descriptionEn ?? "",

    material_vi: product?.material ?? "",
    material_en: product?.materialEn ?? "",

    spec_groups_vi: product?.specGroupsVi ?? [],
    spec_groups_en: product?.specGroupsEn ?? [],

    /**
     * Lấy ảnh từ product.images
     */
    images: getProductImages(product),

    published: product?.published ?? true,
  });

  /**
   * Update field trong form.
   */
  function update<K extends keyof ProductFormState>(
    key: K,
    value: ProductFormState[K],
  ) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  // =====================================================
  // SAVE: CREATE + UPDATE
  // =====================================================

  async function save(
    event: React.FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();

    // ---------------------------------------------------
    // Validate
    // ---------------------------------------------------

    if (!form.name_vi.trim()) {
      setMessage("Vui lòng nhập tên sản phẩm tiếng Việt.");
      return;
    }

    if (!form.name_en.trim()) {
      setMessage("Vui lòng nhập tên sản phẩm tiếng Anh.");
      return;
    }

    if (!form.slug.trim()) {
      setMessage("Vui lòng nhập slug.");
      return;
    }

    if (!form.category_id) {
      setMessage("Vui lòng chọn danh mục.");
      return;
    }

    setSaving(true);
    setMessage("");

    // ---------------------------------------------------
    // Images
    // ---------------------------------------------------

    const images = form.images
      .map((image) => image.trim())
      .filter(Boolean);

    // ---------------------------------------------------
    // Payload
    // ---------------------------------------------------

    const payload = {
      slug: slugify(form.slug.trim()),

      code: form.code.trim() || null,

      category_id: form.category_id,

      name_vi: form.name_vi.trim(),

      name_en: form.name_en.trim(),

      short_vi: form.short_vi.trim(),

      short_en: form.short_en.trim(),

      description_vi: form.description_vi.trim(),

      description_en: form.description_en.trim(),

      material_vi: form.material_vi.trim(),

      material_en: form.material_en.trim(),

      spec_groups_vi: form.spec_groups_vi,

      spec_groups_en: form.spec_groups_en,

      /**
       * QUAN TRỌNG:
       *
       * Không gửi image_path nữa.
       *
       * Gửi images để API products/[id]
       * cập nhật product_images.
       */
      images,

      published: form.published,
    };

    const isEdit = Boolean(product);

    const method = isEdit ? "PUT" : "POST";

    const url = isEdit
      ? `/api/admin/products/${product!.id}`
      : "/api/admin/products";

    console.log(
      isEdit
        ? "🟡 UPDATE PRODUCT"
        : "🟢 CREATE PRODUCT",
    );

    console.log("Product ID:", product?.id);

    console.log("Method:", method);

    console.log("URL:", url);

    console.log(
      "Images:",
      images,
    );

    console.log(
      "Payload:",
      payload,
    );

    // ---------------------------------------------------
    // Request
    // ---------------------------------------------------

    try {
      const response = await fetch(url, {
        method,

        headers: {
          "Content-Type": "application/json",

          Accept: "application/json",
        },

        body: JSON.stringify(payload),
      });

      // -------------------------------------------------
      // Parse response
      // -------------------------------------------------

      const contentType =
        response.headers.get("content-type") ?? "";

      let json: ApiResponse = {};

      if (contentType.includes("application/json")) {
        json = (await response.json()) as ApiResponse;
      } else {
        const text = await response.text();

        json = {
          error:
            text.trim() ||
            `API lỗi ${response.status}: ${response.statusText}`,
        };
      }

      console.log("📩 API response:", {
        status: response.status,

        ok: response.ok,

        data: json,
      });

      if (json.details) {
        console.log(
          "📩 Zod details:",
          json.details,
        );
      }

      // -------------------------------------------------
      // Error
      // -------------------------------------------------

      if (!response.ok) {
        setMessage(
          json.error ??
            `Không thể ${
              isEdit ? "cập nhật" : "tạo"
            } sản phẩm.`,
        );

        return;
      }

      // -------------------------------------------------
      // Success
      // -------------------------------------------------

      console.log(
        isEdit
          ? "✅ UPDATE thành công"
          : "✅ CREATE thành công",
      );

      console.log(
        "✅ Images saved:",
        images,
      );

      // Chuyển về danh sách sản phẩm
      router.push("/admin/products");

      // Refresh dữ liệu
      router.refresh();
    } catch (error) {
      console.error(
        "Save product error:",
        error,
      );

      setMessage(
        error instanceof Error
          ? error.message
          : "Không thể kết nối tới server.",
      );
    } finally {
      setSaving(false);
    }
  }

  // =====================================================
  // DELETE
  // =====================================================

  async function remove(): Promise<void> {
    if (!product) return;

    setSaving(true);
    setMessage("");

    try {
      console.log(
        "🔴 DELETE PRODUCT:",
        product.id,
      );

      const response = await fetch(
        `/api/admin/products/${product.id}`,
        {
          method: "DELETE",

          headers: {
            Accept: "application/json",
          },
        },
      );

      // -------------------------------------------------
      // Parse response
      // -------------------------------------------------

      const contentType =
        response.headers.get("content-type") ?? "";

      let json: ApiResponse = {};

      if (contentType.includes("application/json")) {
        json = (await response.json()) as ApiResponse;
      } else {
        const text = await response.text();

        json = {
          error:
            text.trim() ||
            `API lỗi ${response.status}: ${response.statusText}`,
        };
      }

      console.log("📩 DELETE response:", {
        status: response.status,

        ok: response.ok,

        data: json,
      });

      // -------------------------------------------------
      // Error
      // -------------------------------------------------

      if (!response.ok) {
        setMessage(
          json.error ??
            "Không thể xóa sản phẩm.",
        );

        return;
      }

      // -------------------------------------------------
      // Success
      // -------------------------------------------------

      console.log("✅ DELETE thành công");

      // Đóng popup
      setShowDeleteModal(false);

      // Quay về danh sách
      router.push("/admin/products");

      // Refresh danh sách
      router.refresh();
    } catch (error) {
      console.error(
        "Delete product error:",
        error,
      );

      setMessage(
        error instanceof Error
          ? error.message
          : "Không thể xóa sản phẩm.",
      );
    } finally {
      setSaving(false);
    }
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <>
      <form
        onSubmit={save}
        className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]"
      >
        {/* ================================================= */}
        {/* LEFT */}
        {/* ================================================= */}

        <div className="space-y-5 rounded-[22px] border border-[#dfe8e2] bg-white p-6 shadow-[0_8px_24px_rgba(20,35,27,.035)] md:p-7">
          {/* NAME */}

          <div className="grid gap-4 md:grid-cols-2">
            <Input
              required
              placeholder="Tên tiếng Việt"
              value={form.name_vi}
              onChange={(event) =>
                update(
                  "name_vi",
                  event.target.value,
                )
              }
            />

            <Input
              required
              placeholder="English name"
              value={form.name_en}
              onChange={(event) =>
                update(
                  "name_en",
                  event.target.value,
                )
              }
            />
          </div>

          {/* SLUG + CODE */}

          <div className="grid gap-4 md:grid-cols-2">
            <Input
              required
              placeholder="Slug"
              value={form.slug}
              onChange={(event) =>
                update(
                  "slug",
                  slugify(event.target.value),
                )
              }
            />

            <Input
              placeholder="Product code / SKU"
              value={form.code}
              onChange={(event) =>
                update(
                  "code",
                  event.target.value,
                )
              }
            />
          </div>

          {/* CATEGORY */}

          <select
            value={form.category_id}
            onChange={(event) =>
              update(
                "category_id",
                event.target.value,
              )
            }
            className="h-11 w-full rounded-xl border border-[#d9e4dd] bg-[#fbfcfb] px-3 text-sm outline-none transition focus:border-[#86c69a] focus:bg-white focus:ring-4 focus:ring-[#eaf7ef]"
          >
            <option value="">
              Chọn danh mục
            </option>

            {categories.map((category) => (
              <option
                key={category.id}
                value={category.id}
              >
                {category.name}
              </option>
            ))}
          </select>

          {/* SHORT */}

          <div className="grid gap-4 md:grid-cols-2">
            <textarea
              placeholder="Mô tả ngắn tiếng Việt"
              value={form.short_vi}
              onChange={(event) =>
                update(
                  "short_vi",
                  event.target.value,
                )
              }
              className="min-h-24 w-full rounded-xl border border-[#d9e4dd] bg-[#fbfcfb] p-3.5 text-sm outline-none transition focus:border-[#86c69a] focus:bg-white focus:ring-4 focus:ring-[#eaf7ef]"
            />

            <textarea
              placeholder="English short description"
              value={form.short_en}
              onChange={(event) =>
                update(
                  "short_en",
                  event.target.value,
                )
              }
              className="min-h-24 w-full rounded-xl border border-[#d9e4dd] bg-[#fbfcfb] p-3.5 text-sm outline-none transition focus:border-[#86c69a] focus:bg-white focus:ring-4 focus:ring-[#eaf7ef]"
            />
          </div>

          {/* DESCRIPTION */}

          <textarea
            placeholder="Mô tả tiếng Việt"
            value={form.description_vi}
            onChange={(event) =>
              update(
                "description_vi",
                event.target.value,
              )
            }
            className="min-h-32 w-full rounded-xl border border-[#d9e4dd] bg-[#fbfcfb] p-3.5 text-sm outline-none transition focus:border-[#86c69a] focus:bg-white focus:ring-4 focus:ring-[#eaf7ef]"
          />

          <textarea
            placeholder="English description"
            value={form.description_en}
            onChange={(event) =>
              update(
                "description_en",
                event.target.value,
              )
            }
            className="min-h-32 w-full rounded-xl border border-[#d9e4dd] bg-[#fbfcfb] p-3.5 text-sm outline-none transition focus:border-[#86c69a] focus:bg-white focus:ring-4 focus:ring-[#eaf7ef]"
          />

          {/* MATERIAL */}

          <div className="grid gap-4 md:grid-cols-2">
            <textarea
              placeholder="Material (VI)"
              value={form.material_vi}
              onChange={(event) =>
                update(
                  "material_vi",
                  event.target.value,
                )
              }
              className="min-h-24 w-full rounded-xl border border-[#d9e4dd] bg-[#fbfcfb] p-3.5 text-sm outline-none transition focus:border-[#86c69a] focus:bg-white focus:ring-4 focus:ring-[#eaf7ef]"
            />

            <textarea
              placeholder="Material (EN)"
              value={form.material_en}
              onChange={(event) =>
                update(
                  "material_en",
                  event.target.value,
                )
              }
              className="min-h-24 w-full rounded-xl border border-[#d9e4dd] bg-[#fbfcfb] p-3.5 text-sm outline-none transition focus:border-[#86c69a] focus:bg-white focus:ring-4 focus:ring-[#eaf7ef]"
            />
          </div>

          {/* SPEC GROUPS */}

          <div className="grid gap-6">
            <SpecGroupBuilder
              value={form.spec_groups_vi}
              onChange={(value) =>
                update(
                  "spec_groups_vi",
                  value,
                )
              }
              language="vi"
            />

            <SpecGroupBuilder
              value={form.spec_groups_en}
              onChange={(value) =>
                update(
                  "spec_groups_en",
                  value,
                )
              }
              language="en"
            />
          </div>
        </div>

        {/* ================================================= */}
        {/* RIGHT */}
        {/* ================================================= */}

        <div className="h-fit space-y-4 rounded-[22px] border border-[#dfe8e2] bg-white p-6 shadow-[0_8px_24px_rgba(20,35,27,.035)]">
          <div>
            <div className="text-sm font-extrabold">
              Xuất bản
            </div>

            <div className="mt-1 text-xs leading-5 text-[#829087]">
              Thiết lập trạng thái và hình ảnh
              đại diện.
            </div>
          </div>

          {/* PUBLISHED */}

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.published}
              onChange={(event) =>
                update(
                  "published",
                  event.target.checked,
                )
              }
            />

            Published
          </label>

          {/* IMAGE */}

          <ImageUploader
            /**
             * ImageUploader hiện tại của bạn
             * chỉ nhận 1 value string.
             *
             * Vì vậy lấy ảnh đầu tiên.
             */
            value={form.images[0] ?? ""}
            bucket_id="image-project"
            folder="products"
            label="Ảnh sản phẩm"
            onChange={(path) => {
              const cleanPath =
                path?.trim() ?? "";

              if (!cleanPath) {
                update("images", []);
                return;
              }

              /**
               * Giữ path ảnh vào images[]
               */
              update("images", [
                cleanPath,
              ]);
            }}
          />

          {/* IMAGE PATH DEBUG */}

          {form.images.length > 0 && (
            <div className="rounded-xl bg-[#f7faf8] p-3">
              <div className="text-xs font-semibold text-[#68756d]">
                Storage path
              </div>

              <div className="mt-1 break-all text-xs text-[#829087]">
                {form.images[0]}
              </div>
            </div>
          )}

          {/* SAVE */}

          <Button
            type="submit"
            disabled={saving}
            className="w-full"
          >
            {saving
              ? "Đang lưu…"
              : product
                ? "Cập nhật sản phẩm"
                : "Lưu sản phẩm"}
          </Button>

          {/* DELETE */}

          {product && (
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                setShowDeleteModal(true)
              }
              disabled={saving}
              className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
            >
              Xóa sản phẩm
            </Button>
          )}

          {/* MESSAGE */}

          {message && (
            <div className="rounded-lg bg-[#EAF7EF] p-3 text-sm text-[#1A5A36]">
              {message}
            </div>
          )}
        </div>
      </form>

      {/* ===================================================== */}
      {/* DELETE MODAL */}
      {/* ===================================================== */}

      {showDeleteModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-[2px]"
          onMouseDown={(event) => {
            if (
              event.target ===
                event.currentTarget &&
              !saving
            ) {
              setShowDeleteModal(false);
            }
          }}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-[#e4ebe6] bg-white p-6 shadow-2xl"
            onMouseDown={(event) =>
              event.stopPropagation()
            }
          >
            {/* ICON */}

            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="h-6 w-6 text-red-600"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v4m0 4h.01M10.29 3.86l-7.82 14a2 2 0 001.75 2.98h15.56a2 2 0 001.75-2.98l-7.82-14a2 2 0 00-3.42 0z"
                />
              </svg>
            </div>

            {/* TITLE */}

            <h2 className="text-lg font-extrabold text-[#18251d]">
              Xóa sản phẩm?
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#68756d]">
              Bạn có chắc chắn muốn xóa sản
              phẩm này không?
            </p>

            <p className="mt-1 text-sm leading-6 text-red-600">
              Hành động này không thể hoàn tác.
            </p>

            {/* PRODUCT */}

            <div className="mt-4 rounded-xl bg-[#f7faf8] p-3">
              <div className="text-xs text-[#829087]">
                Sản phẩm
              </div>

              <div className="mt-1 truncate text-sm font-semibold text-[#18251d]">
                {product?.name ??
                  product?.nameEn ??
                  "Sản phẩm"}
              </div>

              <div className="mt-1 text-xs text-[#829087]">
                ID: {product?.id}
              </div>
            </div>

            {/* BUTTONS */}

            <div className="mt-6 flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  setShowDeleteModal(false)
                }
                disabled={saving}
              >
                Hủy
              </Button>

              <Button
                type="button"
                onClick={() =>
                  void remove()
                }
                disabled={saving}
                className="bg-red-600 text-white hover:bg-red-700"
              >
                {saving
                  ? "Đang xóa…"
                  : "Xác nhận xóa"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}