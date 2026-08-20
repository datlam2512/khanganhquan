import type { MetadataRoute } from "next";
import { getProducts, getProjects } from "@/lib/data";
import { SITE_URL } from "@/lib/site-url";

// The sitemap reflects live product/project data, so it should always be
// generated on request rather than frozen at build time.
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = SITE_URL;
  const staticPaths = [
    "/vi",
    "/en",
    "/vi/about",
    "/en/about",
    "/vi/products",
    "/en/products",
    "/vi/projects",
    "/en/projects",
    "/vi/partners",
    "/en/partners",
    "/vi/contact",
    "/en/contact",
  ];
  const products = await getProducts();
  const projects = await getProjects();
  const productPaths = products.flatMap((p) => [
    `/vi/products/${p.slug}`,
    `/en/products/${p.slug}`,
  ]);
  const projectPaths = projects.flatMap((p) => [
    `/vi/projects/${p.slug}`,
    `/en/projects/${p.slug}`,
  ]);
  return [...staticPaths, ...productPaths, ...projectPaths].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
  }));
}
