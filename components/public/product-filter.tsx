"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";

type Category = {
  slug: string;
  name: string;
  nameEn: string;
};

type ProductFiltersProps = {
  categories: Category[];
  initialSearch: string;
  initialCategory: string;
};

export function ProductFilters({
  categories,
  initialSearch,
  initialCategory,
}: ProductFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState(initialCategory);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());

      if (search.trim()) {
        params.set("search", search.trim());
      } else {
        params.delete("search");
      }

      if (category) {
        params.set("category", category);
      } else {
        params.delete("category");
      }

      const query = params.toString();

      router.replace(
        query ? `${pathname}?${query}` : pathname
      );
    }, 400);

    return () => clearTimeout(timeout);
  }, [
    search,
    category,
    pathname,
    router,
    searchParams,
  ]);

  return (
    <div className="mt-7 grid gap-3 md:grid-cols-[1fr_260px]">
      <Input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Tìm kiếm sản phẩm..."
      />

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="h-11 rounded-lg border border-[#DCE5DF] bg-white px-3 text-sm"
      >
        <option value="">Tất cả danh mục</option>

        {categories.map((c) => (
          <option key={c.slug} value={c.slug}>
            {c.name}
          </option>
        ))}
      </select>
    </div>
  );
}