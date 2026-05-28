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

loadEnvFile(resolve(root, '.env.local'))
loadEnvFile(resolve(root, '.env'))

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_KEY

if (!supabaseUrl || !serviceKey) {
  console.error('Missing Supabase URL or SUPABASE_SERVICE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceKey)

const categories = [
  { slug: 'electronics', name: 'Electronics', description: 'Electronic devices and accessories' },
  { slug: 'clothing', name: 'Clothing', description: 'Apparel and fashion items' },
  { slug: 'home-garden', name: 'Home & Garden', description: 'Home improvement and garden supplies' },
  { slug: 'books', name: 'Books', description: 'Books and publications' },
  { slug: 'sports', name: 'Sports', description: 'Sports equipment and gear' },
  { slug: 'toys', name: 'Toys', description: 'Toys and games' },
  { slug: 'food-drinks', name: 'Food & Drinks', description: 'Food and beverage items' },
  { slug: 'other', name: 'Other', description: 'Miscellaneous items' },
]

for (const cat of categories) {
  const { error } = await supabase.from('categories').upsert(cat, { onConflict: 'slug' })
  if (error) {
    console.error(`Failed to upsert "${cat.slug}":`, error.message)
  } else {
    console.log(`Category "${cat.slug}" ready`)
  }
}

console.log('Done')
