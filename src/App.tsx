import { BrowserRouter, Routes, Route, Link } from 'react-router'
import { AuthProvider } from './contexts/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import { useAuth } from './contexts/AuthContext'
import { HomePage } from './pages/HomePage'
import { LoginPage } from './pages/LoginPage'
import { ProductsPage } from './pages/ProductsPage'

function Nav() {
  const { user } = useAuth()
  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b bg-white">
      <Link to="/" className="font-bold text-lg">
        Store
      </Link>
      <div className="flex gap-4 items-center">
        <Link to="/products" className="text-sm text-gray-600 hover:text-black">
          Products
        </Link>
        {user ? (
          <span className="text-sm text-gray-500">{user.email}</span>
        ) : (
          <Link
            to="/login"
            className="rounded-lg bg-black px-4 py-1.5 text-white text-sm"
          >
            Sign In
          </Link>
        )}
      </div>
    </nav>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <Nav />
          <main className="max-w-6xl mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route
                path="/products"
                element={
                  <ProtectedRoute>
                    <ProductsPage />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
