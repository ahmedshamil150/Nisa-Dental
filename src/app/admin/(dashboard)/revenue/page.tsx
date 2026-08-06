"use client"

import { useEffect, useState, useMemo } from "react"
import { getSupabase } from "@/lib/supabase"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Pagination } from "@/components/ui/Pagination"
import { Skeleton, SkeletonTable } from "@/components/ui/Skeleton"

export default function AdminRevenuePage() {
  const [revenue, setRevenue] = useState<any[]>([])
  const [invoices, setInvoices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState("daily")
  const [page, setPage] = useState(1)
  const PAGE_SIZE = 20

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    const sb = getSupabase()
    if (!sb) return
    const [r, i] = await Promise.all([
      sb.from("revenue_log").select("*").order("recorded_at", { ascending: false }),
      sb.from("invoices").select("*, order:orders(*)").order("created_at", { ascending: false }),
    ])
    setRevenue((r.data || []) as any[])
    setInvoices((i.data || []) as any[])
    setLoading(false)
  }

  const summary = useMemo(() => {
    const total = revenue.reduce((sum, r) => sum + (parseFloat(r.amount) || 0), 0)
    const now = new Date()
    const thisMonth = revenue.filter((r) => {
      const d = new Date(r.recorded_at)
      return !isNaN(d.getTime()) && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    })
    const monthTotal = thisMonth.reduce((sum, r) => sum + (parseFloat(r.amount) || 0), 0)
    const today = revenue.filter((r) => {
      const d = new Date(r.recorded_at)
      return !isNaN(d.getTime()) && d.toDateString() === now.toDateString()
    })
    const todayTotal = today.reduce((sum, r) => sum + (parseFloat(r.amount) || 0), 0)
    return { total, monthTotal, todayTotal, count: revenue.length }
  }, [revenue])

  const chartData = useMemo(() => {
    const grouped: Record<string, number> = {}
    revenue.forEach((r) => {
      const d = new Date(r.recorded_at)
      if (isNaN(d.getTime())) return
      let key: string
      if (period === "daily") {
        key = d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
      } else if (period === "weekly") {
        const start = new Date(d)
        start.setDate(d.getDate() - d.getDay())
        key = start.toLocaleDateString("en-US", { month: "short", day: "numeric" })
      } else {
        key = d.toLocaleDateString("en-US", { month: "short", year: "2-digit" })
      }
      grouped[key] = (grouped[key] || 0) + (parseFloat(r.amount) || 0)
    })
    return Object.entries(grouped).map(([date, amount]) => ({ date, amount: Math.round(amount) }))
  }, [revenue, period])

  const sourceBreakdown = useMemo(() => {
    const grouped: Record<string, number> = {}
    revenue.forEach((r) => {
      const source = r.source || "other"
      grouped[source] = (grouped[source] || 0) + (parseFloat(r.amount) || 0)
    })
    return Object.entries(grouped).map(([source, amount]) => ({ source, amount: Math.round(amount) }))
  }, [revenue])

  const totalPages = Math.ceil(revenue.length / PAGE_SIZE)
  const paged = revenue.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <div>
      <h1 className="font-headline-lg text-headline-lg text-on-surface mb-6">Revenue</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-surface rounded-xl border border-outline-variant/30 p-6">
              <Skeleton className="h-3 w-24 mb-3" />
              <Skeleton className="h-7 w-32" />
            </div>
          ))
        ) : (
          <>
            <div className="bg-surface rounded-xl border border-outline-variant/30 p-6">
              <p className="text-caption uppercase text-on-surface-variant mb-1">Total Revenue</p>
              <p className="font-headline-lg text-headline-lg text-on-surface">PKR {summary.total.toLocaleString()}</p>
            </div>
            <div className="bg-surface rounded-xl border border-outline-variant/30 p-6">
              <p className="text-caption uppercase text-on-surface-variant mb-1">This Month</p>
              <p className="font-headline-lg text-headline-lg text-on-surface">PKR {summary.monthTotal.toLocaleString()}</p>
            </div>
            <div className="bg-surface rounded-xl border border-outline-variant/30 p-6">
              <p className="text-caption uppercase text-on-surface-variant mb-1">Today</p>
              <p className="font-headline-lg text-headline-lg text-on-surface">PKR {summary.todayTotal.toLocaleString()}</p>
            </div>
            <div className="bg-surface rounded-xl border border-outline-variant/30 p-6">
              <p className="text-caption uppercase text-on-surface-variant mb-1">Total Transactions</p>
              <p className="font-headline-lg text-headline-lg text-on-surface">{summary.count}</p>
            </div>
          </>
        )}
      </div>

      <div className="bg-surface rounded-xl border border-outline-variant/30 p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-headline-md text-headline-md text-on-surface">Revenue Chart</h2>
          <select value={period} onChange={(e) => setPeriod(e.target.value)}
            className="rounded-lg border border-outline-variant bg-surface px-4 py-2 text-sm focus:border-primary outline-none">
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
        {loading ? (
          <Skeleton className="h-[300px] w-full" />
        ) : chartData.length === 0 ? (
          <p className="text-center text-on-surface-variant py-12">No revenue data yet</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e1e3e3" />
              <XAxis dataKey="date" tick={{ fontSize: 12, fill: "#717977" }} />
              <YAxis tick={{ fontSize: 12, fill: "#717977" }} tickFormatter={(v: any) => `PKR ${(Number(v) / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(value: any) => [`PKR ${(value as number).toLocaleString()}`, "Revenue"]} />
              <Bar dataKey="amount" fill="#3f625f" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-surface rounded-xl border border-outline-variant/30 p-6">
          <h2 className="font-headline-md text-headline-md text-on-surface mb-4">By Source</h2>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-20" />
                </div>
              ))}
            </div>
          ) : sourceBreakdown.length === 0 ? (
            <p className="text-on-surface-variant text-sm">No data</p>
          ) : (
            <div className="space-y-3">
              {sourceBreakdown.map((s) => (
                <div key={s.source} className="flex items-center justify-between">
                  <span className="text-sm text-on-surface-variant capitalize">{(s.source || "other").replace(/_/g, " ")}</span>
                  <span className="font-medium text-on-surface">PKR {s.amount.toLocaleString()}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-surface rounded-xl border border-outline-variant/30 p-6">
          <h2 className="font-headline-md text-headline-md text-on-surface mb-4">Unpaid Invoices</h2>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-4 w-16" />
                </div>
              ))}
            </div>
          ) : invoices.filter((i) => i.status === "unpaid").length === 0 ? (
            <p className="text-on-surface-variant text-sm">All invoices paid</p>
          ) : (
            <div className="space-y-3">
              {invoices.filter((i) => i.status === "unpaid").slice(0, 10).map((inv) => (
                <div key={inv.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-on-surface">{inv.invoice_number}</p>
                    <p className="text-xs text-on-surface-variant">{inv.order?.customer_name || "N/A"}</p>
                  </div>
                  <span className="text-sm font-medium text-red-600">PKR {inv.total}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="bg-surface rounded-xl border border-outline-variant/30 overflow-x-auto">
        <div className="p-6 border-b">
          <h2 className="font-headline-md text-headline-md text-on-surface">Recent Transactions</h2>
        </div>
        <table className="w-full text-sm">
          <thead className="border-b bg-surface-container text-left text-caption uppercase text-on-surface-variant">
            <tr>
              <th className="px-4 py-3 font-medium w-10">#</th>
              <th className="px-6 py-3 font-medium">Date</th>
              <th className="px-6 py-3 font-medium">Source</th>
              <th className="px-6 py-3 font-medium">Description</th>
              <th className="px-6 py-3 font-medium">Invoice</th>
              <th className="px-6 py-3 font-medium">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {loading ? (
              <SkeletonTable rows={6} columns={6} />
            ) : revenue.length === 0 ? (
              <tr><td colSpan={6} className="px-6 py-12 text-center text-on-surface-variant">No revenue entries yet</td></tr>
            ) : paged.map((r: any, i: number) => (
              <tr key={r.id} className="hover:bg-surface-container-low">
                <td className="px-4 py-4 text-on-surface-variant text-sm">{(page - 1) * PAGE_SIZE + i + 1}</td>
                <td className="px-6 py-4 text-on-surface-variant">{(r.recorded_at && !isNaN(new Date(r.recorded_at).getTime())) ? new Date(r.recorded_at).toLocaleDateString() : "-"}</td>
                <td className="px-6 py-4 capitalize text-on-surface">{(r.source || "other").replace(/_/g, " ")}</td>
                <td className="px-6 py-4 text-on-surface-variant">{r.description || "-"}</td>
                <td className="px-6 py-4 text-on-surface-variant">{r.invoice_id?.slice(0, 8) || "-"}</td>
                <td className="px-6 py-4 font-bold text-on-surface">PKR {(parseFloat(r.amount) || 0).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  )
}
