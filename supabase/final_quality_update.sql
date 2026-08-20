-- Final quality update: keep one company location and improve product search.
-- Run this after schema.sql/final_update.sql in Supabase SQL Editor.

-- Ensure the only company location remains the main office.
-- Existing rows are not guessed or deleted automatically here; inspect the locations table and keep:
-- 39/1 Nguyễn Cửu Đàm, Phường Tân Sơn Nhì, Quận Tân Phú, TP. Hồ Chí Minh, Việt Nam.

create index if not exists product_images_product_sort_idx on public.product_images(product_id, sort_order);
create index if not exists project_images_project_sort_idx on public.project_images(project_id, sort_order);

create or replace function public.search_products(search_query text)
returns setof public.products
language sql
stable
as $$
  select p.*
  from public.products p
  where p.published = true
    and (
      search_query is null
      or trim(search_query) = ''
      or to_tsvector('simple',
          coalesce(p.name_vi,'') || ' ' || coalesce(p.name_en,'') || ' ' ||
          coalesce(p.product_code,'') || ' ' || coalesce(p.short_description_vi,'') || ' ' ||
          coalesce(p.short_description_en,'') || ' ' || coalesce(p.description_vi,'') || ' ' ||
          coalesce(p.description_en,'') || ' ' || coalesce(p.material_vi,'') || ' ' ||
          coalesce(p.material_en,'') || ' ' || coalesce(p.standards_vi,'') || ' ' ||
          coalesce(p.standards_en,'') || ' ' || coalesce(p.applications_vi,'') || ' ' ||
          coalesce(p.applications_en,'') || ' ' || coalesce(p.search_keywords,''))
        @@ plainto_tsquery('simple', search_query)
    )
  order by p.created_at desc;
$$;
