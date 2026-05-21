import { readFileSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import admin from 'firebase-admin'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')

for (const line of readFileSync(resolve(root, '.env'), 'utf-8').split('\n')) {
  const trimmed = line.trim()
  if (!trimmed || trimmed.startsWith('#')) continue
  const sep = trimmed.indexOf('=')
  if (sep === -1) continue
  process.env[trimmed.slice(0, sep).trim()] = trimmed.slice(sep + 1).trim()
}

const serviceAccountPath = resolve(
  root,
  process.env.SERVICE_ACCOUNT_PATH || 'service-account.json',
)

if (!existsSync(serviceAccountPath)) {
  console.error(
    `Service account file not found at ${serviceAccountPath}\n` +
      '1. Go to Firebase Console → Project Settings → Service Accounts\n' +
      '2. Click "Generate new private key"\n' +
      '3. Save the file as service-account.json in the project root\n' +
      '4. Run this script again',
  )
  process.exit(1)
}

const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf-8'))

if (admin.apps.length === 0) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  })
}

const db = admin.firestore()

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

const col = db.collection('products')

for (const product of products) {
  const ref = await col.add({
    ...product,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  })
  console.log(`Created product "${product.name}" (${ref.id})`)
}

console.log('Done — 2 products seeded.')
