import { getSupabase } from "@/lib/supabase"
import { NextRequest } from "next/server"

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q") || ""
  if (q.length < 2) return Response.json([])
  const sb = getSupabase()
  if (!sb) return Response.json([])
  const { data } = await sb.from("products")
    .select("name")
    .eq("is_active", true)
    .ilike("name", `%${q}%`)
    .order("name")
    .limit(8)
  return Response.json((data || []).map((d: any) => d.name))
}
