"use client"

import { useEffect, useState } from "react"
import { getSupabase } from "@/lib/supabase"

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<any[]>([])
  const [editing, setEditing] = useState<any | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ patient_name: "", patient_title: "", patient_image: "", content: "", rating: "5", is_featured: false, is_approved: true })

  useEffect(() => { loadTestimonials() }, [])

  async function loadTestimonials() {
    const sb = getSupabase()
    if (!sb) return
    const { data } = await sb.from("testimonials").select("*").order("created_at", { ascending: false })
    setTestimonials((data || []) as any[])
  }

  function openNew() {
    setEditing(null)
    setForm({ patient_name: "", patient_title: "", patient_image: "", content: "", rating: "5", is_featured: false, is_approved: true })
    setShowForm(true)
  }

  function openEdit(t: any) {
    setEditing(t)
    setForm({ patient_name: t.patient_name, patient_title: t.patient_title || "", patient_image: t.patient_image || "", content: t.content, rating: String(t.rating), is_featured: t.is_featured, is_approved: t.is_approved })
    setShowForm(true)
  }

  async function save() {
    const sb = getSupabase()
    if (!sb) return
    const data = {
      patient_name: form.patient_name,
      patient_title: form.patient_title || null,
      patient_image: form.patient_image || null,
      content: form.content,
      rating: parseInt(form.rating) || 5,
      is_featured: form.is_featured,
      is_approved: form.is_approved,
    }
    if (editing) {
      await (sb.from("testimonials") as any).update(data).eq("id", editing.id)
    } else {
      await (sb.from("testimonials") as any).insert(data)
    }
    setShowForm(false)
    loadTestimonials()
  }

  async function remove(id: string) {
    if (!confirm("Delete this testimonial?")) return
    const sb = getSupabase()
    if (!sb) return
    await sb.from("testimonials").delete().eq("id", id)
    loadTestimonials()
  }

  async function toggleApproved(t: any) {
    const sb = getSupabase()
    if (!sb) return
    await (sb.from("testimonials") as any).update({ is_approved: !t.is_approved }).eq("id", t.id)
    loadTestimonials()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-headline-lg text-headline-lg text-on-surface">Testimonials</h1>
        <button onClick={openNew} className="bg-primary text-on-primary px-4 py-2 rounded-lg font-label-md text-label-md hover:bg-primary/90 flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px]">add</span>Add Testimonial
        </button>
      </div>

      <div className="bg-surface rounded-xl border border-outline-variant/30 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b bg-surface-container text-left text-caption uppercase text-on-surface-variant">
            <tr>
              <th className="px-6 py-3 font-medium">Patient</th>
              <th className="px-6 py-3 font-medium">Rating</th>
              <th className="px-6 py-3 font-medium">Content</th>
              <th className="px-6 py-3 font-medium">Featured</th>
              <th className="px-6 py-3 font-medium">Approved</th>
              <th className="px-6 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {testimonials.length === 0 ? (
              <tr><td colSpan={6} className="px-6 py-12 text-center text-on-surface-variant">No testimonials yet</td></tr>
            ) : testimonials.map((t: any) => (
              <tr key={t.id} className="hover:bg-surface-container-low">
                <td className="px-6 py-4 font-medium text-on-surface">{t.patient_name}</td>
                <td className="px-6 py-4">{t.rating}/5</td>
                <td className="px-6 py-4 max-w-xs truncate text-on-surface-variant">{t.content}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${t.is_featured ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
                    {t.is_featured ? "Featured" : "No"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button onClick={() => toggleApproved(t)} className={`px-3 py-1 rounded-full text-xs font-medium ${t.is_approved ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                    {t.is_approved ? "Approved" : "Pending"}
                  </button>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(t)} className="text-primary hover:underline font-label-md text-label-md">Edit</button>
                    <button onClick={() => remove(t.id)} className="text-red-600 hover:underline font-label-md text-label-md">Delete</button>
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
            <h2 className="font-headline-md text-headline-md text-on-surface mb-6">{editing ? "Edit" : "Add"} Testimonial</h2>
            <div className="space-y-4">
              <div>
                <label className="font-label-md text-label-md text-on-surface block mb-1">Patient Name *</label>
                <input value={form.patient_name} onChange={(e) => setForm({ ...form, patient_name: e.target.value })}
                  className="w-full rounded-lg border border-outline-variant bg-surface px-4 py-3 font-body-md focus:border-primary outline-none" />
              </div>
              <div>
                <label className="font-label-md text-label-md text-on-surface block mb-1">Title</label>
                <input value={form.patient_title} onChange={(e) => setForm({ ...form, patient_title: e.target.value })} placeholder="e.g. Regular Patient"
                  className="w-full rounded-lg border border-outline-variant bg-surface px-4 py-3 font-body-md focus:border-primary outline-none" />
              </div>
              <div>
                <label className="font-label-md text-label-md text-on-surface block mb-1">Image URL</label>
                <input value={form.patient_image} onChange={(e) => setForm({ ...form, patient_image: e.target.value })}
                  className="w-full rounded-lg border border-outline-variant bg-surface px-4 py-3 font-body-md focus:border-primary outline-none" />
              </div>
              <div>
                <label className="font-label-md text-label-md text-on-surface block mb-1">Content *</label>
                <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={3}
                  className="w-full rounded-lg border border-outline-variant bg-surface px-4 py-3 font-body-md focus:border-primary outline-none" />
              </div>
              <div>
                <label className="font-label-md text-label-md text-on-surface block mb-1">Rating</label>
                <select value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })}
                  className="w-full rounded-lg border border-outline-variant bg-surface px-4 py-3 font-body-md focus:border-primary outline-none">
                  {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={form.is_featured} onChange={(e) => setForm({ ...form, is_featured: e.target.checked })} className="w-4 h-4 accent-primary" />
                  <span className="font-label-md text-label-md">Featured</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={form.is_approved} onChange={(e) => setForm({ ...form, is_approved: e.target.checked })} className="w-4 h-4 accent-primary" />
                  <span className="font-label-md text-label-md">Approved</span>
                </label>
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
