import type { Metadata } from "next"
import Link from "next/link"
import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll"

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description: "Answers to common questions about Nisa Dental's treatments, pricing, appointments and clinic in Sialkot.",
  alternates: { canonical: "/faq" },
  openGraph: {
    title: "FAQs | Nisa Dental & Surgical",
    description: "Answers to common questions about our dental treatments, pricing and appointments.",
    type: "website",
    url: "/faq",
  },
}

const faqs = [
  {
    q: "What dental services does Nisa Dental offer?",
    a: "We offer a full range of dental care including scaling and polishing, root canal treatment, fillings (laser and GIC), simple and surgical extraction, orthodontic braces, and dental implants.",
  },
  {
    q: "How much does a root canal treatment cost?",
    a: "A root canal treatment at Nisa Dental costs between PKR 6,000 and PKR 8,000 depending on the tooth and complexity. The exact cost is confirmed after an examination.",
  },
  {
    q: "How much does teeth scaling and polishing cost?",
    a: "Scaling and polishing is PKR 6,000. It is recommended every 6–12 months to keep your gums healthy and prevent tartar buildup.",
  },
  {
    q: "Do you offer braces and what do they cost?",
    a: "Yes, we offer orthodontic braces starting from PKR 50,000. The final cost depends on the complexity of your case and treatment duration.",
  },
  {
    q: "How much do dental implants cost?",
    a: "Dental implants start from PKR 60,000 per implant. This includes the implant placement and the abutment; the final crown is quoted separately after consultation.",
  },
  {
    q: "Do you accept walk-in patients?",
    a: "Yes, we accept walk-in patients, but we recommend booking an appointment in advance to reduce waiting time and ensure the right doctor is available for you.",
  },
  {
    q: "How do I book an appointment?",
    a: "You can book an appointment through our website's appointment form, or by calling us at 0334-1710086. We respond promptly to confirm your slot.",
  },
  {
    q: "Where is Nisa Dental located?",
    a: "Our dental clinic is on Aimnabad Road, Sialkot, and our surgical facility is on Kareempura Road, Sialkot. Contact us for directions or guidance.",
  },
  {
    q: "Is the treatment painful?",
    a: "We prioritize patient comfort. We use modern techniques and, where appropriate, local anaesthesia and laser dentistry to keep procedures as pain-free as possible.",
  },
  {
    q: "What are your clinic hours?",
    a: "We are open Monday to Friday from 9:00 AM to 6:00 PM and Saturday from 10:00 AM to 2:00 PM. We are closed on Sunday.",
  },
]

export default function FAQPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  }

  return (
    <div className="container mx-auto px-margin-mobile md:px-margin-desktop py-section-gap">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <div className="max-w-3xl mx-auto text-center mb-16">
        <AnimateOnScroll>
        <p className="text-caption uppercase tracking-widest text-primary mb-4">Help Center</p>
        <h1 className="font-headline-xl text-headline-xl text-on-surface mb-4">Frequently Asked Questions</h1>
        <div className="w-16 h-1 bg-primary mx-auto rounded-full mb-6" />
        <p className="font-body-lg text-body-lg text-on-surface-variant">
          Quick answers to the questions we hear most often from our patients.
        </p>
        </AnimateOnScroll>
      </div>

      <div className="max-w-3xl mx-auto">
        <AnimateOnScroll>
        <div className="space-y-4">
          {faqs.map((f, i) => (
            <details key={i} className="group bg-surface-container-low rounded-xl border border-outline-variant/30 open:border-primary/40 overflow-hidden">
              <summary className="flex items-center justify-between gap-4 px-6 py-5 cursor-pointer list-none font-label-md text-label-md text-on-surface hover:bg-surface-container transition-colors">
                <span>{f.q}</span>
                <span className="material-symbols-outlined text-primary shrink-0 transition-transform group-open:rotate-180">expand_more</span>
              </summary>
              <div className="px-6 pb-6 pt-1 text-on-surface-variant font-body-md">{f.a}</div>
            </details>
          ))}
        </div>
        </AnimateOnScroll>

        <AnimateOnScroll>
        <div className="mt-14 bg-primary rounded-2xl p-10 text-center text-on-primary">
          <h2 className="font-headline-lg text-headline-lg mb-3">Still have questions?</h2>
          <p className="text-on-primary/80 mb-6">We&apos;re happy to help. Reach out or book a consultation.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="bg-surface text-primary px-8 py-3.5 rounded-lg font-label-md text-label-md hover:shadow-lg transition-all">Contact Us</Link>
            <Link href="/appointment" className="bg-primary-container text-on-primary-container px-8 py-3.5 rounded-lg font-label-md text-label-md hover:bg-primary-container/90 transition-all">Book Appointment</Link>
          </div>
        </div>
        </AnimateOnScroll>
      </div>
    </div>
  )
}
