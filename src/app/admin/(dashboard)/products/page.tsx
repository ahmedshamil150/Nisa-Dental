"use client"

import { useEffect, useState, useMemo } from "react"
import { getSupabase } from "@/lib/supabase"
import { Pagination } from "@/components/ui/Pagination"

interface Product {
  id: string
  name: string
  slug: string
  description: string | null
  short_description: string | null
  price: number
  discount_percent: number
  weight: number
  stock_quantity: number
  image_url: string | null
  image_urls: string[]
  category_id: string | null
  category?: { name: string }
  is_active: boolean
  is_featured: boolean
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [editing, setEditing] = useState<Product | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [form, setForm] = useState({
    name: "", slug: "", description: "", short_description: "",
    price: "", discount_percent: "0", weight: "0", stock_quantity: "0",
    category_id: "", image_url: "", image_url_2: "",
    is_featured: false, is_active: true,
  })

  const [filterCat, setFilterCat] = useState("")
  const [filterDiscounted, setFilterDiscounted] = useState(false)
  const [filterFeatured, setFilterFeatured] = useState(false)
  const [filterInStock, setFilterInStock] = useState(false)
  const [sortPrice, setSortPrice] = useState("")
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const PAGE_SIZE = 20

  async function uploadFile(file: File, field: "image_url" | "image_url_2") {
    setUploading(true)
    const fd = new FormData()
    fd.append("file", file)
    try {
      const res = await fetch("/api/upload", { method: "POST", body: fd })
      const data = await res.json()
      if (res.ok) {
        setForm((prev) => ({ ...prev, [field]: data.url }))
      } else {
        alert("Upload failed: " + (data.error || "Unknown error"))
      }
    } catch {
      alert("Upload failed")
    }
    setUploading(false)
  }

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    const sb = getSupabase()
    if (!sb) return
    const [p, c] = await Promise.all([
      sb.from("products").select("*, category:product_categories(*)").order("created_at", { ascending: false }),
      sb.from("product_categories").select("*").order("sort_order"),
    ])
    setProducts((p.data || []) as any)
    setCategories((c.data || []) as any)
  }

  const filtered = useMemo(() => {
    let list = [...products]
    if (search) {
      const q = search.toLowerCase()
      list = list.filter((p) => p.name.toLowerCase().includes(q))
    }
    if (filterCat) {
      list = list.filter((p) => p.category_id === filterCat)
    }
    if (filterDiscounted) {
      list = list.filter((p) => p.discount_percent > 0)
    }
    if (filterFeatured) {
      list = list.filter((p) => p.is_featured)
    }
    if (filterInStock) {
      list = list.filter((p) => p.stock_quantity > 0)
    }
    if (sortPrice === "low") {
      list.sort((a, b) => a.price - b.price)
    } else if (sortPrice === "high") {
      list.sort((a, b) => b.price - a.price)
    }
    return list
  }, [products, search, filterCat, filterDiscounted, filterFeatured, filterInStock, sortPrice])
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  function openNew() {
    setEditing(null)
    setForm({ name: "", slug: "", description: "", short_description: "", price: "", discount_percent: "0", weight: "0", stock_quantity: "0", category_id: "", image_url: "", image_url_2: "", is_featured: false, is_active: true })
    setShowForm(true)
  }

  function openEdit(p: Product) {
    setEditing(p)
    const urls = p.image_urls || []
    setForm({
      name: p.name, slug: p.slug, description: p.description || "", short_description: p.short_description || "",
      price: String(p.price), discount_percent: String(p.discount_percent || 0),
      weight: String(p.weight || 0), stock_quantity: String(p.stock_quantity),
      category_id: p.category_id || "", image_url: urls[0] || p.image_url || "",
      image_url_2: urls[1] || "", is_featured: p.is_featured, is_active: p.is_active,
    })
    setShowForm(true)
  }

  async function save() {
    const sb = getSupabase()
    if (!sb) return
    const price = parseFloat(form.price)
    const discount = parseInt(form.discount_percent) || 0
    const salePrice = discount > 0 ? price * (100 - discount) / 100 : null
    const image_urls = [form.image_url, form.image_url_2].filter(Boolean)
    const data = {
      name: form.name,
      slug: form.slug || form.name.toLowerCase().replace(/\s+/g, "-"),
      description: form.description || null,
      short_description: form.short_description || null,
      price,
      discount_percent: discount,
      sale_price: salePrice,
      weight: parseFloat(form.weight) || 0,
      stock_quantity: parseInt(form.stock_quantity) || 0,
      category_id: form.category_id || null,
      image_url: form.image_url || null,
      image_urls,
      is_featured: form.is_featured,
      is_active: form.is_active,
    }

    if (editing) {
      await (sb.from("products") as any).update(data).eq("id", editing.id)
    } else {
      await (sb.from("products") as any).insert(data)
    }
    setShowForm(false)
    loadData()
  }

  async function toggleActive(p: Product) {
    const sb = getSupabase()
    if (!sb) return
    await (sb.from("products") as any).update({ is_active: !p.is_active }).eq("id", p.id)
    loadData()
  }

  async function remove(id: string) {
    if (!confirm("Delete this product?")) return
    const sb = getSupabase()
    if (!sb) return
    await sb.from("products").delete().eq("id", id)
    loadData()
  }

  const displayPrice = (p: Product) => {
    if (p.discount_percent > 0) {
      const sale = p.price * (100 - p.discount_percent) / 100
      return <><span className="line-through text-on-surface-variant mr-2">PKR {p.price}</span><span className="text-primary font-bold">PKR {sale.toFixed(0)}</span></>
    }
    return <span>PKR {p.price}</span>
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-headline-lg text-headline-lg text-on-surface">Products</h1>
        <button onClick={openNew} className="bg-primary text-on-primary px-4 py-2 rounded-lg font-label-md text-label-md hover:bg-primary/90 flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px]">add</span>Add Product
        </button>
      </div>

      <div className="flex flex-wrap gap-3 mb-6 items-center">
        <input
          placeholder="Search name..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          className="rounded-lg border border-outline-variant bg-surface px-4 py-2 font-body-md text-sm focus:border-primary outline-none w-full sm:w-48"
        />
        <select value={filterCat} onChange={(e) => setFilterCat(e.target.value)}
          className="rounded-lg border border-outline-variant bg-surface px-4 py-2 text-sm focus:border-primary outline-none">
          <option value="">All Categories</option>
          {categories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <label className="flex items-center gap-1.5 text-sm">
          <input type="checkbox" checked={filterDiscounted} onChange={(e) => setFilterDiscounted(e.target.checked)} className="accent-primary" />
          Discounted
        </label>
        <label className="flex items-center gap-1.5 text-sm">
          <input type="checkbox" checked={filterFeatured} onChange={(e) => setFilterFeatured(e.target.checked)} className="accent-primary" />
          Featured
        </label>
        <label className="flex items-center gap-1.5 text-sm">
          <input type="checkbox" checked={filterInStock} onChange={(e) => setFilterInStock(e.target.checked)} className="accent-primary" />
          In Stock
        </label>
        <select value={sortPrice} onChange={(e) => setSortPrice(e.target.value)}
          className="rounded-lg border border-outline-variant bg-surface px-4 py-2 text-sm focus:border-primary outline-none">
          <option value="">Default sort</option>
          <option value="low">Price: Low to High</option>
          <option value="high">Price: High to Low</option>
        </select>
        <span className="text-xs text-on-surface-variant">{filtered.length} of {products.length}</span>
      </div>

      <div className="bg-surface rounded-xl border border-outline-variant/30 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b bg-surface-container text-left text-caption uppercase text-on-surface-variant">
            <tr>
              <th className="px-4 py-3 font-medium w-10">#</th>
              <th className="px-6 py-3 font-medium">Name</th>
              <th className="px-6 py-3 font-medium">Category</th>
              <th className="px-6 py-3 font-medium">Price</th>
              <th className="px-6 py-3 font-medium">Discount</th>
              <th className="px-6 py-3 font-medium">Stock</th>
              <th className="px-6 py-3 font-medium">Weight</th>
              <th className="px-6 py-3 font-medium">Active</th>
              <th className="px-6 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filtered.length === 0 ? (
              <tr><td colSpan={9} className="px-6 py-12 text-center text-on-surface-variant">No products match filters</td></tr>
            ) : paged.map((p: any, i: number) => (
              <tr key={p.id} className="hover:bg-surface-container-low">
                <td className="px-4 py-4 text-on-surface-variant text-sm">{(page - 1) * PAGE_SIZE + i + 1}</td>
                <td className="px-6 py-4 font-medium text-on-surface">{p.name}</td>
                <td className="px-6 py-4 text-on-surface-variant">{p.category?.name || "-"}</td>
                <td className="px-6 py-4">{displayPrice(p)}</td>
                <td className="px-6 py-4">{p.discount_percent > 0 ? `${p.discount_percent}%` : "-"}</td>
                <td className="px-6 py-4"><span className={`${p.stock_quantity > 0 ? "text-green-700" : "text-red-600"}`}>{p.stock_quantity}</span></td>
                <td className="px-6 py-4">{p.weight > 0 ? `${p.weight} kg` : "-"}</td>
                <td className="px-6 py-4">
                  <button onClick={() => toggleActive(p)} className={`px-3 py-1 rounded-full text-xs font-medium ${p.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                    {p.is_active ? "Active" : "Inactive"}
                  </button>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(p)} className="text-primary hover:underline font-label-md text-label-md">Edit</button>
                    <button onClick={() => remove(p.id)} className="text-red-600 hover:underline font-label-md text-label-md">Delete</button>
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
            <h2 className="font-headline-md text-headline-md text-on-surface mb-6">{editing ? "Edit" : "Add"} Product</h2>
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
                  <label className="font-label-md text-label-md text-on-surface block mb-1">Category</label>
                  <select value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                    className="w-full rounded-lg border border-outline-variant bg-surface px-4 py-3 font-body-md focus:border-primary outline-none">
                    <option value="">No category</option>
                    {categories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="font-label-md text-label-md text-on-surface block mb-1">Price (PKR) *</label>
                  <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="w-full rounded-lg border border-outline-variant bg-surface px-4 py-3 font-body-md focus:border-primary outline-none" />
                </div>
                <div>
                  <label className="font-label-md text-label-md text-on-surface block mb-1">Discount %</label>
                  <input type="number" min="0" max="100" value={form.discount_percent} onChange={(e) => setForm({ ...form, discount_percent: e.target.value })}
                    className="w-full rounded-lg border border-outline-variant bg-surface px-4 py-3 font-body-md focus:border-primary outline-none" />
                </div>
                <div>
                  <label className="font-label-md text-label-md text-on-surface block mb-1">Weight (kg)</label>
                  <input type="number" step="0.01" value={form.weight} onChange={(e) => setForm({ ...form, weight: e.target.value })}
                    className="w-full rounded-lg border border-outline-variant bg-surface px-4 py-3 font-body-md focus:border-primary outline-none" />
                </div>
                <div>
                  <label className="font-label-md text-label-md text-on-surface block mb-1">Stock Qty</label>
                  <input type="number" value={form.stock_quantity} onChange={(e) => setForm({ ...form, stock_quantity: e.target.value })}
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
                <div className="col-span-2">
                  <label className="font-label-md text-label-md text-on-surface block mb-1">Image 1</label>
                  <div className="flex items-start gap-3">
                    <div className="flex-grow">
                      <input type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadFile(f, "image_url") }}
                        className="w-full rounded-lg border border-outline-variant bg-surface px-4 py-3 font-body-md file:mr-3 file:bg-primary file:text-on-primary file:border-0 file:px-3 file:py-1 file:rounded file:font-label-md" />
                      <input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                        className="w-full rounded-lg border border-outline-variant bg-surface px-4 py-2 font-body-md text-xs mt-2 focus:border-primary outline-none" placeholder="Or paste URL..." />
                    </div>
                    {form.image_url && <img src={form.image_url} alt="" className="w-20 h-20 rounded-lg object-cover border border-outline-variant/30 shrink-0" />}
                  </div>
                </div>
                <div className="col-span-2">
                  <label className="font-label-md text-label-md text-on-surface block mb-1">Image 2</label>
                  <div className="flex items-start gap-3">
                    <div className="flex-grow">
                      <input type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadFile(f, "image_url_2") }}
                        className="w-full rounded-lg border border-outline-variant bg-surface px-4 py-3 font-body-md file:mr-3 file:bg-primary file:text-on-primary file:border-0 file:px-3 file:py-1 file:rounded file:font-label-md" />
                      <input value={form.image_url_2} onChange={(e) => setForm({ ...form, image_url_2: e.target.value })}
                        className="w-full rounded-lg border border-outline-variant bg-surface px-4 py-2 font-body-md text-xs mt-2 focus:border-primary outline-none" placeholder="Or paste URL..." />
                    </div>
                    {form.image_url_2 && <img src={form.image_url_2} alt="" className="w-20 h-20 rounded-lg object-cover border border-outline-variant/30 shrink-0" />}
                  </div>
                  {uploading && <p className="text-caption text-primary mt-1">Uploading...</p>}
                </div>
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={form.is_featured} onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
                      className="w-4 h-4 accent-primary" />
                    <span className="font-label-md text-label-md">Featured</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                      className="w-4 h-4 accent-primary" />
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
