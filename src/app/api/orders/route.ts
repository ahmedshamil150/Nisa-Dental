import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { sendOrderStatusUpdate } from "@/lib/email"
import { requireAdmin } from "@/lib/admin-auth"
import { csrfGuard } from "@/lib/csrf"

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

function normalizeOrderId(raw: string) {
  const upper = raw.trim().toUpperCase().replace(/-/g, "")
  if (upper.startsWith("NISA")) return "NISA-" + upper.slice(4)
  return raw
}

export async function GET(req: Request) {
  const supabase = getSupabase()
  const { searchParams } = new URL(req.url)
  let id = searchParams.get("id")

  if (!id) {
    return NextResponse.json({ error: "Order ID required" }, { status: 400 })
  }

  id = normalizeOrderId(id)

  let query = supabase.from("orders").select("*, order_items(*), invoices(*)")

  if (id.startsWith("NISA-")) {
    query = query.eq("order_number", id)
  } else {
    query = query.eq("id", id)
  }

  const { data: order } = await query.limit(1).maybeSingle()

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 })
  }

  return NextResponse.json({
    ...order,
    order_number: order.order_number,
    status: order.order_status,
    delivery_charge: order.shipping_cost,
  })
}

export async function PATCH(req: Request) {
  const auth = await requireAdmin(req)
  if (auth) return auth

  const csrf = csrfGuard(req)
  if (csrf) return csrf

  const body = await req.json()
  let { id, order_status } = body

  if (!id || !order_status) {
    return NextResponse.json({ error: "id and order_status required" }, { status: 400 })
  }

  id = normalizeOrderId(id)

  const supabase = getSupabase()

  let query = supabase.from("orders").select("id, order_status, order_number")
  if (id.startsWith("NISA-")) {
    query = query.eq("order_number", id)
  } else {
    query = query.eq("id", id)
  }

  const { data: order } = await query.limit(1).maybeSingle()
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 })
  }

  const oldStatus = order.order_status
  const { error } = await (supabase.from("orders") as any).update({ order_status }).eq("id", order.id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (oldStatus !== order_status) {
    sendOrderStatusUpdate(order, order.order_number, oldStatus, order_status).catch(console.error)
  }

  return NextResponse.json({ success: true })
}
