import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

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

    const supabase = getSupabase()
    let discount = 0
    let appliedCouponCode: string | null = null

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

      if (coupon.max_uses && coupon.used_count >= coupon.max_uses) {
        return NextResponse.json({ error: "Coupon usage limit reached" }, { status: 400 })
      }

      discount = coupon.discount_type === "percentage"
        ? subtotal * (coupon.discount_value / 100)
        : coupon.discount_value

      if (discount > subtotal) discount = subtotal
      appliedCouponCode = coupon.code
    }

    const total = subtotal + delivery + tax - discount

    const order_number = "NISA-" + Date.now().toString(36).slice(-4).toUpperCase() + Math.random().toString(36).slice(2, 6).toUpperCase()

    const { data: order, error: orderErr } = await supabase
      .from("orders")
      .insert({
        customer_name,
        customer_email,
        customer_phone: customer_phone || null,
        shipping_address,
        billing_address: shipping_address,
        subtotal,
        tax,
        shipping_cost: delivery,
        total,
        order_status: "pending",
        payment_status: "pending",
        notes: `Order#${order_number}${appliedCouponCode ? ` | Coupon: ${appliedCouponCode} (-$${discount.toFixed(2)})` : ""}`,
      })
      .select()
      .single()

    if (orderErr) {
      console.error("Order insert error:", JSON.stringify(orderErr))
      return NextResponse.json({ error: "Failed to create order", detail: orderErr.message }, { status: 500 })
    }

    const orderItems = items.map((item: any) => ({
      order_id: order.id,
      product_id: item.product_id,
      product_name: item.product_name,
      quantity: item.quantity,
      unit_price: item.unit_price,
      total_price: item.unit_price * item.quantity,
    }))

    const { error: itemsErr } = await supabase.from("order_items").insert(orderItems)
    if (itemsErr) {
      console.error("Order items insert error:", itemsErr)
      await supabase.from("orders").delete().eq("id", order.id)
      return NextResponse.json({ error: "Failed to save order items" }, { status: 500 })
    }

    if (appliedCouponCode) {
      const { data: coupon } = await supabase.from("coupons").select("used_count").eq("code", appliedCouponCode).single()
      if (coupon) {
        await supabase.from("coupons").update({ used_count: (coupon.used_count || 0) + 1 }).eq("code", appliedCouponCode)
      }
    }

    const { data: invoice, error: invErr } = await supabase
      .from("invoices")
      .insert({
        order_id: order.id,
        invoice_number: "INV-" + order_number,
        subtotal,
        tax_rate: 8.00,
        tax_amount: tax,
        delivery_charge: delivery,
        discount_amount: discount,
        coupon_code: appliedCouponCode,
        total,
        status: "unpaid",
      })
      .select()
      .single()

    if (invErr) {
      console.error("Invoice insert error:", invErr)
      return NextResponse.json({ order_id: order.id, order_number, invoice_error: invErr.message })
    }

    await supabase.from("revenue_log").insert({
      invoice_id: invoice.id,
      amount: total,
      source: "online_sale",
      description: `Order ${order_number}`,
    })

    return NextResponse.json({ order_id: order.id, order_number })
  } catch (err) {
    console.error("Checkout error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
