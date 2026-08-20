"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import type { Locale } from "@/lib/types";

type Category = {
  slug: string;
  name: string;
  nameEn: string;
};

type ProductFiltersProps = {
  categories: Category[];
  initialSearch: string;
  initialCategory: string;
  locale: Locale;
};

export function ProductFilters({
  categories,
  initialSearch,
  initialCategory,
  locale,
}: ProductFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState(initialCategory);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());

      const trimmedSearch = search.trim();

      if (trimmedSearch) {
        params.set("search", trimmedSearch);
      } else {
        params.delete("search");
      }

      if (category) {
        params.set("category", category);
      } else {
        params.delete("category");
      }

      const nextQuery = params.toString();
      const currentQuery = searchParams.toString();

      if (nextQuery === currentQuery) {
        return;
      }

      router.replace(
        nextQuery ? `${pathname}?${nextQuery}` : pathname
      );
    }, 300);

    return () => clearTimeout(timeout);
  }, [search, category, pathname, router, searchParams]);

  return (
    <div className="mt-7 grid gap-3 md:grid-cols-[1fr_260px]">
      <Input
        name="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder={
          locale === "vi"
            ? "Tìm kiếm theo tên sản phẩm..."
            : "Search by product name..."
        }
      />

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="h-11 rounded-lg border border-[#DCE5DF] bg-white px-3 text-sm"
      >
        <option value="">
          {locale === "vi" ? "Tất cả danh mục" : "All categories"}
        </option>

        {categories.map((categoryItem) => (
          <option key={categoryItem.slug} value={categoryItem.slug}>
            {locale === "vi"
              ? categoryItem.name
              : categoryItem.nameEn}
          </option>
        ))}
      </select>
    </div>
  );
}