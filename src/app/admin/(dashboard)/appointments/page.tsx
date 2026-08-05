"use client"

import { useEffect, useState, useMemo } from "react"
import { getSupabase } from "@/lib/supabase"
import { Pagination } from "@/components/ui/Pagination"

const STATUSES = ["", "pending", "confirmed", "completed", "cancelled"]

export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState<any[]>([])
  const [filterStatus, setFilterStatus] = useState("")
  const [page, setPage] = useState(1)
  const PAGE_SIZE = 20

  useEffect(() => { loadAppointments() }, [])

  async function loadAppointments() {
    const sb = getSupabase()
    if (!sb) return
    const { data } = await sb.from("appointments").select("*, service:services(*)").order("appointment_date", { ascending: false })
    setAppointments((data || []) as any[])
  }

  const filtered = useMemo(() => {
    if (!filterStatus) return appointments
    return appointments.filter((a) => a.status === filterStatus)
  }, [appointments, filterStatus])
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  async function updateStatus(id: string, status: string) {
    const sb = getSupabase()
    if (!sb) return
    await (sb.from("appointments") as any).update({ status }).eq("id", id)
    loadAppointments()
  }

  async function remove(id: string) {
    if (!confirm("Delete this appointment?")) return
    const sb = getSupabase()
    if (!sb) return
    await sb.from("appointments").delete().eq("id", id)
    loadAppointments()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-headline-lg text-headline-lg text-on-surface">Appointments</h1>
      </div>

      <div className="flex flex-wrap gap-3 mb-6 items-center">
        <select value={filterStatus} onChange={(e) => { setFilterStatus(e.target.value); setPage(1) }}
          className="rounded-lg border border-outline-variant bg-surface px-4 py-2 text-sm focus:border-primary outline-none">
          <option value="">All Statuses</option>
          {STATUSES.filter(Boolean).map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <span className="text-xs text-on-surface-variant">{filtered.length} of {appointments.length}</span>
      </div>

      <div className="bg-surface rounded-xl border border-outline-variant/30 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b bg-surface-container text-left text-caption uppercase text-on-surface-variant">
            <tr>
              <th className="px-4 py-3 font-medium w-10">#</th>
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
            {filtered.length === 0 ? (
              <tr><td colSpan={8} className="px-6 py-12 text-center text-on-surface-variant">No appointments match filters</td></tr>
            ) : paged.map((a: any, i: number) => (
              <tr key={a.id} className="hover:bg-surface-container-low">
                <td className="px-4 py-4 text-on-surface-variant text-sm">{(page - 1) * PAGE_SIZE + i + 1}</td>
                <td className="px-6 py-4 font-medium text-on-surface">{a.patient_name}</td>
                <td className="px-6 py-4 text-on-surface-variant">{a.service?.name || "General"}</td>
                <td className="px-6 py-4">{(a.appointment_date && !isNaN(new Date(a.appointment_date).getTime())) ? new Date(a.appointment_date).toLocaleDateString() : "-"}</td>
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
                  <div className="flex gap-2 items-center">
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
                    <button onClick={() => remove(a.id)} className="text-red-600 hover:underline font-label-md text-label-md text-xs">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  )
}
