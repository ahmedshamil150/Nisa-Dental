"use client"

import Link from "next/link"
import { useCart } from "@/lib/cart-context"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal, totalWeight, itemCount } = useCart()
  const [couponCode, setCouponCode] = useState("")
  const [couponMsg, setCouponMsg] = useState("")
  const router = useRouter()

  const ratePerKg = 150
  const delivery = Math.round(totalWeight * ratePerKg * 100) / 100

  return (
    <div className="container mx-auto px-margin-mobile md:px-margin-desktop py-section-gap">
      <h1 className="font-headline-lg text-headline-lg text-on-surface mb-8">Shopping Cart</h1>

      {items.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed border-outline-variant/30 rounded-xl">
          <span className="material-symbols-outlined text-[64px] text-outline-variant">shopping_cart</span>
          <p className="font-body-lg text-on-surface-variant mt-4 mb-8">Your cart is empty</p>
          <Link href="/shop" className="bg-primary text-on-primary px-8 py-4 rounded-lg font-label-md text-label-md hover:bg-primary/90 transition-all">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="bg-surface p-4 md:p-6 rounded-xl border border-outline-variant/30">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-lg bg-surface-container-low flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-outline-variant/50">inventory_2</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <Link href={`/shop/${item.slug}`} className="font-label-lg md:font-headline-md text-label-lg md:text-headline-md text-on-surface hover:text-primary transition-colors line-clamp-2">
                        {item.name}
                      </Link>
                      <button onClick={() => removeItem(item.id)} className="text-on-surface-variant hover:text-error transition-colors shrink-0 md:hidden">
                        <span className="material-symbols-outlined text-[20px]">delete</span>
                      </button>
                    </div>
                    <p className="font-label-md md:font-headline-md text-label-md md:text-headline-md text-primary mt-1">PKR {item.price}</p>
                  </div>
                  <button onClick={() => removeItem(item.id)} className="text-on-surface-variant hover:text-error transition-colors shrink-0 hidden md:block">
                    <span className="material-symbols-outlined">delete</span>
                  </button>
                </div>
                <div className="flex items-center justify-between mt-4 md:mt-3 pl-0 md:pl-24">
                  <div className="flex items-center gap-3">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 rounded-lg border border-outline-variant flex items-center justify-center hover:bg-surface-container transition-colors">
                      <span className="material-symbols-outlined text-[18px]">remove</span>
                    </button>
                    <span className="font-label-md text-label-md w-8 text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 rounded-lg border border-outline-variant flex items-center justify-center hover:bg-surface-container transition-colors">
                      <span className="material-symbols-outlined text-[18px]">add</span>
                    </button>
                  </div>
                  <p className="font-label-lg md:font-headline-md text-label-lg md:text-headline-md text-on-surface">PKR {item.price * item.quantity}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-surface p-8 rounded-xl border border-outline-variant/30 h-fit">
            <h2 className="font-headline-md text-headline-md text-on-surface mb-6">Order Summary</h2>
      <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-on-surface-variant">Subtotal</span><span className="font-medium">PKR {subtotal}</span></div>
                <div className="flex justify-between"><span className="text-on-surface-variant">Delivery ({totalWeight.toFixed(2)}kg × PKR {ratePerKg}/kg)</span><span className="font-medium">PKR {delivery}</span></div>
                <div className="flex justify-between"><span className="text-on-surface-variant">Total</span><span className="font-headline-md text-headline-md text-primary">PKR {subtotal + delivery}</span></div>
              </div>

            <hr className="my-6 border-outline-variant/30" />

            <div className="mb-6">
              <label className="font-label-md text-label-md text-on-surface block mb-2">Coupon Code</label>
              <div className="flex gap-2">
                <input
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="ENTER CODE"
                  className="flex-1 rounded-lg border border-outline-variant bg-surface px-4 py-3 font-label-md text-label-md uppercase focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                />
                <button className="bg-primary text-on-primary px-4 rounded-lg font-label-md text-label-md hover:bg-primary/90 transition-all">
                  Apply
                </button>
              </div>
              {couponMsg && <p className="text-caption mt-2 text-primary">{couponMsg}</p>}
            </div>

            <button
              onClick={() => router.push("/checkout")}
              className="w-full bg-primary text-on-primary py-4 rounded-lg font-label-md text-label-md hover:bg-primary/90 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              Proceed to Checkout
              <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
            </button>
            <Link href="/shop" className="block text-center text-primary font-label-md text-label-md mt-4 hover:underline">
              Continue Shopping
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
