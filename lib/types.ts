export type Locale = "vi" | "en";

export type ProductImage = {
  id: string;
  productId: string;
  imageUrl: string;
  altVi: string | null;
  altEn: string | null;
  sortOrder: number;
  isPrimary: boolean;
};

export type SpecGroup = {
  id?: string;
  title?: string;
  type?: "table" | "text" | "material";
  content?: string;
  columns?: string[];
  rows?: (string | string[])[];
  groups?: {
    name?: string;
    items?: (string | string[])[];
  }[];
};
export type Category = {
  id: string;
  slug: string;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  image: string;
  published: boolean;
};
export type Product = {
  id: string;
  slug: string;
  code: string;

  // CŨ:
  // categorySlug: string;

  // MỚI:
  categoryId: string;

  name: string;
  nameEn: string;

  short: string;
  shortEn: string;

  description: string;
  descriptionEn: string;

  material: string;
  materialEn: string;

  specGroupsVi: SpecGroup[];
  specGroupsEn: SpecGroup[];

  images: ProductImage[];

  published: boolean;
};

export type Project = {
  id: string;
  slug: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  location: string;
  year: number;
  coverImage: string;
  equipment: string;
  scope: string;
  gallery: string[];
  published: boolean;
};
