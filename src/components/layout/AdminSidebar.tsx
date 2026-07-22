"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { PanelLeft, LogOut } from "lucide-react"
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

  return (
    <aside className={cn("flex h-screen flex-col border-r bg-white transition-all duration-300", collapsed ? "w-16" : "w-64")}>
      <div className="flex h-16 items-center justify-between border-b px-4">
        {!collapsed && <Link href="/admin" className="font-headline-md text-headline-md text-primary font-semibold">Admin</Link>}
        <button onClick={() => setCollapsed(!collapsed)} className="rounded-md p-1.5 text-on-surface-variant hover:bg-surface-container">
          <PanelLeft className={cn("h-5 w-5 transition-transform", collapsed && "rotate-180")} />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto p-2 space-y-0.5">
        {sidebarLinks.map((link) => {
          const isActive = pathname === link.href || (link.href !== "/admin" && pathname.startsWith(link.href))
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive ? "bg-primary-fixed/30 text-primary" : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface",
                collapsed && "justify-center"
              )}
              title={collapsed ? link.label : undefined}
            >
              <span className="material-symbols-outlined text-[20px]">{link.icon}</span>
              {!collapsed && <span>{link.label}</span>}
            </Link>
          )
        })}
      </nav>

      <div className="border-t p-2">
        <Link href="/" className={cn("flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-on-surface-variant hover:bg-surface-container transition-colors", collapsed && "justify-center")}>
          <LogOut className="h-5 w-5 shrink-0" />
          {!collapsed && <span>Back to Site</span>}
        </Link>
      </div>
    </aside>
  )
}
