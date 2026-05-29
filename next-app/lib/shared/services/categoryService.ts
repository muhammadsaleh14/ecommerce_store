import type { SupabaseClient } from '@supabase/supabase-js'
import type { Category } from '../types/category'

export const getCategories = async (client: SupabaseClient): Promise<Category[]> => {
  const { data, error } = await client
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

export const addCategory = async (client: SupabaseClient, input: { slug: string; name: string; description?: string }) => {
  const { error } = await client.from('categories').insert({
    slug: input.slug,
    name: input.name,
    description: input.description ?? null,
  })
  if (error) throw error
}

export const updateCategory = async (client: SupabaseClient, slug: string, input: { name?: string; description?: string }) => {
  const { error } = await client.from('categories').update(input).eq('slug', slug)
  if (error) throw error
}

export const deleteCategory = async (client: SupabaseClient, slug: string) => {
  const { error } = await client.from('categories').delete().eq('slug', slug)
  if (error) throw error
}
