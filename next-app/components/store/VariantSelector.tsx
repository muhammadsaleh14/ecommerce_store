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
    <div className="space-y-5">
      <div>
        <h3 className="text-sm font-bold uppercase mb-2">Variants</h3>
        <div className="flex flex-wrap gap-2">
          {variants.map((v, i) => (
            <button
              key={v.id}
              type="button"
              onClick={() => setSelected(i)}
              className={`px-4 py-2 text-sm font-bold uppercase border-2 border-black transition-all ${
                i === selected
                  ? 'bg-[#FF006E] text-white shadow-[4px_4px_0px_#000]'
                  : 'bg-white hover:shadow-[4px_4px_0px_#000]'
              }`}
            >
              {v.name}
            </button>
          ))}
        </div>
      </div>

      <div className="pt-5 border-t-2 border-black">
        <p className="text-xs font-bold uppercase mb-1">Selected</p>
        <p className="text-lg font-extrabold">{variant.name}</p>
        <p className="text-2xl font-extrabold text-[#FF006E]">
          Rs. {variant.price.toFixed(2).replace('.00', '')}
        </p>
      </div>
    </div>
  )
}
