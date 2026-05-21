import { useEffect, useState } from 'react'
import { getProducts } from '../services/productService'
import { ProductCard } from '../components/ProductCard'
import type { Product } from '../types/product'

export const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getProducts().then((data) => {
      setProducts(data)
      setLoading(false)
    })
  }, [])

  if (loading) {
    return <div className="text-center p-8 text-gray-500">Loading products...</div>
  }

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Products</h2>
      {products.length === 0 ? (
        <p className="text-gray-500">No products yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
