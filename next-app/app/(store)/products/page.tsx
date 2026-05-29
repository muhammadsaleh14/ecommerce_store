export const dynamic = 'force-dynamic'

import { getServerClient } from '@/lib/supabase/server'
import { getStore } from '@/stores/registry'

export default async function ProductsPage() {
  const supabase = await getServerClient()
  const { data: products } = await supabase
    .from('products')
    .select('*, product_variants(*)')
    .order('created_at', { ascending: false })

  const store = await getStore()
  const Page = store.pages.ProductsPage
  return <Page products={products || []} />
}
