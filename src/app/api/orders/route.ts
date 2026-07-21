import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function GET(req: Request) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id")

  if (!id) {
    return NextResponse.json({ error: "Order ID required" }, { status: 400 })
  }

  let query = supabase.from("orders").select("*, order_items(*), invoices(*)")

  if (id.startsWith("NISA-")) {
    query = query.ilike("notes", `%Order#${id}%`)
  } else {
    query = query.eq("id", id)
  }

  const { data: order } = await query.limit(1).maybeSingle()

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 })
  }

  const shortId = order.id.toString().replace(/-/g, "").slice(0, 8).toUpperCase()
  const order_number = "NISA-" + shortId

  return NextResponse.json({
    ...order,
    order_number,
    status: order.order_status,
    delivery_charge: order.shipping_cost,
    discount: 0,
  })
}
