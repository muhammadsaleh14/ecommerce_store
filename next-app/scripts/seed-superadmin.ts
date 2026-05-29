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

const email = process.env.SEED_SUPERADMIN_EMAIL || 'superadmin@store.com'
const password = process.env.SEED_SUPERADMIN_PASSWORD || 'superadmin123'

let userId: string | null = null

const { data: users } = await supabase.auth.admin.listUsers()
const existing = users?.users.find((u) => u.email === email)

if (existing) {
  userId = existing.id
  console.log(`Superadmin ${email} already exists`)
} else {
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  })
  if (error) {
    console.error('Failed to create superadmin:', error.message)
    process.exit(1)
  }
  userId = data.user.id
  console.log(`Created superadmin ${email}`)
}

if (userId) {
  const { error: utError } = await supabase
    .from('user_tenants')
    .upsert({ user_id: userId, tenant_id: 'womencouture', role: 'superadmin' }, { onConflict: 'user_id, tenant_id' })
  if (utError) {
    console.error('Failed to associate superadmin with tenant:', utError.message)
    process.exit(1)
  }
  console.log(`Superadmin associated with womencouture tenant`)
}

console.log('Done')
