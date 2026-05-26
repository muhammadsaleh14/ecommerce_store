import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

interface CookieAdapter {
  getAll(): Array<{ name: string; value: string }>
  setAll(cookiesToSet: Array<{ name: string; value: string; options?: Record<string, unknown> }>): void
}

export async function getServerClient(cookieAdapter?: CookieAdapter) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY')

  let getAll: CookieAdapter['getAll']
  let setAll: CookieAdapter['setAll']

  if (cookieAdapter) {
    getAll = cookieAdapter.getAll
    setAll = cookieAdapter.setAll
  } else {
    const store = await cookies()
    getAll = () => store.getAll()
    setAll = (cookiesToSet) => {
      cookiesToSet.forEach(({ name, value, options }) => store.set(name, value, options))
    }
  }

  return createServerClient(url, key, {
    cookies: { getAll, setAll },
  })
}