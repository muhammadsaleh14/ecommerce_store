import { config } from '../config'
import Link from 'next/link'

export function ProductCard({ product }: { product: any }) {
  const { theme, content } = config
  const prices = product.product_variants?.map((v: any) => v.price) || []
  const minPrice = Math.min(...prices)
  const maxPrice = Math.max(...prices)
  const firstImage = product.product_variants?.find((v: any) => v.image_url)?.image_url

  return (
    <Link href={`/products/${product.id}`}>
      <div
        className="bg-white overflow-hidden p-4 transition-all hover:translate-x-[-2px] hover:translate-y-[-2px]"
        style={{
          border: `2px solid ${theme.borderColor}`,
          boxShadow: theme.shadow,
        }}
      >
        <div
          className="h-[260px] mb-4 bg-cover bg-center"
          style={{
            border: `2px solid ${theme.borderColor}`,
            backgroundImage: firstImage ? `url('${firstImage}')` : undefined,
          }}
        >
          {!firstImage && (
            <div className="w-full h-full flex items-center justify-center bg-neutral-200 text-black/40 text-xs font-bold uppercase">
              No Image
            </div>
          )}
        </div>
        <span
          className="inline-block text-[10px] font-bold uppercase px-1.5 py-0.5 mb-2"
          style={{
            border: `2px solid ${theme.borderColor}`,
          }}
        >
          {product.category}
        </span>
        <h3 className="font-['Playfair_Display',_serif] text-base font-bold mb-1">{product.name}</h3>
        <p className="font-bold text-sm" style={{ color: theme.accent }}>
          {content.currency} {minPrice.toFixed(2).replace('.00', '')}
          {maxPrice > minPrice && ` — ${content.currency} ${maxPrice.toFixed(2).replace('.00', '')}`}
        </p>
      </div>
    </Link>
  )
}
