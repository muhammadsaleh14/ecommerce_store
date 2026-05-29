insert into products (name, description, category, tenant_id) values
  (
    'Wireless Headphones',
    'Premium noise-cancelling wireless headphones with 30-hour battery life and deep bass.',
    'electronics',
    'womencouture'
  ),
  (
    'Trail Running Shoes',
    'Lightweight trail running shoes with responsive cushioning and rugged grip for any terrain.',
    'sports',
    'womencouture'
  );

with p as (select id, name from products) insert into product_variants (product_id, name, price)
select p.id, v.*
from p
cross join (values
  ('Black', 79.99),
  ('White', 79.99)
) as v(name, price)
where p.name = 'Wireless Headphones';

with p as (select id, name from products) insert into product_variants (product_id, name, price)
select p.id, v.*
from p
cross join (values
  ('US 9 – Red', 119.99),
  ('US 9 – Blue', 119.99),
  ('US 10 – Red', 129.99),
  ('US 10 – Blue', 129.99),
  ('US 11 – Red', 139.99),
  ('US 11 – Blue', 139.99)
) as v(name, price)
where p.name = 'Trail Running Shoes';
