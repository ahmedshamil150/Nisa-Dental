"use client"

import { useEffect, useState, useMemo } from "react"
import { getSupabase } from "@/lib/supabase"

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<any[]>([])
  const [filterRead, setFilterRead] = useState("")

  useEffect(() => { loadMessages() }, [])

  async function loadMessages() {
    const sb = getSupabase()
    if (!sb) return
    const { data } = await sb.from("contacts").select("*").order("created_at", { ascending: false })
    setMessages((data || []) as any[])
  }

  const filtered = useMemo(() => {
    if (filterRead === "read") return messages.filter((m) => m.is_read)
    if (filterRead === "unread") return messages.filter((m) => !m.is_read)
    return messages
  }, [messages, filterRead])

  async function markRead(id: string) {
    const sb = getSupabase()
    if (!sb) return
    await (sb.from("contacts") as any).update({ is_read: true }).eq("id", id)
    loadMessages()
  }

  async function remove(id: string) {
    if (!confirm("Delete this message?")) return
    const sb = getSupabase()
    if (!sb) return
    await sb.from("contacts").delete().eq("id", id)
    loadMessages()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-headline-lg text-headline-lg text-on-surface">Messages</h1>
      </div>

      <div className="flex flex-wrap gap-3 mb-6 items-center">
        <select value={filterRead} onChange={(e) => setFilterRead(e.target.value)}
          className="rounded-lg border border-outline-variant bg-surface px-4 py-2 text-sm focus:border-primary outline-none">
          <option value="">All Messages</option>
          <option value="unread">Unread</option>
          <option value="read">Read</option>
        </select>
        <span className="text-xs text-on-surface-variant">{filtered.length} of {messages.length}</span>
      </div>

      <div className="bg-surface rounded-xl border border-outline-variant/30 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b bg-surface-container text-left text-caption uppercase text-on-surface-variant">
            <tr>
              <th className="px-6 py-3 font-medium">From</th>
              <th className="px-6 py-3 font-medium">Subject</th>
              <th className="px-6 py-3 font-medium">Message</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium">Date</th>
              <th className="px-6 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filtered.length === 0 ? (
              <tr><td colSpan={6} className="px-6 py-12 text-center text-on-surface-variant">No messages match filters</td></tr>
            ) : filtered.map((m: any) => (
              <tr key={m.id} className="hover:bg-surface-container-low">
                <td className="px-6 py-4">
                  <p className="font-medium text-on-surface">{m.name}</p>
                  <p className="text-xs text-on-surface-variant">{m.email}{m.phone ? ` | ${m.phone}` : ""}</p>
                </td>
                <td className="px-6 py-4 text-on-surface-variant">{m.subject || "No subject"}</td>
                <td className="max-w-xs truncate px-6 py-4 text-on-surface-variant">{m.message}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${m.is_read ? "bg-gray-100 text-gray-800" : "bg-yellow-100 text-yellow-800"}`}>
                    {m.is_read ? "Read" : "New"}
                  </span>
                </td>
                <td className="px-6 py-4 text-on-surface-variant">{new Date(m.created_at).toLocaleDateString()}</td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    {!m.is_read && (
                      <button onClick={() => markRead(m.id)} className="text-primary hover:underline font-label-md text-label-md">Mark Read</button>
                    )}
                    <button onClick={() => remove(m.id)} className="text-red-600 hover:underline font-label-md text-label-md">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
