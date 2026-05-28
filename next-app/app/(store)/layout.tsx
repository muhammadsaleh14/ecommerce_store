import Link from 'next/link'

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#FFF3E0] font-['Lato',_sans-serif]">
      <nav className="flex items-center justify-between px-[10%] py-5 border-b-2 border-black">
        <Link href="/" className="font-['Playfair_Display',_serif] text-xl font-bold tracking-wide">Women Couture</Link>
        <div className="flex gap-5 text-[11px] font-bold uppercase tracking-widest">
          <Link href="/products" className="hover:text-[#FF006E] transition-colors">Products</Link>
        </div>
      </nav>
      {children}
    </div>
  )
}
