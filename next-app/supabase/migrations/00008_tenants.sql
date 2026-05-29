create table tenants (
  id text primary key,
  name text not null,
  created_at timestamptz not null default now()
);

insert into tenants (id, name) values ('womencouture', 'Women Couture');

alter table products add column tenant_id text not null default 'womencouture' references tenants(id);
alter table categories add column tenant_id text not null default 'womencouture' references tenants(id);
alter table orders add column tenant_id text not null default 'womencouture' references tenants(id);

create index idx_products_tenant_id on products(tenant_id);
create index idx_categories_tenant_id on categories(tenant_id);
create index idx_orders_tenant_id on orders(tenant_id);
