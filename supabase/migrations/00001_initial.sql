create table products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null default '',
  category text not null default 'other',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  name text not null,
  price numeric not null,
  image_url text not null default ''
);

create index idx_product_variants_product_id on product_variants(product_id);
