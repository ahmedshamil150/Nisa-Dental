"use client"

import { useEffect, useState, useMemo } from "react"
import { getSupabase } from "@/lib/supabase"

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
  requested_return: "bg-orange-100 text-orange-800",
}

const ORDER_STATUSES = ["", "pending", "confirmed", "shipped", "delivered", "cancelled", "requested_return"]

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [selected, setSelected] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const [filterStatus, setFilterStatus] = useState("")
  const [search, setSearch] = useState("")

  useEffect(() => { loadOrders() }, [])

  async function loadOrders() {
    setLoading(true)
    const sb = getSupabase()
    if (!sb) return
    const { data } = await sb.from("orders").select("*, items:order_items(*)").order("created_at", { ascending: false })
    setOrders((data || []) as any)
    setLoading(false)
  }

  const showOrderNumber = (o: any) => o.order_number || "NISA-" + o.id.toString().replace(/-/g, "").slice(0, 8).toUpperCase()

  const filtered = useMemo(() => {
    let list = [...orders]
    if (filterStatus) {
      list = list.filter((o) => o.order_status === filterStatus)
    }
    if (search) {
      const q = search.toLowerCase()
      list = list.filter((o) =>
        o.customer_name.toLowerCase().includes(q) ||
        o.customer_email.toLowerCase().includes(q) ||
        showOrderNumber(o).toLowerCase().includes(q)
      )
    }
    return list
  }, [orders, filterStatus, search])

  async function updateStatus(id: string, order_status: string) {
    const sb = getSupabase()
    if (!sb) return
    const update: any = { order_status }
    if (order_status === "cancelled" || order_status === "requested_return") {
      const order = orders.find((o) => o.id === id)
      if (order?.items) {
        for (const item of order.items) {
          const { data: prod } = await (sb.from("products").select("stock_quantity") as any).eq("id", item.product_id).single()
          if (prod) {
            await (sb.from("products") as any).update({ stock_quantity: prod.stock_quantity + item.quantity }).eq("id", item.product_id)
          }
        }
      }
    }
    await (sb.from("orders") as any).update(update).eq("id", id)
  }

  async function removeOrder(id: string) {
    if (!confirm("Delete this order?")) return
    const sb = getSupabase()
    if (!sb) return
    await sb.from("orders").delete().eq("id", id)
    await loadOrders()
    if (selected?.id === id) {
      setSelected(null)
    }
  }

  return (
    <div>
      <h1 className="font-headline-lg text-headline-lg text-on-surface mb-6">Orders</h1>

      <div className="flex flex-wrap gap-3 mb-6 items-center">
        <input
          placeholder="Search name, email, order #..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-lg border border-outline-variant bg-surface px-4 py-2 font-body-md text-sm focus:border-primary outline-none w-full sm:w-60"
        />
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
          className="rounded-lg border border-outline-variant bg-surface px-4 py-2 text-sm focus:border-primary outline-none">
          <option value="">All Statuses</option>
          {ORDER_STATUSES.filter(Boolean).map((s) => (
            <option key={s} value={s}>{s.replace("_", " ")}</option>
          ))}
        </select>
        <span className="text-xs text-on-surface-variant">{filtered.length} of {orders.length}</span>
      </div>

      <div className="bg-surface rounded-xl border border-outline-variant/30 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b bg-surface-container text-left text-caption uppercase text-on-surface-variant">
            <tr>
              <th className="px-6 py-3 font-medium">Order #</th>
              <th className="px-6 py-3 font-medium">Customer</th>
              <th className="px-6 py-3 font-medium">Email</th>
              <th className="px-6 py-3 font-medium">Items</th>
              <th className="px-6 py-3 font-medium">Total</th>
              <th className="px-6 py-3 font-medium">Payment</th>
              <th className="px-6 py-3 font-medium">Order Status</th>
              <th className="px-6 py-3 font-medium">Date</th>
              <th className="px-6 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {loading ? (
              <tr><td colSpan={9} className="px-6 py-12 text-center text-on-surface-variant">Loading...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={9} className="px-6 py-12 text-center text-on-surface-variant">No orders match filters</td></tr>
            ) : filtered.map((o: any) => (
              <tr key={o.id} className="hover:bg-surface-container-low">
                <td className="px-6 py-4 font-bold text-on-surface">{showOrderNumber(o)}</td>
                <td className="px-6 py-4 font-medium text-on-surface">{o.customer_name}</td>
                <td className="px-6 py-4 text-on-surface-variant">{o.customer_email}</td>
                <td className="px-6 py-4">{o.items?.length || 0}</td>
                <td className="px-6 py-4 font-bold">PKR {o.total}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${o.payment_status === "paid" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                    {o.payment_status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${STATUS_COLORS[o.order_status] || "bg-gray-100 text-gray-800"}`}>
                    {o.order_status.replace("_", " ")}
                  </span>
                </td>
                <td className="px-6 py-4 text-on-surface-variant">{new Date(o.created_at).toLocaleDateString()}</td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button onClick={() => setSelected(o)} className="text-primary hover:underline font-label-md text-label-md">View</button>
                    <button onClick={() => removeOrder(o.id)} className="text-red-600 hover:underline font-label-md text-label-md">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-surface rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-headline-md text-headline-md text-on-surface">
                Order {showOrderNumber(selected)}
              </h2>
              <button onClick={() => setSelected(null)} className="text-on-surface-variant hover:text-on-surface">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
              <div>
                <p className="text-on-surface-variant mb-1">Customer</p>
                <p className="font-medium">{selected.customer_name}</p>
                <p className="text-on-surface-variant">{selected.customer_email}</p>
                {selected.customer_phone && <p className="text-on-surface-variant">{selected.customer_phone}</p>}
              </div>
              <div>
                <p className="text-on-surface-variant mb-1">Status</p>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[selected.order_status] || ""}`}>
                  {selected.order_status.replace("_", " ")}
                </span>
                <p className="text-on-surface-variant mt-2">Payment: {selected.payment_status}</p>
                <p className="text-on-surface-variant">Total: PKR {selected.total}</p>
              </div>
            </div>

            {selected.shipping_address && (
              <div className="mb-6 text-sm">
                <p className="text-on-surface-variant mb-1">Shipping Address</p>
                <p>{selected.shipping_address.line1}<br/>{selected.shipping_address.city}, {selected.shipping_address.state} {selected.shipping_address.zip}</p>
              </div>
            )}

            <div className="mb-6">
              <p className="font-headline-md text-headline-md text-on-surface mb-3">Items</p>
              <table className="w-full text-sm">
                <thead className="border-b text-left text-caption uppercase text-on-surface-variant">
                  <tr><th className="pb-2 font-medium">Product</th><th className="pb-2 font-medium">Qty</th><th className="pb-2 font-medium">Price</th><th className="pb-2 font-medium">Total</th></tr>
                </thead>
                <tbody className="divide-y">
                  {(selected.items || []).map((item: any) => (
                    <tr key={item.id}>
                      <td className="py-2">{item.product_name}</td>
                      <td className="py-2">{item.quantity}</td>
                      <td className="py-2">PKR {item.unit_price}</td>
                      <td className="py-2 font-medium">PKR {item.total_price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-3 space-y-1 text-sm border-t pt-3">
                <div className="flex justify-between"><span className="text-on-surface-variant">Subtotal</span><span>PKR {selected.subtotal}</span></div>
                <div className="flex justify-between"><span className="text-on-surface-variant">Delivery</span><span>PKR {selected.shipping_cost}</span></div>
                <div className="flex justify-between"><span className="text-on-surface-variant">Tax</span><span>PKR {selected.tax}</span></div>
                {selected.notes?.includes("Coupon:") && <div className="flex justify-between text-primary"><span>Discount</span><span>-PKR {selected.notes.match(/PKR ([\d.]+)\)/)?.[1] || 0}</span></div>}
                <div className="flex justify-between font-bold border-t pt-2"><span>Total</span><span>PKR {selected.total}</span></div>
              </div>
            </div>

            <div className="border-t pt-4">
              <p className="font-headline-md text-headline-md text-on-surface mb-3">Update Status</p>
              <div className="flex flex-wrap gap-2">
                {selected.order_status === "pending" && (
                  <>
                    <button onClick={() => updateStatus(selected.id, "confirmed")} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">Confirm</button>
                    <button onClick={() => updateStatus(selected.id, "cancelled")} className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700">Cancel</button>
                  </>
                )}
                {selected.order_status === "confirmed" && (
                  <button onClick={() => updateStatus(selected.id, "shipped")} className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-purple-700">Mark Shipped</button>
                )}
                {selected.order_status === "shipped" && (
                  <button onClick={() => updateStatus(selected.id, "delivered")} className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700">Mark Delivered</button>
                )}
                {selected.order_status === "requested_return" && (
                  <>
                    <button onClick={() => updateStatus(selected.id, "cancelled")} className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700">Approve Return</button>
                    <button onClick={() => updateStatus(selected.id, "confirmed")} className="bg-gray-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-700">Reject Return</button>
                  </>
                )}
              </div>
              <div className="mt-4">
                <a
                  href={`/api/invoice/${selected.id}`}
                  target="_blank"
                  className="bg-primary text-on-primary px-4 py-2 rounded-lg text-sm inline-flex items-center gap-2 hover:bg-primary/90"
                >
                  <span className="material-symbols-outlined text-[18px]">download</span>
                  Download Invoice
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
