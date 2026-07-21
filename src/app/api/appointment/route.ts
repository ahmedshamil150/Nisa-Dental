import { NextResponse } from "next/server"
import { getSupabase } from "@/lib/supabase"

export async function POST(request: Request) {
  try {
    const supabase = getSupabase()
    if (!supabase) throw new Error("Supabase not configured")
    const formData = await request.formData()
    const patient_name = formData.get("patient_name") as string
    const patient_email = formData.get("patient_email") as string
    const patient_phone = formData.get("patient_phone") as string | null
    const service_id = formData.get("service_id") as string | null
    const appointment_date = formData.get("appointment_date") as string
    const appointment_time = formData.get("appointment_time") as string
    const notes = formData.get("notes") as string | null

    if (!patient_name || !patient_email || !appointment_date || !appointment_time) {
      return NextResponse.redirect(new URL("/appointment?error=missing-fields", request.url))
    }

    const { error } = await supabase.from("appointments").insert([
      {
        patient_name,
        patient_email,
        patient_phone: patient_phone || null,
        service_id: service_id || null,
        appointment_date,
        appointment_time,
        notes: notes || null,
      },
    ] as any)

    if (error) throw error

    return NextResponse.redirect(new URL("/appointment?success=true", request.url))
  } catch (error) {
    console.error("Appointment error:", error)
    return NextResponse.redirect(new URL("/appointment?error=true", request.url))
  }
}
