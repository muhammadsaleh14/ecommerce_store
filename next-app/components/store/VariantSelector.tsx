"use client"

import { useState } from 'react'

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
      <div>
        <h3 className="text-xs font-bold uppercase mb-2">Variants</h3>
        <div className="flex flex-wrap gap-1.5">
          {variants.map((v, i) => (
            <button
              key={v.id}
              type="button"
              onClick={() => setSelected(i)}
              className={`px-3 py-1.5 text-xs font-bold uppercase border-2 border-black transition-all ${
                i === selected
                  ? 'bg-[#FF006E] text-white shadow-[3px_3px_0px_#000]'
                  : 'bg-white hover:shadow-[3px_3px_0px_#000]'
              }`}
            >
              {v.name}
            </button>
          ))}
        </div>
      </div>

      <div className="pt-4 border-t-2 border-black">
        <p className="text-[10px] font-bold uppercase mb-1">Selected</p>
        <p className="text-sm font-bold">{variant.name}</p>
        <p className="text-lg font-bold text-[#FF006E]">
          Rs. {variant.price.toFixed(2).replace('.00', '')}
        </p>
      </div>
    </div>
  )
}
