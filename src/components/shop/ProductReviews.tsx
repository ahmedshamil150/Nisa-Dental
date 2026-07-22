"use client"

import { useEffect, useState } from "react"

export function ProductReviews({ productId }: { productId: string }) {
  const [reviews, setReviews] = useState<any[]>([])
  const [form, setForm] = useState({ customer_name: "", customer_email: "", rating: 5, review_text: "" })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/product-reviews?product_id=${productId}`)
      .then((r) => r.json())
      .then((data) => { setReviews(data || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [productId])

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.customer_name || !form.review_text) return
    try {
      await fetch("/api/product-reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, product_id: productId }),
      })
      setSubmitted(true)
      setForm({ customer_name: "", customer_email: "", rating: 5, review_text: "" })
    } catch {}
  }

  return (
    <div className="mt-16 pt-12 border-t border-outline-variant/30">
      <h2 className="font-headline-lg text-headline-lg text-on-surface mb-8">Customer Reviews</h2>

      {loading ? (
        <p className="text-on-surface-variant">Loading reviews...</p>
      ) : reviews.length === 0 ? (
        <p className="text-on-surface-variant mb-8">No reviews yet. Be the first to review this product.</p>
      ) : (
        <div className="space-y-6 mb-10">
          {reviews.map((r: any) => (
            <div key={r.id} className="bg-surface-container-low p-6 rounded-xl border border-outline-variant/30">
              <div className="flex items-center gap-2 mb-2">
                {Array.from({ length: r.rating }).map((_, i) => (
                  <span key={i} className="material-symbols-outlined text-[18px] text-primary">star</span>
                ))}
                {Array.from({ length: 5 - r.rating }).map((_, i) => (
                  <span key={i} className="material-symbols-outlined text-[18px] text-outline-variant">star</span>
                ))}
              </div>
              <p className="font-body-md text-body-md text-on-surface mb-1">{r.review_text}</p>
              <p className="text-caption text-on-surface-variant">— {r.customer_name}</p>
            </div>
          ))}
        </div>
      )}

      {submitted ? (
        <div className="bg-primary-fixed/20 p-6 rounded-xl border border-primary/30 text-center">
          <span className="material-symbols-outlined text-primary text-3xl">check_circle</span>
          <p className="font-label-md text-label-md text-on-surface mt-2">Thank you! Your review has been submitted and will appear after approval.</p>
        </div>
      ) : (
        <form onSubmit={submit} className="bg-surface-container-low p-6 rounded-xl border border-outline-variant/30">
          <h3 className="font-headline-md text-headline-md text-on-surface mb-4">Write a Review</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-label-md text-label-md text-on-surface block mb-1">Name *</label>
                <input value={form.customer_name} onChange={(e) => setForm({ ...form, customer_name: e.target.value })}
                  required className="w-full rounded-lg border border-outline-variant bg-surface px-4 py-3 font-body-md text-sm focus:border-primary outline-none" />
              </div>
              <div>
                <label className="font-label-md text-label-md text-on-surface block mb-1">Email</label>
                <input type="email" value={form.customer_email} onChange={(e) => setForm({ ...form, customer_email: e.target.value })}
                  className="w-full rounded-lg border border-outline-variant bg-surface px-4 py-3 font-body-md text-sm focus:border-primary outline-none" />
              </div>
            </div>
            <div>
              <label className="font-label-md text-label-md text-on-surface block mb-1">Rating</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button key={s} type="button" onClick={() => setForm({ ...form, rating: s })}
                    className={`material-symbols-outlined text-2xl ${s <= form.rating ? "text-primary" : "text-outline-variant"}`}>
                    star
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="font-label-md text-label-md text-on-surface block mb-1">Review *</label>
              <textarea value={form.review_text} onChange={(e) => setForm({ ...form, review_text: e.target.value })}
                required rows={3}
                className="w-full rounded-lg border border-outline-variant bg-surface px-4 py-3 font-body-md text-sm focus:border-primary outline-none" />
            </div>
            <button type="submit" className="bg-primary text-on-primary px-6 py-3 rounded-lg font-label-md text-label-md hover:bg-primary/90 active:scale-95 transition-all">
              Submit Review
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
