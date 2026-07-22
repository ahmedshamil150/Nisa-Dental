"use client"

import { useState } from "react"

export function ProductImageCarousel({ images, productName, discount }: { images: string[]; productName: string; discount: number }) {
  const [idx, setIdx] = useState(0)
  const current = images[idx]

  if (!current) return null

  return (
    <div className="space-y-4">
      <div className="aspect-square rounded-xl bg-surface-container-low border border-outline-variant/30 flex items-center justify-center relative overflow-hidden group">
        <img src={current} alt={productName} className="w-full h-full object-cover" />
        {discount > 0 && (
          <span className="absolute top-4 right-4 bg-red-500 text-white font-label-md text-sm px-3 py-1 rounded-full">
            -{discount}%
          </span>
        )}
        {images.length > 1 && (
          <>
            {idx > 0 && (
              <button onClick={() => setIdx(idx - 1)}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 shadow-md flex items-center justify-center text-on-surface hover:bg-white transition-all opacity-0 group-hover:opacity-100">
                <span className="material-symbols-outlined text-[20px]">chevron_left</span>
              </button>
            )}
            {idx < images.length - 1 && (
              <button onClick={() => setIdx(idx + 1)}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 shadow-md flex items-center justify-center text-on-surface hover:bg-white transition-all opacity-0 group-hover:opacity-100">
                <span className="material-symbols-outlined text-[20px]">chevron_right</span>
              </button>
            )}
          </>
        )}
      </div>
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
          {images.map((img, i) => (
            <button key={i} onClick={() => setIdx(i)}
              className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                i === idx ? "border-primary" : "border-outline-variant/30 opacity-60 hover:opacity-100"
              }`}>
              <img src={img} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
