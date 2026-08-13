import type { Metadata } from "next"
import { getSupabase } from "@/lib/supabase"
import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll"
import Link from "next/link"

export const metadata: Metadata = {
  title: "About Us - Our Dental Team & Clinic in Sialkot",
  description: "Meet the experienced team at Nisa Dental & Surgical in Sialkot. Learn about our modern facility, our approach to gentle dental care, and why patients trust us.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About Nisa Dental & Surgical, Sialkot",
    description: "Our story, our dental team, and our commitment to comfortable, expert dental care in Sialkot.",
    type: "website",
    url: "/about",
  },
}

async function getTeam() {
  const sb = getSupabase()
  if (!sb) return []
  const { data } = await sb.from("team_members").select("*").eq("is_active", true).order("sort_order")
  return (data || []) as any[]
}

export default async function AboutPage() {
  const team = await getTeam()

  return (
    <div className="container mx-auto px-margin-mobile md:px-margin-desktop py-section-gap">
      <AnimateOnScroll>
      <div className="max-w-3xl mx-auto text-center mb-20">
        <h1 className="font-headline-lg text-headline-lg text-on-surface mb-4">About NISA Dental</h1>
        <div className="w-16 h-1 bg-primary mx-auto rounded-full mb-6" />
        <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
          At NISA Dental Clinic, we are committed to providing exceptional dental care. Our state-of-the-art facility and experienced team ensure every patient receives personalized, comfortable treatment.
        </p>
        <Link href="/services" className="mt-8 inline-flex items-center gap-2 bg-primary text-on-primary px-8 py-4 rounded-lg font-label-md text-label-md hover:bg-primary/90 transition-all active:scale-95">
          View Our Services <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </Link>
      </div>
      </AnimateOnScroll>

      <AnimateOnScroll delay={0.15}>
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
      </AnimateOnScroll>
      {team.length > 0 && (
        <AnimateOnScroll>
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
        </AnimateOnScroll>
      )}
    </div>
  )
}
