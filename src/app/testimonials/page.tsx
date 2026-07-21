import { getSupabase } from "@/lib/supabase"

async function getTestimonials() {
  const sb = getSupabase()
  if (!sb) return []
  const { data } = await sb.from("testimonials").select("*").eq("is_approved", true).order("created_at", { ascending: false })
  return (data || []) as any[]
}

export default async function TestimonialsPage() {
  const testimonials = await getTestimonials()

  return (
    <div className="container mx-auto px-margin-mobile md:px-margin-desktop py-section-gap">
      <div className="max-w-3xl mx-auto text-center mb-16">
        <h1 className="font-headline-lg text-headline-lg text-on-surface mb-4">Patient Testimonials</h1>
        <div className="w-16 h-1 bg-primary mx-auto rounded-full mb-6" />
        <p className="font-body-lg text-body-lg text-on-surface-variant">Hear from our patients about their experience</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {testimonials.length === 0 ? (
          <div className="col-span-full text-center py-16 border-2 border-dashed border-outline-variant/30 rounded-xl">
            <span className="material-symbols-outlined text-[48px] text-outline-variant">rate_review</span>
            <p className="font-body-md text-on-surface-variant mt-4">No testimonials yet</p>
          </div>
        ) : testimonials.map((t: any) => (
          <div key={t.id} className="bg-surface p-8 rounded-xl border border-outline-variant/30 shadow-sm hover:-translate-y-2 transition-transform duration-300">
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
    </div>
  )
}
