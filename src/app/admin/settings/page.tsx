import { getSupabase } from "@/lib/supabase"
import { Card, CardContent } from "@/components/ui/Card"

export const dynamic = "force-dynamic"

async function getSettings() {
  const sb = getSupabase()
  if (!sb) return []
  const { data } = await sb.from("site_settings").select("*").order("key")
  return (data || []) as any[]
}

export default async function AdminSettingsPage() {
  const settings = await getSettings()

  const deliveryCharge = settings.find((s: any) => s.key === "delivery_charge")?.value || "5.99"
  const taxRate = settings.find((s: any) => s.key === "tax_rate")?.value || "8.00"

  return (
    <div>
      <h1 className="font-headline-lg text-headline-lg text-on-surface mb-6">Site Settings</h1>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardContent className="p-6">
            <h2 className="font-headline-md text-headline-md text-on-surface mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">local_shipping</span>
              Delivery & Tax
            </h2>
            <div className="space-y-4">
              <div>
                <label className="font-label-md text-label-md text-on-surface block mb-1">Delivery Charge ($)</label>
                <input type="number" step="0.01" defaultValue={deliveryCharge}
                  className="w-full rounded-lg border border-outline-variant bg-surface px-4 py-3 font-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
              </div>
              <div>
                <label className="font-label-md text-label-md text-on-surface block mb-1">Tax Rate (%)</label>
                <input type="number" step="0.01" defaultValue={taxRate}
                  className="w-full rounded-lg border border-outline-variant bg-surface px-4 py-3 font-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
              </div>
              <button className="bg-primary text-on-primary px-6 py-3 rounded-lg font-label-md text-label-md hover:bg-primary/90 active:scale-95 transition-all">
                Save Changes
              </button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-0">
            <div className="p-6 border-b border-outline-variant/30">
              <h2 className="font-headline-md text-headline-md text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">tune</span>
                All Settings
              </h2>
            </div>
            <table className="w-full text-sm">
              <thead className="border-b bg-surface-container text-left text-caption uppercase text-on-surface-variant">
                <tr>
                  <th className="px-6 py-3 font-medium">Key</th>
                  <th className="px-6 py-3 font-medium">Value</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {settings.map((s: any) => (
                  <tr key={s.id} className="hover:bg-surface-container-low">
                    <td className="px-6 py-4 font-medium text-on-surface">{s.key}</td>
                    <td className="px-6 py-4 text-on-surface-variant">{typeof s.value === "string" ? s.value : JSON.stringify(s.value)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
