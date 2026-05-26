import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let _client: SupabaseClient | null = null

type Env = Record<string, string | undefined>

export function setSupabaseClient(client: SupabaseClient): void {
  _client = client
}

export function getSupabase(): SupabaseClient {
  if (!_client) {
    let url = ''
    let key = ''

    try {
      url = (process.env as Env).NEXT_PUBLIC_SUPABASE_URL ?? ''
      key = (process.env as Env).NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''
    } catch {
      try {
        url = (import.meta as any).env?.VITE_SUPABASE_URL ?? ''
        key = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY ?? ''
      } catch {}
    }

    if (!url || !key) {
      throw new Error(
        'Missing Supabase env vars — set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY',
      )
    }

    _client = createClient(url, key)
  }
  return _client
}
