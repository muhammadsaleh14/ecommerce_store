import type { Product } from '@ecommerce/shared'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface Props {
  product: Product
  onDelete?: (id: string) => void
}

export const ProductCard = ({ product, onDelete }: Props) => {
  return (
    <Card className="overflow-hidden">
      <img
        src={product.imageUrl || '/placeholder.svg'}
        alt={product.name}
        className="h-48 w-full object-cover"
      />
      <CardContent className="p-4 space-y-2">
        <Badge variant="secondary">{product.category}</Badge>
        <h3 className="font-semibold text-lg">{product.name}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
        <p className="text-xl font-bold">${product.price.toFixed(2)}</p>
        {onDelete && (
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(product.id)}
          >
            Delete
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
