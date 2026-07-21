"use client"

import { useEffect, useState } from "react"
import { getSupabase } from "@/lib/supabase"

export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState<any[]>([])

  useEffect(() => { loadAppointments() }, [])

  async function loadAppointments() {
    const sb = getSupabase()
    if (!sb) return
    const { data } = await sb.from("appointments").select("*, service:services(*)").order("appointment_date", { ascending: false })
    setAppointments((data || []) as any[])
  }

  async function updateStatus(id: string, status: string) {
    const sb = getSupabase()
    if (!sb) return
    await (sb.from("appointments") as any).update({ status }).eq("id", id)
    loadAppointments()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-headline-lg text-headline-lg text-on-surface">Appointments</h1>
      </div>

      <div className="bg-surface rounded-xl border border-outline-variant/30 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b bg-surface-container text-left text-caption uppercase text-on-surface-variant">
            <tr>
              <th className="px-6 py-3 font-medium">Patient</th>
              <th className="px-6 py-3 font-medium">Service</th>
              <th className="px-6 py-3 font-medium">Date</th>
              <th className="px-6 py-3 font-medium">Time</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium">Contact</th>
              <th className="px-6 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {appointments.length === 0 ? (
              <tr><td colSpan={7} className="px-6 py-12 text-center text-on-surface-variant">No appointments yet</td></tr>
            ) : appointments.map((a: any) => (
              <tr key={a.id} className="hover:bg-surface-container-low">
                <td className="px-6 py-4 font-medium text-on-surface">{a.patient_name}</td>
                <td className="px-6 py-4 text-on-surface-variant">{a.service?.name || "General"}</td>
                <td className="px-6 py-4">{new Date(a.appointment_date).toLocaleDateString()}</td>
                <td className="px-6 py-4">{a.appointment_time?.slice(0, 5)}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    a.status === "confirmed" ? "bg-blue-100 text-blue-800" :
                    a.status === "completed" ? "bg-green-100 text-green-800" :
                    a.status === "cancelled" ? "bg-red-100 text-red-800" :
                    "bg-yellow-100 text-yellow-800"
                  }`}>
                    {a.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-on-surface-variant text-xs">
                  <p>{a.patient_email}</p>
                  {a.patient_phone && <p>{a.patient_phone}</p>}
                </td>
                <td className="px-6 py-4">
                  <select
                    value={a.status}
                    onChange={(e) => updateStatus(a.id, e.target.value)}
                    className="rounded-lg border border-outline-variant bg-surface px-3 py-1.5 text-xs font-label-md focus:border-primary outline-none"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
