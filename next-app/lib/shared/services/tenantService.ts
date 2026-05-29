import type { SupabaseClient } from '@supabase/supabase-js'

export interface Tenant {
  id: string
  name: string
  createdAt: string
}

export const getTenants = async (client: SupabaseClient): Promise<Tenant[]> => {
  const { data, error } = await client.from('tenants').select('*').order('created_at', { ascending: false })

  if (error) throw error
  return (data ?? []).map((row) => ({
    id: row.id,
    name: row.name,
    createdAt: row.created_at,
  }))
}

export const addTenant = async (client: SupabaseClient, input: { id: string; name: string }) => {
  const { error } = await client.from('tenants').insert({ id: input.id, name: input.name })
  if (error) throw error
}

export const updateTenant = async (client: SupabaseClient, id: string, input: { name: string }) => {
  const { error } = await client.from('tenants').update({ name: input.name }).eq('id', id)
  if (error) throw error
}
