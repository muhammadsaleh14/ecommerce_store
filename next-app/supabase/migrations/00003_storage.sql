-- Create product-images bucket (idempotent)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('product-images', 'product-images', true, '5242880', array['image/png', 'image/jpeg', 'image/webp', 'image/gif'])
on conflict (id) do nothing;

-- Admin: upload images
do $$ begin
  create policy "Admin can upload product-images" on storage.objects
    for insert to authenticated
    with check (
      bucket_id = 'product-images'
      and auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'
    );
exception when duplicate_object then null;
end $$;

-- Admin: update images
do $$ begin
  create policy "Admin can update product-images" on storage.objects
    for update to authenticated
    using (
      bucket_id = 'product-images'
      and auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'
    )
    with check (
      bucket_id = 'product-images'
      and auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'
    );
exception when duplicate_object then null;
end $$;

-- Admin: delete images
do $$ begin
  create policy "Admin can delete product-images" on storage.objects
    for delete to authenticated
    using (
      bucket_id = 'product-images'
      and auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'
    );
exception when duplicate_object then null;
end $$;

-- Public: view images
do $$ begin
  create policy "Anyone can view product-images" on storage.objects
    for select to public
    using (bucket_id = 'product-images');
exception when duplicate_object then null;
end $$;
