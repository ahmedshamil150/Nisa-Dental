import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Nisa Dental & Surgical terms of service govern the use of our website, services, and products.",
}

export default function TermsPage() {
  return (
    <div className="container mx-auto px-margin-mobile md:px-margin-desktop py-section-gap">
      <div className="max-w-3xl mx-auto">
        <h1 className="font-headline-lg text-headline-lg text-on-surface mb-4">Terms of Service</h1>
        <div className="w-16 h-1 bg-primary rounded-full mb-8" />
        <p className="text-on-surface-variant mb-8">Last updated: July 23, 2026</p>

        <section className="mb-10">
          <h2 className="font-headline-md text-headline-md text-on-surface mb-4">1. Acceptance of Terms</h2>
          <p className="text-on-surface-variant leading-relaxed">
            By accessing or using the Nisa Dental & Surgical website, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you should not use our website or services.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="font-headline-md text-headline-md text-on-surface mb-4">2. Services</h2>
          <p className="text-on-surface-variant leading-relaxed">
            Nisa Dental & Surgical provides dental care services and surgical product sales. Appointment scheduling, product purchases, and all other services are subject to availability and our professional discretion. We reserve the right to refuse service to anyone for any lawful reason.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="font-headline-md text-headline-md text-on-surface mb-4">3. Orders & Payments</h2>
          <p className="text-on-surface-variant mb-4 leading-relaxed">
            All orders placed through our website are subject to acceptance and availability. We reserve the right to cancel any order for any reason, including pricing errors or stock unavailability.
          </p>
          <p className="text-on-surface-variant leading-relaxed">
            Prices are listed in Pakistani Rupees (PKR) and include applicable taxes unless stated otherwise. Payment must be received in full before orders are processed.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="font-headline-md text-headline-md text-on-surface mb-4">4. Shipping & Returns</h2>
          <p className="text-on-surface-variant mb-4 leading-relaxed">
            We deliver within Sialkot and surrounding areas. Delivery times are estimates and not guaranteed. Risk of loss passes to you upon delivery.
          </p>
          <p className="text-on-surface-variant leading-relaxed">
            Returns are accepted within 7 days of delivery for unused and unopened products. Custom or personalized items are non-returnable.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="font-headline-md text-headline-md text-on-surface mb-4">5. Appointments</h2>
          <p className="text-on-surface-variant leading-relaxed">
            Appointments are subject to practitioner availability. We require at least 24 hours notice for cancellations. Repeated no-shows may result in restricted booking privileges.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="font-headline-md text-headline-md text-on-surface mb-4">6. Intellectual Property</h2>
          <p className="text-on-surface-variant leading-relaxed">
            All content on this website, including text, images, logos, and designs, is the property of Nisa Dental & Surgical and is protected by applicable intellectual property laws. You may not reproduce, distribute, or modify any content without our written permission.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="font-headline-md text-headline-md text-on-surface mb-4">7. Limitation of Liability</h2>
          <p className="text-on-surface-variant leading-relaxed">
            Nisa Dental & Surgical shall not be liable for any indirect, incidental, or consequential damages arising from your use of our website or services, to the fullest extent permitted by law.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="font-headline-md text-headline-md text-on-surface mb-4">8. Changes to Terms</h2>
          <p className="text-on-surface-variant leading-relaxed">
            We reserve the right to update these terms at any time. Changes will be posted on this page with an updated revision date. Continued use of our website after changes constitutes acceptance of the new terms.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="font-headline-md text-headline-md text-on-surface mb-4">9. Contact</h2>
          <p className="text-on-surface-variant leading-relaxed">
            For questions about these Terms of Service, please contact us at:
          </p>
          <p className="text-on-surface-variant leading-relaxed mt-4">
            Nisa Dental Clinic<br />
            Aimnabad Road, Sialkot<br />
            Email: info@nisadental.com<br />
            Phone: 0334-1710086
          </p>
        </section>
      </div>
    </div>
  )
}
