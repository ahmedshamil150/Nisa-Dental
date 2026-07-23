import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Nisa Dental & Surgical privacy policy outlines how we collect, use, and protect your personal information.",
}

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-margin-mobile md:px-margin-desktop py-section-gap">
      <div className="max-w-3xl mx-auto">
        <h1 className="font-headline-lg text-headline-lg text-on-surface mb-4">Privacy Policy</h1>
        <div className="w-16 h-1 bg-primary rounded-full mb-8" />
        <p className="text-on-surface-variant mb-8">Last updated: July 23, 2026</p>

        <section className="mb-10">
          <h2 className="font-headline-md text-headline-md text-on-surface mb-4">1. Information We Collect</h2>
          <p className="text-on-surface-variant mb-4 leading-relaxed">
            We collect information you provide directly to us, including your name, email address, phone number, and mailing address when you book an appointment, place an order, or contact us through our website.
          </p>
          <p className="text-on-surface-variant mb-4 leading-relaxed">
            We also automatically collect certain technical information when you visit our site, including your IP address, browser type, device information, and usage data through cookies and similar technologies.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="font-headline-md text-headline-md text-on-surface mb-4">2. How We Use Your Information</h2>
          <p className="text-on-surface-variant mb-4 leading-relaxed">
            We use the collected information to:
          </p>
          <ul className="list-disc pl-6 text-on-surface-variant space-y-2 leading-relaxed">
            <li>Process and manage your appointments and orders</li>
            <li>Communicate with you about your appointments, orders, and inquiries</li>
            <li>Improve our website, products, and services</li>
            <li>Send relevant updates and promotional materials with your consent</li>
            <li>Comply with legal obligations and protect our rights</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="font-headline-md text-headline-md text-on-surface mb-4">3. Data Protection</h2>
          <p className="text-on-surface-variant mb-4 leading-relaxed">
            We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction. All payment transactions are processed securely through encrypted connections.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="font-headline-md text-headline-md text-on-surface mb-4">4. Third-Party Services</h2>
          <p className="text-on-surface-variant mb-4 leading-relaxed">
            We may share your information with trusted third-party service providers who assist us in operating our website, processing payments, and delivering services. These providers are contractually obligated to protect your data and use it only for the purposes we specify.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="font-headline-md text-headline-md text-on-surface mb-4">5. Cookies</h2>
          <p className="text-on-surface-variant mb-4 leading-relaxed">
            Our website uses cookies to enhance your browsing experience, analyze site traffic, and provide personalized content. You can control cookie preferences through your browser settings.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="font-headline-md text-headline-md text-on-surface mb-4">6. Your Rights</h2>
          <p className="text-on-surface-variant mb-4 leading-relaxed">
            You have the right to access, update, or delete your personal information at any time. To exercise these rights, please contact us using the information provided below.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="font-headline-md text-headline-md text-on-surface mb-4">7. Contact Us</h2>
          <p className="text-on-surface-variant leading-relaxed">
            If you have any questions about this Privacy Policy, please contact us at:
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
