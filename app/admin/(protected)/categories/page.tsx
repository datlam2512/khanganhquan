import { SimpleCrud } from "@/components/admin/simple-crud";
import { getCategories } from "@/lib/data";
export default async function Categories() {
  const items = await getCategories();
  return (
    <div>
      <h1 className="heading-display text-3xl font-extrabold tracking-[-.045em] md:text-4xl">
        Danh mục
      </h1>
      <p className="mt-2 mb-7 text-sm leading-6 text-[#718078]">
        CRUD danh mục sản phẩm.
      </p>
      <SimpleCrud
        title="Danh mục"
        endpoint="/api/admin/categories"
        initialItems={items.map((x) => ({
          id: x.id,
          slug: x.slug,
          name: x.name,
          name_vi: x.name,
          name_en: x.nameEn,
          description: x.description,
          description_en: x.descriptionEn,
          image_path: "",
          published: x.published,
        }))}
        fields={[
          { key: "slug", label: "", placeholder: "slug", required: true },
          {
            key: "name_vi",
            label: "",
            placeholder: "Tên tiếng Việt",
            required: true,
          },
          {
            key: "name_en",
            label: "",
            placeholder: "English name",
            required: true,
          },
          {
            key: "description_vi",
            label: "",
            placeholder: "Mô tả tiếng Việt",
            textarea: true,
          },
          {
            key: "description_en",
            label: "",
            placeholder: "English description",
            textarea: true,
          },
          {
            key: "image_path",
            label: "Ảnh danh mục",
            placeholder: "Upload ảnh",
            image: true,
            bucket_id : "product-images",
            folder: "categories",
          },
        ]}
        nameKey="name"
      />
    </div>
  );
}
