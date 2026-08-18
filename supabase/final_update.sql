-- Final CMS / contact / project gallery update.
-- Run this after the existing schema.

alter table public.company_settings add column if not exists address_vi text;
alter table public.company_settings add column if not exists address_en text;
alter table public.company_settings add column if not exists logo_path text;
alter table public.company_settings add column if not exists about_en text;
alter table public.company_settings add column if not exists about_vi text;

-- Keep only one company location in the website UI. Existing location rows are retained
-- for backwards compatibility; the public Contact page reads company_settings.address_vi.

-- Project gallery is already supported by project_images in the base schema.
-- Ensure indexes exist.
create index if not exists project_images_project_sort_idx on public.project_images(project_id, sort_order);

-- Contact submissions table if the previous contact form patch has not been run.
create table if not exists public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  company text,
  phone text not null,
  email text not null,
  message text not null,
  status text not null default 'new' check (status in ('new','viewed','contacted','closed')),
  created_at timestamptz not null default now()
);
alter table public.contact_submissions enable row level security;
drop policy if exists "public can create contact submissions" on public.contact_submissions;
create policy "public can create contact submissions" on public.contact_submissions for insert to anon, authenticated with check (true);
drop policy if exists "admins can read contact submissions" on public.contact_submissions;
create policy "admins can read contact submissions" on public.contact_submissions for select to authenticated using (public.is_admin());
