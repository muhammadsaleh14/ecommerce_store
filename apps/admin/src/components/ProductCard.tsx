import type { Product } from '@ecommerce/shared'

interface Props {
  product: Product
  onDelete?: (id: string) => void
}

export const ProductCard = ({ product, onDelete }: Props) => {
  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      <img
        src={product.imageUrl || '/placeholder.svg'}
        alt={product.name}
        className="h-48 w-full object-cover"
      />
      <div className="p-4 space-y-2">
        <span className="inline-block rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
          {product.category}
        </span>
        <h3 className="font-semibold text-lg">{product.name}</h3>
        <p className="text-sm text-gray-500 line-clamp-2">{product.description}</p>
        <p className="text-xl font-bold">${product.price.toFixed(2)}</p>
        {onDelete && (
          <button
            onClick={() => onDelete(product.id)}
            className="text-sm text-red-500 hover:underline"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  )
}
