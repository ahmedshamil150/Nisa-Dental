import { getSupabase } from "@/lib/supabase"
import { Card, CardContent } from "@/components/ui/Card"

async function getSettings() {
  const sb = getSupabase()
  if (!sb) return []
  const { data } = await sb.from("site_settings").select("*").order("key")
  return (data || []) as any[]
}

export default async function AdminSettingsPage() {
  const settings = await getSettings()

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Site Settings</h1>
        <p className="mt-1 text-sm text-gray-500">Manage your clinic and website settings</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead className="border-b bg-gray-50 text-left text-xs uppercase text-gray-500">
              <tr>
                <th className="px-6 py-3 font-medium">Key</th>
                <th className="px-6 py-3 font-medium">Value</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {settings.map((s: any) => (
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-700">{s.key}</td>
                  <td className="px-6 py-4 text-gray-600">
                    {typeof s.value === "string" ? s.value : JSON.stringify(s.value)}
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
