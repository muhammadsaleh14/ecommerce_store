create table orders (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  customer_phone text not null,
  customer_address text not null,
  notes text not null default '',
  total numeric not null,
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  product_id uuid not null references products(id) on delete cascade,
  variant_id uuid not null references product_variants(id) on delete cascade,
  product_name text not null,
  variant_name text not null,
  price numeric not null,
  quantity int not null,
  image_url text not null default ''
);

create index idx_order_items_order_id on order_items(order_id);
