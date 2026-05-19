import { Link } from 'react-router'

export const HomePage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-6">
      <h1 className="text-4xl font-bold">Welcome to the Store</h1>
      <p className="text-gray-500 max-w-md">
        Browse our products or log in as an admin to manage inventory.
      </p>
      <div className="flex gap-4">
        <Link
          to="/products"
          className="rounded-lg bg-black px-6 py-2 text-white"
        >
          Browse Products
        </Link>
        <Link
          to="/login"
          className="rounded-lg border border-gray-300 px-6 py-2"
        >
          Admin Login
        </Link>
      </div>
    </div>
  )
}
