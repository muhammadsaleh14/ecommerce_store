import { useState, type FormEvent } from 'react'
import { CATEGORIES } from '@ecommerce/shared'
import type { ProductInput } from '@ecommerce/shared'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface Props {
  onSubmit: (input: ProductInput) => Promise<void>
}

interface VariantRow {
  name: string
  price: number
  imageUrl: string
}

const catLabel = (cat: string) =>
  cat.charAt(0).toUpperCase() + cat.slice(1).replace('-', ' ')

export const ProductForm = ({ onSubmit }: Props) => {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('other')
  const [variants, setVariants] = useState<VariantRow[]>([
    { name: '', price: 0, imageUrl: '' },
  ])
  const [submitting, setSubmitting] = useState(false)

  const handleVariantChange = (
    idx: number,
    field: keyof VariantRow,
    value: string,
  ) => {
    setVariants(
      variants.map((v, i) =>
        i === idx
          ? { ...v, [field]: field === 'price' ? parseFloat(value) || 0 : value }
          : v,
      ),
    )
  }

  const addVariant = () => {
    setVariants([...variants, { name: '', price: 0, imageUrl: '' }])
  }

  const removeVariant = (idx: number) => {
    setVariants(variants.filter((_, i) => i !== idx))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    await onSubmit({
      name,
      description,
      category: category as ProductInput['category'],
      variants: variants
        .filter((v) => v.name.trim())
        .map((v) => ({
          name: v.name.trim(),
          price: v.price,
          imageUrl: v.imageUrl,
        })),
    })

    setName('')
    setDescription('')
    setCategory('other')
    setVariants([{ name: '', price: 0, imageUrl: '' }])
    setSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            placeholder="Product name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Product description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger id="category">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {catLabel(cat)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">
            Variants ({variants.length})
          </CardTitle>
          <Button type="button" variant="outline" size="sm" onClick={addVariant}>
            + Add Variant
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {variants.map((v, i) => (
            <div key={i} className="flex items-center gap-2 border rounded-lg p-3">
              <div className="flex-1 space-y-1">
                <Label className="text-xs">Name</Label>
                <Input
                  placeholder="e.g. Small – Red"
                  value={v.name}
                  onChange={(e) => handleVariantChange(i, 'name', e.target.value)}
                  required
                />
              </div>
              <div className="w-24 space-y-1">
                <Label className="text-xs">Price</Label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={v.price || ''}
                  onChange={(e) => handleVariantChange(i, 'price', e.target.value)}
                  required
                />
              </div>
              <div className="flex-[2] space-y-1">
                <Label className="text-xs">Image URL</Label>
                <Input
                  placeholder="https://..."
                  value={v.imageUrl}
                  onChange={(e) => handleVariantChange(i, 'imageUrl', e.target.value)}
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="mt-5 text-destructive"
                disabled={variants.length <= 1}
                onClick={() => removeVariant(i)}
              >
                X
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      <Button type="submit" disabled={submitting}>
        {submitting ? 'Adding...' : 'Add Product'}
      </Button>
    </form>
  )
}
