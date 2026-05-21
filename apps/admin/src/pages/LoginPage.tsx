import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router'
import { loginWithEmail, loginWithGoogle, logout } from '../services/authService'
import { useAuth } from '../contexts/useAuth'

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

  const handleGoogleLogin = async () => {
    try {
      setError('')
      await loginWithGoogle()
      navigate('/admin/products')
    } catch {
      setError('Google sign-in failed')
    }
  }

  if (user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <p>
          Signed in as <strong>{user.email}</strong>
        </p>
        <button
          onClick={() => {
            logout()
            navigate('/')
          }}
          className="rounded-lg bg-red-500 px-6 py-2 text-white"
        >
          Sign Out
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8">
      <h1 className="text-2xl font-bold">Sign In</h1>

      <form onSubmit={handleEmailLogin} className="space-y-4 w-full max-w-sm">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2"
          required
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
        <button
          type="submit"
          className="w-full rounded-lg bg-black px-6 py-2 text-white"
        >
          Sign In (Admin)
        </button>
      </form>

      <div className="flex items-center gap-2 w-full max-w-sm">
        <div className="flex-1 h-px bg-gray-300" />
        <span className="text-sm text-gray-400">or</span>
        <div className="flex-1 h-px bg-gray-300" />
      </div>

      <button
        onClick={handleGoogleLogin}
        className="w-full max-w-sm rounded-lg border border-gray-300 px-6 py-2 flex items-center justify-center gap-2 hover:bg-gray-50"
      >
        Sign in with Google
      </button>
    </div>
  )
}
