import { getSupabase } from "@/lib/supabase"
import { csrfGuard } from "@/lib/csrf"
import { NextRequest } from "next/server"

export async function GET(req: NextRequest) {
  const productId = req.nextUrl.searchParams.get("product_id")
  if (!productId) return Response.json([])
  const sb = getSupabase()
  if (!sb) return Response.json([])
  const { data, error } = await sb.from("product_reviews")
    .select("*")
    .eq("product_id", productId)
    .eq("is_approved", true)
    .order("created_at", { ascending: false })
  if (error) return Response.json([])
  return Response.json(data || [])
}

export async function POST(req: NextRequest) {
  const csrf = csrfGuard(req)
  if (csrf) return csrf

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  const productId = typeof body?.product_id === "string" ? body.product_id : ""
  const customerName = typeof body?.customer_name === "string" ? body.customer_name.trim() : ""
  const reviewText = typeof body?.review_text === "string" ? body.review_text.trim() : ""
  const rating = Number(body?.rating)

  if (!productId || !customerName || !reviewText) {
    return Response.json({ error: "product_id, customer_name and review_text are required" }, { status: 400 })
  }
  if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
    return Response.json({ error: "rating must be between 1 and 5" }, { status: 400 })
  }
  if (reviewText.length > 2000 || customerName.length > 120) {
    return Response.json({ error: "Review text or customer name too long" }, { status: 400 })
  }

  const sb = getSupabase()
  if (!sb) return Response.json({ error: "DB not available" }, { status: 500 })

  const { error } = await (sb.from("product_reviews") as any).insert({
    product_id: productId,
    customer_name: customerName,
    customer_email: typeof body?.customer_email === "string" ? body.customer_email.trim().slice(0, 254) || null : null,
    rating: Math.round(rating),
    review_text: reviewText,
  })
  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json({ success: true })
}
