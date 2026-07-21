import Link from "next/link"
import { getSupabase } from "@/lib/supabase"
import { Card } from "@/components/ui/Card"
import { Stethoscope, Sparkles, ArrowRight, Syringe, Heart, Baby, ArrowBigRightDash } from "lucide-react"

const iconMap: Record<string, any> = {
  Tooth: Stethoscope,
  Sparkles: Sparkles,
  Syringe: Syringe,
  Heart: Heart,
  Baby: Baby,
  ArrowBigRightDash: ArrowBigRightDash,
}

async function getServices() {
  const sb = getSupabase()
  if (!sb) return []
  const { data } = await sb.from("services").select("*").eq("is_active", true).order("sort_order")
  return (data || []) as any[]
}

export default async function ServicesPage() {
  const services = await getServices()

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h1 className="text-3xl font-bold text-gray-900">Our Dental Services</h1>
          <p className="mt-3 text-gray-600">
            Comprehensive dental care tailored to your needs
          </p>
        </div>

        {services.length === 0 ? (
          <div className="rounded-xl border-2 border-dashed p-16 text-center">
            <p className="text-gray-500">No services listed yet</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service: any) => {
              const Icon = iconMap[service.icon || ""] || Stethoscope
              return (
                <Card key={service.id} className="group overflow-hidden p-6 transition-all hover:shadow-lg hover:border-teal-200">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                    <Icon className="h-7 w-7" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">{service.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-600">
                    {service.short_description}
                  </p>
                  {service.description && (
                    <p className="mt-2 text-sm text-gray-500 line-clamp-2">
                      {service.description}
                    </p>
                  )}
                  <div className="mt-4 flex items-center justify-between">
                    {service.price && (
                      <span className="text-lg font-bold text-teal-600">
                        From ${service.price}
                      </span>
                    )}
                    {service.duration_minutes && (
                      <span className="text-sm text-gray-400">
                        ~{service.duration_minutes} min
                      </span>
                    )}
                  </div>
                </Card>
              )
            })}
          </div>
        )}

        <div className="mt-12 text-center">
          <Link
            href="/appointment"
            className="inline-flex items-center gap-2 rounded-full bg-teal-600 px-8 py-3.5 text-base font-medium text-white transition-colors hover:bg-teal-700"
          >
            Book an Appointment <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </div>
  )
}
