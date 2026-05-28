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
    <section className="px-[10%] py-12">
      <h1 className="font-['Playfair_Display',_serif] text-2xl sm:text-3xl font-bold mb-10">All Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
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
                <div className="bg-white border-2 border-black shadow-[4px_4px_0px_#000] overflow-hidden p-4">
                  <div
                    className="h-[250px] mb-4 border-2 border-black bg-cover bg-center"
                    style={{ backgroundImage: firstImage ? `url('${firstImage}')` : undefined }}
                  >
                    {!firstImage && (
                      <div className="w-full h-full flex items-center justify-center bg-neutral-200 text-black/40 text-xs font-bold uppercase">
                        No Image
                      </div>
                    )}
                  </div>
                  <span className="inline-block text-[10px] font-bold uppercase border-2 border-black px-1.5 py-0.5 mb-2">
                    {product.category}
                  </span>
                  <h3 className="font-['Playfair_Display',_serif] text-base font-bold mb-1">{product.name}</h3>
                  <p className="font-bold text-sm text-[#FF006E]">
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
