import { config } from '../config'
import { ProductCard } from '../components/ProductCard'

export function ProductsPage({ products }: { products: any[] }) {
  const { theme } = config

  return (
    <section className="px-[10%] py-12">
      <h1 className="font-['Playfair_Display',_serif] text-2xl sm:text-3xl font-bold mb-10">All Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {!products || products.length === 0 ? (
          <p className="col-span-full" style={{ color: 'rgba(0,0,0,0.6)' }}>No products yet.</p>
        ) : (
          products.map((product: any) => (
            <ProductCard key={product.id} product={product} />
          ))
        )}
      </div>
    </section>
  )
}
