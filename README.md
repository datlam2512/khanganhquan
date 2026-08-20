# Khang Anh Quan — Corporate Website

Next.js App Router + TypeScript + Tailwind CSS + Supabase/PostgreSQL/Auth/Storage.

## 1. Install

```bash
npm install
```

Current project versions are pinned to the current stable Next.js 16.2.12 and current Supabase SSR/JS packages. Next.js 16.2.12 is the current `latest` npm release; `@supabase/ssr` is using the current 0.12.x line and `@supabase/supabase-js` the current 2.111.x line.

## 2. Environment

Copy `.env.example` to `.env.local` and fill:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## 3. Supabase

Run `supabase/schema.sql`, then `supabase/seed.sql` in the Supabase SQL Editor.

Create an Auth user, then promote it to admin by inserting its UUID into `profiles`:

```sql
insert into public.profiles (id, full_name, role)
values ('AUTH-USER-UUID', 'KAQ Admin', 'admin')
on conflict (id) do update set role='admin';
```

The schema includes:

- PostgreSQL tables for products, categories, projects, partners, company settings, locations and analytics.
- RLS policies for public published content and admin CRUD.
- Supabase Storage buckets and policies.
- Accent-insensitive database-side product search through `search_products(text)`.

## 4. Run

```bash
npm run dev
npm run lint
npm run build
npm run start
```

## 5. Routes

Public:

- `/vi`
- `/en`
- `/vi/about`, `/en/about`
- `/vi/products`, `/en/products`
- `/vi/products/[slug]`, `/en/products/[slug]`
- `/vi/projects`, `/en/projects`
- `/vi/projects/[slug]`, `/en/projects/[slug]`
- `/vi/partners`, `/en/partners`
- `/vi/contact`, `/en/contact`

Admin:

- `/admin/login`
- `/admin/dashboard`
- `/admin/products`
- `/admin/products/new`
- `/admin/products/[id]`
- `/admin/categories`
- `/admin/projects`
- `/admin/partners`
- `/admin/company`
- `/admin/analytics`

## 6. Search

Public product search uses the Supabase RPC `search_products` when Supabase is configured. It searches product name, code, short/long description, material, standards, applications and admin-provided search keywords, and normalizes Vietnamese diacritics with PostgreSQL `unaccent`.

When Supabase environment variables are not present, the site automatically falls back to the demo dataset so the UI can still be previewed locally.

### Visual system
- Tailwind CSS v4
- `@fontsource-variable/inter` for body/UI typography
- `@fontsource-variable/manrope` for display headings
- `tw-animate-css` for lightweight Tailwind-compatible motion utilities
- `@tailwindcss/typography` available for rich-text content

The public UI uses Inter for readability and Manrope for large headings, with a restrained green industrial palette, softer cards, rounded navigation, and lighter shadows.


## Admin login

### Demo mode (không cấu hình Supabase)
Email: `admin@kaq.local`
Mật khẩu: `KAQ@2026Admin`

Demo mode chỉ dành cho local preview. Khi deploy thật, cấu hình Supabase Auth và tạo user trong Authentication > Users, sau đó thêm user ID vào bảng `profiles` với `role = admin`.

### Supabase production
1. Tạo user trong Supabase Authentication > Users.
2. Lấy UUID của user.
3. Chạy: `insert into public.profiles (id, full_name, role) values ('USER_UUID', 'KAQ Admin', 'admin') on conflict (id) do update set role='admin';`
4. Đăng nhập bằng email/password của user đó.

