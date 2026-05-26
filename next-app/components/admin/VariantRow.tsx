"use client"

import { useRef, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { uploadVariantImage } from '@/lib/upload'

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
}

export function VariantRow({ variant, index, canRemove, onChange, onRemove }: Props) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const url = await uploadVariantImage(file)
      onChange(index, 'imageUrl', url)
    } catch {
      console.error('Upload failed')
    }
    setUploading(false)
  }

  return (
    <div className="flex items-center gap-2 border rounded-lg p-3">
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
            onChange={(e) => onChange(index, 'imageUrl', e.target.value)}
            className="flex-1"
          />
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleUpload}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={uploading}
            onClick={() => fileRef.current?.click()}
          >
            {uploading ? '...' : 'Browse'}
          </Button>
        </div>
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
