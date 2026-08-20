import { notFound, redirect } from "next/navigation";
import Image from "next/image";
import type { Metadata } from "next";

import { getLocale, getDictionary } from "@/lib/i18n";
import { getCategories, getProduct, getProducts } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/public/product-card";
import type { SpecGroup } from "@/lib/types";

// Cho phép Next.js cache trang này (ISR) thay vì render động 100% mỗi
// lần có request, giúp việc chuyển trang nhanh hơn nhiều.
export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params;
  const locale = getLocale(rawLocale);
  const product = await getProduct(slug);
  if (!product) return {};

  const name = locale === "vi" ? product.name : product.nameEn;
  const shortDesc =
    (locale === "vi" ? product.short : product.shortEn) ||
    (locale === "vi" ? product.description : product.descriptionEn);
  const title =
    locale === "vi"
      ? `${name}${product.code ? ` (${product.code})` : ""} | Khang Anh Quân`
      : `${name}${product.code ? ` (${product.code})` : ""} | Khang Anh Quan`;
  const primaryImage =
    product.images.find((image) => image.isPrimary) ?? product.images[0];

  return {
    title,
    description: shortDesc || title,
    alternates: {
      canonical: `/${locale}/products/${product.slug}`,
      languages: {
        vi: `/vi/products/${product.slug}`,
        en: `/en/products/${product.slug}`,
        "x-default": `/vi/products/${product.slug}`,
      },
    },
    openGraph: {
      title,
      description: shortDesc || title,
      type: "website",
      images: primaryImage ? [{ url: primaryImage.imageUrl }] : undefined,
    },
  };
}

