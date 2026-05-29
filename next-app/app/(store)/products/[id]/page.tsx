export const dynamic = 'force-dynamic'

import { getServerClient } from '@/lib/supabase/server'
import { getStore } from '@/stores/registry'

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await getServerClient()

  const { data: product } = await supabase
    .from('products')
    .select('*, product_variants(*)')
    .eq('id', id)
    .single()

  const store = await getStore()
  const Page = store.pages.ProductDetailPage
  return <Page product={product} />
}
