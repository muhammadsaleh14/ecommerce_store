"use client"

import { createContext, useEffect, useState, type ReactNode } from 'react'
import type { User } from '@supabase/supabase-js'
import { getSupabaseClient } from '@/lib/supabase/client'

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
    const { data: listener } = getSupabaseClient().auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null)
      setAdmin(session?.user?.app_metadata?.role === 'admin')
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
