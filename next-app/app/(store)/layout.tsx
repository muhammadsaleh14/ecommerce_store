import { getStore } from '@/stores/registry'

export default async function StoreLayout({ children }: { children: React.ReactNode }) {
  const store = await getStore()
  const Layout = store.components.Layout
  return <Layout>{children}</Layout>
}
