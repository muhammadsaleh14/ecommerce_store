import { z } from 'zod'

export const variantSchema = z.object({
  name: z.string().min(1, 'Variant name is required'),
  price: z.number().positive('Price must be positive'),
  imageUrl: z.string().default(''),
})

export type ProductVariant = z.infer<typeof variantSchema>

export const mapVariant = (v: { name: string; price: number; image_url: string }) => ({
  name: v.name,
  price: v.price,
  imageUrl: v.image_url,
})
