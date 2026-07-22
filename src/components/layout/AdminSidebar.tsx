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

const sidebarLinks: SidebarLink[] = [
  { href: "/admin", label: "Dashboard", icon: "dashboard" },
  { href: "/admin/products", label: "Products", icon: "inventory_2" },
  { href: "/admin/categories", label: "Categories", icon: "category" },
  { href: "/admin/services", label: "Services", icon: "medical_services" },
  { href: "/admin/team", label: "Team", icon: "group" },
  { href: "/admin/coupons", label: "Coupons", icon: "sell" },
  { href: "/admin/orders", label: "Orders", icon: "shopping_cart" },
  { href: "/admin/revenue", label: "Revenue", icon: "payments" },
  { href: "/admin/invoices", label: "Invoices", icon: "receipt_long" },
  { href: "/admin/appointments", label: "Appointments", icon: "calendar_today" },
  { href: "/admin/testimonials", label: "Testimonials", icon: "star" },
  { href: "/admin/product-reviews", label: "Product Reviews", icon: "reviews" },
  { href: "/admin/messages", label: "Messages", icon: "mail" },
  { href: "/admin/settings", label: "Settings", icon: "settings" },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

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
          {sidebarLinks.map((link) => {
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
