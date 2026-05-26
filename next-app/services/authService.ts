import { getSupabaseClient } from '@/lib/supabase/client'

export const loginWithEmail = (email: string, password: string) =>
  getSupabaseClient().auth.signInWithPassword({ email, password })

export const logout = () => getSupabaseClient().auth.signOut()
