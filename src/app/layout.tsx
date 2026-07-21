import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { LayoutWrapper } from "@/components/layout/LayoutWrapper"

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] })
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Nisa Dental & Surgical - Advanced Dental Care & Surgical Supplies",
  description: "Professional dental services and premium surgical products. Book your appointment today.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="flex min-h-screen flex-col antialiased">
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  )
}
