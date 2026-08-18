export type Locale = "vi" | "en";

export type Product = {
  id: string;
  slug: string;
  code: string;
  categorySlug: string;
  name: string;
  nameEn: string;
  short: string;
  shortEn: string;
  description: string;
  descriptionEn: string;
  material: string;
  materialEn: string;
  standards: string;
  applications: string;
  applicationsEn: string;
  image: string;
  gallery: string[];
  published: boolean;
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
