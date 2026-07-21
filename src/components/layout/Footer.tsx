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
            <p className="text-on-surface-variant/80 font-body-md">
              Leading the way in premium, technology-driven oral healthcare with a focus on human comfort.
            </p>
          </div>
          <div>
            <h4 className="font-label-md text-label-md text-primary mb-6">SERVICES</h4>
            <ul className="space-y-4">
              <li><Link href="/services" className="text-on-surface-variant/80 hover:text-primary transition-colors">General Dentistry</Link></li>
              <li><Link href="/services" className="text-on-surface-variant/80 hover:text-primary transition-colors">Cosmetic Dental</Link></li>
              <li><Link href="/services" className="text-on-surface-variant/80 hover:text-primary transition-colors">Orthodontics</Link></li>
              <li><Link href="/services" className="text-on-surface-variant/80 hover:text-primary transition-colors">Pediatric Care</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-label-md text-label-md text-primary mb-6">CLINIC</h4>
            <ul className="space-y-4">
              <li className="text-on-surface-variant/80">123 Care Street, Suite 500</li>
              <li className="text-on-surface-variant/80">+1 234 567 890</li>
              <li className="text-on-surface-variant/80">Mon - Fri: 9AM - 6PM</li>
            </ul>
          </div>
          <div>
            <h4 className="font-label-md text-label-md text-primary mb-6">LEGAL</h4>
            <ul className="space-y-4">
              <li><a className="text-on-surface-variant/80 hover:text-primary transition-colors" href="#">Privacy Policy</a></li>
              <li><a className="text-on-surface-variant/80 hover:text-primary transition-colors" href="#">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-outline-variant/30 pt-8 text-center">
          <p className="font-body-md text-body-md text-on-surface-variant/80">
            &copy; {new Date().getFullYear()} Nisa Dental Clinic. Premium Oral Healthcare.
          </p>
        </div>
      </div>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-3 bg-surface border-t border-outline-variant/30 shadow-[0px_-4px_20px_rgba(44,62,59,0.05)]">
        <Link href="/" className="flex flex-col items-center justify-center text-primary font-semibold">
          <span className="material-symbols-outlined fill">home</span>
          <span className="font-label-md text-[10px]">Home</span>
        </Link>
        <Link href="/shop" className="flex flex-col items-center justify-center text-on-surface-variant/70 hover:text-primary transition-colors">
          <span className="material-symbols-outlined">shopping_bag</span>
          <span className="font-label-md text-[10px]">Shop</span>
        </Link>
        <Link href="/cart" className="flex flex-col items-center justify-center text-on-surface-variant/70 hover:text-primary transition-colors">
          <span className="material-symbols-outlined">shopping_cart</span>
          <span className="font-label-md text-[10px]">Cart</span>
        </Link>
        <Link href="/track" className="flex flex-col items-center justify-center text-on-surface-variant/70 hover:text-primary transition-colors">
          <span className="material-symbols-outlined">local_shipping</span>
          <span className="font-label-md text-[10px]">Track</span>
        </Link>
        <Link href="/appointment" className="flex flex-col items-center justify-center text-on-surface-variant/70 hover:text-primary transition-colors">
          <span className="material-symbols-outlined">calendar_today</span>
          <span className="font-label-md text-[10px]">Book</span>
        </Link>
      </nav>
    </footer>
  )
}
