import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { Product, Locale, Category } from "@/lib/types";
import { categories as demoCategories } from "@/data/site";

export function ProductCard({
  product,
  locale,
  categories,
}: {
  product: Product;
  locale: Locale;
  categories?: Category[];
}) {
  /*
   * Product mới dùng categoryId
   */
  const category = (categories ?? demoCategories).find(
    (c) => c.id === product.categoryId,
  );

  const name = locale === "vi" ? product.name : product.nameEn;

  const short = locale === "vi" ? product.short : product.shortEn;

  /*
   * Product mới dùng images[]
   */
  const primaryImage =
    product.images.find((image) => image.isPrimary) ?? product.images[0];

  return (
    <Link
      href={`/${locale}/products/${product.slug}`}
      className="group overflow-hidden rounded-[22px] border border-[#E2EBE5] bg-white shadow-card transition duration-300 hover:-translate-y-1.5 hover:border-[#BFDCC9] hover:shadow-[0_18px_42px_rgba(20,35,27,.1)]"
    >
      {/* IMAGE */}

    <div className="relative aspect-[4/3] overflow-hidden bg-[#F2F6F3] p-6">
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
          <div className="flex h-full items-center justify-center text-sm text-[#87938D]">
            {locale === "vi" ? "Chưa có hình ảnh" : "No image"}
          </div>
        )}

        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/35 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>

      {/* CONTENT */}

      <div className="p-5 sm:p-6">
        <div className="mb-2 text-[10px] font-extrabold uppercase tracking-[.16em] text-[#168748]">
          {category
            ? locale === "vi"
              ? category.name
              : category.nameEn
            : locale === "vi"
              ? "Sản phẩm"
              : "Product"}
        </div>

        <div className="flex items-start justify-between gap-3">
          <h3 className="heading-display text-[1.15rem] font-extrabold leading-snug text-[#183827]">
            {name}
          </h3>

          <span className="grid size-8 shrink-0 place-items-center rounded-full border border-[#DDE9E1] text-[#6B7D73] transition duration-200 group-hover:border-[#A8D2B6] group-hover:bg-[#EAF7EF] group-hover:text-[#0B9F4A]">
            <ArrowUpRight className="size-4" />
          </span>
        </div>

        <p className="mt-2 line-clamp-2 text-[13px] leading-6 text-[#66756C]">
          {short}
        </p>

        {product.code && (
          <div className="mt-4 text-[11px] font-bold tracking-[.08em] text-[#87938D]">
            {product.code}
          </div>
        )}
      </div>
    </Link>
  );
}
