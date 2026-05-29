import type { StoreDefinition } from './types'

export type StoreID = 'womencouture'

const STORE = (process.env.STORE || 'womencouture') as StoreID

const storeModules: Record<StoreID, () => Promise<StoreDefinition>> = {
  womencouture: () => import('./womencouture').then((m) => m.default),
}

export async function getStore(): Promise<StoreDefinition> {
  return storeModules[STORE]()
}

export function getStoreId(): StoreID {
  return STORE
}
