import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function GET() {
  const supabase = getSupabase()
  const { data } = await supabase.from("site_settings").select("*").order("key")
  return NextResponse.json(data || [])
}

export async function POST(req: Request) {
  const { key, value } = await req.json()
  if (!key || value === undefined) {
    return NextResponse.json({ error: "key and value required" }, { status: 400 })
  }
  const supabase = getSupabase()
  const { data: existing } = await supabase.from("site_settings").select("id").eq("key", key).maybeSingle()
  if (existing) {
    await supabase.from("site_settings").update({ value }).eq("key", key)
  } else {
    await supabase.from("site_settings").insert({ key, value })
  }
  return NextResponse.json({ success: true })
}
