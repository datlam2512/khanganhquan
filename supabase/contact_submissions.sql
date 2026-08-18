-- Contact form: run this in Supabase SQL Editor.
create table if not exists public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  company text,
  phone text not null,
  email text not null,
  message text not null,
  status text not null default 'new'
    check (status in ('new','viewed','contacted','closed')),
  created_at timestamptz not null default now()
);

alter table public.contact_submissions enable row level security;

drop policy if exists "public can create contact submissions" on public.contact_submissions;
create policy "public can create contact submissions"
on public.contact_submissions
for insert
to anon, authenticated
with check (true);

drop policy if exists "admins can read contact submissions" on public.contact_submissions;
create policy "admins can read contact submissions"
on public.contact_submissions
for select
to authenticated
using (
  exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'admin'
  )
);

drop policy if exists "admins can update contact submissions" on public.contact_submissions;
create policy "admins can update contact submissions"
on public.contact_submissions
for update
to authenticated
using (
  exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'admin'
  )
)
with check (
  exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'admin'
  )
);
