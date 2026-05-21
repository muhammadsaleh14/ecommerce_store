import { useState, type FormEvent } from 'react'
import { CATEGORIES } from '@ecommerce/shared'
import type { ProductInput } from '@ecommerce/shared'

interface Props {
  onSubmit: (input: ProductInput) => Promise<void>
}

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
      <input
        placeholder="Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        className="w-full rounded-lg border border-gray-300 px-3 py-2"
        required
      />
      <textarea
        placeholder="Description"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
        className="w-full rounded-lg border border-gray-300 px-3 py-2"
        rows={3}
      />
      <input
        placeholder="Price"
        type="number"
        step="0.01"
        value={form.price || ''}
        onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })}
        className="w-full rounded-lg border border-gray-300 px-3 py-2"
        required
      />
      <input
        placeholder="Image URL"
        value={form.imageUrl}
        onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
        className="w-full rounded-lg border border-gray-300 px-3 py-2"
      />
      <select
        value={form.category}
        onChange={(e) => setForm({ ...form, category: e.target.value as typeof form.category })}
        className="w-full rounded-lg border border-gray-300 px-3 py-2"
      >
        {CATEGORIES.map((cat) => (
          <option key={cat} value={cat}>
            {cat.charAt(0).toUpperCase() + cat.slice(1).replace('-', ' ')}
          </option>
        ))}
      </select>
      <button
        type="submit"
        disabled={submitting}
        className="rounded-lg bg-black px-6 py-2 text-white disabled:opacity-50"
      >
        {submitting ? 'Adding...' : 'Add Product'}
      </button>
    </form>
  )
}
