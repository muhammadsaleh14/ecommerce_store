'use client'

import { QueryClientProvider as QCProvider } from '@tanstack/react-query'
import { queryClient } from '@/lib/queryClient'
import type { ReactNode } from 'react'

export function QueryClientProvider({ children }: { children: ReactNode }) {
  return <QCProvider client={queryClient}>{children}</QCProvider>
}
