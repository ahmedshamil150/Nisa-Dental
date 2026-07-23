import { NextResponse } from "next/server"
import { getSupabase } from "@/lib/supabase"

export async function POST(request: Request) {
  try {
    const supabase = getSupabase()
    if (!supabase) throw new Error("Supabase not configured")
    const formData = await request.formData()
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const phone = formData.get("phone") as string | null
    const subject = formData.get("subject") as string | null
    const message = formData.get("message") as string

    if (!name || !email || !message) {
      return NextResponse.json({ success: false, error: "missing-fields" })
    }

    const { error } = await supabase.from("contacts").insert([
      { name, email, phone, subject, message },
    ] as any)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Contact form error:", error)
    return NextResponse.json({ success: false, error: "server-error" })
  }
}
