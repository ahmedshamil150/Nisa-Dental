"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { PanelLeft, LogOut, X, Menu } from "lucide-react"
import { useState } from "react"

interface SidebarLink {
  href: string
  label: string
  icon: string
}

type SectionKey = "shop" | "clinic" | "all"

const shopLinks: SidebarLink[] = [
  { href: "/admin/products", label: "Products", icon: "inventory_2" },
  { href: "/admin/categories", label: "Categories", icon: "category" },
  { href: "/admin/coupons", label: "Coupons", icon: "sell" },
  { href: "/admin/orders", label: "Orders", icon: "shopping_cart" },
  { href: "/admin/invoices", label: "Invoices", icon: "receipt_long" },
  { href: "/admin/revenue", label: "Revenue", icon: "payments" },
  { href: "/admin/product-reviews", label: "Product Reviews", icon: "reviews" },
]

const clinicLinks: SidebarLink[] = [
  { href: "/admin/services", label: "Services", icon: "medical_services" },
  { href: "/admin/team", label: "Team", icon: "group" },
  { href: "/admin/appointments", label: "Appointments", icon: "calendar_today" },
  { href: "/admin/testimonials", label: "Testimonials", icon: "star" },
  { href: "/admin/messages", label: "Messages", icon: "mail" },
]

const miscLinks: SidebarLink[] = [
  { href: "/admin/settings", label: "Settings", icon: "settings" },
]

const allLinks: SidebarLink[] = [...shopLinks, ...clinicLinks, ...miscLinks]

const sections: { key: SectionKey; label: string }[] = [
  { key: "shop", label: "Shop" },
  { key: "clinic", label: "Clinic" },
  { key: "all", label: "All" },
]

function sectionForPath(pathname: string): SectionKey {
  if (shopLinks.some((l) => l.href !== "/admin" && pathname.startsWith(l.href))) return "shop"
  if (clinicLinks.some((l) => pathname.startsWith(l.href))) return "clinic"
  if (miscLinks.some((l) => pathname.startsWith(l.href))) return "all"
  return "all"
}

function linksFor(section: SectionKey): SidebarLink[] {
  if (section === "shop") return shopLinks
  if (section === "clinic") return clinicLinks
  return allLinks
}

export function AdminSidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [section, setSection] = useState<SectionKey>(() => sectionForPath(pathname))

  // Keep the active page visible: if the current page isn't in the selected
  // section, switch to the section that contains it. Dashboard is always shown.
  if (pathname !== "/admin") {
    const pathSection = sectionForPath(pathname)
    const visible = linksFor(section).some(
      (l) => pathname === l.href || (l.href !== "/admin" && pathname.startsWith(l.href))
    )
    if (!visible && pathSection !== section) {
      setSection(pathSection)
    }
  }

  const visibleLinks = linksFor(section)

  return (
    <>
      {/* Mobile hamburger */}
      <button onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-50 lg:hidden bg-white border border-outline-variant/30 rounded-lg p-2 shadow-sm">
        <Menu className="h-5 w-5 text-on-surface" />
      </button>

      {/* Mobile overlay backdrop */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "flex h-screen flex-col bg-white transition-all duration-300",
        "lg:relative lg:flex lg:border-r",
        collapsed ? "lg:w-16" : "lg:w-64",
        mobileOpen
          ? "fixed inset-y-0 left-0 z-50 w-72 shadow-xl"
          : "fixed -left-80 z-50 lg:left-0 lg:z-auto",
      )}>
        <div className="flex h-16 items-center justify-between border-b px-4">
          <Link href="/admin" className="font-headline-md text-headline-md text-primary font-semibold truncate">
            {collapsed && mobileOpen === false ? "" : "Admin"}
          </Link>
          <button onClick={() => { if (mobileOpen) setMobileOpen(false); else setCollapsed(!collapsed) }}
            className="rounded-md p-1.5 text-on-surface-variant hover:bg-surface-container">
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <PanelLeft className={cn("h-5 w-5 transition-transform", collapsed && "rotate-180")} />
            )}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-2 space-y-0.5">
          {/* Dashboard — common to all sections */}
          <Link
            href="/admin"
            onClick={() => setMobileOpen(false)}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              pathname === "/admin" ? "bg-primary-fixed/30 text-primary" : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface",
              collapsed && "justify-center"
            )}
            title={collapsed ? "Dashboard" : undefined}
          >
            <span className="material-symbols-outlined text-[20px]">dashboard</span>
            <span className={cn("shrink-0", collapsed && "lg:hidden")}>Dashboard</span>
          </Link>

          {/* Section switcher */}
          {!collapsed && (
            <div className="px-1 pt-3 pb-1">
              <div className="flex rounded-lg bg-surface-container p-1 gap-1">
                {sections.map((s) => (
                  <button
                    key={s.key}
                    onClick={() => setSection(s.key)}
                    className={cn(
                      "flex-1 rounded-md px-2 py-1.5 text-xs font-medium transition-colors",
                      section === s.key ? "bg-white text-primary shadow-sm" : "text-on-surface-variant hover:text-on-surface"
                    )}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {visibleLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== "/admin" && pathname.startsWith(link.href))
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive ? "bg-primary-fixed/30 text-primary" : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface",
                  collapsed && "justify-center"
                )}
                title={collapsed ? link.label : undefined}
              >
                <span className="material-symbols-outlined text-[20px]">{link.icon}</span>
                <span className={cn("shrink-0", collapsed && "lg:hidden")}>{link.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="border-t p-2">
          <Link href="/"
            onClick={() => setMobileOpen(false)}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-on-surface-variant hover:bg-surface-container transition-colors",
              collapsed && "justify-center"
            )}>
            <LogOut className="h-5 w-5 shrink-0" />
            {!collapsed && <span className="lg:inline hidden">Back to Site</span>}
          </Link>
        </div>
      </aside>
    </>
  )
}
