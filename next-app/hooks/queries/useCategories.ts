import { useQuery } from '@tanstack/react-query'
import { getSupabaseClient } from '@/lib/supabase/client'
import { getCategories } from '@/lib/shared/services/categoryService'
import { useAuth } from '@/hooks/useAuth'

export function useCategories() {
  const { tenantId } = useAuth()
  return useQuery({
    queryKey: ['categories', tenantId],
    queryFn: () => getCategories(getSupabaseClient(), tenantId!),
    enabled: !!tenantId,
  })
}
