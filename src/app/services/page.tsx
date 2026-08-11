import type { Metadata } from "next"
import { getSupabase } from "@/lib/supabase"
import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Dental Services & Pricing in Sialkot",
  description: "Explore Nisa Dental's services — scaling & polishing, root canal, fillings, extraction, braces and implants. Transparent pricing starting from PKR 2,000.",
  alternates: { canonical: "/services" },
  openGraph: {
    title: "Dental Services & Pricing | Nisa Dental & Surgical",
    description: "Transparent dental pricing in Sialkot — scaling, root canal, fillings, braces and implants.",
    type: "website",
    url: "/services",
  },
}

type Service = {
  id: number
  name: string
  slug: string
  description: string | null
  short_description: string | null
  icon: string | null
  image_url: string | null
  price: number | null
  duration_minutes: number | null
  sort_order: number | null
  is_active: boolean
}

async function getServices() {
  const sb = getSupabase()
  if (!sb) return [] as Service[]
  const { data } = await sb.from("services").select("*").eq("is_active", true).order("sort_order")
  return (data || []) as Service[]
}

function ServiceCard({ s }: { s: Service }) {
  const fromPrice = /starting from/i.test(s.short_description || "") || /from 50/i.test(s.short_description || "") || /from 60/i.test(s.short_description || "")
  return (
    <div className="bg-surface-container-low p-8 rounded-xl border border-outline-variant/30 group hover:border-primary/30 hover:-translate-y-1 transition-all duration-300">
      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
        <span className="material-symbols-outlined text-primary text-2xl">{s.icon || "clinical_notes"}</span>
      </div>
      <h3 className="font-headline-md text-headline-md text-on-surface mb-2">{s.name}</h3>
      {s.short_description && <p className="text-on-surface-variant mb-3">{s.short_description}</p>}
      {s.description && <p className="text-caption text-on-surface-variant mb-4 line-clamp-3">{s.description}</p>}
      <div className="flex items-center justify-between mt-6 pt-4 border-t border-outline-variant/20">
        {s.price ? (
          <div>
            <span className="font-headline-md text-headline-md text-primary">PKR {s.price.toLocaleString()}</span>
            {fromPrice && <span className="text-xs text-on-surface-variant block">starting from</span>}
          </div>
        ) : (
          <span className="font-headline-md text-headline-md text-primary">On Consultation</span>
        )}
        {s.duration_minutes && <span className="text-caption text-on-surface-variant">~{s.duration_minutes} min</span>}
      </div>
    </div>
  )
}

export default async function ServicesPage() {
  const services = await getServices()

  const servicesSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: services.map((s: Service, i: number) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "MedicalProcedure",
        name: s.name,
        description: s.short_description || s.description || undefined,
        provider: { "@type": "MedicalClinic", name: "Nisa Dental & Surgical" },
        price: s.price ? `PKR ${s.price}` : undefined,
      },
    })),
  }

  return (
    <div className="container mx-auto px-margin-mobile md:px-margin-desktop py-section-gap">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesSchema) }} />

      <div className="max-w-3xl mx-auto text-center mb-16">
        <AnimateOnScroll>
        <p className="text-caption uppercase tracking-widest text-primary mb-4">Our Treatments</p>
        <h1 className="font-headline-xl text-headline-xl text-on-surface mb-4">Dental Services & Pricing</h1>
        <div className="w-16 h-1 bg-primary mx-auto rounded-full mb-6" />
        <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
          Transparent, expert dental care in Sialkot. Every treatment is performed by our experienced clinicians using modern equipment.
        </p>
        </AnimateOnScroll>
      </div>

      {services.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((s: Service, i: number) => (
            <AnimateOnScroll key={s.id} delay={Math.min(i * 0.05, 0.2)}>
              <ServiceCard s={s} />
            </AnimateOnScroll>
          ))}
        </div>
      ) : (
        <p className="text-center text-on-surface-variant py-20">Our service list is being updated. Please call us to ask about treatments.</p>
      )}

      <AnimateOnScroll>
      <div className="mt-16 bg-primary rounded-2xl p-10 md:p-14 text-center text-on-primary">
        <h2 className="font-headline-lg text-headline-lg mb-4">Not sure which treatment you need?</h2>
        <p className="text-on-primary/80 max-w-xl mx-auto mb-8 font-body-md">
          Book a consultation and our dentists will assess your smile and recommend the right treatment plan for you.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/appointment" className="bg-surface text-primary px-10 py-4 rounded-lg font-label-md text-label-md hover:shadow-xl transition-all active:scale-95">
            Book an Appointment
          </Link>
          <Link href="/contact" className="bg-primary-container text-on-primary-container px-10 py-4 rounded-lg font-label-md text-label-md hover:bg-primary-container/90 transition-all active:scale-95">
            Contact Clinic
          </Link>
        </div>
      </div>
      </AnimateOnScroll>
    </div>
  )
}
