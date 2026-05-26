export const dynamic = 'force-dynamic'

import { getServerClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'

export default async function ProductsPage() {
  const supabase = await getServerClient()
  const { data: products } = await supabase
    .from('products')
    .select('*, product_variants(*)')
    .order('created_at', { ascending: false })

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold">Store</Link>
          <nav className="flex gap-4">
            <Link href="/products" className="text-sm text-muted-foreground hover:text-foreground">Products</Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto px-4 py-12 w-full">
        <h1 className="text-3xl font-bold mb-8">All Products</h1>

        {!products || products.length === 0 ? (
          <p className="text-muted-foreground">No products yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product: any) => {
              const prices = product.product_variants?.map((v: any) => v.price) || []
              const minPrice = Math.min(...prices)
              const maxPrice = Math.max(...prices)
              const firstImage = product.product_variants?.[0]?.image_url || '/placeholder.svg'

              return (
                <Link key={product.id} href={`/products/${product.id}`}>
                  <Card className="overflow-hidden h-full hover:shadow-md transition-shadow">
                    <img src={firstImage} alt={product.name} className="h-48 w-full object-cover" />
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
      </main>
    </div>
  )
}
