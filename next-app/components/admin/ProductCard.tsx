"use client"

import Link from 'next/link'
import type { Product } from '@/lib/shared/types/product'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface Props {
  product: Product
  onDelete?: (id: string) => void
}

export function ProductCard({ product, onDelete }: Props) {
  const firstImage = product.variants.find((v) => v.imageUrl)?.imageUrl || '/placeholder.svg'
  const prices = product.variants.map((v) => v.price)
  const minPrice = Math.min(...prices)
  const maxPrice = Math.max(...prices)

  return (
    <Card className="overflow-hidden">
      <img
        src={firstImage}
        alt={product.name}
        className="h-48 w-full object-contain bg-muted"
      />
      <CardContent className="p-4 space-y-2">
        <div className="flex items-center gap-2">
          <Badge variant="secondary">{product.category}</Badge>
          <span className="text-xs text-muted-foreground">
            {product.variants.length} variant{product.variants.length > 1 && 's'}
          </span>
        </div>
        <h3 className="font-semibold text-lg">{product.name}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {product.description}
        </p>
        <p className="text-xl font-bold">
          From ${minPrice.toFixed(2)}
          {maxPrice > minPrice && ` — $${maxPrice.toFixed(2)}`}
        </p>
        <div className="flex gap-2 pt-1">
          {onDelete && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onDelete(product.id)}
            >
              Delete
            </Button>
          )}
          <Button variant="outline" size="sm" asChild>
            <Link href={`/admin/products/${product.id}/edit`}>Edit</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
