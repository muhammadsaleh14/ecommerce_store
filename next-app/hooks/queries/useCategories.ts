import { useQuery, useMutation } from '@tanstack/react-query'
import { queryClient } from '@/lib/queryClient'
import { getSupabaseClient } from '@/lib/supabase/client'
import { getCategories, addCategory, updateCategory, deleteCategory } from '@/lib/shared/services/categoryService'
import { useAuth } from '@/hooks/useAuth'

export function useCategories() {
  const { activeTenantId } = useAuth()
  return useQuery({
    queryKey: ['categories', activeTenantId],
    queryFn: () => getCategories(getSupabaseClient(), activeTenantId!),
    enabled: !!activeTenantId,
  })
}

export function useAddCategory() {
  const { activeTenantId } = useAuth()
  return useMutation({
    mutationFn: (input: { slug: string; name: string; description?: string }) =>
      addCategory(getSupabaseClient(), activeTenantId!, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'], refetchType: 'all' })
    },
  })
}

export function useUpdateCategory() {
  const { activeTenantId } = useAuth()
  return useMutation({
    mutationFn: ({ slug, name, description }: { slug: string; name?: string; description?: string }) =>
      updateCategory(getSupabaseClient(), activeTenantId!, slug, { name, description }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'], refetchType: 'all' })
    },
  })
}

export function useDeleteCategory() {
  const { activeTenantId } = useAuth()
  return useMutation({
    mutationFn: (slug: string) => deleteCategory(getSupabaseClient(), activeTenantId!, slug),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'], refetchType: 'all' })
    },
  })
}
