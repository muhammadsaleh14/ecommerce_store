import { QueryClientProvider } from '@/components/providers/QueryClientProvider'
import { AdminShell } from '@/components/admin/AdminShell'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider>
      <AdminShell>{children}</AdminShell>
    </QueryClientProvider>
  )
}
