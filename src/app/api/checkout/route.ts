import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { customer_name, customer_email, customer_phone, shipping_address, coupon_code, items, subtotal, delivery, tax } = body

    if (!customer_name || !customer_email || !shipping_address) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 })
    }

    let discount = 0
    let appliedCouponId: string | null = null

    if (coupon_code) {
      const { data: coupon, error: couponErr } = await supabase
        .from("coupons")
        .select("*")
        .eq("code", coupon_code.toUpperCase())
        .eq("is_active", true)
        .single()

      if (couponErr || !coupon) {
        return NextResponse.json({ error: "Invalid coupon code" }, { status: 400 })
      }

      if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
        return NextResponse.json({ error: "Coupon has expired" }, { status: 400 })
      }

      if (coupon.usage_limit && coupon.used_count >= coupon.usage_limit) {
        return NextResponse.json({ error: "Coupon usage limit reached" }, { status: 400 })
      }

      discount = coupon.discount_type === "percentage"
        ? subtotal * (coupon.discount_value / 100)
        : coupon.discount_value

      if (discount > subtotal) discount = subtotal
      appliedCouponId = coupon.id
    }

    const total = subtotal + delivery + tax - discount

    let order_number: string
    try {
      const { data: on } = await supabase.rpc("generate_order_number")
      order_number = on || "NISA-" + Date.now().toString(36).slice(-4).toUpperCase() + Math.random().toString(36).slice(2, 6).toUpperCase()
    } catch {
      order_number = "NISA-" + Date.now().toString(36).slice(-4).toUpperCase() + Math.random().toString(36).slice(2, 6).toUpperCase()
    }

    const { data: order, error: orderErr } = await supabase
      .from("orders")
      .insert({
        customer_name,
        customer_email,
        customer_phone,
        shipping_address,
        coupon_id: appliedCouponId,
        subtotal,
        delivery_charge: delivery,
        tax,
        discount,
        total,
        status: "pending",
        order_number,
      })
      .select()
      .single()

    if (orderErr) {
      console.error("Order insert error:", orderErr)
      return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
    }

    const orderItems = items.map((item: any) => ({
      order_id: order.id,
      product_id: item.product_id,
      product_name: item.product_name,
      quantity: item.quantity,
      unit_price: item.unit_price,
    }))

    const { error: itemsErr } = await supabase.from("order_items").insert(orderItems)
    if (itemsErr) {
      console.error("Order items insert error:", itemsErr)
      await supabase.from("orders").delete().eq("id", order.id)
      return NextResponse.json({ error: "Failed to save order items" }, { status: 500 })
    }

    if (appliedCouponId) {
      await supabase.rpc("increment_coupon_usage", { coupon_id: appliedCouponId })
    }

    let invoiceNumber = "INV-" + order_number
    const { data: invoice, error: invErr } = await supabase
      .from("invoices")
      .insert({
        order_id: order.id,
        invoice_number: invoiceNumber,
        customer_name,
        customer_email,
        billing_address: shipping_address,
        subtotal,
        delivery_charge: delivery,
        tax,
        discount,
        total,
        status: "unpaid",
      })
      .select()
      .single()

    if (invErr) {
      console.error("Invoice insert error:", invErr)
    }

    await supabase.from("revenue_log").insert({
      order_id: order.id,
      amount: total,
      source: "online_sale",
    })

    return NextResponse.json({ order_id: order.id, order_number })
  } catch (err) {
    console.error("Checkout error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
