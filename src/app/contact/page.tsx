import { Card } from "@/components/ui/Card"

export default function ContactPage() {
  return (
    <div className="container mx-auto px-margin-mobile md:px-margin-desktop py-section-gap">
      <div className="max-w-3xl mx-auto text-center mb-16">
        <h1 className="font-headline-lg text-headline-lg text-on-surface mb-4">Contact Us</h1>
        <div className="w-16 h-1 bg-primary mx-auto rounded-full mb-6" />
        <p className="font-body-lg text-body-lg text-on-surface-variant">Get in touch for appointments, inquiries, or feedback</p>
      </div>

      <div className="grid gap-12 md:grid-cols-2">
        <Card className="p-8">
          <h2 className="font-headline-md text-headline-md text-on-surface mb-6">Send Us a Message</h2>
          <form action="/api/contact" method="POST" className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="font-label-md text-label-md text-on-surface block mb-1">Name *</label>
                <input type="text" name="name" id="name" required
                  className="w-full rounded-lg border border-outline-variant bg-surface px-4 py-3 font-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                  placeholder="Your name" />
              </div>
              <div>
                <label htmlFor="email" className="font-label-md text-label-md text-on-surface block mb-1">Email *</label>
                <input type="email" name="email" id="email" required
                  className="w-full rounded-lg border border-outline-variant bg-surface px-4 py-3 font-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                  placeholder="your@email.com" />
              </div>
            </div>
            <div>
              <label htmlFor="phone" className="font-label-md text-label-md text-on-surface block mb-1">Phone</label>
              <input type="tel" name="phone" id="phone"
                className="w-full rounded-lg border border-outline-variant bg-surface px-4 py-3 font-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                placeholder="(555) 123-4567" />
            </div>
            <div>
              <label htmlFor="subject" className="font-label-md text-label-md text-on-surface block mb-1">Subject</label>
              <input type="text" name="subject" id="subject"
                className="w-full rounded-lg border border-outline-variant bg-surface px-4 py-3 font-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                placeholder="How can we help?" />
            </div>
            <div>
              <label htmlFor="message" className="font-label-md text-label-md text-on-surface block mb-1">Message *</label>
              <textarea name="message" id="message" required rows={5}
                className="w-full rounded-lg border border-outline-variant bg-surface px-4 py-3 font-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                placeholder="Tell us more..." />
            </div>
            <button type="submit" className="w-full bg-primary text-on-primary py-4 rounded-lg font-label-md text-label-md hover:bg-primary/90 active:scale-95 transition-all">
              Send Message
            </button>
          </form>
        </Card>

        <div className="space-y-6">
          <Card className="p-6 flex items-start gap-4">
            <span className="material-symbols-outlined text-primary">location_on</span>
            <div>
              <h3 className="font-headline-md text-headline-md text-on-surface">Address</h3>
              <p className="text-on-surface-variant">Nisa Dental Clinic<br />Aimnabad Road, Sialkot</p>
              <p className="text-on-surface-variant mt-2">Nisa Surgical<br />Kareempura Road, Sialkot</p>
            </div>
          </Card>
          <Card className="p-6 flex items-start gap-4">
            <span className="material-symbols-outlined text-primary">call</span>
            <div>
              <h3 className="font-headline-md text-headline-md text-on-surface">Phone</h3>
              <p className="text-on-surface-variant"><a href="tel:03341710086" className="hover:text-primary">0334-1710086</a></p>
            </div>
          </Card>
          <Card className="p-6 flex items-start gap-4">
            <span className="material-symbols-outlined text-primary">mail</span>
            <div>
              <h3 className="font-headline-md text-headline-md text-on-surface">Email</h3>
              <p className="text-on-surface-variant">info@nisadental.com</p>
            </div>
          </Card>
          <Card className="p-6 flex items-start gap-4">
            <span className="material-symbols-outlined text-primary">schedule</span>
            <div>
              <h3 className="font-headline-md text-headline-md text-on-surface">Hours</h3>
              <p className="text-on-surface-variant">Mon-Fri: 9AM - 6PM<br />Sat: 10AM - 2PM</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
