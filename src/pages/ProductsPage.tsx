import { useEffect, useState } from 'react'
import {
  getProducts,
  addProduct,
  deleteProduct,
} from '../services/productService'
import { ProductCard } from '../components/ProductCard'
import { ProductForm } from '../components/ProductForm'
import { useAuth } from '../contexts/AuthContext'
import type { Product, ProductInput } from '../types/product'

export const ProductsPage = () => {
  const { user } = useAuth()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  const fetchProducts = async () => {
    setLoading(true)
    const data = await getProducts()
    setProducts(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const handleAdd = async (input: ProductInput) => {
    await addProduct(input)
    await fetchProducts()
  }

  const handleDelete = async (id: string) => {
    await deleteProduct(id)
    await fetchProducts()
  }

  if (loading) {
    return <div className="text-center p-8 text-gray-500">Loading products...</div>
  }

  return (
    <div className="space-y-8">
      {user && (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-semibold mb-4">Add Product</h2>
          <ProductForm onSubmit={handleAdd} />
        </section>
      )}

      <section>
        <h2 className="text-2xl font-bold mb-6">Products</h2>
        {products.length === 0 ? (
          <p className="text-gray-500">No products yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onDelete={user ? handleDelete : undefined}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
