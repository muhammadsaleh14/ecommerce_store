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
    const supabase = getSupabaseClient()
    let cancelled = false

    async function handleSession(session: import('@supabase/supabase-js').Session | null) {
      const currentUser = session?.user ?? null
      if (cancelled) return
      setUser(currentUser)

      if (currentUser) {
        const { data } = await supabase
          .from('user_tenants')
          .select('tenant_id, role')
          .eq('user_id', currentUser.id)

        if (cancelled) return

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

      if (!cancelled) setLoading(false)
    }

    // Restore session from cookies on page reload
    supabase.auth.getSession().then(({ data: { session } }) => {
      handleSession(session)
    })

    // React to future auth changes (login, logout, token refresh)
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      handleSession(session)
    })

    return () => {
      cancelled = true
      listener?.subscription.unsubscribe()
    }
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
