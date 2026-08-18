"use client";

import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import type { Category, Locale, Product } from "@/lib/types";
import { ProductCard } from "@/components/public/product-card";
import { Input } from "@/components/ui/input";

function normalize(input: string) {
  return input.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
}

export function ProductCatalog({
  locale,
  products,
  categories,
  initialCategory = "",
  initialQuery = "",
  placeholder,
  allCategoriesLabel,
  emptyLabel,
  clearLabel,
}: {
  locale: Locale;
  products: Product[];
  categories: Category[];
  initialCategory?: string;
  initialQuery?: string;
  placeholder: string;
  allCategoriesLabel: string;
  emptyLabel: string;
  clearLabel: string;
}) {
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState(initialCategory);

  const filtered = useMemo(() => {
    const q = normalize(query);
    return products.filter((product) => {
      if (category && product.categorySlug !== category) return false;
      if (!q) return true;
      const haystack = normalize([
        product.name,
        product.nameEn,
        product.code,
        product.short,
        product.shortEn,
        product.description,
        product.descriptionEn,
        product.material,
        product.materialEn,
        product.standards,
        product.standards ?? "",
        product.applications,
        product.applicationsEn,
      ].join(" "));
      return haystack.includes(q);
    });
  }, [products, query, category]);

  return (
    <>
      <div className="rounded-[24px] border border-[#dfe8e2] bg-white p-4 shadow-[0_12px_34px_rgba(20,35,27,.06)] md:p-5">
        <div className="grid gap-3 md:grid-cols-[1fr_260px]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#87938c]" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={placeholder}
              className="h-12 rounded-xl border-[#dfe8e2] bg-[#fbfcfb] pl-11 pr-10 text-sm"
              aria-label={placeholder}
            />
            {query && (
              <button type="button" onClick={() => setQuery("")} className="absolute right-3 top-1/2 grid size-7 -translate-y-1/2 place-items-center rounded-full text-[#78867f] hover:bg-[#edf7f0] hover:text-[#0d6832]" aria-label="Clear search">
                <X className="size-4" />
              </button>
            )}
          </div>
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="h-12 rounded-xl border border-[#dfe8e2] bg-[#fbfcfb] px-3.5 text-sm outline-none focus:border-[#79bc8e] focus:ring-4 focus:ring-[#edf8f1]"
          >
            <option value="">{allCategoriesLabel}</option>
            {categories.map((item) => (
              <option key={item.slug} value={item.slug}>{locale === "vi" ? item.name : item.nameEn}</option>
            ))}
          </select>
        </div>
        <div className="mt-3 flex items-center justify-between text-xs text-[#748179]">
          <span>{filtered.length} sản phẩm</span>
          {(query || category) && <button type="button" onClick={() => { setQuery(""); setCategory(""); }} className="font-bold text-[#0d7a36] hover:underline">{clearLabel}</button>}
        </div>
      </div>

      <div className="mt-8">
        {filtered.length ? (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {filtered.map((product) => <ProductCard key={product.id} product={product} locale={locale} categories={categories} />)}
          </div>
        ) : (
          <div className="rounded-[24px] border border-dashed border-[#cfdcd3] bg-[#f7faf8] px-6 py-16 text-center">
            <div className="text-lg font-black text-[#1a3928]">{emptyLabel}</div>
            <button type="button" onClick={() => { setQuery(""); setCategory(""); }} className="mt-4 inline-flex rounded-xl bg-[#0b9f4a] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#0a8b40]">{clearLabel}</button>
          </div>
        )}
      </div>
    </>
  );
}
