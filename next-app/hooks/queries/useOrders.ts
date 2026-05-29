import { useQuery, useMutation } from '@tanstack/react-query'
import { queryClient } from '@/lib/queryClient'
import { getSupabaseClient } from '@/lib/supabase/client'
import { getOrders, updateOrderStatus } from '@/lib/shared/services/orderService'

const QUERY_KEY = ['orders'] as const

export function useOrders() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: () => getOrders(getSupabaseClient()),
  })
}

export function useUpdateOrderStatus() {
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      updateOrderStatus(getSupabaseClient(), id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY, refetchType: 'all' })
    },
  })
}
