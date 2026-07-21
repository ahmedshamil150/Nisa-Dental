"use client"

import { useEffect, useState } from "react"
import { getSupabase } from "@/lib/supabase"

export default function AdminServicesPage() {
  const [services, setServices] = useState<any[]>([])
  const [editing, setEditing] = useState<any | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    name: "", slug: "", description: "", short_description: "", icon: "", image_url: "",
    price: "", duration_minutes: "", sort_order: "0", is_featured: false, is_active: true,
  })

  useEffect(() => { loadServices() }, [])

  async function loadServices() {
    const sb = getSupabase()
    if (!sb) return
    const { data } = await sb.from("services").select("*").order("sort_order")
    setServices((data || []) as any[])
  }

  function openNew() {
    setEditing(null)
    setForm({ name: "", slug: "", description: "", short_description: "", icon: "", image_url: "", price: "", duration_minutes: "", sort_order: "0", is_featured: false, is_active: true })
    setShowForm(true)
  }

  function openEdit(s: any) {
    setEditing(s)
    setForm({
      name: s.name, slug: s.slug, description: s.description || "", short_description: s.short_description || "",
      icon: s.icon || "", image_url: s.image_url || "", price: s.price ? String(s.price) : "",
      duration_minutes: s.duration_minutes ? String(s.duration_minutes) : "",
      sort_order: String(s.sort_order), is_featured: s.is_featured, is_active: s.is_active,
    })
    setShowForm(true)
  }

  async function save() {
    const sb = getSupabase()
    if (!sb) return
    const data = {
      name: form.name,
      slug: form.slug || form.name.toLowerCase().replace(/\s+/g, "-"),
      description: form.description || null,
      short_description: form.short_description || null,
      icon: form.icon || null,
      image_url: form.image_url || null,
      price: form.price ? parseFloat(form.price) : null,
      duration_minutes: form.duration_minutes ? parseInt(form.duration_minutes) : null,
      sort_order: parseInt(form.sort_order) || 0,
      is_featured: form.is_featured,
      is_active: form.is_active,
    }
    if (editing) {
      await (sb.from("services") as any).update(data).eq("id", editing.id)
    } else {
      await (sb.from("services") as any).insert(data)
    }
    setShowForm(false)
    loadServices()
  }

  async function remove(id: string) {
    if (!confirm("Delete this service?")) return
    const sb = getSupabase()
    if (!sb) return
    await sb.from("services").delete().eq("id", id)
    loadServices()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-headline-lg text-headline-lg text-on-surface">Services</h1>
        <button onClick={openNew} className="bg-primary text-on-primary px-4 py-2 rounded-lg font-label-md text-label-md hover:bg-primary/90 flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px]">add</span>Add Service
        </button>
      </div>

      <div className="bg-surface rounded-xl border border-outline-variant/30 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b bg-surface-container text-left text-caption uppercase text-on-surface-variant">
            <tr>
              <th className="px-6 py-3 font-medium">Name</th>
              <th className="px-6 py-3 font-medium">Price</th>
              <th className="px-6 py-3 font-medium">Duration</th>
              <th className="px-6 py-3 font-medium">Featured</th>
              <th className="px-6 py-3 font-medium">Active</th>
              <th className="px-6 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {services.length === 0 ? (
              <tr><td colSpan={6} className="px-6 py-12 text-center text-on-surface-variant">No services yet</td></tr>
            ) : services.map((s: any) => (
              <tr key={s.id} className="hover:bg-surface-container-low">
                <td className="px-6 py-4 font-medium text-on-surface">{s.name}</td>
                <td className="px-6 py-4">{s.price ? `PKR ${s.price}` : "-"}</td>
                <td className="px-6 py-4">{s.duration_minutes ? `${s.duration_minutes} min` : "-"}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${s.is_featured ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
                    {s.is_featured ? "Featured" : "No"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button onClick={() => {
                    const sb = getSupabase(); if (!sb) return;
                    (sb.from("services") as any).update({ is_active: !s.is_active }).eq("id", s.id).then(loadServices)
                  }} className={`px-3 py-1 rounded-full text-xs font-medium ${s.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                    {s.is_active ? "Active" : "Inactive"}
                  </button>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(s)} className="text-primary hover:underline font-label-md text-label-md">Edit</button>
                    <button onClick={() => remove(s.id)} className="text-red-600 hover:underline font-label-md text-label-md">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-surface rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
            <h2 className="font-headline-md text-headline-md text-on-surface mb-6">{editing ? "Edit" : "Add"} Service</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="font-label-md text-label-md text-on-surface block mb-1">Name *</label>
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") })}
                    className="w-full rounded-lg border border-outline-variant bg-surface px-4 py-3 font-body-md focus:border-primary outline-none" />
                </div>
                <div className="col-span-2">
                  <label className="font-label-md text-label-md text-on-surface block mb-1">Slug</label>
                  <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    className="w-full rounded-lg border border-outline-variant bg-surface px-4 py-3 font-body-md focus:border-primary outline-none" />
                </div>
                <div className="col-span-2">
                  <label className="font-label-md text-label-md text-on-surface block mb-1">Short Description</label>
                  <input value={form.short_description} onChange={(e) => setForm({ ...form, short_description: e.target.value })}
                    className="w-full rounded-lg border border-outline-variant bg-surface px-4 py-3 font-body-md focus:border-primary outline-none" />
                </div>
                <div className="col-span-2">
                  <label className="font-label-md text-label-md text-on-surface block mb-1">Description</label>
                  <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3}
                    className="w-full rounded-lg border border-outline-variant bg-surface px-4 py-3 font-body-md focus:border-primary outline-none" />
                </div>
                <div>
                  <label className="font-label-md text-label-md text-on-surface block mb-1">Price (PKR)</label>
                  <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="w-full rounded-lg border border-outline-variant bg-surface px-4 py-3 font-body-md focus:border-primary outline-none" />
                </div>
                <div>
                  <label className="font-label-md text-label-md text-on-surface block mb-1">Duration (min)</label>
                  <input type="number" value={form.duration_minutes} onChange={(e) => setForm({ ...form, duration_minutes: e.target.value })}
                    className="w-full rounded-lg border border-outline-variant bg-surface px-4 py-3 font-body-md focus:border-primary outline-none" />
                </div>
                <div className="col-span-2">
                  <label className="font-label-md text-label-md text-on-surface block mb-1">Icon (Material Symbol name)</label>
                  <input value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })}
                    className="w-full rounded-lg border border-outline-variant bg-surface px-4 py-3 font-body-md focus:border-primary outline-none" placeholder="e.g. tooth, healing, star" />
                </div>
                <div className="col-span-2">
                  <label className="font-label-md text-label-md text-on-surface block mb-1">Image URL</label>
                  <input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                    className="w-full rounded-lg border border-outline-variant bg-surface px-4 py-3 font-body-md focus:border-primary outline-none" />
                </div>
                <div>
                  <label className="font-label-md text-label-md text-on-surface block mb-1">Sort Order</label>
                  <input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: e.target.value })}
                    className="w-full rounded-lg border border-outline-variant bg-surface px-4 py-3 font-body-md focus:border-primary outline-none" />
                </div>
                <div className="flex items-end gap-4 pb-3">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={form.is_featured} onChange={(e) => setForm({ ...form, is_featured: e.target.checked })} className="w-4 h-4 accent-primary" />
                    <span className="font-label-md text-label-md">Featured</span>
                  </label>
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
