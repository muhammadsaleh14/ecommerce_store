export const dynamic = 'force-dynamic'

import { getServerClient } from '@/lib/supabase/server'
import { getProducts } from '@/lib/shared/services/productService'
import { getStore, getStoreId } from '@/stores/registry'

export default async function HomePage() {
  const supabase = await getServerClient()
  const products = await getProducts(supabase, getStoreId(), 6)

  const store = await getStore()
  const Page = store.pages.HomePage
  return <Page products={products} />
}
