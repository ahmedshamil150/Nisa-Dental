"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useRef, useState } from "react"

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About", dropdown: [
    { href: "/about#services", label: "Services" },
    { href: "/about#team", label: "Team" },
  ]},
  { href: "/contact", label: "Contact" },
]

export function Header() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const [iconsOpen, setIconsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const circleRefs = useRef<(HTMLSpanElement | null)[]>([])
  const tlRefs = useRef<gsap.core.Timeline[]>([])
  const activeTweenRefs = useRef<gsap.core.Tween[]>([])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    let cancelled = false
    import("gsap").then(({ default: gsap }) => {
      if (cancelled) return
      circleRefs.current.forEach((circle, i) => {
      if (!circle?.parentElement) return
      const pill = circle.parentElement
      const rect = pill.getBoundingClientRect()
      const w = rect.width
      const h = rect.height
      const R = ((w * w) / 4 + h * h) / (2 * h)
      const D = Math.ceil(2 * R) + 2
      const delta = Math.ceil(R - Math.sqrt(Math.max(0, R * R - (w * w) / 4))) + 1
      const originY = D - delta

      circle.style.width = `${D}px`
      circle.style.height = `${D}px`
      circle.style.bottom = `-${delta}px`

      gsap.set(circle, { xPercent: -50, scale: 0, transformOrigin: `50% ${originY}px` })

      const label = pill.querySelector(".pill-label") as HTMLElement | null
      const hoverLabel = pill.querySelector(".pill-label-hover") as HTMLElement | null

      if (label) gsap.set(label, { y: 0 })
      if (hoverLabel) gsap.set(hoverLabel, { y: h + 12, opacity: 0 })

      tlRefs.current[i]?.kill()
      const tl = gsap.timeline({ paused: true })
      tl.to(circle, { scale: 1.2, xPercent: -50, duration: 2, ease: "power3.easeOut", overwrite: "auto" }, 0)
      if (label) tl.to(label, { y: -(h + 8), duration: 2, ease: "power3.easeOut", overwrite: "auto" }, 0)
      if (hoverLabel) {
        gsap.set(hoverLabel, { y: Math.ceil(h + 100), opacity: 0 })
        tl.to(hoverLabel, { y: 0, opacity: 1, duration: 2, ease: "power3.easeOut", overwrite: "auto" }, 0)
      }
      tlRefs.current[i] = tl
      })
    })
    return () => { cancelled = true }
  }, [scrolled, pathname])

  const handleEnter = (i: number) => {
    const tl = tlRefs.current[i]
    if (!tl) return
    activeTweenRefs.current[i]?.kill()
    activeTweenRefs.current[i] = tl.tweenTo(tl.duration(), { duration: 0.3, ease: "power3.easeOut", overwrite: "auto" })
  }

  const handleLeave = (i: number) => {
    const tl = tlRefs.current[i]
    if (!tl) return
    activeTweenRefs.current[i]?.kill()
    activeTweenRefs.current[i] = tl.tweenTo(0, { duration: 0.2, ease: "power3.easeOut", overwrite: "auto" })
  }

  function NavPill({ link, index, scrolledState }: { link: typeof navLinks[0], index: number, scrolledState: boolean }) {
    const isActive = pathname === link.href
    const textClasses = scrolledState
      ? (isActive ? "text-white" : "text-white/80 hover:text-white")
      : (isActive ? "text-primary font-bold" : "text-on-surface-variant hover:text-primary")
    const circleColor = scrolledState ? "bg-white/20" : "bg-primary/10"

    const linkContent = (
      <>
        <span className={`hover-circle absolute left-1/2 -bottom-1 w-0 h-0 rounded-full pointer-events-none ${circleColor}`}
          ref={el => { circleRefs.current[index] = el }} />
        <span className="label-stack relative flex flex-col items-center">
          <span className="pill-label">{link.label}</span>
          <span className="pill-label-hover absolute pointer-events-none">{link.label}</span>
        </span>
      </>
    )

    if (link.dropdown) {
      return (
        <div className="relative group">
          <button
            onMouseEnter={() => handleEnter(index)}
            onMouseLeave={() => handleLeave(index)}
            className={`pill relative overflow-hidden rounded-full px-4 py-1.5 font-label-md text-label-md transition-colors ${textClasses}`}>
            {linkContent}
          </button>
          <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
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
      <Link href={link.href}
        onMouseEnter={() => handleEnter(index)}
        onMouseLeave={() => handleLeave(index)}
        className={`pill relative overflow-hidden rounded-full px-4 py-1.5 font-label-md text-label-md transition-colors ${textClasses}`}>
        {linkContent}
      </Link>
    )
  }

  return (
    <>
      {/* --- Desktop Header --- */}
      <header className={`hidden md:block fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "top-4"
          : "bg-surface/80 backdrop-blur-md border-b border-outline-variant/30 shadow-sm"
      }`}>
        <div className={`transition-all duration-300 ${
          scrolled
            ? "bg-[#417171] shadow-lg rounded-full flex items-center justify-between px-6 md:px-10 h-14 max-w-[90vw] mx-auto"
            : "flex justify-between items-center w-full px-margin-desktop h-16"
        }`}>
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <Image src="/logo.png" alt="Nisa Dental" width={40} height={40} className={`rounded-full transition-all duration-300 ${scrolled ? "h-8 w-8" : "h-10 w-auto max-h-10"}`} />
            <span className={`font-headline-md font-semibold tracking-tight transition-all duration-300 ${
              scrolled ? "text-headline-md text-white text-[16px]" : "text-headline-md text-primary"
            }`}>
              NISA DENTAL
            </span>
          </Link>

          <nav className="flex items-center gap-1" aria-label="Main navigation">
            {navLinks.map((link, i) => (
              <NavPill key={link.href} link={link} index={i} scrolledState={scrolled} />
            ))}
          </nav>

          <div className="flex items-center gap-4 shrink-0">
            <Link href="/appointment" className={`transition-all duration-300 ${
              scrolled
                ? "bg-white text-primary px-5 py-1.5 rounded-full font-label-md text-label-md hover:shadow-md active:scale-95"
                : "bg-primary text-on-primary px-6 py-2 rounded-lg font-label-md text-label-md hover:opacity-90 active:scale-95"
            }`}>
              Appointment
            </Link>
          </div>
        </div>
      </header>

      {/* --- Mobile Header --- */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-50 px-margin-mobile py-2 flex items-center gap-2 pointer-events-none">
        {/* Hamburger */}
        <button onClick={() => setMenuOpen(true)}
          className="pointer-events-auto h-11 w-11 rounded-full bg-primary text-on-primary shadow-md flex items-center justify-center active:scale-95 transition-transform shrink-0 self-start mt-0.5"
          aria-label="Open menu" aria-expanded="false" aria-haspopup="dialog">
          <span className="material-symbols-outlined text-[24px]">menu</span>
        </button>

        {/* Logo + text capsule */}
        <Link href="/" className="pointer-events-auto flex items-center gap-1.5 bg-primary/90 backdrop-blur-md border border-primary-border/40 rounded-full px-4 h-11 shadow-sm mx-auto self-start mt-0.5">
          <Image src="/logo.png" alt="" className="h-9 w-9 rounded-full" width={36} height={36} />
          <span className={`font-headline-md text-[16px] font-semibold text-on-primary tracking-tight transition-all duration-300 ease-out ${iconsOpen ? "opacity-0 max-w-0 overflow-hidden" : "opacity-100 max-w-[60px]"}`}>NISA</span>
        </Link>

        {/* Icon capsule with 3 icons */}
        <div className="pointer-events-auto relative shrink-0">
          <div className={`bg-primary/90 backdrop-blur-md border border-primary-border/40 shadow-sm flex flex-col items-stretch transition-all duration-300 ease-out rounded-3xl ${iconsOpen ? "px-4 py-4 gap-3" : "px-3 pt-3 pb-2.5 gap-2.5"}`}>
            <Link href="/appointment" className="flex items-center gap-3 text-on-primary hover:opacity-80 transition-opacity px-0.5" aria-label="Book appointment">
              <span className="material-symbols-outlined text-[22px] shrink-0">calendar_month</span>
              <span className={`font-label-md text-[13px] whitespace-nowrap transition-all duration-300 ease-out ${iconsOpen ? "opacity-100 max-w-[120px] ml-0" : "opacity-0 max-w-0 overflow-hidden -ml-3"}`}>Appointment</span>
            </Link>
            <button onClick={() => setIconsOpen(!iconsOpen)}
              className="flex items-center justify-center text-on-primary/70 hover:text-on-primary transition-colors pt-0.5"
              aria-label={iconsOpen ? "Collapse icons" : "Expand icons"} aria-expanded={iconsOpen}>
              <span className="material-symbols-outlined text-[20px]">{iconsOpen ? "chevron_right" : "chevron_left"}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Spacer for mobile */}
      <div className="md:hidden h-14" />

      {/* Side Drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-[100] md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMenuOpen(false)} />
          <div className="absolute top-0 left-0 h-full w-72 max-w-[85vw] bg-surface shadow-2xl flex flex-col animate-slide-in-left" role="dialog" aria-modal="true" aria-label="Navigation menu">
            <div className="flex items-center justify-between p-5 border-b border-outline-variant/30">
              <Link href="/" onClick={() => setMenuOpen(false)} className="flex items-center gap-2">
                <Image src="/logo.png" alt="Nisa Dental" className="h-10 w-10 rounded-full" width={40} height={40} />
                <span className="font-headline-md text-headline-md font-semibold text-primary">NISA DENTAL</span>
              </Link>
              <button onClick={() => setMenuOpen(false)} className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant" aria-label="Close menu">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto p-5 space-y-1" aria-label="Mobile navigation">
              <Link href="/" onClick={() => setMenuOpen(false)}
                className={`block px-4 py-3 rounded-xl font-label-md text-label-md ${pathname === "/" ? "bg-primary-fixed/30 text-primary font-bold" : "text-on-surface hover:bg-surface-container"}`}>
                Home
              </Link>
              <Link href="/about" onClick={() => setMenuOpen(false)}
                className={`block px-4 py-3 rounded-xl font-label-md text-label-md ${pathname === "/about" ? "bg-primary-fixed/30 text-primary font-bold" : "text-on-surface hover:bg-surface-container"}`}>
                About
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
              <p className="text-caption text-on-surface-variant">Nisa Dental Clinic, Aimnabad Road</p>
              <p className="text-caption text-on-surface-variant">Nisa Surgical, Kareempura Road</p>
              <p className="text-caption text-on-surface-variant"><a href="tel:03341710086" className="hover:text-primary">0334-1710086</a></p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
