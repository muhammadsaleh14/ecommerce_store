"use client"

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Package, Tags, ShoppingBag, Building2, PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

const links = [
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/categories', label: 'Categories', icon: Tags },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingBag },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const { isSuperAdmin } = useAuth()

  const toggle = () => setCollapsed((c) => !c)

  return (
    <aside className={`${collapsed ? 'w-14' : 'w-56'} shrink-0 border-r bg-white min-h-screen flex flex-col transition-all duration-200`}>
      <div className={`border-b flex items-center ${collapsed ? 'justify-center p-2' : 'justify-between p-4'}`}>
        {!collapsed && (
          <Link href="/admin/products" className="text-lg font-bold tracking-tight">
            Admin
          </Link>
        )}
        <button type="button" onClick={toggle} className="p-1 rounded-md hover:bg-muted transition-colors">
          {collapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
        </button>
      </div>
      <nav className="flex-1 p-2 space-y-1">
        {links.map((link) => {
          const Icon = link.icon
          const active = pathname.startsWith(link.href)
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                collapsed ? 'justify-center px-0' : ''
              } ${
                active
                  ? 'bg-neutral-900 text-white'
                  : 'text-muted-foreground hover:bg-muted'
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {!collapsed && link.label}
            </Link>
          )
        })}

        {isSuperAdmin && (
          <>
            {!collapsed && <div className="pt-3 pb-1 px-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Super Admin</div>}
            <Link
              href="/admin/superadmin/tenants"
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                collapsed ? 'justify-center px-0' : ''
              } ${pathname.startsWith('/admin/superadmin') ? 'bg-neutral-900 text-white' : 'text-muted-foreground hover:bg-muted'}`}
            >
              <Building2 className="h-4 w-4 shrink-0" />
              {!collapsed && 'Tenants'}
            </Link>
          </>
        )}
      </nav>
    </aside>
  )
}
