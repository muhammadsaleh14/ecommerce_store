export const dynamic = 'force-dynamic'

import { getServerClient } from '@/lib/supabase/server'
import { getProducts } from '@/lib/shared/services/productService'
import { getStore } from '@/stores/registry'

export default async function ProductsPage() {
  const supabase = await getServerClient()
  const products = await getProducts(supabase)

  const store = await getStore()
  const Page = store.pages.ProductsPage
  return <Page products={products} />
}
