import { readFileSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createClient } from '@supabase/supabase-js'

function loadEnvFile(path: string) {
  if (!existsSync(path)) return
  for (const line of readFileSync(path, 'utf-8').split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const sep = trimmed.indexOf('=')
    if (sep === -1) continue
    process.env[trimmed.slice(0, sep).trim()] = trimmed.slice(sep + 1).trim()
  }
}

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')

// Load .env.local first (Next.js), then .env (seed-specific) — later files override
loadEnvFile(resolve(root, '.env.local'))
loadEnvFile(resolve(root, '.env'))

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_KEY
const adminEmail = process.env.SEED_ADMIN_EMAIL
const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'admin123456'

if (!supabaseUrl || !serviceKey) {
  console.error('Missing Supabase URL or SUPABASE_SERVICE_KEY. Check .env.local or .env')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceKey)

// Idempotent: clear existing products first
await supabase.from('products').delete().neq('id', '00000000-0000-0000-0000-000000000000')

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
  const { data: product, error: productError } = await supabase
    .from('products')
    .insert({ name: p.name, description: p.description, category: p.category, tenant_id: 'womencouture' })
    .select()
    .single()

  if (productError) {
    console.error(`Failed to create "${p.name}":`, productError.message)
    continue
  }

  const { error: variantError } = await supabase
    .from('product_variants')
    .insert(
      p.variants.map((v) => ({
        product_id: product.id,
        name: v.name,
        price: v.price,
        image_url: v.imageUrl,
      })),
    )

  if (variantError) {
    console.error(`Failed to create variants for "${p.name}":`, variantError.message)
    continue
  }

  console.log(`Created "${p.name}" (${product.id})`)
}

// Create admin user and set their role
if (adminEmail) {
  let userId: string | null = null

  const { data: users } = await supabase.auth.admin.listUsers()
  const existing = users?.users.find((u) => u.email === adminEmail)

  if (existing) {
    userId = existing.id
    console.log(`User ${adminEmail} already exists`)
  } else {
    const { data, error } = await supabase.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true,
    })
    if (error) {
      console.error('Failed to create admin user:', error.message)
    } else {
      userId = data.user.id
      console.log(`Created user ${adminEmail}`)
    }
  }

  if (userId) {
    const { error: utError } = await supabase
      .from('user_tenants')
      .upsert({ user_id: userId, tenant_id: 'womencouture', role: 'admin' }, { onConflict: 'user_id, tenant_id' })
    if (utError) {
      console.error('Failed to associate user with tenant:', utError.message)
    } else {
      console.log(`Admin associated with womencouture tenant`)
    }
  }
}

console.log('Done')
