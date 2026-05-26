import { supabase } from '@/lib/supabase/client'

export const loginWithEmail = (email: string, password: string) =>
  supabase.auth.signInWithPassword({ email, password })

export const logout = () => supabase.auth.signOut()
