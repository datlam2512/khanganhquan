"use client";

import { useEffect, useRef, useState } from "react";
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

  // Giữ reference ổn định tới searchParams hiện tại mà KHÔNG
  // đưa vào dependency array của effect debounce bên dưới, để
  // tránh effect tự kích hoạt lại sau mỗi lần router.replace.
  // Ghi vào ref phải nằm trong effect, không được ghi trong render.
  const searchParamsRef = useRef(searchParams);
  useEffect(() => {
    searchParamsRef.current = searchParams;
  }, [searchParams]);

  // Bỏ qua lần chạy đầu tiên khi mount, vì state ban đầu
  // đã khớp với URL rồi, không cần replace ngay.
  const isFirstRun = useRef(true);

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }

    const timeout = setTimeout(() => {
      const params = new URLSearchParams(searchParamsRef.current.toString());

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

      const nextQuery = params.toString();
      const currentQuery = searchParamsRef.current.toString();

      // Chỉ điều hướng khi query thực sự thay đổi
      if (nextQuery === currentQuery) return;

      router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname);
    }, 400);

    return () => clearTimeout(timeout);
    // Chỉ phụ thuộc vào input của người dùng, không phụ thuộc
    // vào searchParams/router/pathname (những thứ effect tự thay đổi)
  }, [search, category]);

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