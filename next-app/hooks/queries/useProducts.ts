import { useQuery, useMutation } from '@tanstack/react-query'
import { queryClient } from '@/lib/queryClient'
import { getProducts, getProduct, addProduct, updateProduct, deleteProduct } from '@ecommerce/shared'
import type { ProductInput } from '@ecommerce/shared'

const QUERY_KEY = ['products'] as const

export function useProducts() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: getProducts,
  })
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => getProduct(id),
  })
}

export function useAddProduct() {
  return useMutation({
    mutationFn: (input: ProductInput) => addProduct(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY, refetchType: 'all' })
    },
  })
}

export function useUpdateProduct(id: string) {
  return useMutation({
    mutationFn: (input: ProductInput) => updateProduct(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY, refetchType: 'all' })
      queryClient.invalidateQueries({ queryKey: ['product', id], refetchType: 'all' })
    },
  })
}

export function useDeleteProduct() {
  return useMutation({
    mutationFn: (id: string) => deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY, refetchType: 'all' })
    },
  })
}
