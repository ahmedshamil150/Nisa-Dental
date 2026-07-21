import { getSupabase } from "@/lib/supabase"
import { Card, CardContent } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { Pencil, Trash2 } from "lucide-react"

async function getTeam() {
  const sb = getSupabase()
  if (!sb) return []
  const { data } = await sb.from("team_members").select("*").order("sort_order")
  return (data || []) as any[]
}

export default async function AdminTeamPage() {
  const team = await getTeam()

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Team Members</h1>
      </div>

      <Card>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead className="border-b bg-gray-50 text-left text-xs uppercase text-gray-500">
              <tr>
                <th className="px-6 py-3 font-medium">Name</th>
                <th className="px-6 py-3 font-medium">Title</th>
                <th className="px-6 py-3 font-medium">Specialties</th>
                <th className="px-6 py-3 font-medium">Order</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {team.map((m: any) => (
                <tr key={m.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{m.name}</td>
                  <td className="px-6 py-4 text-gray-500">{m.title}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {m.specialties?.slice(0, 2).map((s: string) => (
                        <span key={s} className="rounded-full bg-teal-50 px-2 py-0.5 text-xs text-teal-700">
                          {s}
                        </span>
                      ))}
                      {(m.specialties?.length || 0) > 2 && (
                        <span className="text-xs text-gray-400">+{m.specialties.length - 2}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">{m.sort_order}</td>
                  <td className="px-6 py-4">
                    <Badge variant={m.is_active ? "success" : "danger"}>
                      {m.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
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
