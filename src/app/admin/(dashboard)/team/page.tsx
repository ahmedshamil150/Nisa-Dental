"use client"

import { useEffect, useState, useMemo } from "react"
import { getSupabase } from "@/lib/supabase"
import { Pagination } from "@/components/ui/Pagination"

export default function AdminTeamPage() {
  const [members, setMembers] = useState<any[]>([])
  const [editing, setEditing] = useState<any | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [page, setPage] = useState(1)
  const PAGE_SIZE = 20
  const totalPages = Math.ceil(members.length / PAGE_SIZE)
  const paged = members.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const [form, setForm] = useState({
    name: "", title: "", bio: "", image_url: "", specialties: "", education: "", sort_order: "0", is_active: true,
  })

  useEffect(() => { loadMembers() }, [])

  async function loadMembers() {
    const sb = getSupabase()
    if (!sb) return
    const { data } = await sb.from("team_members").select("*").order("sort_order")
    setMembers((data || []) as any[])
  }

  function openNew() {
    setEditing(null)
    setForm({ name: "", title: "", bio: "", image_url: "", specialties: "", education: "", sort_order: "0", is_active: true })
    setShowForm(true)
  }

  function openEdit(m: any) {
    setEditing(m)
    setForm({
      name: m.name, title: m.title || "", bio: m.bio || "", image_url: m.image_url || "",
      specialties: (m.specialties || []).join(", "), education: (m.education || []).join(", "),
      sort_order: String(m.sort_order), is_active: m.is_active,
    })
    setShowForm(true)
  }

  async function save() {
    const sb = getSupabase()
    if (!sb) return
    const data = {
      name: form.name,
      title: form.title || null,
      bio: form.bio || null,
      image_url: form.image_url || null,
      specialties: form.specialties ? form.specialties.split(",").map((s: string) => s.trim()).filter(Boolean) : [],
      education: form.education ? form.education.split(",").map((s: string) => s.trim()).filter(Boolean) : [],
      sort_order: parseInt(form.sort_order) || 0,
      is_active: form.is_active,
    }
    if (editing) {
      await (sb.from("team_members") as any).update(data).eq("id", editing.id)
    } else {
      await (sb.from("team_members") as any).insert(data)
    }
    setShowForm(false)
    loadMembers()
  }

  async function remove(id: string) {
    if (!confirm("Delete this team member?")) return
    const sb = getSupabase()
    if (!sb) return
    await sb.from("team_members").delete().eq("id", id)
    loadMembers()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-headline-lg text-headline-lg text-on-surface">Team Members</h1>
        <button onClick={openNew} className="bg-primary text-on-primary px-4 py-2 rounded-lg font-label-md text-label-md hover:bg-primary/90 flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px]">add</span>Add Member
        </button>
      </div>

      <div className="bg-surface rounded-xl border border-outline-variant/30 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b bg-surface-container text-left text-caption uppercase text-on-surface-variant">
            <tr>
              <th className="px-4 py-3 font-medium w-10">#</th>
              <th className="px-6 py-3 font-medium">Name</th>
              <th className="px-6 py-3 font-medium">Title</th>
              <th className="px-6 py-3 font-medium">Specialties</th>
              <th className="px-6 py-3 font-medium">Active</th>
              <th className="px-6 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {members.length === 0 ? (
              <tr><td colSpan={6} className="px-6 py-12 text-center text-on-surface-variant">No team members yet</td></tr>
            ) : paged.map((m: any, i: number) => (
              <tr key={m.id} className="hover:bg-surface-container-low">
                <td className="px-4 py-4 text-on-surface-variant text-sm">{(page - 1) * PAGE_SIZE + i + 1}</td>
                <td className="px-6 py-4 font-medium text-on-surface">{m.name}</td>
                <td className="px-6 py-4 text-on-surface-variant">{m.title || "-"}</td>
                <td className="px-6 py-4 text-on-surface-variant">{(m.specialties || []).join(", ") || "-"}</td>
                <td className="px-6 py-4">
                  <button onClick={() => {
                    const sb = getSupabase(); if (!sb) return;
                    (sb.from("team_members") as any).update({ is_active: !m.is_active }).eq("id", m.id).then(loadMembers)
                  }} className={`px-3 py-1 rounded-full text-xs font-medium ${m.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                    {m.is_active ? "Active" : "Inactive"}
                  </button>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(m)} className="text-primary hover:underline font-label-md text-label-md">Edit</button>
                    <button onClick={() => remove(m.id)} className="text-red-600 hover:underline font-label-md text-label-md">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />

      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-surface rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
            <h2 className="font-headline-md text-headline-md text-on-surface mb-6">{editing ? "Edit" : "Add"} Team Member</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="font-label-md text-label-md text-on-surface block mb-1">Name *</label>
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full rounded-lg border border-outline-variant bg-surface px-4 py-3 font-body-md focus:border-primary outline-none" />
                </div>
                <div className="col-span-2">
                  <label className="font-label-md text-label-md text-on-surface block mb-1">Title</label>
                  <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Lead Dentist"
                    className="w-full rounded-lg border border-outline-variant bg-surface px-4 py-3 font-body-md focus:border-primary outline-none" />
                </div>
                <div className="col-span-2">
                  <label className="font-label-md text-label-md text-on-surface block mb-1">Bio</label>
                  <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} rows={3}
                    className="w-full rounded-lg border border-outline-variant bg-surface px-4 py-3 font-body-md focus:border-primary outline-none" />
                </div>
                <div className="col-span-2">
                  <label className="font-label-md text-label-md text-on-surface block mb-1">Image URL</label>
                  <input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                    className="w-full rounded-lg border border-outline-variant bg-surface px-4 py-3 font-body-md focus:border-primary outline-none" />
                </div>
                <div className="col-span-2">
                  <label className="font-label-md text-label-md text-on-surface block mb-1">Specialties (comma-separated)</label>
                  <input value={form.specialties} onChange={(e) => setForm({ ...form, specialties: e.target.value })} placeholder="Orthodontics, Implants, Cosmetic"
                    className="w-full rounded-lg border border-outline-variant bg-surface px-4 py-3 font-body-md focus:border-primary outline-none" />
                </div>
                <div className="col-span-2">
                  <label className="font-label-md text-label-md text-on-surface block mb-1">Education (comma-separated)</label>
                  <input value={form.education} onChange={(e) => setForm({ ...form, education: e.target.value })} placeholder="BDS, MCPS, FCPS"
                    className="w-full rounded-lg border border-outline-variant bg-surface px-4 py-3 font-body-md focus:border-primary outline-none" />
                </div>
                <div>
                  <label className="font-label-md text-label-md text-on-surface block mb-1">Sort Order</label>
                  <input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: e.target.value })}
                    className="w-full rounded-lg border border-outline-variant bg-surface px-4 py-3 font-body-md focus:border-primary outline-none" />
                </div>
                <div className="flex items-end gap-4 pb-3">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} className="w-4 h-4 accent-primary" />
                    <span className="font-label-md text-label-md">Active</span>
                  </label>
                </div>
              </div>
              <div className="flex gap-3 pt-4 border-t">
                <button onClick={save} className="bg-primary text-on-primary px-6 py-3 rounded-lg font-label-md text-label-md hover:bg-primary/90">Save</button>
                <button onClick={() => setShowForm(false)} className="border border-outline-variant px-6 py-3 rounded-lg font-label-md text-label-md hover:bg-surface-container">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
