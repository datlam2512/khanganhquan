import { categories as demoCategories, company as demoCompany, products as demoProducts, projects as demoProjects } from "@/data/site";
import { createClient } from "@/lib/supabase/server";
import type { Category, Product, Project } from "@/lib/types";
import type { HeroSlide } from "@/components/public/hero";

export function hasSupabaseConfig() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
  );
}

function imageUrl(path: string | null | undefined, bucket: string) {
  if (!path) return undefined;
  if (/^https?:\/\//i.test(path)) return path;
  if (!hasSupabaseConfig()) return undefined;
  const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${bucket}/${path.replace(/^\/+/, "")}`;
  return url;
}

export async function getHeroSlides(): Promise<HeroSlide[]> {
  const fallback: HeroSlide[] = [];
  if (!hasSupabaseConfig()) return fallback;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from("hero_slides").select("id,image_path,sort_order,published").eq("published", true).order("sort_order", { ascending: true });
    if (error || !data) return fallback;
    return data.map((slide) => ({
      id: slide.id,
      image: imageUrl(slide.image_path, "company-images") ?? "",
      sortOrder: slide.sort_order ?? 0,
      published: Boolean(slide.published),
    })).filter((slide) => slide.image);
  } catch { return fallback; }
}

export async function getCategories(): Promise<Category[]> {
  if (!hasSupabaseConfig()) return demoCategories;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("categories")
      .select("id,slug,name_vi,name_en,description_vi,description_en,image_path,published")
      .eq("published", true)
      .order("sort_order", { ascending: true });
    if (error || !data?.length) return demoCategories;
    return data.map((c) => ({
      id: c.id,
      slug: c.slug,
      name: c.name_vi,
      nameEn: c.name_en,
      description: c.description_vi ?? "",
      descriptionEn: c.description_en ?? "",
      image: imageUrl(c.image_path, "product-images") ?? demoCategories.find((d) => d.slug === c.slug)?.image ?? demoCategories[0].image,
      published: c.published,
    }));
  } catch {
    return demoCategories;
  }
}

export async function getProducts(options: { search?: string; category?: string } = {}): Promise<Product[]> {
  const demoFilter = () => {
    const q = options.search?.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") ?? "";
    return demoProducts.filter((p) => {
      if (options.category && p.categorySlug !== options.category) return false;
      if (!q) return true;
      const hay = [p.name,p.nameEn,p.code,p.short,p.shortEn,p.description,p.descriptionEn,p.material,p.materialEn,p.standards,p.applications,p.applicationsEn].join(" ").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      return hay.includes(q);
    });
  };
  if (!hasSupabaseConfig()) return demoFilter();
  try {
    const supabase = await createClient();
    const q = options.search?.trim();
    let query = supabase
      .from("products")
      .select("id,slug,product_code,category_id,name_vi,name_en,short_description_vi,short_description_en,description_vi,description_en,material_vi,material_en,standards_vi,standards_en,applications_vi,applications_en,main_image_path,published,categories!left(slug)")
      .eq("published", true)
      .order("created_at", { ascending: false });

    if (options.category) {
      const categoryResult = await supabase.from("categories").select("id").eq("slug", options.category).maybeSingle();
      if (categoryResult.data?.id) query = query.eq("category_id", categoryResult.data.id);
    }

    let data;
    let error;
    if (q) {
      const rpc = await supabase.rpc("search_products", { search_query: q });
      data = rpc.data;
      error = rpc.error;
      if (!error && data) {
        const categoryIds = [...new Set(data.map((p: { category_id: string | null }) => p.category_id).filter(Boolean))];
        const catResult = categoryIds.length
          ? await supabase.from("categories").select("id,slug").in("id", categoryIds)
          : { data: [], error: null };
        const map = new Map((catResult.data ?? []).map((c) => [c.id, c.slug]));
        data = data.map((p: Record<string, unknown>) => ({ ...p, categories: p.category_id ? { slug: map.get(p.category_id as string) } : null }));
      }
    } else {
      const result = await query;
      data = result.data;
      error = result.error;
    }

    if (error) return demoFilter();
    if (!data?.length) return [];

    const mapped = (data as Array<Record<string, unknown>>).map((p) => ({
      id: String(p.id),
      slug: String(p.slug),
      code: String(p.product_code ?? ""),
      categorySlug: String(((p.categories as { slug?: string } | null)?.slug) ?? ""),
      name: String(p.name_vi),
      nameEn: String(p.name_en),
      short: String(p.short_description_vi ?? ""),
      shortEn: String(p.short_description_en ?? ""),
      description: String(p.description_vi ?? ""),
      descriptionEn: String(p.description_en ?? ""),
      material: String(p.material_vi ?? ""),
      materialEn: String(p.material_en ?? ""),
      standards: String(p.standards_vi ?? ""),
      applications: String(p.applications_vi ?? ""),
      applicationsEn: String(p.applications_en ?? ""),
      image: imageUrl(String(p.main_image_path ?? ""), "product-images") ?? demoProducts.find((d) => d.slug === p.slug)?.image ?? demoProducts[0].image,
      gallery: [],
      published: Boolean(p.published),
    }));
    return options.category ? mapped.filter((p) => p.categorySlug === options.category) : mapped;
  } catch {
    return demoFilter();
  }
}

export async function getProduct(slug: string): Promise<Product | undefined> {
  const products = await getProducts();
  return products.find((p) => p.slug === slug);
}

export async function getProductById(id: string): Promise<Product | undefined> {
  const products = await getProducts();
  return products.find((p) => p.id === id);
}

export async function getProjects(): Promise<Project[]> {
  if (!hasSupabaseConfig()) return demoProjects.map((p) => ({ ...p, gallery: p.gallery?.length ? p.gallery : [p.coverImage] }));
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("projects")
      .select("id,slug,title_vi,title_en,description_vi,description_en,location,year,equipment_vi,equipment_en,scope_vi,scope_en,cover_image_path,published")
      .eq("published", true)
      .order("sort_order", { ascending: true });
    if (error || !data?.length) return demoProjects.map((p) => ({ ...p, gallery: p.gallery?.length ? p.gallery : [p.coverImage] }));
    const mapped = await Promise.all(data.map(async (p) => {
      const galleryResult = await supabase.from("project_images").select("image_path").eq("project_id", p.id).order("sort_order", { ascending: true });
      const gallery = (galleryResult.data ?? [])
        .map((img) => imageUrl(img.image_path, "project-images"))
        .filter(Boolean) as string[];
      const cover = imageUrl(p.cover_image_path, "project-images") ?? demoProjects.find((d) => d.slug === p.slug)?.coverImage ?? demoProjects[0].coverImage;
      return {
        id: p.id,
        slug: p.slug,
        title: p.title_vi,
        titleEn: p.title_en,
        description: p.description_vi ?? "",
        descriptionEn: p.description_en ?? "",
        location: p.location ?? "",
        year: p.year ?? new Date().getFullYear(),
        coverImage: cover,
        equipment: p.equipment_vi ?? "",
        scope: p.scope_vi ?? "",
        gallery: gallery.length ? gallery : [cover],
        published: p.published,
      };
    }));
    return mapped;
  } catch {
    return demoProjects.map((p) => ({ ...p, gallery: p.gallery?.length ? p.gallery : [p.coverImage] }));
  }
}

export async function getProject(slug: string) {
  const list = await getProjects();
  const project = list.find((p) => p.slug === slug);
  return project;
}

export async function getCompany() {
  if (!hasSupabaseConfig()) return demoCompany;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from("company_settings").select("*").eq("singleton", true).maybeSingle();
    if (error || !data) return demoCompany;
    return {
      ...demoCompany,
      name: data.company_name_vi || demoCompany.name,
      nameEn: data.company_name_en || demoCompany.nameEn,
      description: data.description_vi || demoCompany.description,
      descriptionEn: data.description_en || demoCompany.descriptionEn,
      email: data.email || demoCompany.email,
      phone: data.phone || demoCompany.phone,
      website: data.website || demoCompany.website,
      about: data.about_vi || "",
      aboutEn: data.about_en || "",
      headquarters: data.address_vi || demoCompany.headquarters,
      branch: "",
    };
  } catch {
    return demoCompany;
  }
}

export type Partner = { id: string; name: string; description: string; descriptionEn: string; websiteUrl: string; logo: string; published: boolean };

export async function getPartners(): Promise<Partner[]> {
  const demo: Partner[] = [
    { id: "itron", name: "Itron", description: "", descriptionEn: "", websiteUrl: "", logo: "/partners/itron.png", published: true },
    { id: "pvgas", name: "PV GAS", description: "", descriptionEn: "", websiteUrl: "", logo: "/partners/pvgas.png", published: true },
    { id: "ptsc", name: "PTSC", description: "", descriptionEn: "", websiteUrl: "", logo: "/partners/ptsc.png", published: true },
    { id: "pvc", name: "PVC", description: "", descriptionEn: "", websiteUrl: "", logo: "/partners/pvc.png", published: true },
    { id: "pvc-pt", name: "PVC-PT", description: "", descriptionEn: "", websiteUrl: "", logo: "/partners/pvc-pt.png", published: true },
    { id: "pvoil", name: "PV OIL", description: "", descriptionEn: "", websiteUrl: "", logo: "/partners/pvoil.png", published: true },
    { id: "gas-north", name: "PV GAS North", description: "", descriptionEn: "", websiteUrl: "", logo: "/partners/gas-north.png", published: true },
    { id: "gas-south", name: "PV GAS South", description: "", descriptionEn: "", websiteUrl: "", logo: "/partners/gas-south.png", published: true },
    { id: "bsr", name: "BSR", description: "", descriptionEn: "", websiteUrl: "", logo: "/partners/bsr.png", published: true },
    { id: "saigon-petro", name: "Saigon Petro", description: "", descriptionEn: "", websiteUrl: "", logo: "/partners/saigon-petro.png", published: true },
    { id: "petrolimex", name: "Petrolimex", description: "", descriptionEn: "", websiteUrl: "", logo: "/partners/petrolimex.png", published: true },
  ];
  if (!hasSupabaseConfig()) return demo;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from("partners").select("id,name,description_vi,description_en,website_url,logo_path,published").eq("published", true).order("sort_order", { ascending: true });
    if (error || !data?.length) return demo;
    return data.map((p) => ({ id: p.id, name: p.name, description: p.description_vi ?? "", descriptionEn: p.description_en ?? "", websiteUrl: p.website_url ?? "", logo: imageUrl(p.logo_path, "partner-images") ?? "", published: p.published }));
  } catch { return demo; }
}
