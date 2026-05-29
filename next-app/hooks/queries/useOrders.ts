import { useQuery, useMutation } from '@tanstack/react-query'
import { queryClient } from '@/lib/queryClient'
import { getSupabaseClient } from '@/lib/supabase/client'
import { getOrders, updateOrderStatus } from '@/lib/shared/services/orderService'
import { useAuth } from '@/hooks/useAuth'

export function useOrders() {
  const { tenantId } = useAuth()
  return useQuery({
    queryKey: ['orders', tenantId],
    queryFn: () => getOrders(getSupabaseClient(), tenantId!),
    enabled: !!tenantId,
  })
}

export function useUpdateOrderStatus() {
  const { tenantId } = useAuth()
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      updateOrderStatus(getSupabaseClient(), tenantId!, id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'], refetchType: 'all' })
    },
  })
}
