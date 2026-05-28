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
      <section className="flex items-center justify-between px-[10%] min-h-[50vh]">
        <div className="flex-1 pr-10">
          <h1 className="font-['Playfair_Display',_serif] text-3xl sm:text-4xl font-bold leading-tight mb-4">
            The Festive Eid Collection
          </h1>
          <p className="text-sm sm:text-base mb-6 leading-relaxed">
            Experience the finest craftsmanship with our new embroidered chiffon and luxury lawn suits.
            Elegance stitched into every thread.
          </p>
          <Link
            href="/products"
            className="inline-block bg-[#FF006E] text-white px-7 py-3 font-bold uppercase tracking-wider text-xs border-2 border-black shadow-[4px_4px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[5px_5px_0px_#000] transition-all"
          >
            Shop Collection
          </Link>
        </div>
        <div
          className="flex-1 h-[350px] rounded-none border-2 border-black shadow-[4px_4px_0px_#000] bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1583391733958-650f0c0850a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')" }}
        />
      </section>

      <section className="px-[10%] py-14">
        <h2 className="font-['Playfair_Display',_serif] text-2xl sm:text-3xl font-bold text-center mb-10">Trending Now</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
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
          })}
        </div>
      </section>
    </>
  )
}
