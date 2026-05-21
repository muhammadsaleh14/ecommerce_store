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

interface Props {
  onSubmit: (input: ProductInput) => Promise<void>
}

const catLabel = (cat: string) =>
  cat.charAt(0).toUpperCase() + cat.slice(1).replace('-', ' ')

export const ProductForm = ({ onSubmit }: Props) => {
  const [form, setForm] = useState<ProductInput>({
    name: '',
    description: '',
    price: 0,
    imageUrl: '',
    category: 'other',
  })
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    await onSubmit(form)
    setForm({ name: '', description: '', price: 0, imageUrl: '', category: 'other' })
    setSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          placeholder="Product name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Product description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="price">Price</Label>
        <Input
          id="price"
          placeholder="0.00"
          type="number"
          step="0.01"
          value={form.price || ''}
          onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="imageUrl">Image URL</Label>
        <Input
          id="imageUrl"
          placeholder="https://..."
          value={form.imageUrl}
          onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select
          value={form.category}
          onValueChange={(value) => setForm({ ...form, category: value as typeof form.category })}
        >
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

      <Button type="submit" disabled={submitting}>
        {submitting ? 'Adding...' : 'Add Product'}
      </Button>
    </form>
  )
}
