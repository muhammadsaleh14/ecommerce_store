import { useEffect, useState } from 'react'
import {
  getProducts,
  addProduct,
  deleteProduct,
} from '@ecommerce/shared'
import { ProductCard } from '../components/ProductCard'
import { ProductForm } from '../components/ProductForm'
import type { Product, ProductInput } from '@ecommerce/shared'

export const AdminProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getProducts().then((data) => {
      setProducts(data)
      setLoading(false)
    })
  }, [])

  const handleAdd = async (input: ProductInput) => {
    await addProduct(input)
    const data = await getProducts()
    setProducts(data)
  }

  const handleDelete = async (id: string) => {
    await deleteProduct(id)
    const data = await getProducts()
    setProducts(data)
  }

  if (loading) {
    return <div className="text-center p-8 text-gray-500">Loading products...</div>
  }

  return (
    <div className="space-y-8">
      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-semibold mb-4">Add Product</h2>
        <ProductForm onSubmit={handleAdd} />
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6">Manage Products</h2>
        {products.length === 0 ? (
          <p className="text-gray-500">No products yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
