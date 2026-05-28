export const dynamic = 'force-dynamic'

import { getServerClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function HomePage() {
  const supabase = await getServerClient()
  const { data: products } = await supabase
    .from('products')
    .select('*, product_variants(*)')
    .order('created_at', { ascending: false })
    .limit(6)

  return (
    <>
      <section className="flex items-center justify-between px-[10%] min-h-[60vh]">
        <div className="flex-1 pr-12">
          <h1 className="text-5xl sm:text-6xl font-extrabold leading-[1.1] mb-5">
            The Festive Eid Collection
          </h1>
          <p className="text-base sm:text-lg font-bold mb-8">
            Experience the finest craftsmanship with our new embroidered chiffon and luxury lawn suits.
            Elegance stitched into every thread.
          </p>
          <Link
            href="/products"
            className="inline-block bg-[#FF006E] text-white px-9 py-4 font-bold uppercase tracking-wider text-sm border-2 border-black shadow-[6px_6px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_#000] transition-all"
          >
            Shop Collection
          </Link>
        </div>
        <div
          className="flex-1 h-[500px] rounded-none border-2 border-black shadow-[6px_6px_0px_#000] bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1583391733958-650f0c0850a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')" }}
        />
      </section>

      <section className="px-[10%] py-20">
        <h2 className="text-4xl font-extrabold text-center mb-12">Trending Now</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {(!products || products.length === 0) && (
            <p className="col-span-full text-center text-black/60">No products yet.</p>
          )}
          {products?.map((product: any) => {
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
          })}
        </div>
      </section>
    </>
  )
}
