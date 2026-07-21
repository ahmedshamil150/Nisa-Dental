import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function GET(req: Request) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id") || searchParams.get("order_number")

  if (!id) {
    return NextResponse.json({ error: "Order ID or number required" }, { status: 400 })
  }

  const { data: order } = await supabase
    .from("orders")
    .select("*, order_items(*), invoices(*)")
    .or(`id.eq.${id},order_number.eq.${id}`)
    .single()

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 })
  }

  return NextResponse.json(order)
}
