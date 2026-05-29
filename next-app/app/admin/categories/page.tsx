"use client"

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { useCategories, useAddCategory, useUpdateCategory, useDeleteCategory } from '@/hooks/queries/useCategories'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent } from '@/components/ui/card'

export default function AdminCategoriesPage() {
  const { data: categories, isLoading, error } = useCategories()
  const addCategory = useAddCategory()
  const updateCategory = useUpdateCategory()
  const deleteCategory = useDeleteCategory()

  const [newSlug, setNewSlug] = useState('')
  const [newName, setNewName] = useState('')
  const [newDesc, setNewDesc] = useState('')

  const [editSlug, setEditSlug] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [editDesc, setEditDesc] = useState('')

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newSlug || !newName) return
    try {
      await addCategory.mutateAsync({ slug: newSlug, name: newName, description: newDesc || undefined })
      setNewSlug('')
      setNewName('')
      setNewDesc('')
    } catch { /* handled */ }
  }

  const handleUpdate = async (slug: string) => {
    try {
      await updateCategory.mutateAsync({ slug, name: editName || undefined, description: editDesc || undefined })
      setEditSlug(null)
    } catch { /* handled */ }
  }

  const handleDelete = async (slug: string) => {
    if (!confirm(`Delete "${slug}"?`)) return
    try {
      await deleteCategory.mutateAsync(slug)
    } catch { /* handled */ }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return <p className="text-destructive">Failed to load categories: {(error as Error).message}</p>
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Manage Categories</h2>
      </div>

      <form onSubmit={handleAdd} className="flex items-end gap-3 flex-wrap">
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">Slug</label>
          <Input value={newSlug} onChange={(e) => setNewSlug(e.target.value)} placeholder="e.g. clothing" className="w-36" />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">Name</label>
          <Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="e.g. Clothing" className="w-44" />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">Description</label>
          <Input value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder="Optional" className="w-60" />
        </div>
        <Button type="submit" disabled={addCategory.isPending || !newSlug || !newName}>
          Add Category
        </Button>
      </form>

      {!categories || categories.length === 0 ? (
        <p className="text-muted-foreground">No categories yet.</p>
      ) : (
        <div className="space-y-3">
          {categories.map((cat) => (
            <Card key={cat.slug}>
              <CardContent className="p-4">
                {editSlug === cat.slug ? (
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-sm font-mono text-muted-foreground w-28">{cat.slug}</span>
                    <Input value={editName} onChange={(e) => setEditName(e.target.value)} className="w-44" />
                    <Input value={editDesc} onChange={(e) => setEditDesc(e.target.value)} className="w-60" placeholder="Description" />
                    <Button size="sm" onClick={() => handleUpdate(cat.slug)} disabled={updateCategory.isPending}>
                      Save
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setEditSlug(null)}>
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">{cat.name}</p>
                      <p className="text-sm text-muted-foreground">{cat.slug}{cat.description ? ` — ${cat.description}` : ''}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditSlug(cat.slug)
                          setEditName(cat.name)
                          setEditDesc(cat.description ?? '')
                        }}
                      >
                        Edit
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(cat.slug)} disabled={deleteCategory.isPending}>
                        Delete
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
