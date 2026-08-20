import { SimpleCrud } from "@/components/admin/simple-crud";
import { requireAdmin } from "@/lib/admin";

type CategoryRow = {
  id: string;
  slug: string;
  name_vi: string;
  name_en: string;
  description_vi: string | null;
  description_en: string | null;
  image_path: string | null;
  published: boolean;
};

export default async function Categories() {
  const supabase = await requireAdmin();
  const { data, error } = supabase
    ? await supabase.from("categories").select("*")
    : { data: [] as CategoryRow[], error: null };
  const items = (data ?? []) as CategoryRow[];
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
          name_vi: x.name_vi,
          name_en: x.name_en,
          description_vi: x.description_vi ?? "",
          description_en: x.description_en ?? "",
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
            bucket_id: "image-project",
            folder: "categories",
          },
        ]}
       nameKey="name_vi"
      />
    </div>
  );
}
