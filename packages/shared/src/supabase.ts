import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let _client: SupabaseClient | null = null

export function getSupabase(): SupabaseClient {
  if (!_client) {
    const url =
      (typeof process !== 'undefined' ? (process.env as Record<string, string>)?.['NEXT_PUBLIC_SUPABASE_URL'] : undefined) ??
      (typeof import.meta !== 'undefined' ? (import.meta as Record<string, any>).env?.VITE_SUPABASE_URL : undefined) ??
      ''

    const key =
      (typeof process !== 'undefined' ? (process.env as Record<string, string>)?.['NEXT_PUBLIC_SUPABASE_ANON_KEY'] : undefined) ??
      (typeof import.meta !== 'undefined' ? (import.meta as Record<string, any>).env?.VITE_SUPABASE_ANON_KEY : undefined) ??
      ''

    if (!url || !key) {
      throw new Error(
        'Missing Supabase env vars — set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY',
      )
    }

    _client = createClient(url, key)
  }
  return _client
}
