import { config } from '../config'
import { VariantSelector } from '../components/VariantSelector'
import Link from 'next/link'

export function ProductDetailPage({ product }: { product: any }) {
  const { theme, content } = config
  const variants = product.product_variants || []
  const prices = variants.map((v: any) => v.price)
  const minPrice = Math.min(...prices)
  const maxPrice = Math.max(...prices)
  const firstImage = variants.find((v: any) => v.image_url)?.image_url

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20">
        <h1 className="font-['Playfair_Display',_serif] text-xl font-bold">Product not found</h1>
        <Link href="/products" className="underline text-sm font-bold">Back to products</Link>
      </div>
    )
  }

  return (
    <section className="px-[10%] py-12">
      <Link href="/products" className="inline-block mb-6 text-[11px] font-bold uppercase underline">
        &larr; Back to products
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div
          className="h-[400px] bg-cover bg-center"
          style={{
            border: `2px solid ${theme.borderColor}`,
            boxShadow: theme.shadow,
            backgroundImage: firstImage ? `url('${firstImage}')` : undefined,
          }}
        >
          {!firstImage && (
            <div className="w-full h-full flex items-center justify-center bg-neutral-200 text-black/40 text-xs font-bold uppercase">
              No Image
            </div>
          )}
        </div>

        <div className="space-y-4">
          <span
            className="inline-block text-[10px] font-bold uppercase px-1.5 py-0.5"
            style={{ border: `2px solid ${theme.borderColor}` }}
          >
            {product.category}
          </span>
          <h1 className="font-['Playfair_Display',_serif] text-2xl sm:text-3xl font-bold">{product.name}</h1>
          {product.description && (
            <p className="text-sm leading-relaxed" style={{ color: 'rgba(0,0,0,0.7)' }}>{product.description}</p>
          )}
          <p className="text-xl font-bold" style={{ color: theme.accent }}>
            {content.currency} {minPrice.toFixed(2).replace('.00', '')}
            {maxPrice > minPrice && ` — ${content.currency} ${maxPrice.toFixed(2).replace('.00', '')}`}
          </p>

          <VariantSelector variants={variants} />
        </div>
      </div>
    </section>
  )
}
