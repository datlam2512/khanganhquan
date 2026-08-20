# SEO & Security hardening

- Dynamic locale metadata, canonical and hreflang.
- Sitemap and robots remain enabled.
- Next.js security headers added.
- Supabase RLS remains the primary data access boundary.
- Admin storage operations require admin session.
- Public data is limited to published records.
- Do not expose SUPABASE_SERVICE_ROLE_KEY to the client.
