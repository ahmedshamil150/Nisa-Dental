import { createClient } from "@supabase/supabase-js"
import { Card, CardContent } from "@/components/ui/Card"
import { RevenueChart } from "@/components/admin/RevenueChart"
import Link from "next/link"

export const dynamic = "force-dynamic"

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function getStats() {

  const [
    { count: servicesCount },
    { count: productsCount },
    { count: ordersCount },
    { count: appointmentsCount },
    { count: messagesCount },
    { count: testimonialsCount },
    { count: invoicesCount },
  ] = await Promise.all([
    sb.from("services").select("*", { count: "exact", head: true }).eq("is_active", true),
    sb.from("products").select("*", { count: "exact", head: true }).eq("is_active", true),
    sb.from("orders").select("*", { count: "exact", head: true }),
    sb.from("appointments").select("*", { count: "exact", head: true }).eq("status", "pending"),
    sb.from("contacts").select("*", { count: "exact", head: true }).eq("is_read", false),
    sb.from("testimonials").select("*", { count: "exact", head: true }),
    sb.from("invoices").select("*", { count: "exact", head: true }),
  ])

  const { data: revenueData } = await sb.from("invoices").select("total, created_at")
  const revenue = revenueData?.reduce((sum: number, r: any) => sum + Number(r.total || 0), 0) || 0

  return {
    services: servicesCount || 0,
    products: productsCount || 0,
    orders: ordersCount || 0,
    pendingAppointments: appointmentsCount || 0,
    unreadMessages: messagesCount || 0,
    testimonials: testimonialsCount || 0,
    revenue,
    invoices: invoicesCount || 0,
  }
}

async function getRevenueChart() {
  const { data: raw } = await sb.from("invoices").select("total, created_at")
  const data = raw as any[] | null
  if (!data) return []

  const monthly: Record<string, number> = {}
  for (const inv of data) {
    const d = new Date(inv.created_at)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
    monthly[key] = (monthly[key] || 0) + Number(inv.total || 0)
  }

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  return Object.entries(monthly)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-12)
    .map(([key, revenue]) => {
      const [, m] = key.split("-")
      return { month: monthNames[parseInt(m) - 1], revenue }
    })
}

async function getPendingOrders() {
  const { data } = await sb.from("orders")
    .select("id, order_number, customer_name, total, created_at, order_status")
    .eq("order_status", "pending")
    .order("created_at", { ascending: false })
    .limit(3)
  return (data || []) as any[]
}

async function getPendingAppointments() {
  const { data } = await sb.from("appointments")
    .select("id, patient_name, phone, service_name, appointment_date, appointment_time, status")
    .eq("status", "pending")
    .order("appointment_date", { ascending: true })
    .limit(3)
  return (data || []) as any[]
}

export default async function AdminDashboard() {
  const [stats, chartData, pendingOrders, pendingAppts] = await Promise.all([
    getStats(), getRevenueChart(), getPendingOrders(), getPendingAppointments(),
  ])

  const cards = [
    { label: "Revenue", value: `PKR ${stats.revenue.toLocaleString()}`, icon: "payments", color: "text-on-primary bg-primary" },
    { label: "Orders", value: stats.orders, icon: "shopping_cart", color: "text-on-secondary-container bg-secondary-container" },
    { label: "Invoices", value: stats.invoices, icon: "receipt_long", color: "text-on-tertiary-container bg-tertiary-container" },
    { label: "Products", value: stats.products, icon: "inventory_2", color: "text-on-primary-fixed bg-primary-fixed" },
    { label: "Services", value: stats.services, icon: "clinical_notes", color: "text-on-secondary-container bg-secondary-fixed" },
    { label: "Pending Appts", value: stats.pendingAppointments, icon: "calendar_today", color: "text-on-tertiary-fixed bg-tertiary-fixed" },
    { label: "Unread Messages", value: stats.unreadMessages, icon: "mail", color: "text-on-error-container bg-error-container" },
    { label: "Testimonials", value: stats.testimonials, icon: "star", color: "text-on-primary-fixed bg-primary-fixed-dim" },
  ]

  return (
    <div className="space-y-6">
      <h1 className="font-headline-lg text-headline-lg text-on-surface">Dashboard</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Card key={card.label}>
            <CardContent className="flex items-center gap-4 py-5">
              <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${card.color}`}>
                <span className="material-symbols-outlined">{card.icon}</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-on-surface">{card.value}</p>
                <p className="text-sm text-on-surface-variant">{card.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardContent className="p-6">
            <h2 className="font-headline-md text-headline-md text-on-surface mb-4">Revenue</h2>
            {chartData.length > 0 ? (
              <RevenueChart data={chartData} />
            ) : (
              <p className="text-on-surface-variant py-12 text-center">No revenue data yet</p>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardContent className="p-0">
              <div className="flex items-center justify-between p-4 border-b border-outline-variant/30">
                <h2 className="font-label-lg text-label-lg text-on-surface">Pending Orders</h2>
                <Link href="/admin/orders" className="text-sm text-primary hover:underline">View All</Link>
              </div>
              {pendingOrders.length === 0 ? (
                <p className="text-on-surface-variant p-4 text-sm">No pending orders</p>
              ) : (
                <div className="divide-y">
                  {pendingOrders.map((o: any) => (
                    <Link key={o.id} href={`/admin/orders/${o.id}`} className="flex items-center justify-between p-4 hover:bg-surface-container-low transition-colors">
                      <div>
                        <p className="font-label-md text-label-md text-on-surface">{o.customer_name}</p>
                        <p className="text-caption text-on-surface-variant">{o.order_number}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-label-md text-label-md text-on-surface">PKR {Number(o.total).toLocaleString()}</p>
                        <p className="text-caption text-on-surface-variant">{new Date(o.created_at).toLocaleDateString()}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-0">
              <div className="flex items-center justify-between p-4 border-b border-outline-variant/30">
                <h2 className="font-label-lg text-label-lg text-on-surface">Pending Appointments</h2>
                <Link href="/admin/appointments" className="text-sm text-primary hover:underline">View All</Link>
              </div>
              {pendingAppts.length === 0 ? (
                <p className="text-on-surface-variant p-4 text-sm">No pending appointments</p>
              ) : (
                <div className="divide-y">
                  {pendingAppts.map((a: any) => (
                    <div key={a.id} className="p-4">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-label-md text-label-md text-on-surface">{a.patient_name}</p>
                        <span className="text-caption bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">{a.status}</span>
                      </div>
                      <p className="text-caption text-on-surface-variant">
                        {a.service_name} — {new Date(a.appointment_date).toLocaleDateString()} at {a.appointment_time}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
