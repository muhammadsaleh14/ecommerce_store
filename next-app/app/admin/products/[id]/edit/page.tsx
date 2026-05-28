"use client"

export const dynamic = 'force-dynamic'

import { useState, use, useRef, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { useProduct, useUpdateProduct } from '@/hooks/queries/useProducts'
import { uploadVariantImage, deleteStorageImage } from '@/lib/upload'
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

  const originalUrlsRef = useRef<Set<string>>(new Set())

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('other')
  const [variants, setVariants] = useState<VariantData[]>([])
  const [pendingFiles, setPendingFiles] = useState<(File | null)[]>([])
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
    const v = product.variants.map((v) => ({ name: v.name, price: v.price, imageUrl: v.imageUrl }))
    setVariants(v)
    setPendingFiles(v.map(() => null))
    originalUrlsRef.current = new Set(product.variants.map((v) => v.imageUrl).filter(Boolean))
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

  const handleFilePick = (idx: number, file: File) => {
    setPendingFiles((prev) => {
      const next = [...prev]
      next[idx] = file
      return next
    })
  }

  const addVariant = () => {
    setVariants([...variants, { name: '', price: 0, imageUrl: '' }])
    setPendingFiles((prev) => [...prev, null])
  }

  const removeVariant = (idx: number) => {
    setVariants(variants.filter((_, i) => i !== idx))
    setPendingFiles((prev) => prev.filter((_, i) => i !== idx))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    const finalVariants: ProductInput['variants'] = []
    for (let i = 0; i < variants.length; i++) {
      const v = variants[i]
      if (!v.name.trim()) continue

      let imageUrl = v.imageUrl
      const file = pendingFiles[i]
      if (file) {
        imageUrl = await uploadVariantImage(file)
      }

      finalVariants.push({ name: v.name.trim(), price: v.price, imageUrl })
    }

    await updateMutation.mutateAsync({
      name,
      description,
      category: category as ProductInput['category'],
      variants: finalVariants,
    })

    // Delete original storage images that are no longer used
    const finalUrls = new Set(finalVariants.map((v) => v.imageUrl).filter(Boolean))
    for (const url of originalUrlsRef.current) {
      if (!finalUrls.has(url)) {
        await deleteStorageImage(url).catch(() => {})
      }
    }

    // Revoke any leftover blob URLs
    for (const v of variants) {
      if (v.imageUrl.startsWith('blob:')) URL.revokeObjectURL(v.imageUrl)
    }

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
              onFilePick={handleFilePick}
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
