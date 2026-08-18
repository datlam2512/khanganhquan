"use client";

import { useState } from "react";
import type { Category, Product } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ImageUploader } from "@/components/admin/image-uploader";

type ProductFormProps = {
  categories: Category[];
  product?: Product;
};

type ApiResponse = {
  data?: unknown;
  error?: string;
  message?: string;
};

export function ProductForm({ categories, product }: ProductFormProps) {
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    slug: product?.slug ?? "",
    product_code: product?.code ?? "",

    category_id:
      categories.find((category) => category.slug === product?.categorySlug)
        ?.id ?? "",

    name_vi: product?.name ?? "",
    name_en: product?.nameEn ?? "",

    short_description_vi: product?.short ?? "",
    short_description_en: product?.shortEn ?? "",

    description_vi: product?.description ?? "",
    description_en: product?.descriptionEn ?? "",

    material_vi: product?.material ?? "",
    material_en: product?.materialEn ?? "",

    standards_vi: product?.standards ?? "",
    standards_en: product?.standards ?? "",

    applications_vi: product?.applications ?? "",
    applications_en: product?.applicationsEn ?? "",

    search_keywords: "",

    main_image_path: product?.image ?? "",

    published: product?.published ?? true,
  });

  function update(key: keyof typeof form, value: string | boolean): void {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  async function save(event: React.FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();

    setSaving(true);
    setMessage("");

    const method = product ? "PUT" : "POST";

    const url = product
      ? `/api/admin/products/${product.id}`
      : "/api/admin/products";

    /**
     * Debug request
     */
    console.group(
      product ? "🟡 UPDATE PRODUCT - PUT" : "🟢 CREATE PRODUCT - POST",
    );

    console.log("Method:", method);
    console.log("URL:", url);

    if (product) {
      console.log("Product ID:", product.id);
      console.log("Original product:", product);
    }

    console.log("Data gửi lên API:", form);

    console.log("Image:", form.main_image_path);

    console.log("Category ID:", form.category_id);

    console.log("Published:", form.published);

    console.groupEnd();

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const contentType = response.headers.get("content-type") ?? "";

      let json: ApiResponse = {};

      if (contentType.includes("application/json")) {
        json = (await response.json()) as ApiResponse;
      } else {
        const text = await response.text();

        console.error("❌ API returned non-JSON response:", {
          status: response.status,
          statusText: response.statusText,
          url: response.url,
          contentType,
          body: text,
        });

        json = {
          error:
            text.trim() || `API lỗi ${response.status}: ${response.statusText}`,
        };
      }

      /**
       * Debug response
       */
      console.group(
        response.ok
          ? "✅ PRODUCT REQUEST SUCCESS"
          : "❌ PRODUCT REQUEST FAILED",
      );

      console.log("Status:", response.status);

      console.log("Response:", json);

      if (product) {
        console.log("PUT Product ID:", product.id);
      }

      console.groupEnd();

      if (response.ok) {
        setMessage(
          json.message ??
            (product ? "Đã cập nhật sản phẩm." : "Đã tạo sản phẩm."),
        );
      } else {
        setMessage(
          json.error ??
            (product
              ? "Không thể cập nhật sản phẩm."
              : "Không thể tạo sản phẩm."),
        );
      }
    } catch (error: unknown) {
      console.error("❌ Save product error:", error);

      setMessage(
        error instanceof Error
          ? error.message
          : "Không thể kết nối tới server.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function remove(): Promise<void> {
    if (!product || !confirm("Xóa sản phẩm này?")) {
      return;
    }

    try {
      console.log("🗑️ DELETE PRODUCT:", product.id);

      const response = await fetch(`/api/admin/products/${product.id}`, {
        method: "DELETE",
      });

      const contentType = response.headers.get("content-type") ?? "";

      let json: ApiResponse = {};

      if (contentType.includes("application/json")) {
        json = (await response.json()) as ApiResponse;
      }

      console.log("DELETE response:", {
        status: response.status,
        data: json,
      });

      if (response.ok) {
        setMessage(json.message ?? "Đã xóa. Hãy quay lại danh sách.");
      } else {
        setMessage(json.error ?? "Không thể xóa sản phẩm.");
      }
    } catch (error: unknown) {
      console.error("Delete product error:", error);

      setMessage(
        error instanceof Error ? error.message : "Không thể xóa sản phẩm.",
      );
    }
  }

  return (
    <form
      onSubmit={save}
      className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]"
    >
      <div className="space-y-5 rounded-[22px] border border-[#dfe8e2] bg-white p-6 shadow-[0_8px_24px_rgba(20,35,27,.035)] md:p-7">
        <div className="grid gap-4 md:grid-cols-2">
          <Input
            required
            placeholder="Tên tiếng Việt"
            value={form.name_vi}
            onChange={(event) => update("name_vi", event.target.value)}
          />

          <Input
            required
            placeholder="English name"
            value={form.name_en}
            onChange={(event) => update("name_en", event.target.value)}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Input
            required
            placeholder="Slug"
            value={form.slug}
            onChange={(event) => update("slug", event.target.value)}
          />

          <Input
            placeholder="Product code / SKU"
            value={form.product_code}
            onChange={(event) => update("product_code", event.target.value)}
          />
        </div>

        <select
          value={form.category_id}
          onChange={(event) => update("category_id", event.target.value)}
          className="h-11 w-full rounded-xl border border-[#d9e4dd] bg-[#fbfcfb] px-3 text-sm outline-none transition focus:border-[#86c69a] focus:bg-white focus:ring-4 focus:ring-[#eaf7ef]"
        >
          <option value="">Chọn danh mục</option>

          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>

        <textarea
          placeholder="Mô tả tiếng Việt"
          value={form.description_vi}
          onChange={(event) => update("description_vi", event.target.value)}
          className="min-h-32 w-full rounded-xl border border-[#d9e4dd] bg-[#fbfcfb] p-3.5 text-sm outline-none transition focus:border-[#86c69a] focus:bg-white focus:ring-4 focus:ring-[#eaf7ef]"
        />

        <textarea
          placeholder="English description"
          value={form.description_en}
          onChange={(event) => update("description_en", event.target.value)}
          className="min-h-32 w-full rounded-xl border border-[#d9e4dd] bg-[#fbfcfb] p-3.5 text-sm outline-none transition focus:border-[#86c69a] focus:bg-white focus:ring-4 focus:ring-[#eaf7ef]"
        />

        <div className="grid gap-4 md:grid-cols-2">
          <textarea
            placeholder="Material (VI)"
            value={form.material_vi}
            onChange={(event) => update("material_vi", event.target.value)}
            className="min-h-24 w-full rounded-xl border border-[#d9e4dd] bg-[#fbfcfb] p-3.5 text-sm outline-none transition focus:border-[#86c69a] focus:bg-white focus:ring-4 focus:ring-[#eaf7ef]"
          />

          <textarea
            placeholder="Material (EN)"
            value={form.material_en}
            onChange={(event) => update("material_en", event.target.value)}
            className="min-h-24 w-full rounded-xl border border-[#d9e4dd] bg-[#fbfcfb] p-3.5 text-sm outline-none transition focus:border-[#86c69a] focus:bg-white focus:ring-4 focus:ring-[#eaf7ef]"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <textarea
            placeholder="Standards (VI)"
            value={form.standards_vi}
            onChange={(event) => update("standards_vi", event.target.value)}
            className="min-h-24 w-full rounded-xl border border-[#d9e4dd] bg-[#fbfcfb] p-3.5 text-sm outline-none transition focus:border-[#86c69a] focus:bg-white focus:ring-4 focus:ring-[#eaf7ef]"
          />

          <textarea
            placeholder="Standards (EN)"
            value={form.standards_en}
            onChange={(event) => update("standards_en", event.target.value)}
            className="min-h-24 w-full rounded-xl border border-[#d9e4dd] bg-[#fbfcfb] p-3.5 text-sm outline-none transition focus:border-[#86c69a] focus:bg-white focus:ring-4 focus:ring-[#eaf7ef]"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <textarea
            placeholder="Applications (VI)"
            value={form.applications_vi}
            onChange={(event) => update("applications_vi", event.target.value)}
            className="min-h-24 w-full rounded-xl border border-[#d9e4dd] bg-[#fbfcfb] p-3.5 text-sm outline-none transition focus:border-[#86c69a] focus:bg-white focus:ring-4 focus:ring-[#eaf7ef]"
          />

          <textarea
            placeholder="Applications (EN)"
            value={form.applications_en}
            onChange={(event) => update("applications_en", event.target.value)}
            className="min-h-24 w-full rounded-xl border border-[#d9e4dd] bg-[#fbfcfb] p-3.5 text-sm outline-none transition focus:border-[#86c69a] focus:bg-white focus:ring-4 focus:ring-[#eaf7ef]"
          />
        </div>
      </div>

      <div className="h-fit space-y-4 rounded-[22px] border border-[#dfe8e2] bg-white p-6 shadow-[0_8px_24px_rgba(20,35,27,.035)]">
        <div>
          <div className="text-sm font-extrabold">Xuất bản</div>

          <div className="mt-1 text-xs leading-5 text-[#829087]">
            Thiết lập trạng thái và hình ảnh đại diện.
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.published}
            onChange={(event) => update("published", event.target.checked)}
          />
          Published
        </label>

        <ImageUploader
          value={form.main_image_path}
          bucket_id="image-project"
          folder="products"
          label="Ảnh sản phẩm"
          onChange={(path) => update("main_image_path", path)}
        />

        <Input
          placeholder="Search keywords"
          value={form.search_keywords}
          onChange={(event) => update("search_keywords", event.target.value)}
        />

        <Button type="submit" disabled={saving} className="w-full">
          {saving ? "Đang lưu…" : "Lưu sản phẩm"}
        </Button>

        {product && (
          <Button
            type="button"
            variant="outline"
            onClick={() => void remove()}
            disabled={saving}
            className="w-full"
          >
            Xóa sản phẩm
          </Button>
        )}

        {message && (
          <div className="rounded-lg bg-[#EAF7EF] p-3 text-sm text-[#1A5A36]">
            {message}
          </div>
        )}
      </div>
    </form>
  );
}
