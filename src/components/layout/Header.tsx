"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/shop", label: "Shop" },
  { href: "/appointment", label: "Appointments" },
]

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
            <Link href="/shop" className="material-symbols-outlined text-primary hover:scale-110 transition-transform">
              shopping_bag
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
              href="/appointment"
              onClick={() => setMenuOpen(false)}
              className="block bg-primary text-on-primary text-center px-6 py-3 rounded-lg font-label-md text-label-md mt-4"
            >
              Book Appointment
            </Link>
          </div>
        )}
      </header>
    </>
  )
}
