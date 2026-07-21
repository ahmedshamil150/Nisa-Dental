import Link from "next/link"
import { getSupabase } from "@/lib/supabase"
import { TestimonialsCarousel } from "@/components/ui/TestimonialsCarousel"

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
      <section className="relative overflow-hidden px-margin-mobile md:px-margin-desktop pt-16 md:pt-section-gap pb-section-gap min-h-[80vh] md:min-h-[90vh] flex items-center">
        <div className="absolute inset-0 z-0">
          <div className="w-full h-full bg-cover bg-center" style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=1600&q=80')"
          }} />
          <div className="absolute inset-0 bg-gradient-to-r from-surface via-surface/80 to-transparent" />
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
              href="/about#services"
              className="border border-primary text-primary px-6 md:px-8 py-3 md:py-4 rounded-lg font-label-md text-[13px] md:text-label-md hover:bg-primary/5 transition-all active:scale-95 text-center"
            >
              View Our Services
            </Link>
          </div>
        </div>
      </section>

      {/* Services Bento Grid */}
      <section className="px-margin-mobile md:px-margin-desktop py-section-gap">
        <div className="text-center mb-16">
          <h2 className="font-headline-lg text-headline-lg text-on-surface mb-4">Our Services</h2>
          <div className="w-16 h-1 bg-primary mx-auto rounded-full" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter max-w-container-max mx-auto">
          {services.length > 0 && (
            <>
              <div className="md:col-span-8 bg-surface-container-low p-8 md:p-10 rounded-xl border border-outline-variant/30 flex flex-col md:flex-row gap-8 items-center overflow-hidden group transition-all duration-500 hover:shadow-sm">
                <div className="flex-1">
                  <span className="material-symbols-outlined text-primary text-4xl mb-4">clinical_notes</span>
                  <h3 className="font-headline-md text-headline-md mb-3 text-on-surface">{services[0]?.name}</h3>
                  <p className="text-on-surface-variant mb-6">{services[0]?.short_description}</p>
                  <ul className="space-y-2 mb-8">
                    <li className="flex items-center gap-2 font-label-md text-label-md text-on-surface-variant">
                      <span className="material-symbols-outlined text-primary text-[18px]">check_circle</span> Routine Check-ups
                    </li>
                    <li className="flex items-center gap-2 font-label-md text-label-md text-on-surface-variant">
                      <span className="material-symbols-outlined text-primary text-[18px]">check_circle</span> Professional Cleaning
                    </li>
                  </ul>
                  <Link href="/about#services" className="text-primary font-bold flex items-center gap-2 group-hover:gap-4 transition-all">
                    Learn More <span className="material-symbols-outlined">arrow_forward</span>
                  </Link>
                </div>
                <div className="w-full md:w-1/2 aspect-square rounded-lg overflow-hidden border border-outline-variant/20 bg-primary-fixed-dim/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[80px] text-primary/30">clinical_notes</span>
                </div>
              </div>

              <div className="md:col-span-4 bg-primary text-on-primary p-8 rounded-xl border border-primary-container flex flex-col justify-between transition-all duration-500 hover:shadow-xl">
                <div>
                  <span className="material-symbols-outlined text-on-primary text-4xl mb-4">dentistry</span>
                  <h3 className="font-headline-md text-headline-md mb-3">Orthodontics</h3>
                  <p className="text-primary-fixed opacity-90">Align your smile with modern solutions from invisible aligners to precision braces.</p>
                </div>
                <div className="mt-8">
                  <div className="bg-primary-container/20 p-4 rounded-lg border border-primary-fixed/20 mb-6">
                    <p className="font-label-md text-label-md italic">&ldquo;Life changing results.&rdquo;</p>
                  </div>
                  <Link
                    href="/appointment"
                    className="block w-full bg-surface text-primary py-3 rounded-lg font-label-md text-label-md hover:bg-surface-dim transition-colors text-center"
                  >
                    Book Consultant
                  </Link>
                </div>
              </div>

              <div className="md:col-span-6 bg-surface-container-low p-8 rounded-xl border border-outline-variant/30 group hover:border-primary/30 transition-all">
                <div className="mb-6 rounded-lg overflow-hidden h-48 bg-cover bg-center border border-outline-variant/10 bg-primary-fixed-dim/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[60px] text-primary/30">brightness_high</span>
                </div>
                <h3 className="font-headline-md text-headline-md mb-2 text-on-surface">Teeth Whitening</h3>
                <p className="text-on-surface-variant mb-6">Professional grade brightening treatments that deliver immediate, safe, and stunning results.</p>
                <div className="flex gap-2">
                  <span className="bg-secondary-container px-3 py-1 rounded-full text-[12px] font-bold text-on-secondary-container uppercase tracking-wider">Most Popular</span>
                </div>
              </div>

              <div className="md:col-span-6 bg-tertiary-container text-on-tertiary-container p-8 rounded-xl border border-tertiary flex items-center justify-between overflow-hidden relative">
                <div className="z-10 relative">
                  <h3 className="font-headline-md text-headline-md mb-2">Pediatric Care</h3>
                  <p className="opacity-80 max-w-xs mb-4">Gentle, fun, and educational dental visits designed specifically for our youngest patients.</p>
                  <Link
                    href="/about#services"
                    className="inline-block bg-tertiary text-on-tertiary px-6 py-2 rounded-lg font-label-md text-label-md hover:bg-tertiary/90 transition-all"
                  >
                    Explore
                  </Link>
                </div>
                <span className="material-symbols-outlined text-[120px] absolute -right-4 -bottom-4 opacity-10 rotate-12">child_care</span>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-surface-container-low px-margin-mobile md:px-margin-desktop py-section-gap border-y border-outline-variant/20">
        <div className="max-w-container-max mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
            <div className="relative">
              <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl relative z-10 border border-outline-variant/30 bg-primary-fixed-dim/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-[100px] text-primary/20">stethoscope</span>
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
                    <h4 className="font-headline-md text-headline-md text-on-surface mb-1">Expert Doctors</h4>
                    <p className="text-on-surface-variant">Our clinicians are board-certified specialists committed to ongoing research and advanced techniques.</p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="flex-shrink-0 w-12 h-12 bg-white rounded-lg flex items-center justify-center border border-outline-variant/30">
                    <span className="material-symbols-outlined text-primary">biotech</span>
                  </div>
                  <div>
                    <h4 className="font-headline-md text-headline-md text-on-surface mb-1">Modern Tech</h4>
                    <p className="text-on-surface-variant">Utilizing AI-driven diagnostics, 3D imaging, and laser dentistry for minimally invasive procedures.</p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="flex-shrink-0 w-12 h-12 bg-white rounded-lg flex items-center justify-center border border-outline-variant/30">
                    <span className="material-symbols-outlined text-primary">volunteer_activism</span>
                  </div>
                  <div>
                    <h4 className="font-headline-md text-headline-md text-on-surface mb-1">Gentle Care</h4>
                    <p className="text-on-surface-variant">Specialized comfort protocols to ensure a pain-free and anxiety-free experience for every patient.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <TestimonialsCarousel testimonials={testimonials} />

      {/* CTA Section */}
      <section className="px-margin-mobile md:px-margin-desktop py-section-gap">
        <div className="max-w-container-max mx-auto bg-primary rounded-2xl p-12 md:p-20 text-center relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="font-headline-lg text-headline-lg text-on-primary mb-6">Ready to transform your smile?</h2>
            <p className="text-primary-fixed opacity-90 max-w-xl mx-auto mb-10 font-body-lg">Schedule your initial consultation today and experience the difference of clinical excellence and patient-focused care.</p>
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
      </section>
    </>
  )
}
