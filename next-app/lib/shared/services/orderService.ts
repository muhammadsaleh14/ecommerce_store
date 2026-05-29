import type { SupabaseClient } from '@supabase/supabase-js'
import { orderInputSchema } from '@/lib/shared/types/order'
import type { OrderInput } from '@/lib/shared/types/order'

export const submitOrder = async (client: SupabaseClient, input: OrderInput) => {
  const parsed = orderInputSchema.parse(input)
  const total = parsed.items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const { data: order, error: orderError } = await client
    .from('orders')
    .insert({
      customer_name: parsed.customerName,
      customer_phone: parsed.customerPhone,
      customer_address: parsed.customerAddress,
      notes: parsed.notes,
      total,
    })
    .select()
    .single()

  if (orderError) throw new Error(orderError.message)

  const items = parsed.items.map((item) => ({
    order_id: order.id,
    product_id: item.productId,
    variant_id: item.variantId,
    product_name: item.productName,
    variant_name: item.variantName,
    price: item.price,
    quantity: item.quantity,
    image_url: item.imageUrl,
  }))

  const { error: itemsError } = await client.from('order_items').insert(items)
  if (itemsError) throw new Error(itemsError.message)

  return { orderId: order.id }
}
