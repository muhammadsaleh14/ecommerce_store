export const dynamic = 'force-dynamic'

import { getServerClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { VariantSelector } from '@/components/store/VariantSelector'

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await getServerClient()

  const { data: product } = await supabase
    .from('products')
    .select('*, product_variants(*)')
    .eq('id', id)
    .single()

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24">
        <h1 className="text-2xl font-extrabold">Product not found</h1>
        <Link href="/products" className="underline font-bold">Back to products</Link>
      </div>
    )
  }

  const variants = product.product_variants || []
  const prices = variants.map((v: any) => v.price)
  const minPrice = Math.min(...prices)
  const maxPrice = Math.max(...prices)
  const firstImage = variants.find((v: any) => v.image_url)?.image_url

  return (
    <section className="px-[10%] py-16">
      <Link href="/products" className="inline-block mb-8 text-sm font-bold uppercase underline">
        &larr; Back to products
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div
          className="h-[500px] border-2 border-black shadow-[6px_6px_0px_#000] bg-cover bg-center"
          style={{ backgroundImage: firstImage ? `url('${firstImage}')` : undefined }}
        >
          {!firstImage && (
            <div className="w-full h-full flex items-center justify-center bg-neutral-200 text-black/40 text-sm font-bold uppercase">
              No Image
            </div>
          )}
        </div>

        <div className="space-y-5">
          <span className="inline-block text-xs font-bold uppercase border-2 border-black px-2 py-0.5">
            {product.category}
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold">{product.name}</h1>
          {product.description && (
            <p className="text-base font-bold text-black/70">{product.description}</p>
          )}
          <p className="text-2xl font-extrabold text-[#FF006E]">
            Rs. {minPrice.toFixed(2).replace('.00', '')}
            {maxPrice > minPrice && ` — Rs. ${maxPrice.toFixed(2).replace('.00', '')}`}
          </p>

          <VariantSelector variants={variants} />
        </div>
      </div>
    </section>
  )
}
