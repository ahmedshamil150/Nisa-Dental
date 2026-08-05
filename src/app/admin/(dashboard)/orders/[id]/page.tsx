import { getSupabase } from "@/lib/supabase"
import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

async function getOrder(id: string) {
  const sb = getSupabase()
  if (!sb) return null
  const { data } = await sb.from("orders").select("*, items:order_items(*)").eq("id", id).single()
  return data as any
}

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const order = await getOrder(id)

  if (!order) notFound()

  return (
    <div>
      <Link
        href="/admin/orders"
        className="mb-6 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-teal-600"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Orders
      </Link>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Order #{String(order.id).slice(0, 8)}
        </h1>
        <Badge variant="success" className="text-sm">{order.order_status}</Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <h2 className="font-semibold">Customer Details</h2>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p><span className="font-medium">Name:</span> {order.customer_name}</p>
            <p><span className="font-medium">Email:</span> {order.customer_email}</p>
            {order.customer_phone && (
              <p><span className="font-medium">Phone:</span> {order.customer_phone}</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="font-semibold">Payment Info</h2>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p><span className="font-medium">Method:</span> {order.payment_method || "N/A"}</p>
            <p>
              <span className="font-medium">Status:</span>{" "}
              <Badge variant={order.payment_status === "paid" ? "success" : "warning"}>
                {order.payment_status}
              </Badge>
            </p>
            <p><span className="font-medium">Subtotal:</span> ${order.subtotal}</p>
            <p><span className="font-medium">Shipping:</span> ${order.shipping_cost}</p>
            <p><span className="font-medium">Total:</span> ${order.total}</p>
          </CardContent>
        </Card>
      </div>

      {order.items && order.items.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <h2 className="font-semibold">Order Items</h2>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead className="border-b bg-gray-50 text-left text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-6 py-3 font-medium">Product</th>
                  <th className="px-6 py-3 font-medium">Qty</th>
                  <th className="px-6 py-3 font-medium">Unit Price</th>
                  <th className="px-6 py-3 font-medium">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {order.items.map((item: any) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4">{item.product_name}</td>
                    <td className="px-6 py-4">{item.quantity}</td>
                    <td className="px-6 py-4">${item.unit_price}</td>
                    <td className="px-6 py-4 font-medium">${item.total_price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
