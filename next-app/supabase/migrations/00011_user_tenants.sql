create table user_tenants (
  user_id uuid not null references auth.users(id) on delete cascade,
  tenant_id text not null references tenants(id) on delete cascade,
  role text not null default 'admin',
  primary key (user_id, tenant_id)
);

-- Backfill: associate existing admin users with womencouture
insert into user_tenants (user_id, tenant_id, role)
select id, 'womencouture', coalesce(raw_app_meta_data->>'role', 'admin')
from auth.users
where raw_app_meta_data->>'tenant_id' = 'womencouture'
   or raw_app_meta_data->>'role' = 'admin';

alter table user_tenants enable row level security;

create policy "Superadmin can manage all user_tenants"
  on user_tenants for all to authenticated
  using ((select raw_app_meta_data->>'role' from auth.users where id = auth.uid()) = 'superadmin')
  with check ((select raw_app_meta_data->>'role' from auth.users where id = auth.uid()) = 'superadmin');

create policy "Users can view their own user_tenants"
  on user_tenants for select to authenticated
  using (user_id = auth.uid());
