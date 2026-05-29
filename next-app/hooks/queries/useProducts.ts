import { useQuery, useMutation } from '@tanstack/react-query'
import { queryClient } from '@/lib/queryClient'
import { getSupabaseClient } from '@/lib/supabase/client'
import { getProducts, getProduct, addProduct, updateProduct, deleteProduct } from '@/lib/shared/services/productService'
import type { ProductInput } from '@/lib/shared/types/product'

const QUERY_KEY = ['products'] as const
const client = () => getSupabaseClient()

export function useProducts() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: () => getProducts(client()),
  })
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => getProduct(client(), id),
  })
}

export function useAddProduct() {
  return useMutation({
    mutationFn: (input: ProductInput) => addProduct(client(), input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY, refetchType: 'all' })
    },
  })
}

export function useUpdateProduct(id: string) {
  return useMutation({
    mutationFn: (input: ProductInput) => updateProduct(client(), id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY, refetchType: 'all' })
      queryClient.invalidateQueries({ queryKey: ['product', id], refetchType: 'all' })
    },
  })
}

export function useDeleteProduct() {
  return useMutation({
    mutationFn: (id: string) => deleteProduct(client(), id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY, refetchType: 'all' })
    },
  })
}
