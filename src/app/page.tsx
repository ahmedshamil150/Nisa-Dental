import Image from "next/image"
import Link from "next/link"
import dynamic from "next/dynamic"
import { getSupabase } from "@/lib/supabase"
import { safeMaterialIcon } from "@/lib/material-icons"
import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll"

const TestimonialsCarousel = dynamic(() => import("@/components/ui/TestimonialsCarousel").then(m => ({ default: m.TestimonialsCarousel })))

async function getServices() {
  const sb = getSupabase()
  if (!sb) return []
  const { data } = await sb.from("services").select("*").eq("is_active", true).order("sort_order")
  return (data || []) as any[]
}

async function getTestimonials() {
  const sb = getSupabase()
  if (!sb) return []
  const { data } = await sb.from("testimonials").select("*").eq("is_approved", true).order("created_at", { ascending: false })
  return (data || []) as any[]
}

export default async function HomePage() {
  const [services, testimonials] = await Promise.all([getServices(), getTestimonials()])

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden -mt-14 px-margin-mobile md:px-margin-desktop pt-14 md:pt-section-gap pb-section-gap min-h-[80vh] md:min-h-screen flex items-center">
        <div className="absolute inset-0 z-0">
          <Image src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=1200&q=80" alt="" fill sizes="100vw" className="object-cover" priority quality={60} />
          <div className="absolute inset-0 bg-gradient-to-r from-surface/90 via-surface/40 via-primary/10 to-transparent" />
        </div>
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-secondary-container/50 px-3 md:px-4 py-1 rounded-full mb-4 md:mb-6">
            <span className="material-symbols-outlined text-primary text-[14px] md:text-[18px]">verified</span>
            <span className="font-label-md text-[10px] md:text-label-md text-on-secondary-container">PREMIUM DENTAL CARE</span>
          </div>
          <h1 className="font-headline-xl text-[28px] md:text-headline-xl text-on-surface mb-4 md:mb-6 leading-tight">
            Exceptional Care for your <span className="text-primary italic font-medium">Perfect Smile</span>
          </h1>
          <p className="font-body-lg text-[14px] md:text-body-lg text-on-surface-variant mb-6 md:mb-10 max-w-lg">
            Experience a new standard of dental healthcare where advanced technology meets compassionate, gentle treatment in a serene environment.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
            <Link
              href="/appointment"
              className="bg-primary text-on-primary px-6 md:px-8 py-3 md:py-4 rounded-lg font-label-md text-[13px] md:text-label-md hover:shadow-lg transition-all active:scale-95 text-center"
            >
              Book Appointment
            </Link>
            <Link
              href="/services"
              className="border border-primary text-primary px-6 md:px-8 py-3 md:py-4 rounded-lg font-label-md text-[13px] md:text-label-md hover:bg-primary/5 transition-all active:scale-95 text-center"
            >
              View Our Services
            </Link>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="px-margin-mobile md:px-margin-desktop py-section-gap">
        <AnimateOnScroll>
        <div className="text-center mb-16">
          <h2 className="font-headline-lg text-headline-lg text-on-surface mb-4">Our Services</h2>
          <div className="w-16 h-1 bg-primary mx-auto rounded-full" />
        </div>
        </AnimateOnScroll>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter max-w-container-max mx-auto">
          {services.slice(0, 4).map((s, i) => (
            <AnimateOnScroll key={s.id} delay={Math.min(i * 0.05, 0.2)}>
              <div className="flex h-full flex-col bg-surface-container-low p-8 rounded-xl border border-outline-variant/30 group hover:border-primary/30 hover:-translate-y-1 transition-all duration-300">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <span className="material-symbols-outlined text-primary text-2xl">{safeMaterialIcon(s.icon)}</span>
                </div>
                <h3 className="font-headline-md text-headline-md text-on-surface mb-2">{s.name}</h3>
                {s.short_description && <p className="text-on-surface-variant mb-3">{s.short_description}</p>}
                {s.description && <p className="text-caption text-on-surface-variant mb-4 line-clamp-3">{s.description}</p>}
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-outline-variant/20">
                  {s.price ? (
                    <span className="font-headline-md text-headline-md text-primary">PKR {s.price.toLocaleString()}</span>
                  ) : (
                    <span className="font-headline-md text-headline-md text-primary">On Consultation</span>
                  )}
                  {s.duration_minutes && <span className="text-caption text-on-surface-variant">~{s.duration_minutes} min</span>}
                </div>
                <Link
                  href="/appointment"
                  className="mt-6 block w-full bg-primary text-on-primary px-5 py-3 rounded-lg font-label-md text-label-md text-center hover:bg-primary/90 active:scale-95 transition-all"
                >
                  Book Appointment
                </Link>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-surface-container-low px-margin-mobile md:px-margin-desktop py-section-gap border-y border-outline-variant/20">
        <AnimateOnScroll>
        <div className="max-w-container-max mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
            <div className="relative">
              <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl relative z-10 border border-outline-variant/30">
                <Image src="https://images.unsplash.com/photo-1551076805-e1869033e561?w=800&q=80" alt="Nisa Dental Clinic interior showing modern treatment facility" fill sizes="(max-width: 768px) 100vw, 400px" className="object-cover" />
              </div>
              <div className="absolute -bottom-10 -right-10 bg-surface p-8 rounded-xl shadow-xl z-20 border border-outline-variant/20 hidden lg:block">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-primary text-on-primary w-12 h-12 rounded-full flex items-center justify-center">
                    <span className="material-symbols-outlined">star</span>
                  </div>
                  <div>
                    <div className="font-headline-md text-headline-md text-primary">15+</div>
                    <div className="font-label-md text-label-md text-on-surface-variant">Years of Expertise</div>
                  </div>
                </div>
              </div>
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-primary-container rounded-full opacity-20 blur-3xl" />
            </div>
            <div>
              <h2 className="font-headline-lg text-headline-lg text-on-surface mb-6">Experience the NISA Difference</h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant mb-12">We combine world-class medical expertise with a hospitality-first mindset, ensuring every patient feels seen, heard, and cared for.</p>
              <div className="space-y-10">
                <div className="flex gap-6">
                  <div className="flex-shrink-0 w-12 h-12 bg-white rounded-lg flex items-center justify-center border border-outline-variant/30">
                    <span className="material-symbols-outlined text-primary">stethoscope</span>
                  </div>
                  <div>
                    <h3 className="font-headline-md text-headline-md text-on-surface mb-1">Expert Doctors</h3>
                    <p className="text-on-surface-variant">Our clinicians are board-certified specialists committed to ongoing research and advanced techniques.</p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="flex-shrink-0 w-12 h-12 bg-white rounded-lg flex items-center justify-center border border-outline-variant/30">
                    <span className="material-symbols-outlined text-primary">biotech</span>
                  </div>
                  <div>
                    <h3 className="font-headline-md text-headline-md text-on-surface mb-1">Modern Tech</h3>
                    <p className="text-on-surface-variant">Utilizing AI-driven diagnostics, 3D imaging, and laser dentistry for minimally invasive procedures.</p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="flex-shrink-0 w-12 h-12 bg-white rounded-lg flex items-center justify-center border border-outline-variant/30">
                    <span className="material-symbols-outlined text-primary">volunteer_activism</span>
                  </div>
                  <div>
                    <h3 className="font-headline-md text-headline-md text-on-surface mb-1">Gentle Care</h3>
                    <p className="text-on-surface-variant">Specialized comfort protocols to ensure a pain-free and anxiety-free experience for every patient.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        </AnimateOnScroll>
      </section>

      <AnimateOnScroll>
      <TestimonialsCarousel testimonials={testimonials} />
      </AnimateOnScroll>

      {/* CTA Section */}
      <AnimateOnScroll>
      <section className="px-margin-mobile md:px-margin-desktop py-section-gap">
        <div className="max-w-container-max mx-auto bg-primary rounded-2xl p-12 md:p-20 text-center relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="font-headline-lg text-headline-lg text-on-primary mb-6">Ready to transform your smile?</h2>
            <p className="text-on-primary/80 max-w-xl mx-auto mb-10 font-body-lg">Schedule your initial consultation today and experience the difference of clinical excellence and patient-focused care.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/appointment" className="bg-surface text-primary px-10 py-4 rounded-lg font-label-md text-label-md hover:shadow-xl transition-all active:scale-95">
                Book Your Appointment
              </Link>
              <Link href="/contact" className="bg-primary-container text-on-primary-container px-10 py-4 rounded-lg font-label-md text-label-md hover:bg-primary-container/90 transition-all active:scale-95">
                Contact Clinic
              </Link>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/5 rounded-full -ml-32 -mb-32 blur-3xl" />
        </div>
      </section></AnimateOnScroll>
    </>
  )
}
