import { type ClassValue } from "clsx";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }

/**
 * Normalize a value into a lowercase, URL-safe slug.
 * Strips Vietnamese diacritics, converts spaces/underscores to hyphens,
 * removes any other special characters. Prevents case-sensitivity issues
 * like "/products/Reducer" vs "/products/flanges".
 */
export function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getSupabaseBrowserUrl(bucket: string, path: string) {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!base) return "";
  return `${base}/storage/v1/object/public/${bucket}/${path.replace(/^\/+/, "")}`;
}
