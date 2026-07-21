import Link from "next/link"
import { ArrowRight, Stethoscope, Shield, Sparkles, Award, Phone, Calendar } from "lucide-react"
import { getSupabase } from "@/lib/supabase"
import { Card } from "@/components/ui/Card"

async function getFeaturedServices() {
  const sb = getSupabase()
  if (!sb) return []
  const { data } = await sb.from("services").select("*").eq("is_featured", true).eq("is_active", true).order("sort_order").limit(4)
  return (data || []) as any[]
}

async function getFeaturedTestimonials() {
  const sb = getSupabase()
  if (!sb) return []
  const { data } = await sb.from("testimonials").select("*").eq("is_featured", true).eq("is_approved", true).limit(3)
  return (data || []) as any[]
}

async function getFeaturedProducts() {
  const sb = getSupabase()
  if (!sb) return []
  const { data } = await sb.from("products").select("*, category:product_categories(*)").eq("is_featured", true).eq("is_active", true).limit(4)
  return (data || []) as any[]
}

export default async function HomePage() {
  const [services, testimonials, products] = await Promise.all([
    getFeaturedServices(),
    getFeaturedTestimonials(),
    getFeaturedProducts(),
  ])

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-teal-50 via-white to-cyan-50 py-24 md:py-36">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 md:text-6xl">
              Advanced Dental Care &{" "}
              <span className="text-teal-600">Surgical Supplies</span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-gray-600 md:text-xl">
              Professional dental services and premium surgical products for your practice.
              Your smile is our priority.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/appointment"
                className="inline-flex items-center gap-2 rounded-full bg-teal-600 px-8 py-3.5 text-base font-medium text-white shadow-lg shadow-teal-200 transition-all hover:bg-teal-700 hover:shadow-xl"
              >
                <Calendar className="h-5 w-5" />
                Book Appointment
              </Link>
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-8 py-3.5 text-base font-medium text-gray-700 transition-all hover:border-gray-400 hover:bg-gray-50"
              >
                <Shield className="h-5 w-5" />
                Shop Products
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-gray-900">Our Dental Services</h2>
            <p className="mt-3 text-gray-600">
              Comprehensive dental care with state-of-the-art technology
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {services.map((service: any) => (
              <Link key={service.id} href={`/services#${service.slug}`}>
                <Card className="group h-full cursor-pointer p-6 transition-all hover:shadow-lg hover:border-teal-200">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-teal-50 text-teal-600">
                    <Stethoscope className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-gray-900">{service.name}</h3>
                  <p className="text-sm text-gray-600">{service.short_description}</p>
                  {service.price && (
                    <p className="mt-3 text-sm font-semibold text-teal-600">
                      From ${service.price}
                    </p>
                  )}
                </Card>
              </Link>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 text-sm font-medium text-teal-600 hover:text-teal-700"
            >
              View All Services <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* About / Stats Section */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                Why Choose <span className="text-teal-600">Nisa Dental?</span>
              </h2>
              <p className="mt-4 leading-relaxed text-gray-600">
                With over 15 years of experience, we combine advanced dental technology
                with compassionate care. Our clinic offers a full range of services from
                routine cleanings to complex oral surgeries, all in a comfortable environment.
              </p>
              <div className="mt-8 grid grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <Award className="mt-1 h-5 w-5 shrink-0 text-teal-600" />
                  <div>
                    <p className="font-semibold text-gray-900">15+ Years</p>
                    <p className="text-sm text-gray-500">Experience</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Sparkles className="mt-1 h-5 w-5 shrink-0 text-teal-600" />
                  <div>
                    <p className="font-semibold text-gray-900">5000+</p>
                    <p className="text-sm text-gray-500">Happy Patients</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Shield className="mt-1 h-5 w-5 shrink-0 text-teal-600" />
                  <div>
                    <p className="font-semibold text-gray-900">Modern Tech</p>
                    <p className="text-sm text-gray-500">Latest Equipment</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Stethoscope className="mt-1 h-5 w-5 shrink-0 text-teal-600" />
                  <div>
                    <p className="font-semibold text-gray-900">Expert Team</p>
                    <p className="text-sm text-gray-500">Specialists</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="rounded-2xl bg-teal-600 p-8 text-white">
              <h3 className="text-2xl font-bold">Book Your Visit</h3>
              <p className="mt-2 text-teal-100">
                Schedule an appointment today and experience premium dental care.
              </p>
              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 shrink-0" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <Link
                  href="/appointment"
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-teal-700 transition-colors hover:bg-teal-50"
                >
                  <Calendar className="h-4 w-4" />
                  Book Online Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {products.length > 0 && (
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold text-gray-900">Featured Products</h2>
              <p className="mt-3 text-gray-600">Premium surgical supplies for your practice</p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {products.map((product: any) => (
                <Link key={product.id} href={`/shop/${product.slug}`}>
                  <Card className="group h-full cursor-pointer overflow-hidden transition-all hover:shadow-lg">
                    <div className="aspect-square bg-gray-50 p-8 flex items-center justify-center">
                      <div className="text-4xl text-gray-300">🛒</div>
                    </div>
                    <div className="p-4">
                      <p className="text-xs font-medium uppercase tracking-wider text-teal-600">
                        {product.category?.name || "Product"}
                      </p>
                      <h3 className="mt-1 font-semibold text-gray-900">{product.name}</h3>
                      <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                        {product.short_description}
                      </p>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-lg font-bold text-teal-600">
                          ${product.sale_price || product.price}
                        </span>
                        {product.sale_price && (
                          <span className="text-sm text-gray-400 line-through">
                            ${product.price}
                          </span>
                        )}
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
            <div className="mt-10 text-center">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 rounded-full bg-teal-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-teal-700"
              >
                Shop All Products <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section className="bg-gray-50 py-20">
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold text-gray-900">What Our Patients Say</h2>
              <p className="mt-3 text-gray-600">Real reviews from real patients</p>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {testimonials.map((t: any) => (
                <Card key={t.id} className="p-6">
                  <div className="mb-3 flex gap-1">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <span key={i} className="text-yellow-400">★</span>
                    ))}
                  </div>
                  <p className="text-sm italic text-gray-600">&ldquo;{t.content}&rdquo;</p>
                  <div className="mt-4 border-t pt-4">
                    <p className="font-semibold text-gray-900">{t.patient_name}</p>
                    {t.patient_title && (
                      <p className="text-xs text-gray-500">{t.patient_title}</p>
                    )}
                  </div>
                </Card>
              ))}
            </div>
            <div className="mt-10 text-center">
              <Link
                href="/testimonials"
                className="inline-flex items-center gap-2 text-sm font-medium text-teal-600 hover:text-teal-700"
              >
                Read All Reviews <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Contact CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900">Get In Touch</h2>
          <p className="mx-auto mt-3 max-w-xl text-gray-600">
            Have questions? We are here to help. Contact us for appointments, product inquiries, or general information.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-teal-600 px-8 py-3.5 text-base font-medium text-white transition-colors hover:bg-teal-700"
            >
              <Phone className="h-5 w-5" />
              Contact Us
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-8 py-3.5 text-base font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              Learn More About Us
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
