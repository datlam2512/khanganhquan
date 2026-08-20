create extension if not exists pgcrypto;

create table if not exists profiles (id uuid primary key references auth.users(id) on delete cascade, full_name text, role text not null default 'admin', created_at timestamptz not null default now(), updated_at timestamptz not null default now());
create table if not exists categories (id uuid primary key default gen_random_uuid(), slug text unique not null, name_vi text not null, name_en text not null, description_vi text, description_en text, image_path text, sort_order int not null default 0, published boolean not null default true, created_at timestamptz not null default now(), updated_at timestamptz not null default now());
create table if not exists products (id uuid primary key default gen_random_uuid(), slug text unique not null, product_code text unique, category_id uuid references categories(id) on delete set null, name_vi text not null, name_en text not null, short_description_vi text, short_description_en text, description_vi text, description_en text, material_vi text, material_en text, standards_vi text, standards_en text, applications_vi text, applications_en text, search_keywords text, main_image_path text, published boolean not null default true, created_at timestamptz not null default now(), updated_at timestamptz not null default now());
create table if not exists product_images (id uuid primary key default gen_random_uuid(), product_id uuid not null references products(id) on delete cascade, image_path text not null, sort_order int not null default 0, created_at timestamptz not null default now());
create table if not exists projects (id uuid primary key default gen_random_uuid(), slug text unique not null, title_vi text not null, title_en text not null, description_vi text, description_en text, location text, year int, equipment_vi text, equipment_en text, scope_vi text, scope_en text, cover_image_path text, sort_order int not null default 0, published boolean not null default true, created_at timestamptz not null default now(), updated_at timestamptz not null default now());
create table if not exists project_images (id uuid primary key default gen_random_uuid(), project_id uuid not null references projects(id) on delete cascade, image_path text not null, sort_order int not null default 0, created_at timestamptz not null default now());
create table if not exists partners (id uuid primary key default gen_random_uuid(), name text not null, description_vi text, description_en text, website_url text, logo_path text, sort_order int not null default 0, published boolean not null default true, created_at timestamptz not null default now(), updated_at timestamptz not null default now());
create table if not exists company_settings (id uuid primary key default gen_random_uuid(), singleton boolean unique not null default true, company_name_vi text, company_name_en text, description_vi text, description_en text, email text, phone text, website text, facebook_url text, linkedin_url text, logo_path text, address_vi text, address_en text, about_vi text, about_en text, business_hours_vi text, business_hours_en text, updated_at timestamptz not null default now());
create table if not exists locations (id uuid primary key default gen_random_uuid(), name_vi text not null, name_en text not null, address_vi text, address_en text, phone text, latitude numeric, longitude numeric, google_maps_url text, sort_order int not null default 0, created_at timestamptz not null default now(), updated_at timestamptz not null default now());
create table if not exists analytics_events (id bigint generated always as identity primary key, event_type text not null, page_path text, session_id text, device_type text, browser text, referrer text, country text, created_at timestamptz not null default now());

create index if not exists products_category_idx on products(category_id);
create index if not exists products_published_idx on products(published);
create index if not exists products_created_at_idx on products(created_at desc);
create index if not exists products_search_idx on products using gin(to_tsvector('simple', coalesce(name_vi,'') || ' ' || coalesce(name_en,'') || ' ' || coalesce(description_vi,'') || ' ' || coalesce(description_en,'') || ' ' || coalesce(material_vi,'') || ' ' || coalesce(material_en,'') || ' ' || coalesce(standards_vi,'') || ' ' || coalesce(standards_en,'') || ' ' || coalesce(applications_vi,'') || ' ' || coalesce(applications_en,'') || ' ' || coalesce(search_keywords,'')));

alter table profiles enable row level security; alter table categories enable row level security; alter table products enable row level security; alter table product_images enable row level security; alter table projects enable row level security; alter table project_images enable row level security; alter table partners enable row level security; alter table company_settings enable row level security; alter table locations enable row level security; alter table analytics_events enable row level security;

create policy "public read published categories" on categories for select using (published = true);
create policy "public read published products" on products for select using (published = true);
create policy "public read published product images" on product_images for select using (exists (select 1 from products p where p.id = product_id and p.published));
create policy "public read published projects" on projects for select using (published = true);
create policy "public read published project images" on project_images for select using (exists (select 1 from projects p where p.id = project_id and p.published));
create policy "public read published partners" on partners for select using (published = true);
create policy "public read company settings" on company_settings for select using (true);
create policy "public read locations" on locations for select using (true);
create policy "public insert anonymous analytics" on analytics_events for insert with check (true);

