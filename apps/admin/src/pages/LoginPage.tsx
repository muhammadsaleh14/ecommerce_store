import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router'
import { loginWithEmail, logout } from '../services/authService'
import { useAuth } from '../contexts/useAuth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const LoginPage = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleEmailLogin = async (e: FormEvent) => {
    e.preventDefault()
    try {
      setError('')
      await loginWithEmail(email, password)
      navigate('/admin/products')
    } catch {
      setError('Invalid credentials')
    }
  }

  if (user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <p>
          Signed in as <strong>{user.email}</strong>
        </p>
        <Button
          variant="destructive"
          onClick={() => {
            logout()
            navigate('/')
          }}
        >
          Sign Out
        </Button>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Sign In</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@store.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full">
              Sign In (Admin)
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
