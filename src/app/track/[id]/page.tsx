"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"

const STATUS_STEPS = [
  { key: "pending", label: "Order Placed", icon: "receipt_long", desc: "Your order has been received" },
  { key: "confirmed", label: "Confirmed", icon: "fact_check", desc: "Your order has been confirmed" },
  { key: "shipped", label: "Shipped", icon: "local_shipping", desc: "Your order is on the way" },
  { key: "delivered", label: "Delivered", icon: "check_circle", desc: "Package delivered successfully" },
  { key: "cancelled", label: "Cancelled", icon: "cancel", desc: "Order was cancelled" },
  { key: "requested_return", label: "Return Requested", icon: "assignment_return", desc: "Return has been requested" },
]

export default function TrackOrderPage() {
  const params = useParams()
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)

    useEffect(() => {
    if (!params.id) return
    fetch(`/api/orders?id=${params.id}`)
      .then((r) => r.json())
      .then(setOrder)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [params.id])

  const handleCancel = async () => {
    if (!confirm("Are you sure you want to cancel this order?")) return
    const res = await fetch("/api/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: params.id, order_status: "cancelled" }),
    })
    if (res.ok) {
      setOrder((prev: any) => ({ ...prev, status: "cancelled" }))
    }
  }

  const handleReturn = async () => {
    if (!confirm("Request a return for this order?")) return
    const res = await fetch("/api/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: params.id, order_status: "requested_return" }),
    })
    if (res.ok) {
      setOrder((prev: any) => ({ ...prev, status: "requested_return" }))
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-margin-mobile md:px-margin-desktop py-section-gap text-center">
        <p className="font-body-lg text-on-surface-variant">Loading...</p>
      </div>
    )
  }

  if (!order) {
    return <div className="container mx-auto px-margin-mobile md:px-margin-desktop py-section-gap">
      <div className="text-center py-20">
        <span className="material-symbols-outlined text-[64px] text-outline-variant">search_off</span>
        <p className="font-body-lg text-on-surface-variant mt-4">Order not found</p>
        <Link href="/track" className="text-primary font-label-md text-label-md mt-4 inline-block hover:underline">Try again</Link>
      </div>
    </div>
  }

  const isCancelled = order.status === "cancelled"
  const isReturnRequested = order.status === "requested_return"
  const currentIdx = STATUS_STEPS.findIndex((s) => s.key === order.status)

  const activeSteps = isCancelled
    ? STATUS_STEPS.filter((s) => s.key === "cancelled")
    : isReturnRequested
      ? STATUS_STEPS.filter((s) => ["pending", "confirmed", "requested_return"].includes(s.key))
      : STATUS_STEPS.slice(0, 4)

  return (
    <div className="container mx-auto px-margin-mobile md:px-margin-desktop py-section-gap max-w-2xl">
      <h1 className="font-headline-lg text-headline-lg text-on-surface mb-2">Order Tracking</h1>
      <p className="font-body-lg text-on-surface-variant mb-8">
        Order <span className="font-bold text-primary">{order.order_number}</span>
      </p>

      <div className="bg-surface p-8 rounded-xl border border-outline-variant/30 mb-8">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-headline-md text-headline-md text-on-surface">Status</h2>
          <span className={`px-4 py-1.5 rounded-full font-label-sm text-label-sm ${
            isCancelled || isReturnRequested ? "bg-error-container text-on-error-container" : "bg-primary/10 text-primary"
          }`}>
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </span>
        </div>

        <div className="relative mt-8">
          <div className="absolute left-[19px] top-0 bottom-0 w-0.5 bg-outline-variant/30" />

          <div className="space-y-8">
            {activeSteps.map((step, idx) => {
              const isCompleted = !isCancelled && !isReturnRequested && idx <= currentIdx
              const isCurrent = !isCancelled && idx === currentIdx

              return (
                <div key={step.key} className="flex items-start gap-4 relative">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 relative z-10 transition-all ${
                    isCompleted
                      ? "bg-primary text-on-primary"
                      : (isCancelled && step.key === "cancelled") || (isReturnRequested && step.key === "requested_return")
                        ? "bg-error-container text-on-error-container"
                        : "bg-surface-container-low text-outline-variant"
                  }`}>
                    <span className="material-symbols-outlined text-[20px]">{step.icon}</span>
                  </div>
                  <div className="pt-1.5">
                    <p className={`font-headline-md text-headline-md ${
                      isCurrent ? "text-primary font-bold" : isCompleted ? "text-on-surface" : "text-outline-variant"
                    }`}>{step.label}</p>
                    <p className={`font-body-md ${isCompleted ? "text-on-surface-variant" : "text-outline-variant"}`}>
                      {isCancelled && step.key === "cancelled" ? "Order was cancelled" : isReturnRequested && step.key === "requested_return" ? "Return requested by customer" : step.desc}
                    </p>
                    {isCurrent && order.status === "pending" && (
                      <div className="mt-3 flex gap-3">
                        <button onClick={handleCancel} className="bg-error text-on-error px-4 py-2 rounded-lg font-label-sm text-label-sm hover:bg-error/90 transition-all inline-flex items-center gap-1">
                          <span className="material-symbols-outlined text-[16px]">cancel</span>
                          Cancel Order
                        </button>
                      </div>
                    )}
                    {isCurrent && order.status === "confirmed" && (
                      <div className="mt-3 flex gap-3">
                        <button onClick={handleReturn} className="bg-error text-on-error px-4 py-2 rounded-lg font-label-sm text-label-sm hover:bg-error/90 transition-all inline-flex items-center gap-1">
                          <span className="material-symbols-outlined text-[16px]">assignment_return</span>
                          Request Return
                        </button>
                      </div>
                    )}
                    {(isCurrent || order.status !== "pending") && (
                      <div className="mt-3">
                        <Link
                          href={order.invoices?.[0]?.id ? `/api/invoice/${order.invoices[0].id}` : "#"}
                          className="bg-primary text-on-primary px-4 py-2 rounded-lg font-label-sm text-label-sm hover:bg-primary/90 transition-all inline-flex items-center gap-1"
                        >
                          <span className="material-symbols-outlined text-[16px]">download</span>
                          Download Invoice
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="bg-surface p-8 rounded-xl border border-outline-variant/30 mb-8">
        <h2 className="font-headline-md text-headline-md text-on-surface mb-4">Order Details</h2>
        <div className="space-y-3">
          {order.order_items?.map((item: any) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span className="text-on-surface-variant">{item.product_name} x{item.quantity}</span>
              <span className="font-medium">PKR {item.unit_price * item.quantity}</span>
            </div>
          ))}
        </div>
        <hr className="my-4 border-outline-variant/30" />
        <div className="space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-on-surface-variant">Subtotal</span><span>PKR {order.subtotal}</span></div>
          <div className="flex justify-between"><span className="text-on-surface-variant">Delivery</span><span>PKR {order.delivery_charge}</span></div>
          {order.discount > 0 && (
            <div className="flex justify-between text-primary"><span>Discount</span><span>-PKR {order.discount}</span></div>
          )}
          <div className="border-t pt-2 flex justify-between font-headline-md text-headline-md text-on-surface">
            <span>Total</span><span>PKR {order.total}</span>
          </div>
        </div>
      </div>

      <div className="bg-surface p-8 rounded-xl border border-outline-variant/30">
        <h2 className="font-headline-md text-headline-md text-on-surface mb-4">Shipping To</h2>
        <p className="font-body-md text-on-surface-variant">{order.customer_name}</p>
        <p className="font-body-md text-on-surface-variant">{order.customer_email}</p>
        {order.shipping_address && (
          <p className="font-body-md text-on-surface-variant mt-2">
            {order.shipping_address.line1}<br />
            {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.zip}
          </p>
        )}
      </div>
    </div>
  )
}
