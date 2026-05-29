"use client"

import { useOrders, useUpdateOrderStatus } from '@/hooks/queries/useOrders'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'

const statuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'] as const

export default function AdminOrdersPage() {
  const { data: orders, isLoading, error } = useOrders()
  const updateStatus = useUpdateOrderStatus()

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  if (error) {
    return <p className="text-destructive">Failed to load orders: {(error as Error).message}</p>
  }

  const handleStatus = (id: string, status: string) => {
    updateStatus.mutate({ id, status })
  }

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Orders</h2>

      {!orders || orders.length === 0 ? (
        <p className="text-muted-foreground">No orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="border rounded-lg p-4 bg-white space-y-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="font-semibold">{order.customerName}</p>
                  <p className="text-sm text-muted-foreground">{order.customerPhone}</p>
                  <p className="text-sm text-muted-foreground">{order.customerAddress}</p>
                  {order.notes && <p className="text-xs text-muted-foreground italic">Notes: {order.notes}</p>}
                </div>
                <div className="text-right text-sm space-y-1">
                  <p className="font-bold">Rs. {order.total.toFixed(2).replace('.00', '')}</p>
                  <p className="text-xs text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="border-t pt-2 space-y-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Items</p>
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>{item.productName} — {item.variantName} x{item.quantity}</span>
                    <span className="font-medium">Rs. {(item.price * item.quantity).toFixed(2).replace('.00', '')}</span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium uppercase tracking-wider">Status:</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                    order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    order.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                    order.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                    order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {order.status}
                  </span>
                </div>
                <div className="flex gap-1">
                  {statuses.map((s) => (
                    <Button
                      key={s}
                      variant={order.status === s ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleStatus(order.id, s)}
                      disabled={updateStatus.isPending}
                    >
                      {s}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
