import type { TenantDefinition } from './types'

export type TenantID = 'womencouture'

const TENANT = (process.env.TENANT_ID || 'womencouture') as TenantID

const tenantModules: Record<TenantID, () => Promise<TenantDefinition>> = {
  womencouture: () => import('./womencouture').then(m => m.default),
}

export async function getTenant(): Promise<TenantDefinition> {
  return tenantModules[TENANT]()
}

export function getTenantId(): TenantID {
  return TENANT
}
