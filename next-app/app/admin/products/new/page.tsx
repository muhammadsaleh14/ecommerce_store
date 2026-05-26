"use client"

export const dynamic = 'force-dynamic'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { useAddProduct } from '@/hooks/queries/useProducts'
import { BasicFields } from '@/components/admin/BasicFields'
import { VariantList } from '@/components/admin/VariantList'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { ProductInput } from '@ecommerce/shared'

interface VariantData {
  name: string
  price: number
  imageUrl: string
}

export default function AddProductPage() {
  const router = useRouter()
  const addMutation = useAddProduct()

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('other')
  const [variants, setVariants] = useState<VariantData[]>([
    { name: '', price: 0, imageUrl: '' },
  ])
  const [submitting, setSubmitting] = useState(false)

  const handleVariantChange = (idx: number, field: keyof VariantData, value: string) => {
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

    await addMutation.mutateAsync({
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

    router.push('/admin/products')
  }

  return (
    <div className="max-w-lg mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Add Product</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <BasicFields
              name={name}
              description={description}
              category={category}
              onNameChange={setName}
              onDescriptionChange={setDescription}
              onCategoryChange={setCategory}
            />

            <VariantList
              variants={variants}
              onChange={handleVariantChange}
              onAdd={addVariant}
              onRemove={removeVariant}
            />

            <Button type="submit" disabled={submitting}>
              {submitting ? 'Adding...' : 'Add Product'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
