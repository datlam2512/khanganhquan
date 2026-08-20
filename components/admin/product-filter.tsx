"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import { useRef } from "react";

type Category = {
  id: string;
  name: string;
};

export function ProductFilters({
  category,
  q,
  categories,
}: {
  category: string;
  q: string;
  categories: Category[];
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleSearchChange() {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      formRef.current?.requestSubmit();
    }, 400);
  }

  function handleCategoryChange() {
    formRef.current?.requestSubmit();
  }

  return (
    <form
      ref={formRef}
      method="get"
      className="mb-5 flex flex-col gap-3 rounded-[22px] border border-[#dfe8e2] bg-white p-4 shadow-[0_8px_24px_rgba(20,35,27,.035)] sm:flex-row sm:items-center"
    >
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#8a978f]" />

        <input
          type="text"
          name="q"
          defaultValue={q}
          onChange={handleSearchChange}
          placeholder="Tìm theo tên sản phẩm..."
          className="w-full rounded-xl border border-[#d9e4dd] bg-[#fbfcfb] py-2.5 pl-10 pr-3.5 text-sm outline-none transition focus:border-[#86c69a] focus:bg-white focus:ring-4 focus:ring-[#eaf7ef]"
        />
      </div>

      <select
        name="category"
        defaultValue={category}
        onChange={handleCategoryChange}
        className="rounded-xl border border-[#d9e4dd] bg-[#fbfcfb] px-3.5 py-2.5 text-sm outline-none transition focus:border-[#86c69a] focus:bg-white focus:ring-4 focus:ring-[#eaf7ef] sm:w-56"
      >
        <option value="">Tất cả danh mục</option>

        {categories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>

      {(category || q) && (
        <Link
          href="/admin/products"
          className="inline-flex items-center justify-center rounded-xl border border-[#dce7df] bg-white px-4 py-2.5 text-xs font-bold text-[#5d7065] transition hover:bg-[#f3faf5]"
        >
          Xóa lọc
        </Link>
      )}
    </form>
  );
}