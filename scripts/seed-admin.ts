import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const envPath = resolve(__dirname, '..', '.env')
for (const line of readFileSync(envPath, 'utf-8').split('\n')) {
  const trimmed = line.trim()
  if (!trimmed || trimmed.startsWith('#')) continue
  const sep = trimmed.indexOf('=')
  if (sep === -1) continue
  process.env[trimmed.slice(0, sep).trim()] = trimmed.slice(sep + 1).trim()
}

const API_KEY = process.env.VITE_FIREBASE_API_KEY
const EMAIL = process.env.SEED_ADMIN_EMAIL
const PASSWORD = process.env.SEED_ADMIN_PASSWORD

if (!API_KEY) {
  console.error('Missing VITE_FIREBASE_API_KEY in .env')
  process.exit(1)
}
if (!EMAIL || !PASSWORD) {
  console.error('Missing SEED_ADMIN_EMAIL or SEED_ADMIN_PASSWORD in .env')
  process.exit(1)
}

const res = await fetch(
  `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`,
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD, returnSecureToken: true }),
  },
)

const data = await res.json()

if (res.ok) {
  console.log(`Admin user created: ${data.email}`)
} else {
  const msg = data.error?.message || JSON.stringify(data)
  if (msg.includes('EMAIL_EXISTS')) {
    console.log(`Admin user already exists: ${EMAIL}`)
  } else {
    console.error(`Failed: ${msg}`)
    process.exit(1)
  }
}
