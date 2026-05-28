export const dynamic = 'force-dynamic'

import { getServerClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function ProductsPage() {
  const supabase = await getServerClient()
  const { data: products } = await supabase
    .from('products')
    .select('*, product_variants(*)')
    .order('created_at', { ascending: false })

  return (
    <section className="px-[10%] py-16">
      <h1 className="text-4xl font-extrabold mb-12">All Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {!products || products.length === 0 ? (
          <p className="col-span-full text-black/60">No products yet.</p>
        ) : (
          products.map((product: any) => {
            const prices = product.product_variants?.map((v: any) => v.price) || []
            const minPrice = Math.min(...prices)
            const maxPrice = Math.max(...prices)
            const firstImage = product.product_variants?.find((v: any) => v.image_url)?.image_url

            return (
              <Link key={product.id} href={`/products/${product.id}`}>
                <div className="bg-white border-2 border-black shadow-[6px_6px_0px_#000] overflow-hidden p-5">
                  <div
                    className="h-[400px] mb-5 border-2 border-black bg-cover bg-center"
                    style={{ backgroundImage: firstImage ? `url('${firstImage}')` : undefined }}
                  >
                    {!firstImage && (
                      <div className="w-full h-full flex items-center justify-center bg-neutral-200 text-black/40 text-sm font-bold uppercase">
                        No Image
                      </div>
                    )}
                  </div>
                  <span className="inline-block text-xs font-bold uppercase border-2 border-black px-2 py-0.5 mb-2">
                    {product.category}
                  </span>
                  <h3 className="text-xl font-extrabold mb-2">{product.name}</h3>
                  <p className="font-extrabold text-lg text-[#FF006E]">
                    Rs. {minPrice.toFixed(2).replace('.00', '')}
                    {maxPrice > minPrice && ` — Rs. ${maxPrice.toFixed(2).replace('.00', '')}`}
                  </p>
                </div>
              </Link>
            )
          })
        )}
      </div>
    </section>
  )
}
