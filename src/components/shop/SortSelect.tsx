"use client"

export function SortSelect({ currentSort, params }: { currentSort: string; params: Record<string, string | undefined> }) {
  return (
    <div className="relative">
      <select value={currentSort} onChange={(e) => {
        const v = e.target.value
        const sp = new URLSearchParams()
        Object.entries(params).forEach(([k, val]) => { if (val && k !== "sort") sp.set(k, val) })
        if (v) sp.set("sort", v)
        const qs = sp.toString()
        window.location.href = `/shop${qs ? `?${qs}` : ""}`
      }}
        className="appearance-none rounded-lg border border-outline-variant bg-surface px-4 py-2 pr-8 font-body-md text-sm text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none cursor-pointer">
        <option value="">Sort: Latest</option>
        <option value="price_asc">Price: Low to High</option>
        <option value="price_desc">Price: High to Low</option>
      </select>
      <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-[16px] text-on-surface-variant pointer-events-none">unfold_more</span>
    </div>
  )
}
