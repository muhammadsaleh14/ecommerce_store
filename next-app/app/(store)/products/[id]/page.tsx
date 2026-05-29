export const dynamic = 'force-dynamic'

import { getServerClient } from '@/lib/supabase/server'
import { getProduct } from '@/lib/shared/services/productService'
import { getTenant, getTenantId } from '@/tenants/registry'

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await getServerClient()
  const product = await getProduct(supabase, getTenantId(), id)

  const tenant = await getTenant()
  const Page = tenant.pages.ProductDetailPage
  return <Page product={product} />
}
