import { requireAdmin } from "@/lib/admin";
import type { Category, Product } from "@/lib/types";

/**
 * Các hàm trong file này CHỈ dùng cho khu vực /admin.
 *
 * Khác với lib/data.ts (dùng cho trang public): ở đây KHÔNG lọc
 * published = true và KHÔNG tự động rơi về dữ liệu demo khi bảng
 * rỗng/lỗi — vì nếu không, admin sẽ không thể quản lý các mục đang
 * ở trạng thái Draft, và trong trường hợp xấu có thể thao tác nhầm
 * lên dữ liệu demo (id không phải UUID) rồi gặp lỗi khi lưu/xóa.
 */

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

export async function getAdminCategories(): Promise<Category[]> {
  const supabase = await requireAdmin();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("categories")
    .select("*")

  if (error || !data) return [];

  return (data as CategoryRow[]).map((c) => ({
    id: c.id,
    slug: c.slug,
    name: c.name_vi,
    nameEn: c.name_en,
    description: c.description_vi ?? "",
    descriptionEn: c.description_en ?? "",
    image: c.image_path ?? "",
    published: c.published,
  }));
}

type ProductRow = {
  id: string;
  slug: string;
  code: string | null;
  category_id: string | null;
  name_vi: string;
  name_en: string;
  short_vi: string | null;
  short_en: string | null;
  description_vi: string | null;
  description_en: string | null;
  material_vi: string | null;
  material_en: string | null;
  spec_groups_vi: unknown;
  spec_groups_en: unknown;
  published: boolean;
};

type ProductImageRow = {
  id: string;
  product_id: string;
  image_url: string;
  alt_vi: string | null;
  alt_en: string | null;
  sort_order: number | null;
  is_primary: boolean | null;
};

function imageUrl(path: string | null | undefined, bucket: string) {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) return "";
  return `${url}/storage/v1/object/public/${bucket}/${path.replace(/^\/+/, "")}`;
}

export async function getAdminProducts(options: {
  search?: string;
  category?: string;
} = {}): Promise<Product[]> {
  const supabase = await requireAdmin();
  if (!supabase) return [];

  let query = supabase
    .from("products")
    .select(
      "id,slug,code,category_id,name_vi,name_en,short_vi,short_en,description_vi,description_en,material_vi,material_en,spec_groups_vi,spec_groups_en,published",
    )
    .order("created_at", { ascending: false });

  if (options.category) {
    query = query.eq("category_id", options.category);
  }

  const { data, error } = await query;
  if (error || !data?.length) return [];

  const rows = data as ProductRow[];
  const productIds = rows.map((p) => p.id);

  const { data: imageData } = await supabase
    .from("product_images")
    .select("id,product_id,image_url,alt_vi,alt_en,sort_order,is_primary")
    .in("product_id", productIds)
    .order("sort_order", { ascending: true });

  const imagesByProduct = new Map<string, Product["images"]>();
  for (const image of (imageData ?? []) as ProductImageRow[]) {
    const current = imagesByProduct.get(image.product_id) ?? [];
    current.push({
      id: image.id,
      productId: image.product_id,
      imageUrl: imageUrl(image.image_url, "product-images"),
      altVi: image.alt_vi ?? "",
      altEn: image.alt_en ?? "",
      sortOrder: image.sort_order ?? 0,
      isPrimary: Boolean(image.is_primary),
    });
    imagesByProduct.set(image.product_id, current);
  }

  let mapped: Product[] = rows.map((p) => ({
    id: p.id,
    slug: p.slug,
    code: p.code ?? "",
    categoryId: p.category_id ?? "",
    name: p.name_vi ?? "",
    nameEn: p.name_en ?? "",
    short: p.short_vi ?? "",
    shortEn: p.short_en ?? "",
    description: p.description_vi ?? "",
    descriptionEn: p.description_en ?? "",
    material: p.material_vi ?? "",
    materialEn: p.material_en ?? "",
    specGroupsVi: Array.isArray(p.spec_groups_vi) ? p.spec_groups_vi : [],
    specGroupsEn: Array.isArray(p.spec_groups_en) ? p.spec_groups_en : [],
    images: imagesByProduct.get(p.id) ?? [],
    published: Boolean(p.published),
  }));

const search = options.search?.trim();

if (search) {
  const normalize = (value: string) =>
    value
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

  const q = normalize(search);

  mapped = mapped.filter((product) => {
    return (
      normalize(product.name).includes(q) ||
      normalize(product.nameEn).includes(q)
    );
  });
}

  return mapped;
}

export async function getAdminProductById(id: string): Promise<Product | undefined> {
  const products = await getAdminProducts();
  return products.find((p) => p.id === id);
}
