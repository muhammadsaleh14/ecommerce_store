import Link from 'next/link'

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold">Store</Link>
          <nav className="flex gap-4">
            <Link href="/products" className="text-sm text-muted-foreground hover:text-foreground">Products</Link>
          </nav>
        </div>
      </header>
      {children}
    </div>
  )
}
