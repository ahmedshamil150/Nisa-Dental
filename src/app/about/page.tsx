import { getSupabase } from "@/lib/supabase"
import { Card } from "@/components/ui/Card"

async function getTeamMembers() {
  const sb = getSupabase()
  if (!sb) return []
  const { data } = await sb.from("team_members")
    .select("*")
    .eq("is_active", true)
    .order("sort_order")
  return (data || []) as any[]
}

export default async function AboutPage() {
  const team = await getTeamMembers()

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        {/* About Section */}
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-3xl font-bold text-gray-900">About Nisa Dental</h1>
          <p className="mt-4 leading-relaxed text-gray-600">
            At Nisa Dental & Surgical, we are committed to providing exceptional dental care
            combined with access to premium surgical products. Our state-of-the-art facility
            and experienced team ensure every patient receives personalized, comfortable treatment.
          </p>
          <p className="mt-4 leading-relaxed text-gray-600">
            Founded by Dr. Aisha Nisa, our clinic has served the community for over 15 years,
            building a reputation for excellence in both general and specialized dental procedures.
            We believe in combining advanced technology with a gentle touch.
          </p>
        </div>

        {/* Stats */}
        <div className="mx-auto mt-16 grid max-w-4xl gap-6 sm:grid-cols-3">
          <Card className="p-6 text-center">
            <p className="text-3xl font-bold text-teal-600">15+</p>
            <p className="mt-1 text-sm text-gray-600">Years Experience</p>
          </Card>
          <Card className="p-6 text-center">
            <p className="text-3xl font-bold text-teal-600">5000+</p>
            <p className="mt-1 text-sm text-gray-600">Happy Patients</p>
          </Card>
          <Card className="p-6 text-center">
            <p className="text-3xl font-bold text-teal-600">50+</p>
            <p className="mt-1 text-sm text-gray-600">Surgical Products</p>
          </Card>
        </div>

        {/* Team */}
        {team.length > 0 && (
          <div className="mt-20">
            <div className="mb-10 text-center">
              <h2 className="text-2xl font-bold text-gray-900">Meet Our Team</h2>
              <p className="mt-2 text-gray-600">Dedicated professionals caring for your smile</p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {team.map((member: any) => (
                <Card key={member.id} className="overflow-hidden p-6 text-center">
                  <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-teal-50 text-2xl font-bold text-teal-700">
                    {member.name.split(" ").map((n: string) => n[0]).join("")}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{member.name}</h3>
                  <p className="text-sm text-teal-600">{member.title}</p>
                  {member.specialties && member.specialties.length > 0 && (
                    <div className="mt-3 flex flex-wrap justify-center gap-1.5">
                      {member.specialties.map((s: string) => (
                        <span
                          key={s}
                          className="rounded-full bg-teal-50 px-2.5 py-0.5 text-xs font-medium text-teal-700"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
