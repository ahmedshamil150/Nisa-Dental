import { NextResponse } from "next/server"
import { getSupabase } from "@/lib/supabase"
import { sendAppointmentConfirmation } from "@/lib/email"
import { csrfGuard } from "@/lib/csrf"

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_RE = /^[\d\s\-\+\(\)]{7,20}$/
const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/

function sanitize(str: string, maxLen = 500): string {
  return str.trim().slice(0, maxLen)
}

export async function POST(request: Request) {
  try {
    const csrf = csrfGuard(request)
    if (csrf) return csrf

    const supabase = getSupabase()
    if (!supabase) {
      return NextResponse.json({ error: "Server not configured" }, { status: 500 })
    }

    const formData = await request.formData()
    const patient_name = sanitize((formData.get("patient_name") as string) || "", 100)
    const patient_email = sanitize((formData.get("patient_email") as string) || "", 254)
    const patient_phone = formData.get("patient_phone") ? sanitize(formData.get("patient_phone") as string, 20) : null
    const service_id = formData.get("service_id") ? sanitize(formData.get("service_id") as string, 50) : null
    const appointment_date = sanitize((formData.get("appointment_date") as string) || "", 10)
    const appointment_time = sanitize((formData.get("appointment_time") as string) || "", 5)
    const notes = formData.get("notes") ? sanitize(formData.get("notes") as string, 500) : null

    if (!patient_name || !patient_email || !appointment_date || !appointment_time) {
      return NextResponse.json({ error: "missing-fields" }, { status: 400 })
    }

    if (!EMAIL_RE.test(patient_email)) {
      return NextResponse.json({ error: "invalid-email" }, { status: 400 })
    }

    if (patient_phone && !PHONE_RE.test(patient_phone)) {
      return NextResponse.json({ error: "invalid-phone" }, { status: 400 })
    }

    if (!TIME_RE.test(appointment_time)) {
      return NextResponse.json({ error: "invalid-time" }, { status: 400 })
    }

    const parsed = new Date(appointment_date)
    if (isNaN(parsed.getTime())) {
      return NextResponse.json({ error: "invalid-date" }, { status: 400 })
    }

    const { error, data } = await supabase.from("appointments").insert([
      {
        patient_name,
        patient_email,
        patient_phone: patient_phone || null,
        service_id: service_id || null,
        appointment_date,
        appointment_time,
        notes: notes || null,
      },
    ] as any).select().single()

    if (error) throw error

    // Send confirmation email (non-blocking)
    sendAppointmentConfirmation(data).catch(() => {})

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Appointment error:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}
