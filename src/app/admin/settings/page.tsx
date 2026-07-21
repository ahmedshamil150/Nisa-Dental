"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/Card"

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<any[]>([])
  const [deliveryRate, setDeliveryRate] = useState("150")
  const [taxRate, setTaxRate] = useState("0")
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState("")

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        setSettings(data)
        const dr = data.find((s: any) => s.key === "delivery_rate_per_kg")
        if (dr) setDeliveryRate(dr.value)
        const tr = data.find((s: any) => s.key === "tax_rate")
        if (tr) setTaxRate(tr.value)
      })
      .catch(console.error)
  }, [])

  const save = async (key: string, value: string) => {
    setSaving(true)
    await fetch("/api/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, value }),
    })
    setSaving(false)
    setMsg("Saved!")
    setTimeout(() => setMsg(""), 2000)
  }

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
                <label className="font-label-md text-label-md text-on-surface block mb-1">Delivery Rate (PKR per kg)</label>
                <input type="number" step="1" value={deliveryRate}
                  onChange={(e) => setDeliveryRate(e.target.value)}
                  className="w-full rounded-lg border border-outline-variant bg-surface px-4 py-3 font-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
              </div>
              <div>
                <label className="font-label-md text-label-md text-on-surface block mb-1">Tax Rate (%)</label>
                <input type="number" step="0.01" value={taxRate}
                  onChange={(e) => setTaxRate(e.target.value)}
                  className="w-full rounded-lg border border-outline-variant bg-surface px-4 py-3 font-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
              </div>
              <button onClick={() => { save("delivery_rate_per_kg", deliveryRate); save("tax_rate", taxRate) }}
                disabled={saving}
                className="bg-primary text-on-primary px-6 py-3 rounded-lg font-label-md text-label-md hover:bg-primary/90 active:scale-95 transition-all disabled:opacity-50">
                {saving ? "Saving..." : "Save Changes"}
              </button>
              {msg && <p className="text-primary font-label-md text-label-md">{msg}</p>}
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
