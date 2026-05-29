-- Replace tenant-scoped policies with user_tenants-based policies.
-- Superadmin check now uses user_tenants.role instead of app_metadata.
-- Products
drop policy if exists "Users can manage their tenant's products" on products;
drop policy if exists "Superadmin can manage all products" on products;

create policy "Users can access their tenant's products"
  on products for all to authenticated
  using (
    exists (select 1 from user_tenants where user_id = auth.uid() and tenant_id = products.tenant_id)
    or exists (select 1 from user_tenants where user_id = auth.uid() and role = 'superadmin')
  )
  with check (
    exists (select 1 from user_tenants where user_id = auth.uid() and tenant_id = products.tenant_id)
    or exists (select 1 from user_tenants where user_id = auth.uid() and role = 'superadmin')
  );

-- Categories
drop policy if exists "Users can manage their tenant's categories" on categories;
drop policy if exists "Superadmin can manage all categories" on categories;

create policy "Users can access their tenant's categories"
  on categories for all to authenticated
  using (
    exists (select 1 from user_tenants where user_id = auth.uid() and tenant_id = categories.tenant_id)
    or exists (select 1 from user_tenants where user_id = auth.uid() and role = 'superadmin')
  )
  with check (
    exists (select 1 from user_tenants where user_id = auth.uid() and tenant_id = categories.tenant_id)
    or exists (select 1 from user_tenants where user_id = auth.uid() and role = 'superadmin')
  );

-- Orders
drop policy if exists "Users can manage their tenant's orders" on orders;
drop policy if exists "Superadmin can manage all orders" on orders;

create policy "Users can access their tenant's orders"
  on orders for all to authenticated
  using (
    exists (select 1 from user_tenants where user_id = auth.uid() and tenant_id = orders.tenant_id)
    or exists (select 1 from user_tenants where user_id = auth.uid() and role = 'superadmin')
  )
  with check (
    exists (select 1 from user_tenants where user_id = auth.uid() and tenant_id = orders.tenant_id)
    or exists (select 1 from user_tenants where user_id = auth.uid() and role = 'superadmin')
  );
