import { getSupabase } from "@/lib/supabase"
import { Card, CardContent } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"

async function getCoupons() {
  const sb = getSupabase()
  if (!sb) return []
  const { data } = await sb.from("coupons").select("*").order("created_at", { ascending: false })
  return (data || []) as any[]
}

export default async function AdminCouponsPage() {
  const coupons = await getCoupons()

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-headline-lg text-headline-lg text-on-surface">Coupons</h1>
        <button className="bg-primary text-on-primary px-4 py-2 rounded-lg font-label-md text-label-md hover:bg-primary/90 active:scale-95 transition-all flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px]">add</span>
          Add Coupon
        </button>
      </div>

      <Card>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead className="border-b bg-surface-container text-left text-caption uppercase text-on-surface-variant">
              <tr>
                <th className="px-6 py-3 font-medium">Code</th>
                <th className="px-6 py-3 font-medium">Discount</th>
                <th className="px-6 py-3 font-medium">Type</th>
                <th className="px-6 py-3 font-medium">Min Order</th>
                <th className="px-6 py-3 font-medium">Uses</th>
                <th className="px-6 py-3 font-medium">Expires</th>
                <th className="px-6 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {coupons.length === 0 ? (
                <tr><td colSpan={7} className="px-6 py-12 text-center text-on-surface-variant">No coupons yet</td></tr>
              ) : coupons.map((c: any) => (
                <tr key={c.id} className="hover:bg-surface-container-low">
                  <td className="px-6 py-4 font-bold text-on-surface uppercase">{c.code}</td>
                  <td className="px-6 py-4">{c.discount_type === 'percentage' ? `${c.discount_value}%` : `$${c.discount_value}`}</td>
                  <td className="px-6 py-4"><Badge variant={c.discount_type === 'percentage' ? 'info' : 'success'}>{c.discount_type}</Badge></td>
                  <td className="px-6 py-4">${c.min_order_amount}</td>
                  <td className="px-6 py-4">{c.used_count}{c.max_uses ? ` / ${c.max_uses}` : ''}</td>
                  <td className="px-6 py-4">{c.expires_at ? new Date(c.expires_at).toLocaleDateString() : 'Never'}</td>
                  <td className="px-6 py-4"><Badge variant={c.is_active ? 'success' : 'danger'}>{c.is_active ? 'Active' : 'Inactive'}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
