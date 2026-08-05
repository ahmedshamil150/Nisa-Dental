import { NextResponse } from "next/server"
import { getServiceSupabase } from "@/lib/supabase"
import { sendOrderConfirmation } from "@/lib/email"
import { randomBytes } from "crypto"
import { csrfGuard } from "@/lib/csrf"

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_RE = /^[\d\s\-\+\(\)]{7,20}$/

function getSetting(settings: any[], key: string, fallback: string) {
  return settings.find((s: any) => s.key === key)?.value || fallback
}

function generateOrderNumber() {
  return "NISA-" + randomBytes(5).toString("hex").toUpperCase()
}

function sanitize(str: string, maxLen = 500): string {
  return str.trim().slice(0, maxLen)
}

export async function POST(req: Request) {
  try {
    const csrf = csrfGuard(req)
    if (csrf) return csrf

    const body = await req.json()
    const customer_name = sanitize(body.customer_name || "", 100)
    const customer_email = sanitize(body.customer_email || "", 254)
    const customer_phone = body.customer_phone ? sanitize(body.customer_phone, 20) : null
    const shipping_address = body.shipping_address
    const coupon_code = body.coupon_code ? sanitize(body.coupon_code, 50).toUpperCase() : null
    const items = body.items
    const subtotal = Number(body.subtotal) || 0
    const delivery = body.delivery != null ? Number(body.delivery) : null
    const total_weight = body.total_weight != null ? Number(body.total_weight) : null

    if (!customer_name || !customer_email || !shipping_address) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (!EMAIL_RE.test(customer_email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 })
    }

    if (customer_phone && !PHONE_RE.test(customer_phone)) {
      return NextResponse.json({ error: "Invalid phone" }, { status: 400 })
    }

    if (!shipping_address.line1 || !shipping_address.city) {
      return NextResponse.json({ error: "Address requires line1 and city" }, { status: 400 })
    }

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 })
    }

    for (const item of items) {
      if (!item.product_id || typeof item.product_id !== "string") {
        return NextResponse.json({ error: "Invalid item: missing product_id" }, { status: 400 })
      }
      const qty = Number(item.quantity)
      const price = Number(item.unit_price)
      if (!Number.isInteger(qty) || qty < 1 || qty > 99) {
        return NextResponse.json({ error: `Invalid quantity for "${item.product_name || "item"}"` }, { status: 400 })
      }
      if (typeof price !== "number" || price <= 0 || price > 999999) {
        return NextResponse.json({ error: `Invalid price for "${item.product_name || "item"}"` }, { status: 400 })
      }
    }

    const supabase = getServiceSupabase()
    if (!supabase) {
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 })
    }

    // Validate stock for each item
    for (const item of items) {
      const { data: product } = await supabase
        .from("products")
        .select("stock_quantity, name")
        .eq("id", item.product_id)
        .single()

      if (!product) {
        return NextResponse.json({ error: `Product "${item.product_name}" not found` }, { status: 400 })
      }

      if (product.stock_quantity < item.quantity) {
        return NextResponse.json({
          error: `Insufficient stock for "${product.name}". Available: ${product.stock_quantity}, requested: ${item.quantity}`
        }, { status: 400 })
      }
    }

    // Fetch settings for delivery rate calculation
    const { data: siteSettings } = await supabase.from("site_settings").select("*")
    const settings = siteSettings || []
    const ratePerKg = parseInt(getSetting(settings, "delivery_rate_per_kg", "150"))
    const taxRate = parseFloat(getSetting(settings, "tax_rate", "0"))

    // Compute delivery from weight if not already computed
    const computedDelivery = delivery || (total_weight ? Math.round(total_weight * ratePerKg * 100) / 100 : 0)
    const tax = Math.round(subtotal * (taxRate / 100) * 100) / 100

    let discount = 0
    let appliedCouponCode: string | null = null

    if (coupon_code) {
      const { data: coupon, error: couponErr } = await supabase
        .from("coupons")
        .select("*")
        .eq("code", coupon_code)
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

      if (coupon.min_order_amount && subtotal < coupon.min_order_amount) {
        return NextResponse.json({ error: `Minimum order PKR ${coupon.min_order_amount} for this coupon` }, { status: 400 })
      }

      discount = coupon.discount_type === "percentage"
        ? subtotal * (coupon.discount_value / 100)
        : coupon.discount_value

      if (discount > subtotal) discount = subtotal
      appliedCouponCode = coupon.code
    }

    const total = subtotal + computedDelivery + tax - discount

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
        shipping_cost: computedDelivery,
        total,
        order_status: "pending",
        payment_status: "pending",
        notes: "",
      })
      .select()
      .single()

    if (orderErr) {
      console.error("Order insert error:", JSON.stringify(orderErr))
      return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
    }

    // Generate random order number
    const order_number = generateOrderNumber()

    // Update order with order number
    await supabase.from("orders").update({
      order_number,
      notes: `Order#${order_number}${appliedCouponCode ? ` | Coupon: ${appliedCouponCode} (-PKR ${discount.toFixed(0)})` : ""}${total_weight ? ` | Weight: ${total_weight}kg` : ""}`,
    }).eq("id", order.id)

    // Deduct stock (best-effort, don't block order if RPC fails)
    try {
      for (const item of items) {
        await supabase.rpc("decrement_stock", { pid: item.product_id, qty: item.quantity })
      }
    } catch (stockErr) {
      console.error("Stock deduction error (non-fatal):", stockErr)
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
        tax_rate: taxRate,
        tax_amount: tax,
        delivery_charge: computedDelivery,
        discount_amount: discount,
        coupon_code: appliedCouponCode,
        total,
        status: "unpaid",
      })
      .select()
      .single()

    if (invErr) {
      console.error("Invoice insert error:", invErr)
    } else {
      await supabase.from("revenue_log").insert({
        invoice_id: invoice.id,
        amount: total,
        source: "online_sale",
        description: `Order ${order_number}`,
      })
    }

    // Send confirmation emails (non-blocking)
    sendOrderConfirmation({ ...order, order_items: orderItems }, order_number).catch(console.error)

    return NextResponse.json({ order_id: order.id, order_number })
  } catch (err) {
    console.error("Checkout error:", err)
    const msg = err instanceof Error ? err.message : "Internal server error"
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
