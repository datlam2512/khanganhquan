import {
  categories as demoCategories,
  company as demoCompany,
  products as demoProducts,
  projects as demoProjects,
} from "@/data/site";
import { createClient } from "@/lib/supabase/server";
import type { Category, Product, Project } from "@/lib/types";
import type { HeroSlide } from "@/components/public/hero";

export function hasSupabaseConfig() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
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
    const { data, error } = await supabase
      .from("hero_slides")
      .select("id,image_path,sort_order,published")
      .eq("published", true)
      .order("sort_order", { ascending: true });
    if (error || !data) return fallback;
    return data
      .map((slide) => ({
        id: slide.id,
        image: imageUrl(slide.image_path, "company-images") ?? "",
        sortOrder: slide.sort_order ?? 0,
        published: Boolean(slide.published),
      }))
      .filter((slide) => slide.image);
  } catch {
    return fallback;
  }
}

export async function getCategories(): Promise<Category[]> {
  if (!hasSupabaseConfig()) {
    return demoCategories;
  }

  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("categories")
      .select(`
        id,
        slug,
        name_vi,
        name_en,
        description_vi,
        description_en,
        image,
        published
      `)
      .eq("published", true);

    if (error) {
      console.error("Error fetching categories:", error);
      return demoCategories;
    }

    if (!data || data.length === 0) {
      return demoCategories;
    }

    return data.map((c) => ({
      id: c.id,
      slug: c.slug,

      name: c.name_vi,
      nameEn: c.name_en,

      description: c.description_vi ?? "",
      descriptionEn: c.description_en ?? "",

      image:
        c.image ??
        demoCategories.find((d) => d.slug === c.slug)?.image ??
        demoCategories[0]?.image,

      published: c.published,
    }));
  } catch (error) {
    console.error("Error loading categories:", error);
    return demoCategories;
  }
}

