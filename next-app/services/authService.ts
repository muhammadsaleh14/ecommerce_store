import { createSupabaseClient } from '@/lib/supabase-client'

let client: ReturnType<typeof createSupabaseClient> | null = null
function supabase() {
  if (!client) client = createSupabaseClient()
  return client
}

export const loginWithEmail = (email: string, password: string) =>
  supabase().auth.signInWithPassword({ email, password })

export const logout = () => supabase().auth.signOut()
