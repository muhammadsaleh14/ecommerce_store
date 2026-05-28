"use client"

export const dynamic = 'force-dynamic'

import { useCategories } from '@/hooks/queries/useCategories'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent } from '@/components/ui/card'

export default function AdminCategoriesPage() {
  const { data: categories, isLoading, error } = useCategories()

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

      {!categories || categories.length === 0 ? (
        <p className="text-muted-foreground">No categories yet.</p>
      ) : (
        <div className="space-y-3">
          {categories.map((cat) => (
            <Card key={cat.slug}>
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <p className="font-semibold">{cat.name}</p>
                  <p className="text-sm text-muted-foreground">{cat.slug}</p>
                </div>
                {cat.description && (
                  <p className="text-sm text-muted-foreground max-w-xs text-right">
                    {cat.description}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
