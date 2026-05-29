import type { SupabaseClient } from '@supabase/supabase-js'
import { orderInputSchema, mapOrder, mapOrderItem } from '@/lib/shared/types/order'
import type { OrderInput, Order, OrderItem } from '@/lib/shared/types/order'

export const submitOrder = async (client: SupabaseClient, tenantId: string, input: OrderInput) => {
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
      tenant_id: tenantId,
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

export const getOrders = async (client: SupabaseClient, tenantId: string): Promise<Order[]> => {
  const { data: rows, error } = await client
    .from('orders')
    .select('*, order_items(*)')
    .eq('tenant_id', tenantId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return (rows ?? []).map((row: any) => ({
    ...mapOrder(row),
    items: (row.order_items ?? []).map(mapOrderItem),
  }))
}

export const updateOrderStatus = async (client: SupabaseClient, tenantId: string, id: string, status: string) => {
  const { error } = await client.from('orders').update({ status }).eq('tenant_id', tenantId).eq('id', id)
  if (error) throw error
}