export async function getProducts(
  options: { search?: string; category?: string } = {},
): Promise<Product[]> {
  const normalizeText = (value: string) =>
    value
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

  const demoFilter = (): Product[] => {
    const q = normalizeText(options.search?.trim() ?? "");

    return demoProducts.filter((p) => {
      if (options.category) {
        const category = demoCategories.find(
          (c) => c.slug === options.category,
        );

        if (!category || p.categoryId !== category.id) {
          return false;
        }
      }

      if (!q) {
        return true;
      }

      const specText = [...p.specGroupsVi, ...p.specGroupsEn]
        .map((group) => {
          const rows = (group.rows ?? []).flatMap((row) =>
            Array.isArray(row) ? row : [row],
          );

          const nestedGroups = (group.groups ?? []).flatMap((nested) => [
            nested.name ?? "",
            ...(nested.items ?? []).flatMap((item) =>
              Array.isArray(item) ? item : [item],
            ),
          ]);

          return [
            group.title ?? "",
            group.content ?? "",
            ...(group.columns ?? []),
            ...rows,
            ...nestedGroups,
          ].join(" ");
        })
        .join(" ");

      const haystack = normalizeText(
        [
          p.name,
          p.nameEn,
          p.code,
          p.short,
          p.shortEn,
          p.description,
          p.descriptionEn,
          p.material,
          p.materialEn,
          specText,
        ].join(" "),
      );

      return haystack.includes(q);
    });
  };

  /*
   * ===========================================================
   * NO SUPABASE
   * ===========================================================
   */

  if (!hasSupabaseConfig()) {
    return demoFilter();
  }

  try {
    const supabase = await createClient();

    /*
     * =========================================================
     * 1. PRODUCTS
     * =========================================================
     */

    let query = supabase
      .from("products")
      .select(
        `
        id,
        slug,
        code,
        category_id,
        name_vi,
        name_en,
        short_vi,
        short_en,
        description_vi,
        description_en,
        material_vi,
        material_en,
        spec_groups_vi,
        spec_groups_en,
        published
      `,
      )
      .eq("published", true)
      .order("created_at", { ascending: false });

    /*
     * =========================================================
     * 2. CATEGORY FILTER
     * =========================================================
     */

    if (options.category) {
      const categoryResult = await supabase
        .from("categories")
        .select("id")
        .eq("slug", options.category)
        .maybeSingle();

      if (categoryResult.error) {
        console.error("getProducts category error:", categoryResult.error);
        return demoFilter();
      }

      if (!categoryResult.data) {
        return [];
      }

      query = query.eq("category_id", categoryResult.data.id);
    }

    /*
     * =========================================================
     * 3. GET PRODUCTS
     * =========================================================
     */

    const { data, error } = await query;

    if (error) {
      console.error("getProducts error:", error);
      return demoFilter();
    }

    if (!data?.length) {
      return [];
    }

    /*
     * =========================================================
     * 4. GET PRODUCT IMAGES
     * =========================================================
     */

    const productIds = data.map((product) => product.id);
    const { data: imageData, error: imageError } = await supabase
      .from("product_images")
      .select(
        `
    id,
    product_id,
    image_url,
    alt_vi,
    alt_en,
    sort_order,
    is_primary
  `,
      )
      .in("product_id", productIds)
      .order("sort_order", { ascending: true });

    /*
     * =========================================================
     * 5. GROUP IMAGES
     * =========================================================
     */

    const imagesByProduct = new Map<string, Product["images"]>();

    for (const image of imageData ?? []) {
      const current = imagesByProduct.get(image.product_id) ?? [];

      current.push({
        id: image.id,
        productId: image.product_id,
        imageUrl: imageUrl(image.image_url, "product-images") ?? "",
        altVi: image.alt_vi ?? "",
        altEn: image.alt_en ?? "",
        sortOrder: image.sort_order ?? 0,
        isPrimary: Boolean(image.is_primary),
      });

      imagesByProduct.set(image.product_id, current);
    }
    /*
     * =========================================================
     * 6. MAP SUPABASE -> Product
     * =========================================================
     */

    let mapped: Product[] = data.map((p) => {
      const images = imagesByProduct.get(p.id) ?? [];

      return {
        id: p.id,
        slug: p.slug,
        code: p.code ?? "",

        categoryId: p.category_id,

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

        images,

        published: Boolean(p.published),
      };
    });

    /*
     * =========================================================
     * 7. SEARCH SUPABASE DATA
     * =========================================================
     */

    const search = options.search?.trim()
      ? normalizeText(options.search.trim())
      : "";

    if (search) {
      mapped = mapped.filter((product) => {
        const specText = [
          JSON.stringify(product.specGroupsVi),
          JSON.stringify(product.specGroupsEn),
        ].join(" ");

        const haystack = [
          product.name,
          product.nameEn,
          product.code,
          product.short,
          product.shortEn,
          product.description,
          product.descriptionEn,
          product.material,
          product.materialEn,
          specText,
        ]
          .join(" ")
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "");

        return haystack.includes(search);
      });
    }

    return mapped;
  } catch (error) {
    console.error("getProducts exception:", error);

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
  if (!hasSupabaseConfig())
    return demoProjects.map((p) => ({
      ...p,
      gallery: p.gallery?.length ? p.gallery : [p.coverImage],
    }));
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("projects")
      .select(
        "id,slug,title_vi,title_en,description_vi,description_en,location,year,equipment_vi,equipment_en,scope_vi,scope_en,cover_image_path,published",
      )
      .eq("published", true)
      .order("sort_order", { ascending: true });
    if (error || !data?.length)
      return demoProjects.map((p) => ({
        ...p,
        gallery: p.gallery?.length ? p.gallery : [p.coverImage],
      }));
    const mapped = await Promise.all(
      data.map(async (p) => {
        const galleryResult = await supabase
          .from("project_images")
          .select("image_path")
          .eq("project_id", p.id)
          .order("sort_order", { ascending: true });
        const gallery = (galleryResult.data ?? [])
          .map((img) => imageUrl(img.image_path, "project-images"))
          .filter(Boolean) as string[];
        const cover =
          imageUrl(p.cover_image_path, "project-images") ??
          demoProjects.find((d) => d.slug === p.slug)?.coverImage ??
          demoProjects[0].coverImage;
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
      }),
    );
    return mapped;
  } catch {
    return demoProjects.map((p) => ({
      ...p,
      gallery: p.gallery?.length ? p.gallery : [p.coverImage],
    }));
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
    const { data, error } = await supabase
      .from("company_settings")
      .select("*")
      .eq("singleton", true)
      .maybeSingle();
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

export type Partner = {
  id: string;
  name: string;
  description: string;
  descriptionEn: string;
  websiteUrl: string;
  logo: string;
  published: boolean;
};

export async function getPartners(): Promise<Partner[]> {
  const demo: Partner[] = [
    {
      id: "itron",
      name: "Itron",
      description: "",
      descriptionEn: "",
      websiteUrl: "",
      logo: "/partners/itron.png",
      published: true,
    },
    {
      id: "pvgas",
      name: "PV GAS",
      description: "",
      descriptionEn: "",
      websiteUrl: "",
      logo: "/partners/pvgas.png",
      published: true,
    },
    {
      id: "ptsc",
      name: "PTSC",
      description: "",
      descriptionEn: "",
      websiteUrl: "",
      logo: "/partners/ptsc.png",
      published: true,
    },
    {
      id: "pvc",
      name: "PVC",
      description: "",
      descriptionEn: "",
      websiteUrl: "",
      logo: "/partners/pvc.png",
      published: true,
    },
    {
      id: "pvc-pt",
      name: "PVC-PT",
      description: "",
      descriptionEn: "",
      websiteUrl: "",
      logo: "/partners/pvc-pt.png",
      published: true,
    },
    {
      id: "pvoil",
      name: "PV OIL",
      description: "",
      descriptionEn: "",
      websiteUrl: "",
      logo: "/partners/pvoil.png",
      published: true,
    },
    {
      id: "gas-north",
      name: "PV GAS North",
      description: "",
      descriptionEn: "",
      websiteUrl: "",
      logo: "/partners/gas-north.png",
      published: true,
    },
    {
      id: "gas-south",
      name: "PV GAS South",
      description: "",
      descriptionEn: "",
      websiteUrl: "",
      logo: "/partners/gas-south.png",
      published: true,
    },
    {
      id: "bsr",
      name: "BSR",
      description: "",
      descriptionEn: "",
      websiteUrl: "",
      logo: "/partners/bsr.png",
      published: true,
    },
    {
      id: "saigon-petro",
      name: "Saigon Petro",
      description: "",
      descriptionEn: "",
      websiteUrl: "",
      logo: "/partners/saigon-petro.png",
      published: true,
    },
    {
      id: "petrolimex",
      name: "Petrolimex",
      description: "",
      descriptionEn: "",
      websiteUrl: "",
      logo: "/partners/petrolimex.png",
      published: true,
    },
  ];
  if (!hasSupabaseConfig()) return demo;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("partners")
      .select(
        "id,name,description_vi,description_en,website_url,logo_path,published",
      )
      .eq("published", true)
      .order("sort_order", { ascending: true });
    if (error || !data?.length) return demo;
    return data.map((p) => ({
      id: p.id,
      name: p.name,
      description: p.description_vi ?? "",
      descriptionEn: p.description_en ?? "",
      websiteUrl: p.website_url ?? "",
      logo: imageUrl(p.logo_path, "partner-images") ?? "",
      published: p.published,
    }));
  } catch {
    return demo;
  }
}
