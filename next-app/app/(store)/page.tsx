export const dynamic = 'force-dynamic'

import { getServerClient } from '@/lib/supabase/server'
import { getProducts } from '@/lib/shared/services/productService'
import { getTenant, getTenantId } from '@/tenants/registry'

export default async function HomePage() {
  const supabase = await getServerClient()
  const products = await getProducts(supabase, getTenantId(), 6)

  const tenant = await getTenant()
  const Page = tenant.pages.HomePage
  return <Page products={products} />
}
