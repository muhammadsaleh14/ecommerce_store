"use client"

import { useState } from 'react'
import { config } from '../config'

interface Props {
  variants: { id: string; name: string; price: number; image_url: string }[]
}

export function VariantSelector({ variants }: Props) {
  const [selected, setSelected] = useState(0)
  const variant = variants[selected]
  const { theme, content } = config

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
              className={`px-3 py-1.5 text-xs font-bold uppercase transition-all ${i === selected ? 'text-white' : 'bg-white'}`}
              style={{
                border: `2px solid ${theme.borderColor}`,
                boxShadow: i === selected ? `3px 3px 0px ${theme.borderColor}` : undefined,
                backgroundColor: i === selected ? theme.accent : undefined,
              }}
            >
              {v.name}
            </button>
          ))}
        </div>
      </div>

      <div className="pt-4 border-t-2" style={{ borderColor: theme.borderColor }}>
        <p className="text-[10px] font-bold uppercase mb-1">Selected</p>
        <p className="text-sm font-bold">{variant.name}</p>
        <p className="text-lg font-bold" style={{ color: theme.accent }}>
          {content.currency} {variant.price.toFixed(2).replace('.00', '')}
        </p>
      </div>
    </div>
  )
}
