"use client"

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
import { useCategories } from '@/hooks/queries/useCategories'
import { Skeleton } from '@/components/ui/skeleton'

interface Props {
  name: string
  description: string
  category: string
  onNameChange: (value: string) => void
  onDescriptionChange: (value: string) => void
  onCategoryChange: (value: string) => void
}

export function BasicFields({
  name,
  description,
  category,
  onNameChange,
  onDescriptionChange,
  onCategoryChange,
}: Props) {
  const { data: categories, isLoading } = useCategories()

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          placeholder="Product name"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Product description"
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select value={category} onValueChange={onCategoryChange}>
          <SelectTrigger id="category">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {isLoading ? (
              <div className="p-2">
                <Skeleton className="h-8 w-32" />
              </div>
            ) : (
              categories?.map((cat) => (
                <SelectItem key={cat.slug} value={cat.slug}>
                  {cat.name}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
