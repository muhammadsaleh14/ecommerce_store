"use client"

import { createContext, useEffect, useState, type ReactNode } from 'react'
import type { User } from '@supabase/supabase-js'
import { createSupabaseClient } from '@/lib/supabase-client'

interface AuthContextValue {
  user: User | null
  loading: boolean
  isAdmin: boolean
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  isAdmin: false,
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [admin, setAdmin] = useState(false)

  useEffect(() => {
    const supabase = createSupabaseClient()

    const updateProfile = async (userId: string | undefined) => {
      if (!userId) {
        setAdmin(false)
        return
      }
      const { data } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .maybeSingle()
      setAdmin(data?.role === 'admin')
    }

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null)
      await updateProfile(session?.user?.id)
      setLoading(false)
    })

    return () => listener?.subscription.unsubscribe()
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin: admin }}>
      {children}
    </AuthContext.Provider>
  )
}

export { AuthContext }
