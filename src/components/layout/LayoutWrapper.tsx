"use client"

import { usePathname } from "next/navigation"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { CartProvider } from "@/lib/cart-context"
import { ToastProvider } from "@/lib/toast-context"

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdmin = pathname.startsWith("/admin")

  if (isAdmin) return <>{children}</>

  return (
    <CartProvider>
      <ToastProvider>
        <Header />
        <main className="flex-1 animate-fade-in-up">{children}</main>
        <Footer />
      </ToastProvider>
    </CartProvider>
  )
}
