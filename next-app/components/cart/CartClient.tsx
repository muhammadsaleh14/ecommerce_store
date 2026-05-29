"use client"

import { useState } from 'react'
import { useCart } from '@/lib/context/cart'
import { placeOrder } from '@/lib/actions/order'
import Link from 'next/link'
import { Trash2, Minus, Plus } from 'lucide-react'

export function CartClient() {
  const { items, total, updateQuantity, removeItem, clearCart } = useCart()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [orderId, setOrderId] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (items.length === 0) return
    setSubmitting(true)
    setError('')
    try {
      const result = await placeOrder({
        customerName: name,
        customerPhone: phone,
        customerAddress: address,
        notes,
        items: items.map((i) => ({
          productId: i.productId,
          variantId: i.variantId,
          productName: i.productName,
          variantName: i.variantName,
          price: i.price,
          quantity: i.quantity,
          imageUrl: i.imageUrl,
        })),
      })
      setOrderId(result.orderId)
      clearCart()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to place order')
    } finally {
      setSubmitting(false)
    }
  }

  if (orderId) {
    return (
      <section className="px-[10%] py-16 text-center">
        <div className="max-w-md mx-auto bg-white border-2 border-black p-8 shadow-[6px_6px_0px_#000]">
          <h1 className="font-['Playfair_Display',_serif] text-2xl font-bold mb-2">Order Placed!</h1>
          <p className="text-sm mb-4">Your order has been placed successfully. You will receive a confirmation call shortly.</p>
          <p className="text-xs font-bold uppercase mb-6">Order ID: {orderId.slice(0, 8)}</p>
          <Link
            href="/products"
            className="inline-block bg-[#FF006E] text-white px-6 py-3 font-bold uppercase tracking-wider text-xs border-2 border-black shadow-[4px_4px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all"
          >
            Continue Shopping
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className="px-[10%] py-12">
      <h1 className="font-['Playfair_Display',_serif] text-2xl sm:text-3xl font-bold mb-8">Cart</h1>

      {items.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-black/60 mb-6">Your cart is empty.</p>
          <Link
            href="/products"
            className="inline-block bg-[#FF006E] text-white px-6 py-3 font-bold uppercase tracking-wider text-xs border-2 border-black shadow-[4px_4px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.variantId}
                className="bg-white border-2 border-black p-4 flex gap-4 shadow-[4px_4px_0px_#000]"
              >
                <div
                  className="w-24 h-24 shrink-0 border-2 border-black bg-cover bg-center"
                  style={{ backgroundImage: item.imageUrl ? `url('${item.imageUrl}')` : undefined }}
                >
                  {!item.imageUrl && (
                    <div className="w-full h-full flex items-center justify-center bg-neutral-200 text-black/40 text-[10px] font-bold uppercase">
                      No Image
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-['Playfair_Display',_serif] font-bold text-sm">{item.productName}</h3>
                  <p className="text-xs text-black/60 mt-0.5">{item.variantName}</p>
                  <p className="text-sm font-bold mt-1" style={{ color: '#FF006E' }}>
                    Rs. {item.price.toFixed(2).replace('.00', '')}
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center border-2 border-black">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                        className="p-1 hover:bg-neutral-100"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="px-3 text-xs font-bold">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                        className="p-1 hover:bg-neutral-100"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(item.variantId)}
                      className="p-1 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="text-right text-sm font-bold shrink-0">
                  Rs. {(item.price * item.quantity).toFixed(2).replace('.00', '')}
                </div>
              </div>
            ))}
          </div>

          <div>
            <div className="bg-white border-2 border-black p-6 shadow-[4px_4px_0px_#000]">
              <h2 className="font-['Playfair_Display',_serif] text-lg font-bold mb-4">Checkout</h2>
              <div className="text-sm font-bold mb-4 pb-4 border-b-2 border-black flex justify-between">
                <span>Total</span>
                <span style={{ color: '#FF006E' }}>Rs. {total.toFixed(2).replace('.00', '')}</span>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label className="text-[10px] font-bold uppercase block mb-1">Full Name</label>
                  <input
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border-2 border-black p-2 text-sm bg-transparent"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase block mb-1">Phone Number</label>
                  <input
                    required
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full border-2 border-black p-2 text-sm bg-transparent"
                    placeholder="03XX-XXXXXXX"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase block mb-1">Delivery Address</label>
                  <textarea
                    required
                    rows={3}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full border-2 border-black p-2 text-sm bg-transparent resize-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase block mb-1">Notes (optional)</label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full border-2 border-black p-2 text-sm bg-transparent resize-none"
                    placeholder="e.g. landmark, preferred delivery time"
                  />
                </div>

                {error && <p className="text-xs text-red-600 font-bold">{error}</p>}

                <p className="text-[10px] font-bold uppercase text-center pt-2">Payment: Cash on Delivery</p>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-[#FF006E] text-white px-6 py-3 font-bold uppercase tracking-wider text-xs border-2 border-black shadow-[4px_4px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all disabled:opacity-50"
                >
                  {submitting ? 'Placing Order...' : 'Place Order'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
