'use client'

import { createContext, useEffect, useState, type ReactNode } from 'react'
import type { User } from '@supabase/supabase-js'
import { getSupabaseClient } from '@/lib/supabase/client'

export interface UserTenant {
  tenantId: string
  role: string
}

interface AuthContextValue {
  user: User | null
  loading: boolean
  isAdmin: boolean
  isSuperAdmin: boolean
  activeTenantId: string | null
  userTenants: UserTenant[]
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  isAdmin: false,
  isSuperAdmin: false,
  activeTenantId: null,
  userTenants: [],
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [admin, setAdmin] = useState(false)
  const [superAdmin, setSuperAdmin] = useState(false)
  const [activeTenantId, setActiveTenantId] = useState<string | null>(null)
  const [userTenants, setUserTenants] = useState<UserTenant[]>([])

  useEffect(() => {
    const { data: listener } = getSupabaseClient().auth.onAuthStateChange(async (_event, session) => {
      const currentUser = session?.user ?? null
      setUser(currentUser)

      if (currentUser) {
        const { data } = await getSupabaseClient()
          .from('user_tenants')
          .select('tenant_id, role')
          .eq('user_id', currentUser.id)

        const tenants: UserTenant[] = (data ?? []).map((r: any) => ({
          tenantId: r.tenant_id,
          role: r.role,
        }))
        setUserTenants(tenants)
        setSuperAdmin(tenants.some((t) => t.role === 'superadmin'))
        setAdmin(tenants.some((t) => t.role === 'admin' || t.role === 'superadmin'))
        setActiveTenantId(tenants[0]?.tenantId ?? currentUser.app_metadata?.tenant_id ?? 'womencouture')
      } else {
        setUserTenants([])
        setSuperAdmin(false)
        setAdmin(false)
        setActiveTenantId(null)
      }

      setLoading(false)
    })

    return () => listener?.subscription.unsubscribe()
  }, [])

  return (
    <AuthContext.Provider
      value={{ user, loading, isAdmin: admin, isSuperAdmin: superAdmin, activeTenantId, userTenants }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export { AuthContext }
