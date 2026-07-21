"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
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
  const [menuOpen, setMenuOpen] = useState(false)
  const [iconsOpen, setIconsOpen] = useState(false)

  return (
    <>
      {/* --- Desktop Header --- */}
      <header className="hidden md:block bg-surface/80 backdrop-blur-md border-b border-outline-variant/30 shadow-sm sticky top-0 z-50">
        <div className="flex justify-between items-center w-full px-margin-desktop h-16">
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="Nisa Dental" className="h-8 w-auto rounded-full" />
            <span className="font-headline-md text-headline-md font-semibold text-primary tracking-tight">
              NISA DENTAL
            </span>
          </Link>

          <nav className="flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href
              if (link.dropdown) {
                return (
                  <div key={link.href} className="relative group">
                    <Link href={link.href}
                      className={`font-label-md text-label-md transition-colors ${isActive ? "text-primary font-bold" : "text-on-surface-variant hover:text-primary"}`}>
                      {link.label}
                    </Link>
                    <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                      <div className="bg-surface shadow-xl rounded-xl border border-outline-variant/30 p-2 min-w-[160px]">
                        {link.dropdown.map((sub) => (
                          <Link key={sub.href} href={sub.href}
                            className="block px-4 py-2.5 rounded-lg font-label-md text-label-md text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors">
                            {sub.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                )
              }
              return (
                <Link key={link.href} href={link.href}
                  className={`font-label-md text-label-md transition-colors ${isActive ? "text-primary font-bold" : "text-on-surface-variant hover:text-primary"}`}>
                  {link.label}
                </Link>
              )
            })}
          </nav>

          <div className="flex items-center gap-4">
            <Link href="/appointment" className="bg-primary text-on-primary px-6 py-2 rounded-lg font-label-md text-label-md hover:opacity-90 active:scale-95 transition-all">
              Appointment
            </Link>
            <Link href="/cart" className="relative text-primary hover:scale-110 transition-transform">
              <span className="material-symbols-outlined">shopping_cart</span>
              <CartBadge />
            </Link>
          </div>
        </div>
      </header>

      {/* --- Mobile Header --- */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-50 px-margin-mobile py-2 flex items-center gap-2 pointer-events-none">
        {/* Hamburger */}
        <button onClick={() => setMenuOpen(true)}
          className="pointer-events-auto h-9 w-9 rounded-full bg-primary text-on-primary shadow-md flex items-center justify-center active:scale-95 transition-transform shrink-0 self-start mt-0.5">
          <span className="material-symbols-outlined text-[20px]">menu</span>
        </button>

        {/* Logo + text capsule */}
        <Link href="/" className="pointer-events-auto flex items-center gap-1.5 bg-primary/90 backdrop-blur-md border border-primary-border/40 rounded-full px-3 h-9 shadow-sm mx-auto self-start mt-0.5">
          <img src="/logo.png" alt="" className="h-5 w-5 rounded-full ring-2 ring-white/30" />
          <span className="font-headline-md text-[13px] font-semibold text-on-primary tracking-tight">NISA</span>
        </Link>

        {/* Icon capsule with 3 icons */}
        <div className="pointer-events-auto relative shrink-0">
          <div className={`bg-primary/90 backdrop-blur-md border border-primary-border/40 rounded-2xl shadow-sm flex flex-col items-stretch transition-all duration-300 ease-out ${iconsOpen ? "px-4 py-3 gap-3" : "px-3 py-2 gap-2"}`}>
            <Link href="/cart" className="flex items-center gap-3 text-on-primary hover:opacity-80 transition-opacity px-0.5">
              <span className="material-symbols-outlined text-[20px] shrink-0">shopping_cart</span>
              <span className={`font-label-md text-label-md whitespace-nowrap transition-all duration-300 ease-out ${iconsOpen ? "opacity-100 max-w-[120px] ml-0" : "opacity-0 max-w-0 overflow-hidden -ml-3"}`}>Cart</span>
            </Link>
            <Link href="/appointment" className="flex items-center gap-3 text-on-primary hover:opacity-80 transition-opacity px-0.5">
              <span className="material-symbols-outlined text-[20px] shrink-0">calendar_month</span>
              <span className={`font-label-md text-label-md whitespace-nowrap transition-all duration-300 ease-out ${iconsOpen ? "opacity-100 max-w-[120px] ml-0" : "opacity-0 max-w-0 overflow-hidden -ml-3"}`}>Appointment</span>
            </Link>
            <Link href="/track" className="flex items-center gap-3 text-on-primary hover:opacity-80 transition-opacity px-0.5">
              <span className="material-symbols-outlined text-[20px] shrink-0">local_shipping</span>
              <span className={`font-label-md text-label-md whitespace-nowrap transition-all duration-300 ease-out ${iconsOpen ? "opacity-100 max-w-[120px] ml-0" : "opacity-0 max-w-0 overflow-hidden -ml-3"}`}>Track</span>
            </Link>
            <button onClick={() => setIconsOpen(!iconsOpen)}
              className="flex items-center justify-center text-on-primary/70 hover:text-on-primary transition-colors pt-0.5">
              <span className="material-symbols-outlined text-[18px]">{iconsOpen ? "chevron_right" : "chevron_left"}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Spacer for mobile */}
      <div className="md:hidden h-12" />

      {/* Side Drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-[100] md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMenuOpen(false)} />
          <div className="absolute top-0 left-0 h-full w-72 max-w-[85vw] bg-surface shadow-2xl flex flex-col animate-slide-in-left">
            <div className="flex items-center justify-between p-5 border-b border-outline-variant/30">
              <Link href="/" onClick={() => setMenuOpen(false)} className="flex items-center gap-2">
                <img src="/logo.png" alt="Nisa Dental" className="h-8 w-8 rounded-full" />
                <span className="font-headline-md text-headline-md font-semibold text-primary">NISA DENTAL</span>
              </Link>
              <button onClick={() => setMenuOpen(false)} className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto p-5 space-y-1">
              <Link href="/" onClick={() => setMenuOpen(false)}
                className={`block px-4 py-3 rounded-xl font-label-md text-label-md ${pathname === "/" ? "bg-primary-fixed/30 text-primary font-bold" : "text-on-surface hover:bg-surface-container"}`}>
                Home
              </Link>
              <Link href="/about" onClick={() => setMenuOpen(false)}
                className={`block px-4 py-3 rounded-xl font-label-md text-label-md ${pathname === "/about" ? "bg-primary-fixed/30 text-primary font-bold" : "text-on-surface hover:bg-surface-container"}`}>
                About
              </Link>
              <Link href="/shop" onClick={() => setMenuOpen(false)}
                className={`block px-4 py-3 rounded-xl font-label-md text-label-md ${pathname.startsWith("/shop") ? "bg-primary-fixed/30 text-primary font-bold" : "text-on-surface hover:bg-surface-container"}`}>
                Shop
              </Link>
              <Link href="/contact" onClick={() => setMenuOpen(false)}
                className={`block px-4 py-3 rounded-xl font-label-md text-label-md ${pathname === "/contact" ? "bg-primary-fixed/30 text-primary font-bold" : "text-on-surface hover:bg-surface-container"}`}>
                Contact
              </Link>
              <Link href="/appointment" onClick={() => setMenuOpen(false)}
                className={`block px-4 py-3 rounded-xl font-label-md text-label-md ${pathname === "/appointment" ? "bg-primary-fixed/30 text-primary font-bold" : "text-on-surface hover:bg-surface-container"}`}>
                Appointment
              </Link>
            </nav>
            <div className="p-5 border-t border-outline-variant/30 space-y-3">
              <p className="text-caption text-on-surface-variant">123 Care Street, Suite 500</p>
              <p className="text-caption text-on-surface-variant">+1 234 567 890</p>
              <p className="text-caption text-on-surface-variant">Mon - Fri: 9AM - 6PM</p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
