import { NextResponse } from "next/server"
import { getSupabase } from "@/lib/supabase"
import { sendAppointmentConfirmation } from "@/lib/email"

export async function POST(request: Request) {
  try {
    const supabase = getSupabase()
    if (!supabase) {
      return NextResponse.json({ error: "Server not configured" }, { status: 500 })
    }

    const formData = await request.formData()
    const patient_name = formData.get("patient_name") as string
    const patient_email = formData.get("patient_email") as string
    const patient_phone = formData.get("patient_phone") as string | null
    const service_id = formData.get("service_id") as string | null
    const appointment_date = formData.get("appointment_date") as string
    const appointment_time = formData.get("appointment_time") as string
    const notes = formData.get("notes") as string | null

    if (!patient_name || !patient_email || !appointment_date || !appointment_time) {
      return NextResponse.json({ error: "missing-fields" }, { status: 400 })
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
