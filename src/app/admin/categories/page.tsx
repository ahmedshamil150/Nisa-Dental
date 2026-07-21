"use client"

import { useEffect, useState } from "react"
import { getSupabase } from "@/lib/supabase"

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([])
  const [editing, setEditing] = useState<any | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: "", slug: "", sort_order: "0", is_active: true })

  useEffect(() => { loadCategories() }, [])

  async function loadCategories() {
    const sb = getSupabase()
    if (!sb) return
    const { data } = await sb.from("product_categories").select("*").order("sort_order")
    setCategories((data || []) as any[])
  }

  function openNew() {
    setEditing(null)
    setForm({ name: "", slug: "", sort_order: "0", is_active: true })
    setShowForm(true)
  }

  function openEdit(c: any) {
    setEditing(c)
    setForm({ name: c.name, slug: c.slug, sort_order: String(c.sort_order), is_active: c.is_active })
    setShowForm(true)
  }

  async function save() {
    const sb = getSupabase()
    if (!sb) return
    const data = {
      name: form.name,
      slug: form.slug || form.name.toLowerCase().replace(/\s+/g, "-"),
      sort_order: parseInt(form.sort_order) || 0,
      is_active: form.is_active,
    }
    if (editing) {
      await (sb.from("product_categories") as any).update(data).eq("id", editing.id)
    } else {
      await (sb.from("product_categories") as any).insert(data)
    }
    setShowForm(false)
    loadCategories()
  }

  async function remove(id: string) {
    if (!confirm("Delete this category?")) return
    const sb = getSupabase()
    if (!sb) return
    await sb.from("product_categories").delete().eq("id", id)
    loadCategories()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-headline-lg text-headline-lg text-on-surface">Categories</h1>
        <button onClick={openNew} className="bg-primary text-on-primary px-4 py-2 rounded-lg font-label-md text-label-md hover:bg-primary/90 flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px]">add</span>Add Category
        </button>
      </div>

      <div className="bg-surface rounded-xl border border-outline-variant/30 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b bg-surface-container text-left text-caption uppercase text-on-surface-variant">
            <tr>
              <th className="px-6 py-3 font-medium">Name</th>
              <th className="px-6 py-3 font-medium">Slug</th>
              <th className="px-6 py-3 font-medium">Order</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {categories.length === 0 ? (
              <tr><td colSpan={5} className="px-6 py-12 text-center text-on-surface-variant">No categories yet</td></tr>
            ) : categories.map((c: any) => (
              <tr key={c.id} className="hover:bg-surface-container-low">
                <td className="px-6 py-4 font-medium text-on-surface">{c.name}</td>
                <td className="px-6 py-4 text-on-surface-variant">{c.slug}</td>
                <td className="px-6 py-4">{c.sort_order}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${c.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                    {c.is_active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(c)} className="text-primary hover:underline font-label-md text-label-md">Edit</button>
                    <button onClick={() => remove(c.id)} className="text-red-600 hover:underline font-label-md text-label-md">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-surface rounded-xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
            <h2 className="font-headline-md text-headline-md text-on-surface mb-6">{editing ? "Edit" : "Add"} Category</h2>
            <div className="space-y-4">
              <div>
                <label className="font-label-md text-label-md text-on-surface block mb-1">Name *</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") })}
                  className="w-full rounded-lg border border-outline-variant bg-surface px-4 py-3 font-body-md focus:border-primary outline-none" />
              </div>
              <div>
                <label className="font-label-md text-label-md text-on-surface block mb-1">Slug</label>
                <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  className="w-full rounded-lg border border-outline-variant bg-surface px-4 py-3 font-body-md focus:border-primary outline-none" />
              </div>
              <div>
                <label className="font-label-md text-label-md text-on-surface block mb-1">Sort Order</label>
                <input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: e.target.value })}
                  className="w-full rounded-lg border border-outline-variant bg-surface px-4 py-3 font-body-md focus:border-primary outline-none" />
              </div>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} className="w-4 h-4 accent-primary" />
                <span className="font-label-md text-label-md">Active</span>
              </label>
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
