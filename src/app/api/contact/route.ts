import { NextResponse } from "next/server"
import { getSupabase } from "@/lib/supabase"
import { csrfGuard } from "@/lib/csrf"

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_RE = /^[\d\s\-\+\(\)]{7,20}$/

function sanitize(str: string, maxLen = 500): string {
  return str.trim().slice(0, maxLen)
}

export async function POST(request: Request) {
  try {
    const csrf = csrfGuard(request)
    if (csrf) return csrf

    const supabase = getSupabase()
    if (!supabase) throw new Error("Supabase not configured")
    const formData = await request.formData()
    const name = sanitize((formData.get("name") as string) || "", 100)
    const email = sanitize((formData.get("email") as string) || "", 254)
    const phone = formData.get("phone") ? sanitize(formData.get("phone") as string, 20) : null
    const subject = formData.get("subject") ? sanitize(formData.get("subject") as string, 200) : null
    const message = sanitize((formData.get("message") as string) || "", 2000)

    if (!name || !email || !message) {
      return NextResponse.json({ success: false, error: "missing-fields" })
    }

    if (!EMAIL_RE.test(email)) {
      return NextResponse.json({ success: false, error: "invalid-email" })
    }

    if (phone && !PHONE_RE.test(phone)) {
      return NextResponse.json({ success: false, error: "invalid-phone" })
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
