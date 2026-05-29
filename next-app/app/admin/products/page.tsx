'use client'

export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { useProducts, useDeleteProduct } from '@/hooks/queries/useProducts'
import { ProductCard } from '@/components/admin/ProductCard'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

export default function AdminProductsPage() {
  const { data: products, isLoading, error } = useProducts()
  const deleteMutation = useDeleteProduct()

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-72 rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return <p className="text-destructive">Failed to load products: {(error as Error).message}</p>
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Manage Products</h2>
        <Button asChild>
          <Link href="/admin/products/new">+ Add Product</Link>
        </Button>
      </div>

      {!products || products.length === 0 ? (
        <p className="text-muted-foreground">No products yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} onDelete={(id) => deleteMutation.mutate(id)} />
          ))}
        </div>
      )}
    </div>
  )
}
