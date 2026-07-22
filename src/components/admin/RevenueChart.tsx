"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export function RevenueChart({ data }: { data: { month: string; revenue: number }[] }) {
  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#9e9e9e" />
          <YAxis tick={{ fontSize: 12 }} stroke="#9e9e9e" />
          <Tooltip
            contentStyle={{ borderRadius: 8, border: "1px solid #e0e0e0", fontSize: 13 }}
            formatter={(value: any) => [`PKR ${(Number(value) || 0).toLocaleString()}`, "Revenue"]}
          />
          <Bar dataKey="revenue" fill="#3f625f" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
