export const dynamic = 'force-dynamic'

import { getServerClient } from '@/lib/supabase/server'
import { getStore } from '@/stores/registry'

export default async function HomePage() {
  const supabase = await getServerClient()
  const { data: products } = await supabase
    .from('products')
    .select('*, product_variants(*)')
    .order('created_at', { ascending: false })
    .limit(6)

  const store = await getStore()
  const Page = store.pages.HomePage
  return <Page products={products || []} />
}
