import { getSupabase } from "@/lib/supabase"
import { Card, CardContent } from "@/components/ui/Card"
import { Stethoscope, Package, ShoppingCart, Calendar, MessageSquare, Users } from "lucide-react"

async function getStats() {
  const sb = getSupabase()
  if (!sb) return { services: 0, products: 0, orders: 0, pendingAppointments: 0, unreadMessages: 0, testimonials: 0 }
  const [
    { count: servicesCount },
    { count: productsCount },
    { count: ordersCount },
    { count: appointmentsCount },
    { count: messagesCount },
    { count: testimonialsCount },
  ] = await Promise.all([
    sb.from("services").select("*", { count: "exact", head: true }).eq("is_active", true),
    sb.from("products").select("*", { count: "exact", head: true }).eq("is_active", true),
    sb.from("orders").select("*", { count: "exact", head: true }),
    sb.from("appointments").select("*", { count: "exact", head: true }).eq("status", "pending"),
    sb.from("contacts").select("*", { count: "exact", head: true }).eq("is_read", false),
    sb.from("testimonials").select("*", { count: "exact", head: true }),
  ])

  return {
    services: servicesCount || 0,
    products: productsCount || 0,
    orders: ordersCount || 0,
    pendingAppointments: appointmentsCount || 0,
    unreadMessages: messagesCount || 0,
    testimonials: testimonialsCount || 0,
  }
}

export default async function AdminDashboard() {
  const stats = await getStats()

  const cards = [
    { label: "Services", value: stats.services, icon: Stethoscope, color: "text-blue-600 bg-blue-50" },
    { label: "Products", value: stats.products, icon: Package, color: "text-teal-600 bg-teal-50" },
    { label: "Orders", value: stats.orders, icon: ShoppingCart, color: "text-purple-600 bg-purple-50" },
    { label: "Pending Appointments", value: stats.pendingAppointments, icon: Calendar, color: "text-yellow-600 bg-yellow-50" },
    { label: "Unread Messages", value: stats.unreadMessages, icon: MessageSquare, color: "text-red-600 bg-red-50" },
    { label: "Testimonials", value: stats.testimonials, icon: Users, color: "text-green-600 bg-green-50" },
  ]

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon
          return (
            <Card key={card.label}>
              <CardContent className="flex items-center gap-4 py-5">
                <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${card.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                  <p className="text-sm text-gray-500">{card.label}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
