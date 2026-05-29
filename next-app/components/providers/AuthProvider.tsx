"use client"

import { createContext, useEffect, useState, type ReactNode } from 'react'
import type { User } from '@supabase/supabase-js'
import { getSupabaseClient } from '@/lib/supabase/client'

interface AuthContextValue {
  user: User | null
  loading: boolean
  isAdmin: boolean
  isSuperAdmin: boolean
  tenantId: string | null
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  isAdmin: false,
  isSuperAdmin: false,
  tenantId: null,
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [admin, setAdmin] = useState(false)
  const [superAdmin, setSuperAdmin] = useState(false)
  const [tenantId, setTenantId] = useState<string | null>(null)

  useEffect(() => {
    const { data: listener } = getSupabaseClient().auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null)
      const role = session?.user?.app_metadata?.role
      setAdmin(role === 'admin' || role === 'superadmin')
      setSuperAdmin(role === 'superadmin')
      setTenantId(session?.user?.app_metadata?.tenant_id ?? null)
      setLoading(false)
    })

    return () => listener?.subscription.unsubscribe()
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin: admin, isSuperAdmin: superAdmin, tenantId }}>
      {children}
    </AuthContext.Provider>
  )
}

export { AuthContext }
