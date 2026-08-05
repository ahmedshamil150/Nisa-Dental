import { NextResponse } from "next/server"
import { getServiceSupabase } from "@/lib/supabase"
import { requireAdmin } from "@/lib/admin-auth"
import { csrfGuard } from "@/lib/csrf"

export async function GET() {
  try {
    const supabase = getServiceSupabase()
    if (!supabase) {
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 })
    }
    const { data, error } = await supabase.from("site_settings").select("*").order("key")
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json(data || [])
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const auth = await requireAdmin(req)
  if (auth) return auth

  const csrf = csrfGuard(req)
  if (csrf) return csrf

  let key: string
  let value: unknown
  try {
    const body = await req.json()
    key = body.key
    value = body.value
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  if (!key || typeof key !== "string" || value === undefined) {
    return NextResponse.json({ error: "key and value required" }, { status: 400 })
  }

  try {
    const supabase = getServiceSupabase()
    if (!supabase) {
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 })
    }
    const { data: existing } = await supabase.from("site_settings").select("id").eq("key", key).maybeSingle()
    if (existing) {
      const { error } = await supabase.from("site_settings").update({ value }).eq("key", key)
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    } else {
      const { error } = await supabase.from("site_settings").insert({ key, value })
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  const auth = await requireAdmin(req)
  if (auth) return auth

  const csrf = csrfGuard(req)
  if (csrf) return csrf

  try {
    const { searchParams } = new URL(req.url)
    const key = searchParams.get("key")
    if (!key) return NextResponse.json({ error: "key required" }, { status: 400 })

    const supabase = getServiceSupabase()
    if (!supabase) {
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 })
    }
    const { error } = await supabase.from("site_settings").delete().eq("key", key)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
