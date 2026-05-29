import { useQuery, useMutation } from '@tanstack/react-query'
import { queryClient } from '@/lib/queryClient'
import { getSupabaseClient } from '@/lib/supabase/client'
import { getTenants, addTenant, updateTenant } from '@/lib/shared/services/tenantService'

const QUERY_KEY = ['tenants'] as const

export function useTenants() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: () => getTenants(getSupabaseClient()),
  })
}

export function useAddTenant() {
  return useMutation({
    mutationFn: (input: { id: string; name: string }) => addTenant(getSupabaseClient(), input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY, refetchType: 'all' })
    },
  })
}

export function useUpdateTenant() {
  return useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) => updateTenant(getSupabaseClient(), id, { name }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY, refetchType: 'all' })
    },
  })
}
