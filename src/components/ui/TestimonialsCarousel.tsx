"use client"

import { useState } from "react"

export function TestimonialsCarousel({ testimonials }: { testimonials: any[] }) {
  const [index, setIndex] = useState(0)
  const t = testimonials[index]

  if (testimonials.length === 0) return null

  return (
    <section className="px-margin-mobile md:px-margin-desktop py-section-gap overflow-hidden">
      <div className="max-w-container-max mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 md:mb-16 gap-6">
          <div className="max-w-md">
            <h2 className="font-headline-lg text-headline-lg text-on-surface mb-4">Patient Stories</h2>
            <p className="text-on-surface-variant">Don&apos;t just take our word for it—hear from the thousands of patients who have trusted us with their smiles.</p>
          </div>
        </div>

        {/* Desktop grid */}
        <div className="hidden md:grid md:grid-cols-3 gap-8">
          {testimonials.map((t: any) => (
            <div key={t.id} className="bg-surface p-8 rounded-xl border border-outline-variant/30 shadow-sm relative group hover:-translate-y-2 transition-transform duration-300">
              <div className="flex text-primary mb-4">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <span key={i} className="material-symbols-outlined fill" style={{ fontSize: "20px" }}>star</span>
                ))}
              </div>
              <p className="text-on-surface italic mb-8 font-body-lg">&ldquo;{t.content}&rdquo;</p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center font-bold text-primary">
                  {t.patient_name.charAt(0)}
                </div>
                <div>
                  <div className="font-label-md text-label-md text-on-surface">{t.patient_name}</div>
                  {t.patient_title && <div className="text-caption text-on-surface-variant">{t.patient_title}</div>}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile carousel */}
        <div className="md:hidden">
          <div className="bg-surface p-8 rounded-xl border border-outline-variant/30 shadow-sm">
            <div className="flex text-primary mb-4">
              {Array.from({ length: t.rating }).map((_, i) => (
                <span key={i} className="material-symbols-outlined fill" style={{ fontSize: "20px" }}>star</span>
              ))}
            </div>
            <p className="text-on-surface italic mb-8 font-body-lg">&ldquo;{t.content}&rdquo;</p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center font-bold text-primary">
                {t.patient_name.charAt(0)}
              </div>
              <div>
                <div className="font-label-md text-label-md text-on-surface">{t.patient_name}</div>
                {t.patient_title && <div className="text-caption text-on-surface-variant">{t.patient_title}</div>}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 mt-6">
            <button onClick={() => setIndex((i) => (i - 1 + testimonials.length) % testimonials.length)}
              className="w-10 h-10 rounded-full border border-outline-variant flex items-center justify-center text-on-surface-variant hover:bg-surface-container transition-colors">
              <span className="material-symbols-outlined text-[20px]">chevron_left</span>
            </button>
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button key={i} onClick={() => setIndex(i)}
                  className={`w-2 h-2 rounded-full transition-all ${i === index ? "bg-primary w-6" : "bg-outline-variant"}`} />
              ))}
            </div>
            <button onClick={() => setIndex((i) => (i + 1) % testimonials.length)}
              className="w-10 h-10 rounded-full border border-outline-variant flex items-center justify-center text-on-surface-variant hover:bg-surface-container transition-colors">
              <span className="material-symbols-outlined text-[20px]">chevron_right</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
