import Link from "next/link"
import { Mail, Phone, MapPin, Clock } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="mb-4 text-lg font-semibold text-white">
              Nisa <span className="text-teal-400">Dental</span>
            </h3>
            <p className="text-sm leading-relaxed text-gray-400">
              Advanced dental care and premium surgical supplies. Your trusted partner in oral health and medical excellence.
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              Quick Links
            </h4>
            <nav className="flex flex-col gap-2 text-sm">
              <Link href="/services" className="transition-colors hover:text-teal-400">Services</Link>
              <Link href="/shop" className="transition-colors hover:text-teal-400">Shop</Link>
              <Link href="/testimonials" className="transition-colors hover:text-teal-400">Testimonials</Link>
              <Link href="/about" className="transition-colors hover:text-teal-400">About Us</Link>
              <Link href="/contact" className="transition-colors hover:text-teal-400">Contact</Link>
            </nav>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              Contact Info
            </h4>
            <div className="flex flex-col gap-3 text-sm">
              <div className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-teal-400" />
                <span>123 Medical Center Drive, Suite 100, New York, NY 10001</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0 text-teal-400" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0 text-teal-400" />
                <span>info@nisadental.com</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              Hours
            </h4>
            <div className="flex items-start gap-2 text-sm">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-teal-400" />
              <div>
                <p>Mon - Fri: 9:00 AM - 6:00 PM</p>
                <p>Saturday: 10:00 AM - 2:00 PM</p>
                <p>Sunday: Closed</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-gray-800 pt-6 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Nisa Dental &amp; Surgical. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
