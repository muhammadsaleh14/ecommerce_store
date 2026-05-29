export const dynamic = 'force-dynamic'

import { getServerClient } from '@/lib/supabase/server'
import { getProduct } from '@/lib/shared/services/productService'
import { getStore, getStoreId } from '@/stores/registry'

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await getServerClient()
  const product = await getProduct(supabase, getStoreId(), id)

  const store = await getStore()
  const Page = store.pages.ProductDetailPage
  return <Page product={product} />
}
