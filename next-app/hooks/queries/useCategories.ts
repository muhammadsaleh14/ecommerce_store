import { useQuery } from '@tanstack/react-query'
import { getSupabaseClient } from '@/lib/supabase/client'
import { getCategories } from '@/lib/shared/services/categoryService'
import { useAuth } from '@/hooks/useAuth'

export function useCategories() {
  const { activeTenantId } = useAuth()
  return useQuery({
    queryKey: ['categories', activeTenantId],
    queryFn: () => getCategories(getSupabaseClient(), activeTenantId!),
    enabled: !!activeTenantId,
  })
}
