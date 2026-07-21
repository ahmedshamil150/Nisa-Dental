"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"

const STATUS_STEPS = [
  { key: "pending", label: "Order Placed", icon: "receipt_long" },
  { key: "processing", label: "Processing", icon: "manufacturing" },
  { key: "shipped", label: "Shipped", icon: "local_shipping" },
  { key: "delivered", label: "Delivered", icon: "check_circle" },
]

export default function OrderConfirmationPage() {
  const params = useParams()
  const [order, setOrder] = useState<any>(null)

  useEffect(() => {
    fetch(`/api/orders?id=${params.id}`)
      .then((r) => r.json())
      .then(setOrder)
      .catch(console.error)
  }, [params.id])

  if (!order) {
    return (
      <div className="container mx-auto px-margin-mobile md:px-margin-desktop py-section-gap text-center">
        <p className="font-body-lg text-on-surface-variant">Loading...</p>
      </div>
    )
  }

  const currentStep = STATUS_STEPS.findIndex((s) => s.key === order.status) + 1

  return (
    <div className="container mx-auto px-margin-mobile md:px-margin-desktop py-section-gap max-w-2xl">
      <div className="text-center mb-10">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <span className="material-symbols-outlined text-[48px] text-primary">check_circle</span>
        </div>
        <h1 className="font-headline-lg text-headline-lg text-on-surface mb-2">Order Confirmed!</h1>
        <p className="font-body-lg text-on-surface-variant mb-2">Thank you for your purchase, {order.customer_name}.</p>
        <p className="font-label-md text-label-md text-primary">
          Order Number: <span className="font-bold">{order.order_number}</span>
        </p>
      </div>

      <div className="bg-surface p-8 rounded-xl border border-outline-variant/30 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-headline-md text-headline-md text-on-surface">Order Items</h2>
          <Link
            href={`/track/${order.order_number}`}
            className="font-label-md text-label-md text-primary hover:underline flex items-center gap-1"
          >
            Track Order
            <span className="material-symbols-outlined text-[18px]">open_in_new</span>
          </Link>
        </div>
        <div className="space-y-3 mb-6">
          {order.order_items?.map((item: any) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span className="text-on-surface-variant">{item.product_name} x{item.quantity}</span>
              <span className="font-medium">${(item.unit_price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>
        <hr className="border-outline-variant/30 mb-4" />
        <div className="space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-on-surface-variant">Subtotal</span><span>${order.subtotal?.toFixed(2)}</span></div>
          <div className="flex justify-between"><span className="text-on-surface-variant">Delivery</span><span>${order.delivery_charge?.toFixed(2)}</span></div>
          <div className="flex justify-between"><span className="text-on-surface-variant">Tax</span><span>${order.tax?.toFixed(2)}</span></div>
          {order.discount > 0 && (
            <div className="flex justify-between text-primary"><span>Discount</span><span>-${order.discount?.toFixed(2)}</span></div>
          )}
          <div className="border-t pt-2 flex justify-between font-headline-md text-headline-md text-on-surface">
            <span>Total</span><span>${order.total?.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="bg-surface p-8 rounded-xl border border-outline-variant/30 mb-8">
        <h2 className="font-headline-md text-headline-md text-on-surface mb-4">Shipping Address</h2>
        {order.shipping_address && (
          <p className="font-body-md text-on-surface-variant">
            {order.shipping_address.line1}<br />
            {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.zip}
          </p>
        )}
      </div>

      <div className="text-center">
        <Link
          href="/shop"
          className="bg-primary text-on-primary px-8 py-4 rounded-lg font-label-md text-label-md hover:bg-primary/90 transition-all inline-flex items-center gap-2"
        >
          Continue Shopping
          <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
        </Link>
      </div>
    </div>
  )
}
