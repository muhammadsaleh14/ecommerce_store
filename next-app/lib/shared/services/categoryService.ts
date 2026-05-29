import type { SupabaseClient } from '@supabase/supabase-js'
import type { Category } from '../types/category'

export const getCategories = async (client: SupabaseClient, tenantId: string): Promise<Category[]> => {
  const { data, error } = await client
    .from('categories')
    .select('*')
    .eq('tenant_id', tenantId)
    .order('slug', { ascending: true })

  if (error) throw error
  return (data ?? []).map((row) => ({
    slug: row.slug,
    name: row.name,
    description: row.description,
  }))
}

export const addCategory = async (client: SupabaseClient, tenantId: string, input: { slug: string; name: string; description?: string }) => {
  const { error } = await client.from('categories').insert({
    slug: input.slug,
    name: input.name,
    description: input.description ?? null,
    tenant_id: tenantId,
  })
  if (error) throw error
}

export const updateCategory = async (client: SupabaseClient, tenantId: string, slug: string, input: { name?: string; description?: string }) => {
  const { error } = await client
    .from('categories')
    .update(input)
    .eq('tenant_id', tenantId)
    .eq('slug', slug)
  if (error) throw error
}

export const deleteCategory = async (client: SupabaseClient, tenantId: string, slug: string) => {
  const { error } = await client
    .from('categories')
    .delete()
    .eq('tenant_id', tenantId)
    .eq('slug', slug)
  if (error) throw error
}
