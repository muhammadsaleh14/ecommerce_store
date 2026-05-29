"use server"

import { getServerClient } from '@/lib/supabase/server'
import { submitOrder } from '@/lib/shared/services/orderService'
import type { OrderInput } from '@/lib/shared/types/order'

export async function placeOrder(input: OrderInput) {
  const supabase = await getServerClient()
  return submitOrder(supabase, input)
}
