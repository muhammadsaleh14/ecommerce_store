import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "../../lib/queryClient";
import { getProducts, addProduct, deleteProduct } from "@ecommerce/shared";
import type { ProductInput } from "@ecommerce/shared";

const QUERY_KEY = ["products"] as const;

export function useProducts() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: getProducts,
  });
}

export function useAddProduct() {
  return useMutation({
    mutationFn: (input: ProductInput) => addProduct(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
}

export function useDeleteProduct() {
  return useMutation({
    mutationFn: (id: string) => deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
}
