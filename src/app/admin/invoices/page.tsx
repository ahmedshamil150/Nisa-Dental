import { getSupabase } from "@/lib/supabase"
import { Card, CardContent } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import Link from "next/link"

async function getInvoices() {
  const sb = getSupabase()
  if (!sb) return []
  const { data } = await sb.from("invoices").select("*, order:orders(*)").order("created_at", { ascending: false })
  return (data || []) as any[]
}

export default async function AdminInvoicesPage() {
  const invoices = await getInvoices()

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-headline-lg text-headline-lg text-on-surface">Invoices</h1>
      </div>

      <Card>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead className="border-b bg-surface-container text-left text-caption uppercase text-on-surface-variant">
              <tr>
                <th className="px-6 py-3 font-medium">Invoice #</th>
                <th className="px-6 py-3 font-medium">Customer</th>
                <th className="px-6 py-3 font-medium">Total</th>
                <th className="px-6 py-3 font-medium">Tax</th>
                <th className="px-6 py-3 font-medium">Delivery</th>
                <th className="px-6 py-3 font-medium">Coupon</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Date</th>
                <th className="px-6 py-3 font-medium">PDF</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {invoices.length === 0 ? (
                <tr><td colSpan={9} className="px-6 py-12 text-center text-on-surface-variant">No invoices yet</td></tr>
              ) : invoices.map((inv: any) => (
                <tr key={inv.id} className="hover:bg-surface-container-low">
                  <td className="px-6 py-4 font-medium text-on-surface">{inv.invoice_number}</td>
                  <td className="px-6 py-4 text-on-surface-variant">{inv.order?.customer_name || 'N/A'}</td>
                  <td className="px-6 py-4 font-bold text-on-surface">${inv.total}</td>
                  <td className="px-6 py-4">${inv.tax_amount}</td>
                  <td className="px-6 py-4">${inv.delivery_charge}</td>
                  <td className="px-6 py-4">{inv.coupon_code || '-'}</td>
                  <td className="px-6 py-4"><Badge variant={inv.status === 'paid' ? 'success' : 'warning'}>{inv.status}</Badge></td>
                  <td className="px-6 py-4 text-on-surface-variant">{new Date(inv.created_at).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <Link
                      href={`/api/invoice/${inv.id}`}
                      className="text-primary hover:underline font-label-md text-label-md flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[16px]">download</span>
                      PDF
                    </Link>
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
