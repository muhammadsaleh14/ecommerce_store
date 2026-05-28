import Link from 'next/link'

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#FFF3E0] font-['Syne',_sans-serif]">
      <nav className="flex items-center justify-between px-[10%] py-8 border-b-2 border-black">
        <Link href="/" className="text-2xl font-bold tracking-wide">GULPOSH</Link>
        <div className="flex gap-6 text-xs font-bold uppercase tracking-widest">
          <Link href="/products" className="hover:text-[#FF006E] transition-colors">Products</Link>
        </div>
      </nav>
      {children}
    </div>
  )
}
