"use client"

import { useRef, useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export function SearchBar({ defaultValue, params }: { defaultValue?: string; params: Record<string, string | undefined> }) {
  const router = useRouter()
  const [val, setVal] = useState(defaultValue || "")
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [focused, setFocused] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setFocused(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  function onChange(v: string) {
    setVal(v)
    clearTimeout(timer.current)
    if (v.length < 2) { setSuggestions([]); return }
    timer.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/products/search?q=${encodeURIComponent(v)}`)
        const data = await res.json()
        setSuggestions(data || [])
      } catch { setSuggestions([]) }
    }, 250)
  }

  function submit(s?: string) {
    const sp = new URLSearchParams()
    Object.entries(params).forEach(([k, v]) => { if (v && k !== "search") sp.set(k, v) })
    if (s) sp.set("search", s)
    else if (val) sp.set("search", val)
    const qs = sp.toString()
    router.push(`/shop${qs ? `?${qs}` : ""}`)
    setFocused(false)
  }

  return (
    <div ref={wrapperRef} className="relative flex-1">
      <div className="relative">
        <input value={val} onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); submit() } }}
          placeholder="Search products..."
          className="w-full rounded-lg border border-outline-variant bg-surface px-4 py-2 pl-10 font-body-md text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-on-surface-variant">search</span>
      </div>
      {focused && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 z-20 mt-1 bg-surface border border-outline-variant/30 rounded-xl shadow-xl overflow-hidden">
          {suggestions.map((s) => (
            <button key={s} onMouseDown={() => { setVal(s); submit(s) }}
              className="w-full text-left px-4 py-2.5 text-sm text-on-surface hover:bg-surface-container transition-colors">
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
