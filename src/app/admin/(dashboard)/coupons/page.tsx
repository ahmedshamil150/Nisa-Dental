"use client"

import { useEffect, useState } from "react"
import { getSupabase } from "@/lib/supabase"

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<any[]>([])
  const [editing, setEditing] = useState<any | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    code: "", discount_type: "percentage", discount_value: "", min_order_amount: "0",
    max_uses: "", expires_at: "", is_active: true,
  })

  useEffect(() => { loadCoupons() }, [])

  async function loadCoupons() {
    const sb = getSupabase()
    if (!sb) return
    const { data } = await sb.from("coupons").select("*").order("created_at", { ascending: false })
    setCoupons((data || []) as any[])
  }

  function openNew() {
    setEditing(null)
    setForm({ code: "", discount_type: "percentage", discount_value: "", min_order_amount: "0", max_uses: "", expires_at: "", is_active: true })
    setShowForm(true)
  }

  function openEdit(c: any) {
    setEditing(c)
    setForm({
      code: c.code, discount_type: c.discount_type, discount_value: String(c.discount_value),
      min_order_amount: String(c.min_order_amount), max_uses: c.max_uses ? String(c.max_uses) : "",
      expires_at: c.expires_at ? c.expires_at.slice(0, 10) : "", is_active: c.is_active,
    })
    setShowForm(true)
  }

  async function save() {
    const sb = getSupabase()
    if (!sb) return
    const data = {
      code: form.code.toUpperCase(),
      discount_type: form.discount_type,
      discount_value: parseFloat(form.discount_value) || 0,
      min_order_amount: parseFloat(form.min_order_amount) || 0,
      max_uses: form.max_uses ? parseInt(form.max_uses) : null,
      expires_at: form.expires_at || null,
      is_active: form.is_active,
    }
    if (editing) {
      await (sb.from("coupons") as any).update(data).eq("id", editing.id)
    } else {
      await (sb.from("coupons") as any).insert(data)
    }
    setShowForm(false)
    loadCoupons()
  }

  async function remove(id: string) {
    if (!confirm("Delete this coupon?")) return
    const sb = getSupabase()
    if (!sb) return
    await sb.from("coupons").delete().eq("id", id)
    loadCoupons()
  }

  async function toggleActive(c: any) {
    const sb = getSupabase()
    if (!sb) return
    await (sb.from("coupons") as any).update({ is_active: !c.is_active }).eq("id", c.id)
    loadCoupons()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-headline-lg text-headline-lg text-on-surface">Coupons</h1>
        <button onClick={openNew} className="bg-primary text-on-primary px-4 py-2 rounded-lg font-label-md text-label-md hover:bg-primary/90 flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px]">add</span>Add Coupon
        </button>
      </div>

      <div className="bg-surface rounded-xl border border-outline-variant/30 overflow-hidden">
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
              <th className="px-6 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {coupons.length === 0 ? (
              <tr><td colSpan={8} className="px-6 py-12 text-center text-on-surface-variant">No coupons yet</td></tr>
            ) : coupons.map((c: any) => (
              <tr key={c.id} className="hover:bg-surface-container-low">
                <td className="px-6 py-4 font-bold text-on-surface uppercase">{c.code}</td>
                <td className="px-6 py-4">{c.discount_type === "percentage" ? `${c.discount_value}%` : `PKR ${c.discount_value}`}</td>
                <td className="px-6 py-4"><span className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">{c.discount_type}</span></td>
                <td className="px-6 py-4">PKR {c.min_order_amount}</td>
                <td className="px-6 py-4">{c.used_count}{c.max_uses ? ` / ${c.max_uses}` : ""}</td>
                <td className="px-6 py-4 text-on-surface-variant">{c.expires_at ? new Date(c.expires_at).toLocaleDateString() : "Never"}</td>
                <td className="px-6 py-4">
                  <button onClick={() => toggleActive(c)} className={`px-3 py-1 rounded-full text-xs font-medium ${c.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                    {c.is_active ? "Active" : "Inactive"}
                  </button>
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
            <h2 className="font-headline-md text-headline-md text-on-surface mb-6">{editing ? "Edit" : "Add"} Coupon</h2>
            <div className="space-y-4">
              <div>
                <label className="font-label-md text-label-md text-on-surface block mb-1">Code *</label>
                <input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                  className="w-full rounded-lg border border-outline-variant bg-surface px-4 py-3 font-body-md focus:border-primary outline-none uppercase" placeholder="NISA10" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-label-md text-label-md text-on-surface block mb-1">Type</label>
                  <select value={form.discount_type} onChange={(e) => setForm({ ...form, discount_type: e.target.value })}
                    className="w-full rounded-lg border border-outline-variant bg-surface px-4 py-3 font-body-md focus:border-primary outline-none">
                    <option value="percentage">Percentage</option>
                    <option value="fixed">Fixed (PKR)</option>
                  </select>
                </div>
                <div>
                  <label className="font-label-md text-label-md text-on-surface block mb-1">Value *</label>
                  <input type="number" value={form.discount_value} onChange={(e) => setForm({ ...form, discount_value: e.target.value })}
                    className="w-full rounded-lg border border-outline-variant bg-surface px-4 py-3 font-body-md focus:border-primary outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-label-md text-label-md text-on-surface block mb-1">Min Order (PKR)</label>
                  <input type="number" value={form.min_order_amount} onChange={(e) => setForm({ ...form, min_order_amount: e.target.value })}
                    className="w-full rounded-lg border border-outline-variant bg-surface px-4 py-3 font-body-md focus:border-primary outline-none" />
                </div>
                <div>
                  <label className="font-label-md text-label-md text-on-surface block mb-1">Max Uses</label>
                  <input type="number" value={form.max_uses} onChange={(e) => setForm({ ...form, max_uses: e.target.value })} placeholder="Unlimited"
                    className="w-full rounded-lg border border-outline-variant bg-surface px-4 py-3 font-body-md focus:border-primary outline-none" />
                </div>
              </div>
              <div>
                <label className="font-label-md text-label-md text-on-surface block mb-1">Expires At</label>
                <input type="date" value={form.expires_at} onChange={(e) => setForm({ ...form, expires_at: e.target.value })}
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
