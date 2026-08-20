import { SimpleCrud } from "@/components/admin/simple-crud";
import { requireAdmin } from "@/lib/admin";

type PartnerRow = {
  id: string;
  name: string;
  description_vi: string | null;
  description_en: string | null;
  website_url: string | null;
  logo_path: string | null;
  published: boolean;
};

export default async function Partners() {
  const supabase = await requireAdmin();
  const { data } = supabase
    ? await supabase.from("partners").select("*").order("sort_order", { ascending: true })
    : { data: [] as PartnerRow[] };
  const items = (data ?? []) as PartnerRow[];
  return (
    <div>
      <h1 className="heading-display text-3xl font-extrabold tracking-[-.045em] md:text-4xl">
        Đối tác
      </h1>
      <p className="mt-2 mb-7 text-sm leading-6 text-[#718078]">
        Quản trị logo, hình ảnh và thông tin đối tác.
      </p>
      <SimpleCrud
        title="Đối tác"
        endpoint="/api/admin/partners"
        initialItems={items.map((x) => ({
          id: x.id,
          name: x.name,
          description_vi: x.description_vi ?? "",
          description_en: x.description_en ?? "",
          website_url: x.website_url ?? "",
          logo_path: x.logo_path ?? "",
          published: x.published,
        }))}
        fields={[
          {
            key: "name",
            label: "",
            placeholder: "Tên đối tác",
            required: true,
          },
          {
            key: "description_vi",
            label: "",
            placeholder: "Mô tả",
            textarea: true,
          },
          {
            key: "description_en",
            label: "",
            placeholder: "English description",
            textarea: true,
          },
          { key: "website_url", label: "", placeholder: "Website URL" },
          {
            key: "logo_path",
            label: "Logo đối tác",
            placeholder: "Upload logo",
            image: true,
            bucket_id : "partner-images",
            folder: "partners",
          },
        ]}
        nameKey="name"
      />
    </div>
  );
}
