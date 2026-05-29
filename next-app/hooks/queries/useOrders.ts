import { useQuery, useMutation } from '@tanstack/react-query'
import { queryClient } from '@/lib/queryClient'
import { getSupabaseClient } from '@/lib/supabase/client'
import { getOrders, updateOrderStatus } from '@/lib/shared/services/orderService'
import { useAuth } from '@/hooks/useAuth'

export function useOrders() {
  const { activeTenantId } = useAuth()
  return useQuery({
    queryKey: ['orders', activeTenantId],
    queryFn: () => getOrders(getSupabaseClient(), activeTenantId!),
    enabled: !!activeTenantId,
  })
}

export function useUpdateOrderStatus() {
  const { activeTenantId } = useAuth()
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      updateOrderStatus(getSupabaseClient(), activeTenantId!, id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'], refetchType: 'all' })
    },
  })
}
