import { useQuery } from '@tanstack/react-query'
import { getSupabaseClient } from '@/lib/supabase/client'
import { getCategories } from '@/lib/shared/services/categoryService'

const QUERY_KEY = ['categories'] as const

export function useCategories() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: () => getCategories(getSupabaseClient()),
  })
}
