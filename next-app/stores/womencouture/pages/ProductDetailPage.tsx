import { ProductGallery } from '../components/ProductGallery'
import Link from 'next/link'

export function ProductDetailPage({ product }: { product: any }) {
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
      <ProductGallery product={product} />
    </section>
  )
}
