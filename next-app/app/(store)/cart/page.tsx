export const dynamic = 'force-dynamic'

import { CartClient } from '@/components/cart/CartClient'
import { getStoreId } from '@/stores/registry'

export default function CartPage() {
  return <CartClient tenantId={getStoreId()} />
}
