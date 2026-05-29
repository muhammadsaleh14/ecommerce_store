-- Allow superadmin to see all rows regardless of tenant_id
create policy "Superadmin can manage all products"
  on products for all to authenticated
  using ((select raw_app_meta_data->>'role' from auth.users where id = auth.uid()) = 'superadmin')
  with check ((select raw_app_meta_data->>'role' from auth.users where id = auth.uid()) = 'superadmin');

create policy "Superadmin can manage all categories"
  on categories for all to authenticated
  using ((select raw_app_meta_data->>'role' from auth.users where id = auth.uid()) = 'superadmin')
  with check ((select raw_app_meta_data->>'role' from auth.users where id = auth.uid()) = 'superadmin');

create policy "Superadmin can manage all orders"
  on orders for all to authenticated
  using ((select raw_app_meta_data->>'role' from auth.users where id = auth.uid()) = 'superadmin')
  with check ((select raw_app_meta_data->>'role' from auth.users where id = auth.uid()) = 'superadmin');
