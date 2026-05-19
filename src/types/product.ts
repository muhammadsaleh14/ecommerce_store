import { z } from 'zod'
import type { Timestamp } from 'firebase/firestore'

const baseSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  description: z.string().max(2000).default(''),
  price: z.number().positive('Price must be positive'),
  imageUrl: z.string().default(''),
  category: z.string().max(100).default(''),
})

export const productSchema = baseSchema

export type ProductInput = z.infer<typeof productSchema>

export interface Product extends z.infer<typeof productSchema> {
  id: string
  createdAt: Timestamp
  updatedAt: Timestamp
}
