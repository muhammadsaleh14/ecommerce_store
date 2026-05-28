import { getSupabaseClient } from '@/lib/supabase/client'
import type { Category } from '../types/category'

function db() {
  return getSupabaseClient()
}

export const getCategories = async (): Promise<Category[]> => {
  const { data, error } = await db()
    .from('categories')
    .select('*')
    .order('slug', { ascending: true })

  if (error) throw error
  return (data ?? []).map((row) => ({
    slug: row.slug,
    name: row.name,
    description: row.description,
  }))
}

export const addCategory = async (input: { slug: string; name: string; description?: string }) => {
  const { error } = await db().from('categories').insert({
    slug: input.slug,
    name: input.name,
    description: input.description ?? null,
  })
  if (error) throw error
}

export const updateCategory = async (slug: string, input: { name?: string; description?: string }) => {
  const { error } = await db().from('categories').update(input).eq('slug', slug)
  if (error) throw error
}

export const deleteCategory = async (slug: string) => {
  const { error } = await db().from('categories').delete().eq('slug', slug)
  if (error) throw error
}
