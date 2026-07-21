import { getSupabase } from "@/lib/supabase"

async function getServices() {
  const sb = getSupabase()
  if (!sb) return []
  const { data } = await sb.from("services").select("*").eq("is_active", true).order("sort_order")
  return (data || []) as any[]
}

async function getTeam() {
  const sb = getSupabase()
  if (!sb) return []
  const { data } = await sb.from("team_members").select("*").eq("is_active", true).order("sort_order")
  return (data || []) as any[]
}

export default async function AboutPage() {
  const [services, team] = await Promise.all([getServices(), getTeam()])

  return (
    <div className="container mx-auto px-margin-mobile md:px-margin-desktop py-section-gap">
      <div className="max-w-3xl mx-auto text-center mb-20">
        <h1 className="font-headline-lg text-headline-lg text-on-surface mb-4">About NISA Dental</h1>
        <div className="w-16 h-1 bg-primary mx-auto rounded-full mb-6" />
        <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
          At NISA Dental Clinic, we are committed to providing exceptional dental care combined with premium surgical products. Our state-of-the-art facility and experienced team ensure every patient receives personalized, comfortable treatment.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-20">
        <div className="bg-surface-container-low p-8 rounded-xl border border-outline-variant/30 text-center">
          <span className="material-symbols-outlined text-primary text-4xl mb-4">calendar_today</span>
          <p className="font-headline-md text-headline-md text-primary">15+</p>
          <p className="text-on-surface-variant">Years Experience</p>
        </div>
        <div className="bg-surface-container-low p-8 rounded-xl border border-outline-variant/30 text-center">
          <span className="material-symbols-outlined text-primary text-4xl mb-4">favorite</span>
          <p className="font-headline-md text-headline-md text-primary">5000+</p>
          <p className="text-on-surface-variant">Happy Patients</p>
        </div>
        <div className="bg-surface-container-low p-8 rounded-xl border border-outline-variant/30 text-center">
          <span className="material-symbols-outlined text-primary text-4xl mb-4">inventory_2</span>
          <p className="font-headline-md text-headline-md text-primary">50+</p>
          <p className="text-on-surface-variant">Premium Products</p>
        </div>
      </div>

      {services.length > 0 && (
        <section id="services" className="mb-20 scroll-mt-20">
          <h2 className="font-headline-lg text-headline-lg text-on-surface text-center mb-12">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((s: any) => (
              <div key={s.id} className="bg-surface-container-low p-8 rounded-xl border border-outline-variant/30 group hover:border-primary/30 transition-all">
                <span className="material-symbols-outlined text-primary text-4xl mb-4">clinical_notes</span>
                <h3 className="font-headline-md text-headline-md text-on-surface mb-2">{s.name}</h3>
                {s.short_description && <p className="text-on-surface-variant mb-4">{s.short_description}</p>}
                {s.description && <p className="text-caption text-on-surface-variant mb-4 line-clamp-2">{s.description}</p>}
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-outline-variant/20">
                  {s.price && <span className="font-headline-md text-headline-md text-primary">PKR {s.price}</span>}
                  {s.duration_minutes && <span className="text-caption text-on-surface-variant">~{s.duration_minutes} min</span>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {team.length > 0 && (
        <section id="team" className="scroll-mt-20">
          <h2 className="font-headline-lg text-headline-lg text-on-surface text-center mb-12">Meet Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((m: any) => (
              <div key={m.id} className="bg-surface-container-low p-6 rounded-xl border border-outline-variant/30 text-center group hover:-translate-y-2 transition-transform">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-primary-fixed-dim/30 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-4xl">person</span>
                </div>
                <h3 className="font-headline-md text-headline-md text-on-surface">{m.name}</h3>
                <p className="text-primary font-label-md text-label-md mt-1">{m.title}</p>
                {m.specialties?.length > 0 && (
                  <div className="flex flex-wrap gap-2 justify-center mt-4">
                    {m.specialties.slice(0, 3).map((s: string) => (
                      <span key={s} className="bg-secondary-container px-3 py-1 rounded-full text-[11px] font-bold text-on-secondary-container uppercase tracking-wider">{s}</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
