import { QueryClientProvider } from '@/components/providers/QueryClientProvider'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider>
      <div className="min-h-screen bg-gray-50">
        <main className="max-w-6xl mx-auto px-4 py-8">
          {children}
        </main>
      </div>
    </QueryClientProvider>
  )
}
