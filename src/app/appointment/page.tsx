"use client"

import { Suspense, useState, useEffect } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/Card"
import { useToast } from "@/lib/toast-context"

function AppointmentForm() {
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [services, setServices] = useState<any[]>([])
  const { addToast } = useToast()

  useEffect(() => {
    fetch("/api/services").then((r) => r.json()).then(setServices).catch(console.error)
  }, [])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError("")
    setLoading(true)

    const fd = new FormData(e.currentTarget)
    try {
      const res = await fetch("/api/appointment", { method: "POST", body: fd })
      const data = await res.json()
      if (res.ok && data.success) {
        addToast("Appointment request submitted!")
        setSubmitted(true)
      } else {
        setError(data.error === "missing-fields" ? "Please fill in all required fields." : "Something went wrong. Please try again.")
      }
    } catch {
      setError("Something went wrong. Please try again.")
    }
    setLoading(false)
  }

  if (submitted) {
    return (
      <div className="container mx-auto px-margin-mobile md:px-margin-desktop py-section-gap">
        <div className="max-w-lg mx-auto text-center">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <span className="material-symbols-outlined text-[48px] text-primary">check_circle</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface mb-4">Thank You!</h1>
          <p className="font-body-lg text-on-surface-variant mb-4">
            Your appointment request has been submitted successfully.
          </p>
          <p className="font-body-md text-on-surface-variant mb-8">
            You will shortly receive a confirmation email with your appointment details.
          </p>
          <Link href="/" className="bg-primary text-on-primary px-8 py-4 rounded-lg font-label-md text-label-md hover:bg-primary/90 inline-flex items-center gap-2">
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-margin-mobile md:px-margin-desktop py-section-gap">
      <div className="max-w-3xl mx-auto text-center mb-16">
        <h1 className="font-headline-lg text-headline-lg text-on-surface mb-4">Book an Appointment</h1>
        <div className="w-16 h-1 bg-primary mx-auto rounded-full mb-6" />
        <p className="font-body-lg text-body-lg text-on-surface-variant">Schedule your visit. We&apos;ll confirm within 24 hours.</p>
      </div>

      <div className="max-w-2xl mx-auto">
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-error-container text-on-error-container text-sm flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">error</span>
            {error}
          </div>
        )}

        <Card className="p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="patient_name" className="font-label-md text-label-md text-on-surface block mb-1">Full Name *</label>
                <input type="text" name="patient_name" id="patient_name" required
                  className="w-full rounded-lg border border-outline-variant bg-surface px-4 py-3 font-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                  placeholder="John Doe" />
              </div>
              <div>
                <label htmlFor="patient_email" className="font-label-md text-label-md text-on-surface block mb-1">Email *</label>
                <input type="email" name="patient_email" id="patient_email" required
                  className="w-full rounded-lg border border-outline-variant bg-surface px-4 py-3 font-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                  placeholder="john@email.com" />
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="patient_phone" className="font-label-md text-label-md text-on-surface block mb-1">Phone</label>
                <input type="tel" name="patient_phone" id="patient_phone"
                  className="w-full rounded-lg border border-outline-variant bg-surface px-4 py-3 font-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                  placeholder="03XX-XXXXXXX" />
              </div>
              <div>
                <label htmlFor="service_id" className="font-label-md text-label-md text-on-surface block mb-1">Service</label>
                <select name="service_id" id="service_id"
                  className="w-full rounded-lg border border-outline-variant bg-surface px-4 py-3 font-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none">
                  <option value="">Select a service</option>
                  {services.map((s: any) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="appointment_date" className="font-label-md text-label-md text-on-surface block mb-1">Preferred Date *</label>
                <input type="date" name="appointment_date" id="appointment_date" required
                  className="w-full rounded-lg border border-outline-variant bg-surface px-4 py-3 font-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
              </div>
              <div>
                <label htmlFor="appointment_time" className="font-label-md text-label-md text-on-surface block mb-1">Preferred Time *</label>
                <input type="time" name="appointment_time" id="appointment_time" required
                  className="w-full rounded-lg border border-outline-variant bg-surface px-4 py-3 font-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
              </div>
            </div>

            <div>
              <label htmlFor="notes" className="font-label-md text-label-md text-on-surface block mb-1">Notes</label>
              <textarea name="notes" id="notes" rows={3}
                className="w-full rounded-lg border border-outline-variant bg-surface px-4 py-3 font-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                placeholder="Any special requests..." />
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-primary text-on-primary py-4 rounded-lg font-label-md text-label-md hover:bg-primary/90 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50">
              <span className="material-symbols-outlined text-[20px]">calendar_today</span>
              {loading ? "Submitting..." : "Book Appointment"}
            </button>
          </form>
        </Card>
      </div>
    </div>
  )
}

export default function AppointmentPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-margin-mobile md:px-margin-desktop py-section-gap text-center">
        <p className="font-body-lg text-on-surface-variant">Loading...</p>
      </div>
    }>
      <AppointmentForm />
    </Suspense>
  )
}
