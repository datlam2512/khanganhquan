/**
 * Resolve the canonical site URL used for metadata, canonical tags,
 * sitemap.xml and robots.txt.
 *
 * Priority:
 * 1. NEXT_PUBLIC_SITE_URL — set this in Vercel Project Settings > Environment
 *    Variables to your real production domain (e.g. https://www.khanganhquan.com)
 *    once it is live. This always wins.
 * 2. VERCEL_PROJECT_PRODUCTION_URL / VERCEL_URL — automatically provided by
 *    Vercel at build/runtime, so production builds never silently fall back
 *    to localhost even if step 1 was never configured.
 * 3. http://localhost:3000 — local development only.
 */
function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/+$/, "");

  const vercelProdUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercelProdUrl) return `https://${vercelProdUrl}`;

  const vercelUrl = process.env.VERCEL_URL;
  if (vercelUrl) return `https://${vercelUrl}`;

  return "http://localhost:3000";
}

export const SITE_URL = resolveSiteUrl();
