import { z } from 'zod'

export const CATEGORIES = [
  'electronics',
  'clothing',
  'home-garden',
  'books',
  'sports',
  'toys',
  'food-drinks',
  'other',
] as const

export type Category = (typeof CATEGORIES)[number]

export const variantSchema = z.object({
  name: z.string().min(1, 'Variant name is required'),
  price: z.number().positive('Price must be positive'),
  imageUrl: z.string().default(''),
})

export type ProductVariant = z.infer<typeof variantSchema>

export const productSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  description: z.string().max(2000).default(''),
  category: z.enum(CATEGORIES).default('other'),
  variants: z.array(variantSchema).min(1, 'At least one variant is required'),
})

export type ProductInput = z.infer<typeof productSchema>

export const productOutputSchema = productSchema.extend({
  id: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export type Product = z.infer<typeof productOutputSchema>

const mapCategory = (cat: string): Category =>
  (CATEGORIES as readonly string[]).includes(cat) ? (cat as Category) : 'other'

const mapVariant = (v: { name: string; price: number; image_url: string }) => ({
  name: v.name,
  price: v.price,
  imageUrl: v.image_url,
})

export function toProduct(row: {
  id: string
  name: string
  description: string
  category: string
  created_at: string
  updated_at: string
  product_variants: { name: string; price: number; image_url: string }[]
}): Product {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    category: mapCategory(row.category),
    variants: row.product_variants.map(mapVariant),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}
