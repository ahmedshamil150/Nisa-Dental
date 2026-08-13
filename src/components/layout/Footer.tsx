import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-surface-container-highest w-full mt-section-gap">
      <div className="max-w-container-max mx-auto w-full px-margin-mobile md:px-margin-desktop py-margin-desktop">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 text-left mb-12">
          <div className="col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <span className="font-headline-md text-headline-md text-on-surface font-semibold">NISA DENTAL</span>
            </div>
            <p className="text-on-surface-variant font-body-md">
              Leading the way in premium, technology-driven oral healthcare with a focus on human comfort.
            </p>
            <div className="mt-6 space-y-3">
              <p className="text-on-surface-variant font-body-md">Nisa Dental Clinic<br />Aimnabad Road, Sialkot</p>
              <p className="text-on-surface-variant font-body-md">Nisa Surgical<br />Kareempura Road, Sialkot</p>
              <p className="font-body-md"><a href="tel:03341710086" className="text-primary hover:opacity-80 transition-opacity">0334-1710086</a></p>
            </div>
          </div>
          <div>
            <h3 className="font-label-md text-label-md text-primary mb-6">SERVICES</h3>
            <ul className="space-y-4">
              <li><Link href="/services" className="text-on-surface-variant hover:text-primary transition-colors">General Dentistry</Link></li>
              <li><Link href="/services" className="text-on-surface-variant hover:text-primary transition-colors">Cosmetic Dental</Link></li>
              <li><Link href="/services" className="text-on-surface-variant hover:text-primary transition-colors">Orthodontics</Link></li>
              <li><Link href="/services" className="text-on-surface-variant hover:text-primary transition-colors">Dental Implants</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-label-md text-label-md text-primary mb-6">EXPLORE</h3>
            <ul className="space-y-4">
              <li><Link href="/about" className="text-on-surface-variant hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/blog" className="text-on-surface-variant hover:text-primary transition-colors">Blog</Link></li>
              <li><Link href="/faq" className="text-on-surface-variant hover:text-primary transition-colors">FAQ</Link></li>
              <li><Link href="/appointment" className="text-on-surface-variant hover:text-primary transition-colors">Book Appointment</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-label-md text-label-md text-primary mb-6">LEGAL</h3>
            <ul className="space-y-4">
              <li><Link href="/privacy" className="text-on-surface-variant hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-on-surface-variant hover:text-primary transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-outline-variant/30 pt-8 text-center space-y-2">
          <p className="font-body-md text-body-md text-on-surface-variant">
            &copy; {new Date().getFullYear()} Nisa Dental Clinic. Premium Oral Healthcare.
          </p>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Developed and maintained by{" "}
            <a href="https://www.ahdigitalsolutions.dev" target="_blank" rel="noopener" className="font-bold text-primary hover:opacity-80 transition-opacity">
              AH Digital Solutions
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
