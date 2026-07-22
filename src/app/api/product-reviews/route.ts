import { getSupabase } from "@/lib/supabase"
import { NextRequest } from "next/server"

export async function GET(req: NextRequest) {
  const productId = req.nextUrl.searchParams.get("product_id")
  if (!productId) return Response.json([])
  const sb = getSupabase()
  if (!sb) return Response.json([])
  const { data } = await sb.from("product_reviews")
    .select("*")
    .eq("product_id", productId)
    .eq("is_approved", true)
    .order("created_at", { ascending: false })
  return Response.json(data || [])
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const sb = getSupabase()
  if (!sb) return Response.json({ error: "DB not available" }, { status: 500 })
  const { error } = await sb.from("product_reviews").insert({
    product_id: body.product_id,
    customer_name: body.customer_name,
    customer_email: body.customer_email || null,
    rating: body.rating,
    review_text: body.review_text,
  })
  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json({ success: true })
}
