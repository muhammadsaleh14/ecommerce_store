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
      <section className="flex items-center justify-between px-[10%] min-h-[70vh]">
        <div className="flex-1 pr-12">
          <span className="inline-block text-[11px] font-bold uppercase border-2 border-black px-2 py-1 mb-5">
            Eid Collection 2026
          </span>
          <h1 className="font-['Playfair_Display',_serif] text-5xl sm:text-6xl font-bold leading-[1.05] mb-5">
            Where Tradition<br />Meets Trend
          </h1>
          <p className="text-base mb-8 leading-relaxed max-w-md text-black/70">
            Discover Pakistani fashion that celebrates your heritage. Embroidered chiffons, luxury lawns, and unstitched fabrics — crafted for the modern woman.
          </p>
          <div className="flex gap-4">
            <Link
              href="/products"
              className="bg-[#FF006E] text-white px-8 py-3.5 font-bold uppercase tracking-wider text-xs border-2 border-black shadow-[5px_5px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[7px_7px_0px_#000] transition-all"
            >
              Shop Now
            </Link>
            <Link
              href="/products"
              className="bg-white text-black px-8 py-3.5 font-bold uppercase tracking-wider text-xs border-2 border-black shadow-[5px_5px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[7px_7px_0px_#000] transition-all"
            >
              Explore Collection
            </Link>
          </div>
        </div>
        <div
          className="flex-1 h-[500px] border-2 border-black shadow-[8px_8px_0px_#000] bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1583391733958-650f0c0850a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')" }}
        />
      </section>

      <section className="border-y-2 border-black bg-white">
        <div className="grid grid-cols-3 divide-x-2 divide-black">
          <div className="py-8 text-center">
            <p className="font-['Playfair_Display',_serif] text-3xl font-bold text-[#FF006E]">Premium</p>
            <p className="text-xs font-bold uppercase tracking-wider mt-1">Quality Fabrics</p>
          </div>
          <div className="py-8 text-center">
            <p className="font-['Playfair_Display',_serif] text-3xl font-bold text-[#FF006E]">Pan Pakistan</p>
            <p className="text-xs font-bold uppercase tracking-wider mt-1">Free Delivery</p>
          </div>
          <div className="py-8 text-center">
            <p className="font-['Playfair_Display',_serif] text-3xl font-bold text-[#FF006E]">Easy</p>
            <p className="text-xs font-bold uppercase tracking-wider mt-1">Exchange &amp; Returns</p>
          </div>
        </div>
      </section>

      <section className="px-[10%] py-16">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="font-['Playfair_Display',_serif] text-3xl font-bold">Trending Now</h2>
            <p className="text-sm text-black/60 mt-1">Most loved pieces this season</p>
          </div>
          <Link href="/products" className="text-xs font-bold uppercase underline underline-offset-4 hover:text-[#FF006E] transition-colors">
            View All
          </Link>
        </div>
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
                <div className="bg-white border-2 border-black shadow-[4px_4px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_#000] transition-all overflow-hidden p-4">
                  <div
                    className="h-[260px] mb-4 border-2 border-black bg-cover bg-center"
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

      <section className="px-[10%] py-16 bg-black text-white">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-['Playfair_Display',_serif] text-3xl sm:text-4xl font-bold mb-4">
            The Perfect Fit Awaits
          </h2>
          <p className="text-sm sm:text-base text-white/70 mb-8 leading-relaxed">
            From festive occasions to everyday elegance — find your style in our curated collection of Pakistani fashion.
          </p>
          <Link
            href="/products"
            className="inline-block bg-[#FF006E] text-white px-8 py-3.5 font-bold uppercase tracking-wider text-xs border-2 border-white shadow-[5px_5px_0px_#fff] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[7px_7px_0px_#fff] transition-all"
          >
            Start Shopping
          </Link>
        </div>
      </section>
    </>
  )
}
