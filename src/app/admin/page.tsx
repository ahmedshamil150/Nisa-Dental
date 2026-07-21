import { getSupabase } from "@/lib/supabase"
import { Card, CardContent } from "@/components/ui/Card"

async function getStats() {
  const sb = getSupabase()
  if (!sb) return { services: 0, products: 0, orders: 0, pendingAppointments: 0, unreadMessages: 0, testimonials: 0, revenue: 0, invoices: 0 }

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

  const { data: revenueData } = await sb.from("invoices").select("total")
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

export default async function AdminDashboard() {
  const stats = await getStats()

  const cards = [
    { label: "Revenue", value: `$${stats.revenue}`, icon: "payments", color: "text-on-primary bg-primary" },
    { label: "Orders", value: stats.orders, icon: "shopping_cart", color: "text-on-secondary-container bg-secondary-container" },
    { label: "Invoices", value: stats.invoices, icon: "receipt_long", color: "text-on-tertiary-container bg-tertiary-container" },
    { label: "Products", value: stats.products, icon: "inventory_2", color: "text-on-primary-fixed bg-primary-fixed" },
    { label: "Services", value: stats.services, icon: "clinical_notes", color: "text-on-secondary-container bg-secondary-fixed" },
    { label: "Pending Appts", value: stats.pendingAppointments, icon: "calendar_today", color: "text-on-tertiary-fixed bg-tertiary-fixed" },
    { label: "Unread Messages", value: stats.unreadMessages, icon: "mail", color: "text-on-error-container bg-error-container" },
    { label: "Testimonials", value: stats.testimonials, icon: "star", color: "text-on-primary-fixed bg-primary-fixed-dim" },
  ]

  return (
    <div>
      <h1 className="font-headline-lg text-headline-lg text-on-surface mb-6">Dashboard</h1>
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
    </div>
  )
}
