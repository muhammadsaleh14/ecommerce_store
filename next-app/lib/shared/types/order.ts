import { z } from 'zod'

export const orderInputSchema = z.object({
  customerName: z.string().min(2, 'Name is required'),
  customerPhone: z.string().min(5, 'Valid phone number is required'),
  customerAddress: z.string().min(5, 'Address is required'),
  notes: z.string().default(''),
  items: z
    .array(
      z.object({
        productId: z.string(),
        variantId: z.string(),
        productName: z.string(),
        variantName: z.string(),
        price: z.number().positive(),
        quantity: z.number().int().positive(),
        imageUrl: z.string().default(''),
      }),
    )
    .min(1, 'At least one item is required'),
})

export type OrderInput = z.infer<typeof orderInputSchema>

export interface OrderItem {
  id: string
  orderId: string
  productId: string
  variantId: string
  productName: string
  variantName: string
  price: number
  quantity: number
  imageUrl: string
}

export interface Order {
  id: string
  customerName: string
  customerPhone: string
  customerAddress: string
  notes: string
  total: number
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
  createdAt: string
  updatedAt: string
  items: OrderItem[]
}

export const mapOrder = (row: {
  id: string
  customer_name: string
  customer_phone: string
  customer_address: string
  notes: string
  total: number
  status: string
  created_at: string
  updated_at: string
}): Omit<Order, 'items'> => ({
  id: row.id,
  customerName: row.customer_name,
  customerPhone: row.customer_phone,
  customerAddress: row.customer_address,
  notes: row.notes,
  total: row.total,
  status: row.status as Order['status'],
  createdAt: row.created_at,
  updatedAt: row.updated_at,
})

export const mapOrderItem = (row: {
  id: string
  order_id: string
  product_id: string
  variant_id: string
  product_name: string
  variant_name: string
  price: number
  quantity: number
  image_url: string
}): OrderItem => ({
  id: row.id,
  orderId: row.order_id,
  productId: row.product_id,
  variantId: row.variant_id,
  productName: row.product_name,
  variantName: row.variant_name,
  price: row.price,
  quantity: row.quantity,
  imageUrl: row.image_url,
})
