'use client'

import { useRef, useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

interface VariantData {
  name: string
  price: number
  imageUrl: string
}

interface Props {
  variant: VariantData
  index: number
  canRemove: boolean
  onChange: (index: number, field: keyof VariantData, value: string) => void
  onRemove: (index: number) => void
  onFilePick?: (index: number, file: File) => void
}

export function VariantRow({ variant, index, canRemove, onChange, onRemove, onFilePick }: Props) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  // revoke blob URL on unmount
  useEffect(() => {
    return () => {
      if (previewUrl?.startsWith('blob:')) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  const handleFilePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const blobUrl = URL.createObjectURL(file)
    const prevPreview = previewUrl
    setPreviewUrl(blobUrl)
    if (prevPreview?.startsWith('blob:')) URL.revokeObjectURL(prevPreview)

    onChange(index, 'imageUrl', blobUrl)
    onFilePick?.(index, file)
  }

  const displayUrl = previewUrl ?? variant.imageUrl

  return (
    <div className="flex items-start gap-2 border rounded-lg p-3">
      <div className="flex-1 space-y-1">
        <Label className="text-xs">Name</Label>
        <Input
          placeholder="e.g. Small – Red"
          value={variant.name}
          onChange={(e) => onChange(index, 'name', e.target.value)}
          required
        />
      </div>
      <div className="w-24 space-y-1">
        <Label className="text-xs">Price</Label>
        <Input
          type="number"
          step="0.01"
          placeholder="0.00"
          value={variant.price || ''}
          onChange={(e) => onChange(index, 'price', e.target.value)}
          required
        />
      </div>
      <div className="flex-[2] space-y-1">
        <Label className="text-xs">Image</Label>
        <div className="flex gap-1">
          <Input
            placeholder="https://..."
            value={variant.imageUrl}
            onChange={(e) => {
              onChange(index, 'imageUrl', e.target.value)
              setPreviewUrl(null)
            }}
            className="flex-1"
          />
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFilePick} />
          <Button type="button" variant="outline" size="sm" onClick={() => fileRef.current?.click()}>
            Browse
          </Button>
        </div>
        {displayUrl && <img src={displayUrl} alt="Preview" className="mt-1 h-16 w-16 rounded object-cover border" />}
      </div>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="mt-5 text-destructive"
        disabled={!canRemove}
        onClick={() => onRemove(index)}
      >
        X
      </Button>
    </div>
  )
}
