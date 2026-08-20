import { cache } from "react";
import {
  categories as demoCategories,
  company as demoCompany,
  products as demoProducts,
  projects as demoProjects,
} from "@/data/site";
import { createPublicClient } from "@/lib/supabase/public";
import type { Category, Product, Project } from "@/lib/types";
import type { HeroSlide } from "@/components/public/hero";
import type { Locale } from "@/lib/types";
/**
 * Next.js throws a special internal error to bail a route out of static
 * generation into dynamic rendering whenever it touches a "dynamic API"
 * (here: `cookies()` inside the Supabase server client). It is NOT a real
 * failure — catching it as a normal error and logging/falling back to demo
 * data (as this file used to do) produces misleading "Error loading..."
 * console output during `next build` for every admin/dynamic route.
 * We detect it here and rethrow so Next can handle it as intended.
 */
function isNextDynamicBailout(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "digest" in error &&
    typeof (error as { digest?: unknown }).digest === "string" &&
    (error as { digest: string }).digest.startsWith("DYNAMIC_SERVER_USAGE")
  );
}

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

export const getHeroSlides = cache(async function getHeroSlides(): Promise<
  HeroSlide[]
> {
  const fallback: HeroSlide[] = [];
  if (!hasSupabaseConfig()) return fallback;
  try {
    const supabase = createPublicClient();
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
});

export const getCategories = cache(async function getCategories(): Promise<
  Category[]
> {
  if (!hasSupabaseConfig()) {
    return demoCategories;
  }

  try {
    const supabase = createPublicClient();

    const { data, error } = await supabase
      .from("categories")
      .select(
        `
        id,
        slug,
        name_vi,
        name_en,
        description_vi,
        description_en,
        image,
        published
      `,
      )
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
    if (isNextDynamicBailout(error)) throw error;
    console.error("Error loading categories:", error);
    return demoCategories;
  }
});

export const getProducts = cache(async function getProducts(
  options: {
    search?: string;
    category?: string;
    locale?: Locale;
  } = {},
): Promise<Product[]> {
  const normalizeText = (value: string) =>
    value
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

  const search = normalizeText(options.search?.trim() ?? "");

  const demoFilter = (): Product[] => {
    return demoProducts.filter((p) => {
      // ============================
      // CATEGORY FILTER
      // ============================
      if (options.category) {
        const category = demoCategories.find(
          (c) => c.slug === options.category,
        );

        if (!category || p.categoryId !== category.id) {
          return false;
        }
      }

      // ============================
      // PRODUCT NAME SEARCH ONLY
      // ============================
      if (search) {
        const productName =
          options.locale === "en"
            ? p.nameEn
            : p.name;

        return normalizeText(productName).includes(search);
      }

      return true;
    });
  };

  // ============================================================
  // NO SUPABASE
  // ============================================================

  if (!hasSupabaseConfig()) {
    return demoFilter();
  }

  try {
    const supabase = createPublicClient();

    // ==========================================================
    // 1. PRODUCTS QUERY
    // ==========================================================

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

    // ==========================================================
    // 2. CATEGORY FILTER
    // ==========================================================

    if (options.category) {
      const categoryResult = await supabase
        .from("categories")
        .select("id")
        .eq("slug", options.category)
        .maybeSingle();

      if (categoryResult.error) {
        console.error(
          "getProducts category error:",
          categoryResult.error,
        );

        return demoFilter();
      }

      if (!categoryResult.data) {
        return [];
      }

      query = query.eq(
        "category_id",
        categoryResult.data.id,
      );
    }

    // ==========================================================
    // 3. GET PRODUCTS
    // ==========================================================

    const { data, error } = await query;

    if (error) {
      console.error("getProducts error:", error);
      return demoFilter();
    }

    if (!data?.length) {
      return [];
    }

    // ==========================================================
    // 4. GET PRODUCT IMAGES
    // ==========================================================

    const productIds = data.map((product) => product.id);

    const { data: imageData } = await supabase
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

    // ==========================================================
    // 5. GROUP IMAGES
    // ==========================================================

    const imagesByProduct = new Map<
      string,
      Product["images"]
    >();

    for (const image of imageData ?? []) {
      const current =
        imagesByProduct.get(image.product_id) ?? [];

      current.push({
        id: image.id,
        productId: image.product_id,
        imageUrl:
          imageUrl(
            image.image_url,
            "product-images",
          ) ?? "",
        altVi: image.alt_vi ?? "",
        altEn: image.alt_en ?? "",
        sortOrder: image.sort_order ?? 0,
        isPrimary: Boolean(image.is_primary),
      });

      imagesByProduct.set(
        image.product_id,
        current,
      );
    }

    // ==========================================================
    // 6. MAP SUPABASE -> PRODUCT
    // ==========================================================

    let mapped: Product[] = data.map((p) => {
      const images =
        imagesByProduct.get(p.id) ?? [];

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

        specGroupsVi: Array.isArray(p.spec_groups_vi)
          ? p.spec_groups_vi
          : [],

        specGroupsEn: Array.isArray(p.spec_groups_en)
          ? p.spec_groups_en
          : [],

        images,
        published: Boolean(p.published),
      };
    });

    // ==========================================================
    // 7. SEARCH BY PRODUCT NAME ONLY
    // ==========================================================
if (search) {
  mapped = mapped.filter((product) => {
    const productName =
      options.locale === "en"
        ? product.nameEn
        : product.name;

    const normalizedName = normalizeText(productName);

    // Tìm theo từ, không tìm substring nằm giữa một từ khác
    const words = normalizedName.split(/\s+/);

    return words.some((word) => word.startsWith(search));
  });
}

    return mapped;
  } catch (error) {
    if (isNextDynamicBailout(error)) {
      throw error;
    }

    console.error(
      "getProducts exception:",
      error,
    );

    return demoFilter();
  }
});

export const getProduct = cache(async function getProduct(
  slug: string,
): Promise<Product | undefined> {
  const products = await getProducts();
  const lower = slug.toLowerCase();
  return (
    products.find((p) => p.slug === slug) ??
    products.find((p) => p.slug.toLowerCase() === lower)
  );
});

export const getProductById = cache(async function getProductById(
  id: string,
): Promise<Product | undefined> {
  const products = await getProducts();
  return products.find((p) => p.id === id);
});

export const getProjects = cache(async function getProjects(): Promise<
  Project[]
> {
  if (!hasSupabaseConfig())
    return demoProjects.map((p) => ({
      ...p,
      gallery: p.gallery?.length ? p.gallery : [p.coverImage],
    }));
  try {
    const supabase = createPublicClient();
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
});

export const getProject = cache(async function getProject(slug: string) {
  const list = await getProjects();
  const project = list.find((p) => p.slug === slug);
  return project;
});

export const getCompany = cache(async function getCompany() {
  if (!hasSupabaseConfig()) return demoCompany;
  try {
    const supabase = createPublicClient();
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
});

export type Partner = {
  id: string;
  name: string;
  description: string;
  descriptionEn: string;
  websiteUrl: string;
  logo: string;
  published: boolean;
};

export const getPartners = cache(async function getPartners(): Promise<
  Partner[]
> {
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
    const supabase = createPublicClient();
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
});
