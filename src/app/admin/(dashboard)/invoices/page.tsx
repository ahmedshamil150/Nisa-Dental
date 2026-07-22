"use client"

import { useEffect, useState, useMemo } from "react"
import { getSupabase } from "@/lib/supabase"
import Link from "next/link"
import { Pagination } from "@/components/ui/Pagination"

export default function AdminInvoicesPage() {
  const [invoices, setInvoices] = useState<any[]>([])
  const [filterStatus, setFilterStatus] = useState("")
  const [page, setPage] = useState(1)
  const PAGE_SIZE = 20

  useEffect(() => { loadInvoices() }, [])

  async function loadInvoices() {
    const sb = getSupabase()
    if (!sb) return
    const { data } = await sb.from("invoices").select("*, order:orders(*)").order("created_at", { ascending: false })
    setInvoices((data || []) as any[])
  }

  const filtered = useMemo(() => {
    if (!filterStatus) return invoices
    return invoices.filter((inv) => inv.status === filterStatus)
  }, [invoices, filterStatus])
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  async function remove(id: string) {
    if (!confirm("Delete this invoice?")) return
    const sb = getSupabase()
    if (!sb) return
    await sb.from("invoices").delete().eq("id", id)
    loadInvoices()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-headline-lg text-headline-lg text-on-surface">Invoices</h1>
      </div>

      <div className="flex flex-wrap gap-3 mb-6 items-center">
        <select value={filterStatus} onChange={(e) => { setFilterStatus(e.target.value); setPage(1) }}
          className="rounded-lg border border-outline-variant bg-surface px-4 py-2 text-sm focus:border-primary outline-none">
          <option value="">All Statuses</option>
          <option value="paid">Paid</option>
          <option value="unpaid">Unpaid</option>
        </select>
        <span className="text-xs text-on-surface-variant">{filtered.length} of {invoices.length}</span>
      </div>

      <div className="bg-surface rounded-xl border border-outline-variant/30 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b bg-surface-container text-left text-caption uppercase text-on-surface-variant">
            <tr>
              <th className="px-4 py-3 font-medium w-10">#</th>
              <th className="px-6 py-3 font-medium">Invoice #</th>
              <th className="px-6 py-3 font-medium">Customer</th>
              <th className="px-6 py-3 font-medium">Total</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium">Date</th>
              <th className="px-6 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filtered.length === 0 ? (
              <tr><td colSpan={7} className="px-6 py-12 text-center text-on-surface-variant">No invoices match filters</td></tr>
            ) : paged.map((inv: any, i: number) => (
              <tr key={inv.id} className="hover:bg-surface-container-low">
                <td className="px-4 py-4 text-on-surface-variant text-sm">{(page - 1) * PAGE_SIZE + i + 1}</td>
                <td className="px-6 py-4 font-medium text-on-surface">{inv.invoice_number}</td>
                <td className="px-6 py-4 text-on-surface-variant">{inv.order?.customer_name || "N/A"}</td>
                <td className="px-6 py-4 font-bold">PKR {inv.total}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${inv.status === "paid" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                    {inv.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-on-surface-variant">{new Date(inv.created_at).toLocaleDateString()}</td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <Link href={`/api/invoice/${inv.id}`} className="text-primary hover:underline font-label-md text-label-md flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">download</span>
                      PDF
                    </Link>
                    <button onClick={() => remove(inv.id)} className="text-red-600 hover:underline font-label-md text-label-md">Delete</button>
                  </div>
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