export default async function ProductDetail({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: rawLocale, slug } = await params;

  const locale = getLocale(rawLocale);
  const t = getDictionary(locale);

  const [product, categories, allProducts] = await Promise.all([
    getProduct(slug),
    getCategories(),
    getProducts(),
  ]);

  if (!product) {
    notFound();
  }

  // If the requested slug doesn't exactly match the canonical (lowercase)
  // slug — e.g. an old link to /products/Reducer — redirect permanently to
  // the canonical URL so search engines consolidate signals onto one URL.
  if (product.slug !== slug) {
    redirect(`/${locale}/products/${product.slug}`);
  }

  // Product mới dùng categoryId
  const category = categories.find((c) => c.id === product.categoryId);

  const name = locale === "vi" ? product.name : product.nameEn;

  const description =
    locale === "vi" ? product.description : product.descriptionEn;

  const material = locale === "vi" ? product.material : product.materialEn;

  // Lấy spec theo ngôn ngữ
  const specGroups: SpecGroup[] =
    locale === "vi" ? product.specGroupsVi : product.specGroupsEn;

  // Ảnh chính
  const primaryImage =
    product.images.find((image) => image.isPrimary) ?? product.images[0];

  // Related products cùng category
  const related = allProducts
    .filter(
      (item) =>
        item.id !== product.id && item.categoryId === product.categoryId,
    )
    .slice(0, 4);

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    sku: product.code || undefined,
    category: category ? (locale === "vi" ? category.name : category.nameEn) : undefined,
    image: primaryImage ? [primaryImage.imageUrl] : undefined,
    brand: { "@type": "Organization", name: "Khang Anh Quân" },
  };

  return (
    <main>
      {/* JSON-LD structured data for search engines (invisible, no visual impact) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />

      {/* =====================================================
          PRODUCT HERO
      ===================================================== */}

      <section className="section-pad bg-[#F7FAF8]">
        <div className="container-kaq grid gap-10 lg:grid-cols-[1.05fr_.95fr] lg:items-start">
          {/* IMAGE */}

          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-[#E4EBE6] bg-white">
            {primaryImage ? (
            <Image
                  src={primaryImage.imageUrl}
                  alt={
                    locale === "vi"
                      ? primaryImage.altVi || name
                      : primaryImage.altEn || name
                  }
                  fill
                  className="object-contain transition duration-500 group-hover:scale-[1.035]"
                  sizes="(max-width:770000px) 100vw, 33vw"
                />
            ) : (
              <div className="flex h-full items-center justify-center text-[#75837B]">
                {locale === "vi" ? "Chưa có hình ảnh" : "No image"}
              </div>
            )}
          </div>

          {/* PRODUCT INFO */}

          <div>
            <div className="eyebrow">
              {category
                ? locale === "vi"
                  ? category.name
                  : category.nameEn
                : locale === "vi"
                  ? "Sản phẩm"
                  : "Product"}
            </div>

            <h1 className="mt-3 text-4xl font-black tracking-tight text-[#173826] md:text-5xl">
              {name}
            </h1>

            <p className="mt-5 text-lg leading-8 text-[#66746C]">
              {description}
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {/* CODE */}

              <div className="rounded-xl border border-[#E0E8E3] bg-white p-4">
                <div className="text-xs font-bold uppercase text-[#75837B]">
                  {locale === "vi" ? "Mã sản phẩm" : "Product code"}
                </div>

                <div className="mt-1 font-extrabold">{product.code || "—"}</div>
              </div>

              {/* MATERIAL */}

              <div className="rounded-xl border border-[#E0E8E3] bg-white p-4">
                <div className="text-xs font-bold uppercase text-[#75837B]">
                  {locale === "vi" ? "Vật liệu" : "Material"}
                </div>

                <div className="mt-1 font-extrabold">{material || "—"}</div>
              </div>
            </div>

            <Button
              href={`/${locale}/contact#contact-form`}
              className="mt-7 !text-[#EEEEEE]"
            >
              {t.actions.contact}
            </Button>
          </div>
        </div>
      </section>

      {/* =====================================================
          TECHNICAL SPECIFICATIONS
      ===================================================== */}

      <section className="section-pad">
        <div className="container-kaq">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)] lg:items-start">
            {/* SPECS */}
            <div className="space-y-6">
              {specGroups.length > 0 ? (
                specGroups.map((group, index) => (
                  <SpecGroupRenderer
                    key={group.id ?? `${group.title}-${index}`}
                    group={group}
                  />
                ))
              ) : (
                <div className="rounded-2xl border border-[#E5EBE7] bg-white p-6">
                  <h2 className="text-xl font-black text-[#173826]">
                    {locale === "vi"
                      ? "Thông tin kỹ thuật"
                      : "Technical Information"}
                  </h2>

                  <p className="mt-3 text-sm leading-7 text-[#68766F]">
                    {locale === "vi"
                      ? "Thông tin kỹ thuật đang được cập nhật."
                      : "Technical information is being updated."}
                  </p>
                </div>
              )}
            </div>

            {/* CONTACT - ĐỘC LẬP */}
            <aside className="self-start lg:sticky lg:top-24">
              <div className="rounded-2xl bg-[#EAF7EF] p-6">
                <div className="eyebrow">
                  {locale === "vi" ? "Cần thêm thông tin?" : "Need details?"}
                </div>

                <h3 className="mt-3 text-2xl font-black text-[#163B26]">
                  {locale === "vi"
                    ? "Trao đổi với đội ngũ của chúng tôi."
                    : "Talk to our team."}
                </h3>

                <Button
                  href={`/${locale}/contact#contact-form`}
                  className="mt-6 !text-[#EEEEEE]"
                >
                  {t.actions.contact}
                </Button>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* =====================================================
          GALLERY
      ===================================================== */}

      {product.images.length > 1 && (
        <section className="pb-20">
          <div className="container-kaq">
            <h2 className="text-2xl font-black">
              {locale === "vi" ? "Hình ảnh sản phẩm" : "Product images"}
            </h2>

            <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {product.images.map((image) => (
                <div
                  key={image.id}
                  className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-[#E5EBE7] bg-white"
                >
                  <Image
                    src={image.imageUrl}
                    alt={
                      locale === "vi"
                        ? image.altVi || name
                        : image.altEn || name
                    }
                    fill
                    className="object-cover transition duration-300 hover:scale-105"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* =====================================================
          RELATED PRODUCTS
      ===================================================== */}

      {related.length > 0 && (
        <section className="pb-20">
          <div className="container-kaq">
            <h2 className="text-2xl font-black">
              {locale === "vi" ? "Sản phẩm liên quan" : "Related products"}
            </h2>

            <div className="mt-7 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {related.map((item) => (
                <ProductCard
                  key={item.id}
                  product={item}
                  locale={locale}
                  categories={categories}
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}

/* ============================================================
   SPEC GROUP RENDERER
============================================================ */

function SpecGroupRenderer({ group }: { group: SpecGroup }) {
  const type = group.type ?? "text";

  /* =========================
     TEXT
  ========================= */

  if (type === "text") {
    return (
      <div className="rounded-2xl border border-[#E5EBE7] bg-white p-6">
        {group.title && (
          <h2 className="text-xl font-black text-[#173826]">{group.title}</h2>
        )}

        <p className="mt-3 whitespace-pre-line text-sm leading-7 text-[#68766F]">
          {group.content || "—"}
        </p>
      </div>
    );
  }

  /* =========================
     TABLE
  ========================= */

  if (type === "table") {
    return (
      <div className="rounded-2xl border border-[#E5EBE7] bg-white p-6">
        {group.title && (
          <h2 className="text-xl font-black text-[#173826]">{group.title}</h2>
        )}

        {group.columns?.length && group.rows?.length ? (
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[500px] border-collapse text-sm">
              <thead>
                <tr>
                  {group.columns.map((column, index) => (
                    <th
                      key={index}
                      className="border border-[#DDE7E0] bg-[#F4F8F5] px-4 py-3 text-left font-black text-[#173826]"
                    >
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {group.rows.map((row, rowIndex) => {
                  const cells = Array.isArray(row) ? row : [row];

                  return (
                    <tr key={rowIndex}>
                      {cells.map((cell, cellIndex) => (
                        <td
                          key={cellIndex}
                          className="border border-[#E5EBE7] px-4 py-3 text-[#68766F]"
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="mt-3 text-sm text-[#68766F]">—</p>
        )}
      </div>
    );
  }

  /* =========================
     MATERIAL
  ========================= */

  if (type === "material") {
    return (
      <div className="rounded-2xl border border-[#E5EBE7] bg-white p-6">
        {group.title && (
          <h2 className="text-xl font-black text-[#173826]">{group.title}</h2>
        )}

        <div className="mt-5 space-y-6">
          {group.groups?.map((materialGroup, groupIndex) => (
            <div key={groupIndex}>
              {materialGroup.name && (
                <h3 className="mb-3 text-sm font-black uppercase tracking-wide text-[#52635A]">
                  {materialGroup.name}
                </h3>
              )}

              <div className="overflow-hidden rounded-xl border border-[#E5EBE7]">
                {materialGroup.items?.map((item, itemIndex) => {
                  const cells = Array.isArray(item) ? item : [item];

                  return (
                    <div
                      key={itemIndex}
                      className="grid border-b border-[#E5EBE7] last:border-b-0"
                      style={{
                        gridTemplateColumns: `repeat(${cells.length}, minmax(0, 1fr))`,
                      }}
                    >
                      {cells.map((cell, cellIndex) => (
                        <div
                          key={cellIndex}
                          className={`p-3 text-sm ${
                            cellIndex === 0
                              ? "font-bold text-[#173826]"
                              : "text-[#68766F]"
                          }`}
                        >
                          {cell}
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
}
