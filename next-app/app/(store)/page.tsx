export const dynamic = 'force-dynamic'

import { getServerClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'

export default async function HomePage() {
  const supabase = await getServerClient()
  const { data: products } = await supabase
    .from('products')
    .select('*, product_variants(*)')
    .order('created_at', { ascending: false })
    .limit(6)

  return (
    <main className="flex-1 max-w-6xl mx-auto px-4 py-12 w-full">
        <section className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Welcome to the Store</h1>
          <p className="text-muted-foreground text-lg max-w-xl">
            Browse our collection of products.
          </p>
        </section>

        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Featured Products</h2>
            <Link href="/products" className="text-sm text-muted-foreground hover:text-foreground underline">
              View all
            </Link>
          </div>

          {!products || products.length === 0 ? (
            <p className="text-muted-foreground">No products yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product: any) => {
                const prices = product.product_variants?.map((v: any) => v.price) || []
                const minPrice = Math.min(...prices)
                const maxPrice = Math.max(...prices)
                const firstImage = product.product_variants?.find((v: any) => v.image_url)?.image_url || '/placeholder.svg'

                return (
                  <Link key={product.id} href={`/products/${product.id}`}>
                    <Card className="overflow-hidden h-full hover:shadow-md transition-shadow">
                      <img src={firstImage} alt={product.name} className="h-48 w-full object-contain bg-muted" />
                      <CardContent className="p-4 space-y-2">
                        <Badge variant="secondary">{product.category}</Badge>
                        <h3 className="font-semibold text-lg">{product.name}</h3>
                        {product.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
                        )}
                        <p className="text-xl font-bold">
                          From ${minPrice.toFixed(2)}
                          {maxPrice > minPrice && ` — $${maxPrice.toFixed(2)}`}
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                )
              })}
            </div>
          )}
        </section>
    </main>
  )
}
