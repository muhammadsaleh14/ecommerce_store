import { useQuery, useMutation } from '@tanstack/react-query'
import { queryClient } from '@/lib/queryClient'
import { getSupabaseClient } from '@/lib/supabase/client'
import { getProducts, getProduct, addProduct, updateProduct, deleteProduct } from '@/lib/shared/services/productService'
import type { ProductInput } from '@/lib/shared/types/product'
import { useAuth } from '@/hooks/useAuth'

const QUERY_KEY = ['products'] as const

function useTenantId() {
  const { tenantId } = useAuth()
  return tenantId
}

export function useProducts() {
  const tenantId = useTenantId()
  return useQuery({
    queryKey: [...QUERY_KEY, tenantId],
    queryFn: () => getProducts(getSupabaseClient(), tenantId!),
    enabled: !!tenantId,
  })
}

export function useProduct(id: string) {
  const tenantId = useTenantId()
  return useQuery({
    queryKey: ['product', id, tenantId],
    queryFn: () => getProduct(getSupabaseClient(), tenantId!, id),
    enabled: !!tenantId,
  })
}

export function useAddProduct() {
  const tenantId = useTenantId()
  return useMutation({
    mutationFn: (input: ProductInput) => addProduct(getSupabaseClient(), tenantId!, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY, refetchType: 'all' })
    },
  })
}

export function useUpdateProduct(id: string) {
  const tenantId = useTenantId()
  return useMutation({
    mutationFn: (input: ProductInput) => updateProduct(getSupabaseClient(), tenantId!, id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY, refetchType: 'all' })
      queryClient.invalidateQueries({ queryKey: ['product', id], refetchType: 'all' })
    },
  })
}

export function useDeleteProduct() {
  const tenantId = useTenantId()
  return useMutation({
    mutationFn: (id: string) => deleteProduct(getSupabaseClient(), tenantId!, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY, refetchType: 'all' })
    },
  })
}
