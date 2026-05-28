"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Package, Tags } from 'lucide-react'

const links = [
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/categories', label: 'Categories', icon: Tags },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-56 shrink-0 border-r bg-white min-h-screen flex flex-col">
      <div className="p-4 border-b">
        <Link href="/admin/products" className="text-lg font-bold tracking-tight">
          Admin
        </Link>
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
                active
                  ? 'bg-neutral-900 text-white'
                  : 'text-muted-foreground hover:bg-muted'
              }`}
            >
              <Icon className="h-4 w-4" />
              {link.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
