import { NextResponse } from "next/server"
import { getServiceSupabase } from "@/lib/supabase"

export async function GET() {
  try {
    const supabase = getServiceSupabase()
    if (!supabase) {
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 })
    }
    const { data, error } = await supabase.from("services").select("*").eq("is_active", true).order("sort_order")
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json(data || [])
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
