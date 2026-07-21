import { getSupabase } from "@/lib/supabase"
import { Card } from "@/components/ui/Card"
import { Star } from "lucide-react"

async function getTestimonials() {
  const sb = getSupabase()
  if (!sb) return []
  const { data } = await sb.from("testimonials")
    .select("*")
    .eq("is_approved", true)
    .order("created_at", { ascending: false })
  return (data || []) as any[]
}

export default async function TestimonialsPage() {
  const testimonials = await getTestimonials()

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h1 className="text-3xl font-bold text-gray-900">Patient Testimonials</h1>
          <p className="mt-3 text-gray-600">
            Hear from our patients about their experience at Nisa Dental
          </p>
        </div>

        {testimonials.length === 0 ? (
          <div className="rounded-xl border-2 border-dashed p-16 text-center">
            <p className="text-gray-500">No testimonials yet</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((t: any) => (
              <Card key={t.id} className="p-6">
                <div className="mb-3 flex gap-1">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-sm italic leading-relaxed text-gray-600">
                  &ldquo;{t.content}&rdquo;
                </p>
                <div className="mt-4 flex items-center gap-3 border-t pt-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-100 text-sm font-bold text-teal-700">
                    {t.patient_name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{t.patient_name}</p>
                    {t.patient_title && (
                      <p className="text-xs text-gray-500">{t.patient_title}</p>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
