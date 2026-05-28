create table categories (
  slug text primary key,
  name text not null,
  description text
);

insert into categories (slug, name, description) values
  ('electronics', 'Electronics', 'Electronic devices and accessories'),
  ('clothing', 'Clothing', 'Apparel and fashion items'),
  ('home-garden', 'Home & Garden', 'Home improvement and garden supplies'),
  ('books', 'Books', 'Books and publications'),
  ('sports', 'Sports', 'Sports equipment and gear'),
  ('toys', 'Toys', 'Toys and games'),
  ('food-drinks', 'Food & Drinks', 'Food and beverage items'),
  ('other', 'Other', 'Miscellaneous items');

alter table products
  add constraint products_category_fkey
  foreign key (category) references categories(slug);
