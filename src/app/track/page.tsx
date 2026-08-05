"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function TrackOrderLookupPage() {
  const router = useRouter()
  const [orderNumber, setOrderNumber] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  function normalizeOrderNumber(raw: string) {
    const upper = raw.trim().toUpperCase().replace(/-/g, "")
    if (upper.startsWith("NISA")) return "NISA-" + upper.slice(4)
    return raw.trim().toUpperCase()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const val = normalizeOrderNumber(orderNumber)
    if (!val || val === "NISA-") {
      setError("Please enter a valid order number")
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`/api/orders?id=${encodeURIComponent(val)}`)
      if (!res.ok) {
        setError("Order not found. Please check your order number.")
        setLoading(false)
        return
      }
      const data = await res.json()
      router.push(`/track/${data.order_number}`)
    } catch {
      setError("Something went wrong. Please try again.")
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-margin-mobile md:px-margin-desktop py-section-gap max-w-xl">
      <div className="text-center mb-10">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <span className="material-symbols-outlined text-[48px] text-primary">local_shipping</span>
        </div>
        <h1 className="font-headline-lg text-headline-lg text-on-surface mb-2">Track Your Order</h1>
        <p className="font-body-lg text-on-surface-variant">
          Enter your order number (e.g., NISA-A1B2C3D4E5) to track its status.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-surface p-8 rounded-xl border border-outline-variant/30">
        <div className="mb-6">
          <label className="font-label-md text-label-md text-on-surface block mb-2">Order Number</label>
          <input
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value.toUpperCase())}
            placeholder="NISA-A1B2C3D4E5"
            className="w-full rounded-lg border border-outline-variant bg-surface px-4 py-4 font-headline-md text-headline-md focus:border-primary focus:ring-1 focus:ring-primary outline-none text-center tracking-widest"
            maxLength={15}
          />
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-error-container text-on-error-container text-sm flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">error</span>
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-on-primary py-4 rounded-lg font-label-md text-label-md hover:bg-primary/90 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            "Searching..."
          ) : (
            <>
              <span className="material-symbols-outlined text-[20px]">search</span>
              Track Order
            </>
          )}
        </button>
      </form>

      <div className="mt-8 p-6 rounded-xl border border-outline-variant/30 bg-surface">
        <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2">Need Help?</h3>
        <p className="font-body-md text-on-surface-variant mb-4">
          If you don&apos;t have your order number, please check your order confirmation email or contact us.
        </p>
        <Link href="/contact" className="text-primary font-label-md text-label-md hover:underline inline-flex items-center gap-1">
          Contact Us
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </Link>
      </div>
    </div>
  )
}
