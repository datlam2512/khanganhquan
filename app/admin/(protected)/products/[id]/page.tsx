import { notFound } from "next/navigation";
import { getAdminCategories, getAdminProductById } from "@/lib/admin-data";
import { ProductForm } from "@/components/admin/product-form";

export default async function EditProduct({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [categories, product] = await Promise.all([
    getAdminCategories(),
    getAdminProductById(id),
  ]);
  if (!product) notFound();
  return (
    <div className="max-w-6xl">
      <h1 className="heading-display text-3xl font-extrabold tracking-[-.045em] md:text-4xl">
        Chỉnh sửa sản phẩm
      </h1>
      <p className="mt-2 mb-7 text-sm leading-6 text-[#718078]">
        {product.name} · {product.nameEn}
      </p>
      <ProductForm categories={categories} product={product} />
    </div>
  );
}
