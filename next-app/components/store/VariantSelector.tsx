"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'

interface Variant {
  id: string
  name: string
  price: number
  image_url: string
}

interface Props {
  variants: Variant[]
}

export function VariantSelector({ variants }: Props) {
  const [selected, setSelected] = useState(0)
  const variant = variants[selected]

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-sm font-medium">Variants</h3>
        <div className="flex flex-wrap gap-2">
          {variants.map((v, i) => (
            <Button
              key={v.id}
              type="button"
              variant={i === selected ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelected(i)}
            >
              {v.name}
            </Button>
          ))}
        </div>
      </div>

      <div className="pt-4 border-t">
        <p className="text-sm text-muted-foreground">Selected:</p>
        <p className="text-lg font-semibold">{variant.name}</p>
        <p className="text-2xl font-bold">${variant.price.toFixed(2)}</p>
      </div>
    </div>
  )
}