create or replace function public.is_admin() returns boolean language sql stable security definer set search_path = public as $$ select exists(select 1 from profiles where id = auth.uid() and role = 'admin'); $$;

create policy "admin manage categories" on categories for all using (public.is_admin()) with check (public.is_admin());
create policy "admin manage products" on products for all using (public.is_admin()) with check (public.is_admin());
create policy "admin manage product images" on product_images for all using (public.is_admin()) with check (public.is_admin());
create policy "admin manage projects" on projects for all using (public.is_admin()) with check (public.is_admin());
create policy "admin manage project images" on project_images for all using (public.is_admin()) with check (public.is_admin());
create policy "admin manage partners" on partners for all using (public.is_admin()) with check (public.is_admin());
create policy "admin manage company settings" on company_settings for all using (public.is_admin()) with check (public.is_admin());
create policy "admin manage locations" on locations for all using (public.is_admin()) with check (public.is_admin());
create policy "admin read analytics" on analytics_events for select using (public.is_admin());

insert into storage.buckets (id, name, public) values ('product-images','product-images',true) on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('project-images','project-images',true) on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('partner-images','partner-images',true) on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('company-images','company-images',true) on conflict (id) do nothing;

-- Accent-insensitive database-side product search for the public catalog.
create extension if not exists unaccent;

create or replace function public.search_products(search_query text)
returns setof public.products
language sql
stable
as $$
  select p.*
  from public.products p
  where p.published = true
    and unaccent(
      coalesce(p.name_vi,'') || ' ' ||
      coalesce(p.name_en,'') || ' ' ||
      coalesce(p.product_code,'') || ' ' ||
      coalesce(p.short_description_vi,'') || ' ' ||
      coalesce(p.short_description_en,'') || ' ' ||
      coalesce(p.description_vi,'') || ' ' ||
      coalesce(p.description_en,'') || ' ' ||
      coalesce(p.material_vi,'') || ' ' ||
      coalesce(p.material_en,'') || ' ' ||
      coalesce(p.standards_vi,'') || ' ' ||
      coalesce(p.standards_en,'') || ' ' ||
      coalesce(p.applications_vi,'') || ' ' ||
      coalesce(p.applications_en,'') || ' ' ||
      coalesce(p.search_keywords,'')
    ) ilike '%' || unaccent(search_query) || '%'
  order by p.created_at desc;
$$;

grant execute on function public.search_products(text) to anon, authenticated;


-- Storage access: public can read public buckets; admins can manage objects.
drop policy if exists "public read product images" on storage.objects;
drop policy if exists "public read project images" on storage.objects;
drop policy if exists "public read partner images" on storage.objects;
drop policy if exists "public read company images" on storage.objects;
drop policy if exists "admin manage product storage" on storage.objects;
drop policy if exists "admin manage project storage" on storage.objects;
drop policy if exists "admin manage partner storage" on storage.objects;
drop policy if exists "admin manage company storage" on storage.objects;

create policy "public read product images" on storage.objects for select
using (bucket_id = 'product-images');
create policy "public read project images" on storage.objects for select
using (bucket_id = 'project-images');
create policy "public read partner images" on storage.objects for select
using (bucket_id = 'partner-images');
create policy "public read company images" on storage.objects for select
using (bucket_id = 'company-images');

create policy "admin manage product storage" on storage.objects for all
using (bucket_id = 'product-images' and public.is_admin())
with check (bucket_id = 'product-images' and public.is_admin());
create policy "admin manage project storage" on storage.objects for all
using (bucket_id = 'project-images' and public.is_admin())
with check (bucket_id = 'project-images' and public.is_admin());
create policy "admin manage partner storage" on storage.objects for all
using (bucket_id = 'partner-images' and public.is_admin())
with check (bucket_id = 'partner-images' and public.is_admin());
create policy "admin manage company storage" on storage.objects for all
using (bucket_id = 'company-images' and public.is_admin())
with check (bucket_id = 'company-images' and public.is_admin());

-- Homepage hero slider: admins manage images only; hero text stays fixed in the public UI.
create table if not exists hero_slides (
  id uuid primary key default gen_random_uuid(),
  image_path text not null,
  title_vi text not null,
  title_en text not null,
  description_vi text,
  description_en text,
  eyebrow_vi text,
  eyebrow_en text,
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table hero_slides enable row level security;
drop policy if exists "public read published hero slides" on hero_slides;
drop policy if exists "admin manage hero slides" on hero_slides;
create policy "public read published hero slides" on hero_slides for select using (published = true);
create policy "admin manage hero slides" on hero_slides for all using (public.is_admin()) with check (public.is_admin());
