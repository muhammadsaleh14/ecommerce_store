import { z } from 'zod'
import { variantSchema } from './variant'
import { mapVariant } from './variant'

export const productSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  description: z.string().max(2000).default(''),
  category: z.string().default('other'),
  variants: z.array(variantSchema).min(1, 'At least one variant is required'),
})

export type ProductInput = z.infer<typeof productSchema>

export const productOutputSchema = productSchema.extend({
  id: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export type Product = z.infer<typeof productOutputSchema>

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
    category: row.category,
    variants: row.product_variants.map(mapVariant),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}
