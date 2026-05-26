"use client"

export const dynamic = 'force-dynamic'

import { useState, use, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { useProduct, useUpdateProduct } from '@/hooks/queries/useProducts'
import { BasicFields } from '@/components/admin/BasicFields'
import { VariantList } from '@/components/admin/VariantList'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import type { ProductInput } from '@/lib/shared/types/product'

interface VariantData {
  name: string
  price: number
  imageUrl: string
}

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { data: product, isLoading } = useProduct(id)
  const updateMutation = useUpdateProduct(id)

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('other')
  const [variants, setVariants] = useState<VariantData[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [initialized, setInitialized] = useState(false)

  if (isLoading) {
    return (
      <div className="max-w-lg mx-auto space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 rounded-xl" />
      </div>
    )
  }

  if (!product) {
    return <p className="text-muted-foreground">Product not found.</p>
  }

  if (!initialized) {
    setName(product.name)
    setDescription(product.description)
    setCategory(product.category)
    setVariants(
      product.variants.map((v) => ({ name: v.name, price: v.price, imageUrl: v.imageUrl })),
    )
    setInitialized(true)
  }

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

    await updateMutation.mutateAsync({
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
          <CardTitle>Edit Product</CardTitle>
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
              {submitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
