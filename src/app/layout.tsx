import type { Metadata } from "next"
import { Manrope, Noto_Serif } from "next/font/google"
import "./globals.css"
import { LayoutWrapper } from "@/components/layout/LayoutWrapper"
import { SchemaJsonLd } from "@/components/seo/SchemaJsonLd"
import { MaterialSymbolsLoader } from "@/components/seo/MaterialSymbolsLoader"

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "optional",
  variable: "--font-manrope",
})

const notoSerif = Noto_Serif({
  subsets: ["latin"],
  weight: ["500", "600"],
  display: "optional",
  variable: "--font-noto-serif",
})

export const metadata: Metadata = {
  title: {
    default: "Nisa Dental & Surgical - Advanced Dental Care & Surgical Supplies in Sialkot",
    template: "%s | Nisa Dental & Surgical",
  },
  description: "Nisa Dental & Surgical provides professional dental care services and premium surgical products in Sialkot. Book your appointment today for expert dental treatment.",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "Nisa Dental & Surgical - Advanced Dental Care & Surgical Supplies",
    description: "Professional dental services and premium surgical products in Sialkot. Book your appointment today.",
    url: "https://nisa-dental.vercel.app",
    siteName: "Nisa Dental & Surgical",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nisa Dental & Surgical",
    description: "Professional dental services and premium surgical products in Sialkot.",
  },
  robots: {
    index: true,
    follow: true,
  },
  other: {
    "theme-color": "#3f625f",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${manrope.variable} ${notoSerif.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,0..1&display=swap" />
      </head>
      <body className="flex min-h-screen flex-col antialiased">
        <MaterialSymbolsLoader />
        <SchemaJsonLd />
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  )
}
