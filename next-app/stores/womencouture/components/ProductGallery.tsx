"use client"

import { useState } from 'react'
import { config } from '../config'

export function ProductGallery({ product }: { product: any }) {
  const { theme, content } = config
  const variants = product.product_variants || []
  const [selected, setSelected] = useState(0)
  const variant = variants[selected]
  const imageUrl = variant?.image_url

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div
        className="h-[400px] bg-cover bg-center"
        style={{
          border: `2px solid ${theme.borderColor}`,
          boxShadow: theme.shadow,
          backgroundImage: imageUrl ? `url('${imageUrl}')` : undefined,
        }}
      >
        {!imageUrl && (
          <div className="w-full h-full flex items-center justify-center bg-neutral-200 text-black/40 text-xs font-bold uppercase">
            No Image
          </div>
        )}
      </div>

      <div className="space-y-4">
        <span
          className="inline-block text-[10px] font-bold uppercase px-1.5 py-0.5"
          style={{ border: `2px solid ${theme.borderColor}` }}
        >
          {product.category}
        </span>
        <h1 className="font-['Playfair_Display',_serif] text-2xl sm:text-3xl font-bold">{product.name}</h1>
        {product.description && (
          <p className="text-sm leading-relaxed" style={{ color: 'rgba(0,0,0,0.7)' }}>{product.description}</p>
        )}
        <p className="text-xl font-bold" style={{ color: theme.accent }}>
          {content.currency} {variant.price.toFixed(2).replace('.00', '')}
        </p>

        <div className="space-y-4">
          <div>
            <h3 className="text-xs font-bold uppercase mb-2">Variants</h3>
            <div className="flex flex-wrap gap-1.5">
              {variants.map((v: any, i: number) => (
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
      </div>
    </div>
  )
}
