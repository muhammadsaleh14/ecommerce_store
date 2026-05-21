import { Navigate } from 'react-router'
import { useAuth } from '../contexts/useAuth'
import { Skeleton } from '@/components/ui/skeleton'
import type { ReactNode } from 'react'

export const AdminRoute = ({ children }: { children: ReactNode }) => {
  const { isAdmin, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <Skeleton className="h-6 w-32" />
      </div>
    )
  }

  if (!isAdmin) return <Navigate to="/login" replace />

  return <>{children}</>
}
