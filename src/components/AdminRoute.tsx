import { Navigate } from 'react-router'
import { useAuth } from '../contexts/AuthContext'
import type { ReactNode } from 'react'

export const AdminRoute = ({ children }: { children: ReactNode }) => {
  const { isAdmin, loading } = useAuth()

  if (loading) {
    return <div className="flex justify-center p-8 text-gray-500">Loading...</div>
  }

  if (!isAdmin) return <Navigate to="/login" replace />

  return <>{children}</>
}
