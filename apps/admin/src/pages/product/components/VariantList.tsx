import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { VariantRow } from './VariantRow'

interface VariantData {
  name: string
  price: number
  imageUrl: string
}

interface Props {
  variants: VariantData[]
  onChange: (index: number, field: keyof VariantData, value: string) => void
  onAdd: () => void
  onRemove: (index: number) => void
}

export function VariantList({ variants, onChange, onAdd, onRemove }: Props) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">
          Variants ({variants.length})
        </CardTitle>
        <Button type="button" variant="outline" size="sm" onClick={onAdd}>
          + Add Variant
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {variants.map((v, i) => (
          <VariantRow
            key={i}
            variant={v}
            index={i}
            canRemove={variants.length > 1}
            onChange={onChange}
            onRemove={onRemove}
          />
        ))}
      </CardContent>
    </Card>
  )
}
