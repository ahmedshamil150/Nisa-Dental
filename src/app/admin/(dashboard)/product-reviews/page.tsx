"use client"

import { useEffect, useState, useMemo } from "react"
import { getSupabase } from "@/lib/supabase"
import { Pagination } from "@/components/ui/Pagination"
import { SkeletonTable } from "@/components/ui/Skeleton"

export default function AdminProductReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("")
  const [page, setPage] = useState(1)
  const PAGE_SIZE = 20

  useEffect(() => { loadReviews() }, [])

  async function loadReviews() {
    const sb = getSupabase()
    if (!sb) return
    const { data } = await sb.from("product_reviews").select("*, product:products(name)").order("created_at", { ascending: false })
    setReviews((data || []) as any[])
    setLoading(false)
  }

  async function toggleApproved(r: any) {
    const sb = getSupabase()
    if (!sb) return
    await (sb.from("product_reviews") as any).update({ is_approved: !r.is_approved }).eq("id", r.id)
    loadReviews()
  }

  async function remove(id: string) {
    if (!confirm("Delete this review?")) return
    const sb = getSupabase()
    if (!sb) return
    await sb.from("product_reviews").delete().eq("id", id)
    loadReviews()
  }

  const filtered = useMemo(() => {
    return filter
      ? reviews.filter((r) => r.product?.name?.toLowerCase().includes(filter.toLowerCase()) || r.customer_name?.toLowerCase().includes(filter.toLowerCase()) || r.review_text?.toLowerCase().includes(filter.toLowerCase()))
      : reviews
  }, [reviews, filter])
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <h1 className="font-headline-lg text-headline-lg text-on-surface">Product Reviews</h1>
        <input value={filter} onChange={(e) => { setFilter(e.target.value); setPage(1) }} placeholder="Search reviews..."
          className="w-full sm:w-64 rounded-lg border border-outline-variant bg-surface px-4 py-2 font-body-md text-sm focus:border-primary outline-none" />
      </div>

      <div className="bg-surface rounded-xl border border-outline-variant/30 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b bg-surface-container text-left text-caption uppercase text-on-surface-variant">
            <tr>
              <th className="px-4 py-3 font-medium w-10">#</th>
              <th className="px-6 py-3 font-medium">Product</th>
              <th className="px-6 py-3 font-medium">Customer</th>
              <th className="px-6 py-3 font-medium">Rating</th>
              <th className="px-6 py-3 font-medium">Review</th>
              <th className="px-6 py-3 font-medium">Date</th>
              <th className="px-6 py-3 font-medium">Approved</th>
              <th className="px-6 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {loading ? (
              <SkeletonTable rows={6} columns={8} />
            ) : filtered.length === 0 ? (
              <tr><td colSpan={8} className="px-6 py-12 text-center text-on-surface-variant">No reviews found</td></tr>
            ) : paged.map((r: any, i: number) => (
              <tr key={r.id} className="hover:bg-surface-container-low">
                <td className="px-4 py-4 text-on-surface-variant text-sm">{(page - 1) * PAGE_SIZE + i + 1}</td>
                <td className="px-6 py-4 font-medium text-on-surface">{r.product?.name || "—"}</td>
                <td className="px-6 py-4">
                  <div className="text-on-surface">{r.customer_name}</div>
                  {r.customer_email && <div className="text-xs text-on-surface-variant">{r.customer_email}</div>}
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-0.5">
                    {Array.from({ length: Math.min(Math.max(Math.round(Number(r.rating) || 0), 0), 5) }).map((_, i) => (
                      <span key={i} className="material-symbols-outlined text-[16px] text-primary">star</span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 max-w-xs">
                  <p className="line-clamp-2 text-on-surface">{r.review_text || "-"}</p>
                </td>
                <td className="px-6 py-4 text-on-surface-variant whitespace-nowrap">{(r.created_at && !isNaN(new Date(r.created_at).getTime())) ? new Date(r.created_at).toLocaleDateString() : "-"}</td>
                <td className="px-6 py-4">
                  <button onClick={() => toggleApproved(r)}
                    className={`px-3 py-1 rounded-full text-xs font-medium ${r.is_approved ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                    {r.is_approved ? "Approved" : "Pending"}
                  </button>
                </td>
                <td className="px-6 py-4">
                  <button onClick={() => remove(r.id)} className="text-red-600 hover:underline font-label-md text-label-md">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  )
}
