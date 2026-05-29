export const dynamic = 'force-dynamic'

import { CartClient } from '@/components/cart/CartClient'
import { getTenantId } from '@/tenants/registry'

export default function CartPage() {
  return <CartClient tenantId={getTenantId()} />
}
