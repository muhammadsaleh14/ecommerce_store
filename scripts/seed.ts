import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createClient } from '@supabase/supabase-js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')

for (const line of readFileSync(resolve(root, '.env'), 'utf-8').split('\n')) {
  const trimmed = line.trim()
  if (!trimmed || trimmed.startsWith('#')) continue
  const sep = trimmed.indexOf('=')
  if (sep === -1) continue
  process.env[trimmed.slice(0, sep).trim()] = trimmed.slice(sep + 1).trim()
}

const supabaseUrl = process.env.VITE_SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_KEY

if (!supabaseUrl || !serviceKey) {
  console.error(
    'Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_KEY in .env',
  )
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceKey)

async function seedProduct(
  name: string,
  description: string,
  category: string,
  variants: { name: string; price: number; imageUrl: string }[],
) {
  const { data: product, error: productError } = await supabase
    .from('products')
    .insert({ name, description, category })
    .select()
    .single()

  if (productError) {
    console.error(`Failed to create product "${name}":`, productError)
    return
  }

  const { error: variantError } = await supabase
    .from('product_variants')
    .insert(
      variants.map((v) => ({
        product_id: product.id,
        name: v.name,
        price: v.price,
        image_url: v.imageUrl,
      })),
    )

  if (variantError) {
    console.error(`Failed to create variants for "${name}":`, variantError)
    return
  }

  console.log(`Created "${name}" (${product.id})`)
}

const products = [
  {
    name: 'Wireless Headphones',
    description:
      'Premium noise-cancelling wireless headphones with 30-hour battery life and deep bass.',
    category: 'electronics',
    variants: [
      { name: 'Black', price: 79.99, imageUrl: '' },
      { name: 'White', price: 79.99, imageUrl: '' },
    ],
  },
  {
    name: 'Trail Running Shoes',
    description:
      'Lightweight trail running shoes with responsive cushioning and rugged grip for any terrain.',
    category: 'sports',
    variants: [
      { name: 'US 9 – Red', price: 119.99, imageUrl: '' },
      { name: 'US 9 – Blue', price: 119.99, imageUrl: '' },
      { name: 'US 10 – Red', price: 129.99, imageUrl: '' },
      { name: 'US 10 – Blue', price: 129.99, imageUrl: '' },
      { name: 'US 11 – Red', price: 139.99, imageUrl: '' },
      { name: 'US 11 – Blue', price: 139.99, imageUrl: '' },
    ],
  },
]

for (const p of products) {
  await seedProduct(p.name, p.description, p.category, p.variants)
}

console.log('Done — 2 products seeded.')
