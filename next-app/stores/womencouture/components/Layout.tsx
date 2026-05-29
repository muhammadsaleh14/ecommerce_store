"use client"

import { config } from '../config'
import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'
import { useCart } from '@/lib/context/cart'

export function Layout({ children }: { children: React.ReactNode }) {
  const { theme, content } = config
  const { itemCount } = useCart()

  return (
    <div className="min-h-screen font-['Lato',_sans-serif]" style={{ backgroundColor: theme.bg }}>
      <nav className="flex items-center justify-between px-[10%] py-5 border-b-2" style={{ borderColor: theme.borderColor }}>
        <Link href="/" className="font-['Playfair_Display',_serif] text-xl font-bold tracking-wide">{content.name}</Link>
        <div className="flex items-center gap-5">
          <Link href="/products" className="text-[11px] font-bold uppercase tracking-widest hover:transition-colors">Products</Link>
          <Link href="/cart" className="relative">
            <ShoppingCart className="h-5 w-5" style={{ color: theme.borderColor }} />
            {itemCount > 0 && (
              <span
                className="absolute -top-2 -right-2 text-[10px] font-bold text-white rounded-full h-4 w-4 flex items-center justify-center"
                style={{ backgroundColor: theme.accent }}
              >
                {itemCount > 9 ? '9+' : itemCount}
              </span>
            )}
          </Link>
        </div>
      </nav>
      {children}
    </div>
  )
}
