export const dynamic = 'force-dynamic'

import { getServerClient } from '@/lib/supabase/server'
import { getProducts } from '@/lib/shared/services/productService'
import { getTenant, getTenantId } from '@/tenants/registry'

export default async function ProductsPage() {
  const supabase = await getServerClient()
  const products = await getProducts(supabase, getTenantId())

  const tenant = await getTenant()
  const Page = tenant.pages.ProductsPage
  return <Page products={products} />
}
