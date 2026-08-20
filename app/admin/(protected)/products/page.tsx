import Link from "next/link";
import Image from "next/image";
import { getAdminCategories, getAdminProducts } from "@/lib/admin-data";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, PackageSearch, Search } from "lucide-react";

export default async function AdminProducts({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string }>;
}) {
  const { category = "", q = "" } = await searchParams;

  const [products, categories] = await Promise.all([
    getAdminProducts({ category: category || undefined, search: q || undefined }),
    getAdminCategories(),
  ]);

  return (
    <div className="mx-auto max-w-[1450px]">
      <div className="mb-7 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <div className="section-label">Catalog</div>

          <h1 className="heading-display mt-2 text-3xl font-extrabold tracking-[-.045em] md:text-4xl">
            Sản phẩm
          </h1>

          <p className="mt-2 text-sm leading-6 text-[#718078]">
            Quản lý catalog, nội dung song ngữ và trạng thái xuất bản.
          </p>
        </div>

        <Button href="/admin/products/new">
          + Thêm sản phẩm
        </Button>
      </div>

      <form
        method="get"
        className="mb-5 flex flex-col gap-3 rounded-[22px] border border-[#dfe8e2] bg-white p-4 shadow-[0_8px_24px_rgba(20,35,27,.035)] sm:flex-row sm:items-center"
      >
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#8a978f]" />
          <input
            type="text"
            name="q"
            defaultValue={q}
            placeholder="Tìm theo tên, mã sản phẩm, mô tả..."
            className="w-full rounded-xl border border-[#d9e4dd] bg-[#fbfcfb] py-2.5 pl-10 pr-3.5 text-sm outline-none transition focus:border-[#86c69a] focus:bg-white focus:ring-4 focus:ring-[#eaf7ef]"
          />
        </div>

        <select
          name="category"
          defaultValue={category}
          className="rounded-xl border border-[#d9e4dd] bg-[#fbfcfb] px-3.5 py-2.5 text-sm outline-none transition focus:border-[#86c69a] focus:bg-white focus:ring-4 focus:ring-[#eaf7ef] sm:w-56"
        >
          <option value="">Tất cả danh mục</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <div className="flex gap-2">
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-xl bg-[#0b9f4a] px-4 py-2.5 text-xs font-extrabold text-white transition hover:bg-[#0a8c41]"
          >
            Lọc
          </button>
          {(category || q) && (
            <Link
              href="/admin/products"
              className="inline-flex items-center justify-center rounded-xl border border-[#dce7df] bg-white px-4 py-2.5 text-xs font-bold text-[#5d7065] transition hover:bg-[#f3faf5]"
            >
              Xóa lọc
            </Link>
          )}
        </div>
      </form>

      <div className="overflow-hidden rounded-[22px] border border-[#dfe8e2] bg-white shadow-[0_8px_24px_rgba(20,35,27,.035)]">
        <div className="flex items-center justify-between border-b border-[#e8eee9] px-5 py-4">
          <div>
            <div className="text-sm font-extrabold">
              Danh sách sản phẩm
            </div>

            <div className="mt-1 text-xs text-[#8a978f]">
              {products.length} sản phẩm{category || q ? " phù hợp với bộ lọc" : " đang hiển thị"}.
            </div>
          </div>

          <div className="grid size-9 place-items-center rounded-xl bg-[#f1f8f3] text-[#0b9f4a]">
            <PackageSearch className="size-4" />
          </div>
        </div>

        {products.length ? (
          <div className="divide-y divide-[#edf1ee]">
            {products.map((p) => {
              /*
               * Product mới dùng categoryId
               */
              const cat = categories.find(
                (x) => x.id === p.categoryId,
              );

              /*
               * Product mới dùng images[]
               */
              const primaryImage =
                p.images.find(
                  (image) => image.isPrimary,
                ) ?? p.images[0];

              return (
                <div
                  key={p.id}
                  className="group flex flex-col gap-4 px-5 py-4 transition hover:bg-[#fbfdfc] sm:flex-row sm:items-center"
                >
                  {/* PRODUCT IMAGE */}

                  <div className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-[#f1f6f3]">
                    {primaryImage ? (
                      <Image
                        src={primaryImage.imageUrl}
                        alt={
                          primaryImage.altVi ||
                          p.name
                        }
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    ) : (
                      <div className="grid h-full place-items-center text-[#91a099]">
                        <PackageSearch className="size-5" />
                      </div>
                    )}
                  </div>

                  {/* PRODUCT INFO */}

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-extrabold text-[#173826]">
                        {p.name}
                      </h2>

                      <span className="rounded-full bg-[#f1f8f3] px-2 py-1 text-[10px] font-extrabold text-[#34704a]">
                        {p.published
                          ? "Published"
                          : "Draft"}
                      </span>
                    </div>

                    <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#7c8982]">
                      <span>
                        {p.code || "Chưa có mã"}
                      </span>

                      <span>
                        {cat?.name ||
                          "Chưa phân loại"}
                      </span>

                      <span>{p.nameEn}</span>
                    </div>
                  </div>

                  {/* EDIT */}

                  <Link
                    href={`/admin/products/${p.id}`}
                    className="inline-flex items-center gap-2 rounded-xl border border-[#dce7df] bg-white px-3.5 py-2.5 text-xs font-bold text-[#087a3a] transition hover:border-[#acd2b8] hover:bg-[#f3faf5]"
                  >
                    Chỉnh sửa
                    <ArrowUpRight className="size-4" />
                  </Link>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-14 text-center">
            <PackageSearch className="mx-auto size-8 text-[#a5b2aa]" />

            <div className="mt-3 font-extrabold">
              {category || q ? "Không tìm thấy sản phẩm phù hợp" : "Chưa có sản phẩm"}
            </div>

            <div className="mt-1 text-sm text-[#7b8981]">
              {category || q
                ? "Thử đổi từ khóa hoặc chọn danh mục khác."
                : "Tạo sản phẩm đầu tiên để bắt đầu catalog."}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
