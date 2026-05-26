import { createClient } from '@supabase/supabase-js'
import type { SupabaseClient } from '@supabase/supabase-js'

let _client: SupabaseClient | null = null

export function getSupabaseClient(): SupabaseClient {
  if (_client) return _client

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  _client = createClient(url, key, {
    auth: {
      storage: {
        getItem(key) {
          const val = localStorage.getItem(key)
          if (val) return val
          const match = document.cookie.match(new RegExp(`(?:^|; )${key}=([^;]*)`))
          return match ? decodeURIComponent(match[1]) : null
        },
        setItem(key, value) {
          localStorage.setItem(key, value)
          try {
            const session = JSON.parse(value)
            if (session?.access_token) {
              document.cookie = `sb-access-token=${session.access_token}; path=/; max-age=3600; samesite=lax`
            }
          } catch {}
        },
        removeItem(key) {
          localStorage.removeItem(key)
          document.cookie = 'sb-access-token=; path=/; max-age=0'
        },
      },
    },
  })

  return _client
}
