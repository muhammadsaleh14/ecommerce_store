import { config } from '../config'
import type { ReactNode } from 'react'
import Link from 'next/link'

export function Layout({ children }: { children: ReactNode }) {
  const { theme, content } = config

  return (
    <div className="min-h-screen font-['Lato',_sans-serif]" style={{ backgroundColor: theme.bg }}>
      <nav className="flex items-center justify-between px-[10%] py-5 border-b-2" style={{ borderColor: theme.borderColor }}>
        <Link href="/" className="font-['Playfair_Display',_serif] text-xl font-bold tracking-wide">{content.name}</Link>
        <div className="flex gap-5 text-[11px] font-bold uppercase tracking-widest">
          <Link href="/products" className="hover:transition-colors" style={{ color: 'inherit' }}>Products</Link>
        </div>
      </nav>
      {children}
    </div>
  )
}
