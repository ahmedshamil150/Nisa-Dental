import type { Metadata } from "next"
import "./globals.css"
import { LayoutWrapper } from "@/components/layout/LayoutWrapper"

export const metadata: Metadata = {
  title: "Nisa Dental & Surgical - Advanced Dental Care & Surgical Supplies",
  description: "Professional dental services and premium surgical products. Book your appointment today.",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Serif:wght@500;600&family=Manrope:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className="flex min-h-screen flex-col antialiased">
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  )
}
