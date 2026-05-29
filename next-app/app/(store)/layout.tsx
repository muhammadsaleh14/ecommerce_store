import { getTenant } from '@/tenants/registry'

export default async function StoreLayout({ children }: { children: React.ReactNode }) {
  const tenant = await getTenant()
  const Layout = tenant.components.Layout
  return <Layout>{children}</Layout>
}
