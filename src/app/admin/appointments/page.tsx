import { getSupabase } from "@/lib/supabase"
import { Card, CardContent } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"

async function getAppointments() {
  const sb = getSupabase()
  if (!sb) return []
  const { data } = await sb.from("appointments").select("*, service:services(*)").order("appointment_date", { ascending: false })
  return (data || []) as any[]
}

const statusColors: Record<string, "success" | "warning" | "danger" | "info"> = {
  pending: "warning",
  confirmed: "info",
  completed: "success",
  cancelled: "danger",
}

export default async function AdminAppointmentsPage() {
  const appointments = await getAppointments()

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
      </div>

      <Card>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead className="border-b bg-gray-50 text-left text-xs uppercase text-gray-500">
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
              {appointments.map((a: any) => (
                <tr key={a.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{a.patient_name}</td>
                  <td className="px-6 py-4 text-gray-500">{a.service?.name || "General"}</td>
                  <td className="px-6 py-4">{new Date(a.appointment_date).toLocaleDateString()}</td>
                  <td className="px-6 py-4">{a.appointment_time.slice(0, 5)}</td>
                  <td className="px-6 py-4">
                    <Badge variant={statusColors[a.status] || "default"}>
                      {a.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    <div className="text-xs">
                      <p>{a.patient_email}</p>
                      {a.patient_phone && <p>{a.patient_phone}</p>}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      className="rounded-lg border border-gray-300 px-2 py-1 text-xs"
                      defaultValue={a.status}
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
        </CardContent>
      </Card>
    </div>
  )
}
