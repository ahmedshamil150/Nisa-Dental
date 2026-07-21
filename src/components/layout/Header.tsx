"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { useCart } from "@/lib/cart-context"

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/shop", label: "Shop" },
  { href: "/track", label: "Track Order" },
  { href: "/appointment", label: "Appointments" },
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
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      <header className="bg-surface/80 backdrop-blur-md border-b border-outline-variant/30 shadow-sm sticky top-0 z-50">
        <div className="flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop h-16">
          <div className="flex items-center gap-3">
            <button className="material-symbols-outlined md:hidden text-primary" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? "close" : "menu"}
            </button>
            <Link href="/" className="font-headline-md text-headline-md font-semibold text-primary tracking-tight">
              NISA DENTAL
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href
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
            <Link
              href="/appointment"
              className="bg-primary text-on-primary px-6 py-2 rounded-lg font-label-md text-label-md hover:opacity-90 active:scale-95 transition-all"
            >
              Book Appointment
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link href="/cart" className="relative text-primary hover:scale-110 transition-transform">
              <span className="material-symbols-outlined">shopping_cart</span>
              <CartBadge />
            </Link>
            <Link href="/appointment" className="material-symbols-outlined text-primary hover:scale-110 transition-transform">
              calendar_month
            </Link>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden border-t border-outline-variant/30 bg-surface px-margin-mobile py-4 space-y-3">
            {navLinks.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={`block font-label-md text-label-md py-2 ${
                    isActive ? "text-primary font-bold" : "text-on-surface-variant"
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}
            <Link
              href="/cart"
              onClick={() => setMenuOpen(false)}
              className="block bg-primary text-on-primary text-center px-6 py-3 rounded-lg font-label-md text-label-md mt-4"
            >
              View Cart
            </Link>
          </div>
        )}
      </header>
    </>
  )
}
