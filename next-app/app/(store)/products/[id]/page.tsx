export const dynamic = 'force-dynamic'

import { getServerClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
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
        <h1 className="text-2xl font-bold">Product not found</h1>
        <Link href="/products" className="text-sm text-muted-foreground underline">Back to products</Link>
      </div>
    )
  }

  const variants = product.product_variants || []
  const prices = variants.map((v: any) => v.price)
  const minPrice = Math.min(...prices)
  const maxPrice = Math.max(...prices)
  const firstImage = variants.find((v: any) => v.image_url)?.image_url || '/placeholder.svg'

  return (
    <main className="flex-1 max-w-4xl mx-auto px-4 py-12 w-full">
        <Link href="/products" className="text-sm text-muted-foreground hover:text-foreground underline mb-8 inline-block">
          ← Back to products
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <img
              src={firstImage}
              alt={product.name}
              className="w-full rounded-xl object-cover aspect-square"
            />
          </div>

          <div className="space-y-4">
            <Badge variant="secondary">{product.category}</Badge>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            {product.description && (
              <p className="text-muted-foreground">{product.description}</p>
            )}
            <p className="text-2xl font-bold">
              From ${minPrice.toFixed(2)}
              {maxPrice > minPrice && ` — $${maxPrice.toFixed(2)}`}
            </p>

            <VariantSelector variants={variants} />
          </div>
        </div>
    </main>
  )
}
