import { Navigate } from 'react-router'
import { useAuth } from '../contexts/AuthContext'
import type { ReactNode } from 'react'

export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return <div className="flex justify-center p-8 text-gray-500">Loading...</div>
  }

  if (!user) return <Navigate to="/login" replace />

  return <>{children}</>
}
