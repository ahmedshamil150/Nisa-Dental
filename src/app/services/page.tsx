import Link from "next/link"
import { getSupabase } from "@/lib/supabase"

async function getServices() {
  const sb = getSupabase()
  if (!sb) return []
  const { data } = await sb.from("services").select("*").eq("is_active", true).order("sort_order")
  return (data || []) as any[]
}

export default async function ServicesPage() {
  const services = await getServices()

  return (
    <div className="container mx-auto px-margin-mobile md:px-margin-desktop py-section-gap">
      <div className="max-w-3xl mx-auto text-center mb-16">
        <h1 className="font-headline-lg text-headline-lg text-on-surface mb-4">Our Services</h1>
        <div className="w-16 h-1 bg-primary mx-auto rounded-full mb-6" />
        <p className="font-body-lg text-body-lg text-on-surface-variant">Comprehensive dental care tailored to your needs</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.length === 0 ? (
          <div className="col-span-full text-center py-16 border-2 border-dashed border-outline-variant/30 rounded-xl">
            <span className="material-symbols-outlined text-[48px] text-outline-variant">medical_services</span>
            <p className="font-body-md text-on-surface-variant mt-4">No services listed yet</p>
          </div>
        ) : services.map((s: any) => (
          <div key={s.id} className="bg-surface-container-low p-8 rounded-xl border border-outline-variant/30 group hover:border-primary/30 transition-all">
            <span className="material-symbols-outlined text-primary text-4xl mb-4">clinical_notes</span>
            <h3 className="font-headline-md text-headline-md text-on-surface mb-2">{s.name}</h3>
            <p className="text-on-surface-variant mb-4">{s.short_description}</p>
            {s.description && <p className="text-caption text-on-surface-variant mb-4 line-clamp-2">{s.description}</p>}
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-outline-variant/20">
              {s.price && <span className="font-headline-md text-headline-md text-primary">From ${s.price}</span>}
              {s.duration_minutes && <span className="text-caption text-on-surface-variant">~{s.duration_minutes} min</span>}
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-16">
        <Link href="/appointment" className="bg-primary text-on-primary px-10 py-4 rounded-lg font-label-md text-label-md hover:bg-primary/90 active:scale-95 transition-all inline-flex items-center gap-2">
          Book an Appointment <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
        </Link>
      </div>
    </div>
  )
}
