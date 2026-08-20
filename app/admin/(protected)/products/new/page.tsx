import { getAdminCategories } from "@/lib/admin-data";
import { ProductForm } from "@/components/admin/product-form";

export default async function NewProduct() {
  const categories = await getAdminCategories();
  return (
    <div className="max-w-6xl">
      <h1 className="heading-display text-3xl font-extrabold tracking-[-.045em] md:text-4xl">
        Tạo sản phẩm
      </h1>
      <p className="mt-2 mb-7 text-sm leading-6 text-[#718078]">
        Nhập nội dung tiếng Việt và English.
      </p>
      <ProductForm categories={categories} />
    </div>
  );
}
