import { getLocale, getDictionary } from "@/lib/i18n";
import { getCategories, getProducts } from "@/lib/data";
import { ProductCard } from "@/components/public/product-card";
import { Input } from "@/components/ui/input";
import { SectionHeading } from "@/components/public/section-heading";

export default async function Products({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ search?: string; category?: string }>;
}) {
  const locale = getLocale((await params).locale);
  const t = getDictionary(locale);
  const sp = await searchParams;
  const q = sp.search?.trim() ?? "";
  const category = sp.category ?? "";
  const [categories, list] = await Promise.all([
    getCategories(),
    getProducts({ search: q, category }),
  ]);

  return (
    <main>
      <section className="section-pad border-b border-[#E5EBE7] bg-[#F7FAF8]">
        <div className="container-kaq">
          <SectionHeading
            eyebrow="Catalog"
            title={t.nav.products}
            description={
              locale === "vi"
                ? "Tìm kiếm theo tên, mã sản phẩm, category, vật liệu, tiêu chuẩn hoặc mô tả."
                : "Search by name, product code, category, material, standards or description."
            }
          />
          <form
            className="mt-7 grid gap-3 md:grid-cols-[1fr_260px]"
            method="GET"
          >
            <Input
              name="search"
              defaultValue={q}
              placeholder={t.search.placeholder}
            />
            <select
              name="category"
              defaultValue={category}
              className="h-11 rounded-lg border border-[#DCE5DF] bg-white px-3 text-sm"
            >
              <option value="">
                {locale === "vi" ? "Tất cả danh mục" : "All categories"}
              </option>
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {locale === "vi" ? c.name : c.nameEn}
                </option>
              ))}
            </select>
          </form>
          <div className="mt-4 text-sm text-[#64726A]">
            {list.length} {t.search.results}
            {q ? ` · “${q}”` : ""}
          </div>
        </div>
      </section>
      <section className="section-pad">
        <div className="container-kaq">
          {list.length ? (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {list.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  locale={locale}
                  categories={categories}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-[#CFDBD3] bg-[#F7FAF8] px-6 py-16 text-center">
              <div className="text-lg font-black text-[#1A3928]">
                {t.search.empty}
              </div>
              <a
                href={`/${locale}/products`}
                className="mt-4 inline-flex rounded-lg bg-[#0B9F4A] px-4 py-2 text-sm font-bold text-white"
              >
                {t.search.clear}
              </a>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
