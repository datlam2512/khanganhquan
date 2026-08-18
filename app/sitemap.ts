import type { MetadataRoute } from "next";
import { getProducts, getProjects } from "@/lib/data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const staticPaths = ["/vi","/en","/vi/about","/en/about","/vi/products","/en/products","/vi/projects","/en/projects","/vi/partners","/en/partners","/vi/contact","/en/contact"];
  const products = await getProducts();
  const projects = await getProjects();
  const productPaths = products.flatMap((p) => [`/vi/products/${p.slug}`, `/en/products/${p.slug}`]);
  const projectPaths = projects.flatMap((p) => [`/vi/projects/${p.slug}`, `/en/projects/${p.slug}`]);
  return [...staticPaths, ...productPaths, ...projectPaths].map((path) => ({ url: `${base}${path}`, lastModified: new Date() }));
}
