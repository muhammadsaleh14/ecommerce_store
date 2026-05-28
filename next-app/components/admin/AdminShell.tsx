"use client"

import { usePathname } from 'next/navigation'
import { AdminSidebar } from './AdminSidebar'

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isLoginPage = pathname === '/admin/login'

  if (isLoginPage) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        {children}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar />
      <main className="flex-1 px-6 py-8 overflow-auto">
        {children}
      </main>
    </div>
  )
}
