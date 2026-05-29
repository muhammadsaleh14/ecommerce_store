import { CartProvider } from '@/lib/context/cart'
import { getStore } from '@/stores/registry'

export default async function StoreLayout({ children }: { children: React.ReactNode }) {
  const store = await getStore()
  const Layout = store.components.Layout
  return (
    <CartProvider>
      <Layout>{children}</Layout>
    </CartProvider>
  )
}
