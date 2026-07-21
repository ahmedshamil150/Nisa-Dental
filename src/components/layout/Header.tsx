"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useCart } from "@/lib/cart-context"

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/track", label: "Track Order" },
  { href: "/about", label: "About", dropdown: [
    { href: "/about#services", label: "Services" },
    { href: "/about#team", label: "Team" },
  ]},
  { href: "/contact", label: "Contact" },
]

function CartBadge() {
  const { itemCount } = useCart()
  if (itemCount === 0) return null
  return (
    <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-error text-on-error text-[10px] font-bold flex items-center justify-center">
      {itemCount > 9 ? "9+" : itemCount}
    </span>
  )
}

export function Header() {
  const pathname = usePathname()

  return (
    <header className="bg-surface/80 backdrop-blur-md border-b border-outline-variant/30 shadow-sm sticky top-0 z-50">
      <div className="flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop h-16">
        <Link href="/" className="flex items-center gap-2">
          <img src="/logo.png" alt="Nisa Dental" className="h-8 w-auto rounded-full" />
          <span className="font-headline-md text-headline-md font-semibold text-primary tracking-tight">
            NISA DENTAL
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = pathname === link.href
            if (link.dropdown) {
              return (
                <div key={link.href} className="relative group">
                  <Link
                    href={link.href}
                    className={`font-label-md text-label-md transition-colors ${
                      isActive ? "text-primary font-bold" : "text-on-surface-variant hover:text-primary"
                    }`}
                  >
                    {link.label}
                  </Link>
                  <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="bg-surface shadow-xl rounded-xl border border-outline-variant/30 p-2 min-w-[160px]">
                      {link.dropdown.map((sub) => (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          className="block px-4 py-2.5 rounded-lg font-label-md text-label-md text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors"
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )
            }
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`font-label-md text-label-md transition-colors ${
                  isActive ? "text-primary font-bold" : "text-on-surface-variant hover:text-primary"
                }`}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-4">
          <Link
            href="/appointment"
            className="hidden md:inline-flex bg-primary text-on-primary px-6 py-2 rounded-lg font-label-md text-label-md hover:opacity-90 active:scale-95 transition-all"
          >
            Appointment
          </Link>
          <Link href="/cart" className="relative text-primary hover:scale-110 transition-transform">
            <span className="material-symbols-outlined">shopping_cart</span>
            <CartBadge />
          </Link>
        </div>
      </div>
    </header>
  )
}
