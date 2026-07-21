"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useCart } from "@/lib/cart-context"

export default function CheckoutPage() {
  const { items, subtotal, totalWeight, clearCart } = useCart()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const ratePerKg = 150
  const delivery = Math.round(totalWeight * ratePerKg * 100) / 100

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const form = new FormData(e.currentTarget)
    const data = {
      customer_name: form.get("name"),
      customer_email: form.get("email"),
      customer_phone: form.get("phone"),
      shipping_address: {
        line1: form.get("address"),
        city: form.get("city"),
        state: form.get("state"),
        zip: form.get("zip"),
      },
      coupon_code: form.get("coupon") || "",
      items: items.map((i) => ({
        product_id: i.id,
        product_name: i.name,
        quantity: i.quantity,
        unit_price: i.price,
      })),
      subtotal,
      delivery,
      total_weight: totalWeight,
    }

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      const result = await res.json()
      if (!res.ok) {
        setError(result.error || "Something went wrong")
        setLoading(false)
        return
      }

      clearCart()
      router.push(`/track/${result.order_number}`)
    } catch (err) {
      console.error("Checkout error:", err)
      setError("Something went wrong. Check the console for details.")
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-margin-mobile md:px-margin-desktop py-section-gap text-center">
        <span className="material-symbols-outlined text-[64px] text-outline-variant">shopping_cart</span>
        <p className="font-body-lg text-on-surface-variant mt-4 mb-8">Your cart is empty</p>
        <Link href="/shop" className="bg-primary text-on-primary px-8 py-4 rounded-lg font-label-md text-label-md hover:bg-primary/90 transition-all">
          Browse Products
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-margin-mobile md:px-margin-desktop py-section-gap">
      <h1 className="font-headline-lg text-headline-lg text-on-surface mb-8">Checkout</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-12 lg:grid-cols-5">
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-surface p-8 rounded-xl border border-outline-variant/30">
              <h2 className="font-headline-md text-headline-md text-on-surface mb-6">Shipping Information</h2>
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="font-label-md text-label-md text-on-surface block mb-1">Full Name *</label>
                  <input name="name" required className="w-full rounded-lg border border-outline-variant bg-surface px-4 py-3 font-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none" placeholder="John Doe" />
                </div>
                <div>
                  <label className="font-label-md text-label-md text-on-surface block mb-1">Email *</label>
                  <input name="email" type="email" required className="w-full rounded-lg border border-outline-variant bg-surface px-4 py-3 font-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none" placeholder="john@email.com" />
                </div>
                <div>
                  <label className="font-label-md text-label-md text-on-surface block mb-1">Phone</label>
                  <input name="phone" className="w-full rounded-lg border border-outline-variant bg-surface px-4 py-3 font-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none" placeholder="(555) 123-4567" />
                </div>
                <div className="sm:col-span-2">
                  <label className="font-label-md text-label-md text-on-surface block mb-1">Address *</label>
                  <input name="address" required className="w-full rounded-lg border border-outline-variant bg-surface px-4 py-3 font-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none" placeholder="House 123, Street 4" />
                </div>
                <div>
                  <label className="font-label-md text-label-md text-on-surface block mb-1">City *</label>
                  <input name="city" required className="w-full rounded-lg border border-outline-variant bg-surface px-4 py-3 font-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none" placeholder="Karachi" />
                </div>
                <div>
                  <label className="font-label-md text-label-md text-on-surface block mb-1">State *</label>
                  <input name="state" required className="w-full rounded-lg border border-outline-variant bg-surface px-4 py-3 font-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none" placeholder="Sindh" />
                </div>
                <div>
                  <label className="font-label-md text-label-md text-on-surface block mb-1">ZIP Code *</label>
                  <input name="zip" required className="w-full rounded-lg border border-outline-variant bg-surface px-4 py-3 font-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none" placeholder="74000" />
                </div>
                <div>
                  <label className="font-label-md text-label-md text-on-surface block mb-1">Coupon Code</label>
                  <input name="coupon" className="w-full rounded-lg border border-outline-variant bg-surface px-4 py-3 font-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none uppercase" placeholder="NISAXMAS" />
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-surface p-8 rounded-xl border border-outline-variant/30">
              <h2 className="font-headline-md text-headline-md text-on-surface mb-6">Order Summary</h2>
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-on-surface-variant truncate mr-4">{item.name} x{item.quantity}</span>
                    <span className="font-medium">PKR {item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
              <hr className="my-4 border-outline-variant/30" />
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-on-surface-variant">Subtotal</span><span>PKR {subtotal}</span></div>
                <div className="flex justify-between"><span className="text-on-surface-variant">Delivery ({totalWeight.toFixed(2)}kg × PKR {ratePerKg}/kg)</span><span>PKR {delivery}</span></div>
                <div className="border-t pt-3 flex justify-between font-headline-md text-headline-md text-on-surface">
                  <span>Total</span><span>PKR {subtotal + delivery}</span>
                </div>
              </div>

              {error && (
                <div className="mt-4 p-3 rounded-lg bg-error-container text-on-error-container text-sm flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">error</span>
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-on-primary py-4 rounded-lg font-label-md text-label-md hover:bg-primary/90 active:scale-95 transition-all flex items-center justify-center gap-2 mt-6 disabled:opacity-50"
              >
                {loading ? (
                  <>Processing...</>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[20px]">lock</span>
                    Place Order — PKR {subtotal + delivery}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
