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
  metadataBase: new URL("https://nisa-dental.vercel.app"),
  title: {
    default: "Nisa Dental & Surgical - Advanced Dental Care in Sialkot",
    template: "%s | Nisa Dental & Surgical",
  },
  description: "Nisa Dental & Surgical in Sialkot offers expert dental care — scaling, root canal, fillings, braces, implants and more. Book your appointment today at 0334-1710086.",
  keywords: [
    "dentist in Sialkot", "dental clinic Sialkot", "root canal treatment Sialkot",
    "braces Sialkot", "dental implants", "teeth cleaning", "dental filling",
    "Nisa Dental", "dental care Pakistan", "orthodontics Sialkot",
  ],
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Nisa Dental & Surgical - Advanced Dental Care in Sialkot",
    description: "Expert dental care in Sialkot — scaling, root canal, fillings, braces, implants and more. Book your appointment at 0334-1710086.",
    url: "https://nisa-dental.vercel.app",
    siteName: "Nisa Dental & Surgical",
    locale: "en_US",
    type: "website",
    images: [{ url: "/logo.png", width: 512, height: 512, alt: "Nisa Dental & Surgical" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nisa Dental & Surgical - Advanced Dental Care in Sialkot",
    description: "Expert dental care in Sialkot — scaling, root canal, fillings, braces, implants and more.",
    images: ["/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "",
  },
  other: {
    "theme-color": "#3f625f",
    "geo.region": "PK-PB",
    "geo.placename": "Sialkot",
    "geo.position": "32.4927;74.5317",
    "ICBM": "32.4927, 74.5317",
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
