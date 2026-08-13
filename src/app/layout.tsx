import type { Metadata } from "next"
import { Manrope, Noto_Serif } from "next/font/google"
import "./globals.css"
import { LayoutWrapper } from "@/components/layout/LayoutWrapper"
import { SchemaJsonLd } from "@/components/seo/SchemaJsonLd"
import { MaterialSymbolsLoader } from "@/components/seo/MaterialSymbolsLoader"
import { SITE_URL } from "@/lib/site-config"

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
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Best Dental Clinic in Sialkot | Nisa Dental & Surgical",
    template: "%s | Nisa Dental & Surgical",
  },
  description: "Nisa Dental & Surgical is a leading dental clinic in Sialkot offering root canal, scaling & polishing, braces, implants, fillings and extractions at transparent prices. Dentist near you in Sialkot Cantt. Call 0334-1710086.",
  keywords: [
    "Best dental clinic in Sialkot", "Top 10 dentist in Sialkot", "Dental clinic Sialkot Cantt",
    "Dentist Sialkot near me", "Lady dentist in Sialkot", "Smile dental clinic Sialkot",
    "Makkah Dental clinic Sialkot", "Dental clinic near me", "dental clinic in Sialkot",
    "dentist in Sialkot", "dental clinic Sialkot", "root canal treatment Sialkot",
    "braces Sialkot", "dental implants", "teeth cleaning", "dental filling",
    "Nisa Dental", "dental care Pakistan", "orthodontics Sialkot",
    "best dentist Sialkot", "teeth whitening Sialkot",
    "dentist in Pakistan", "affordable dental care", "dental surgeon Sialkot",
    "dentist Cantt Sialkot", "dental hospital Sialkot", "tooth extraction Sialkot",
    "scaling polishing Sialkot", "dental braces cost Sialkot", "implant dentist Sialkot",
  ],
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: "Best Dental Clinic in Sialkot | Nisa Dental & Surgical",
    description: "Leading dental clinic in Sialkot — root canal, scaling & polishing, braces, implants, fillings and extractions at transparent prices. Book at 0334-1710086.",
    url: SITE_URL,
    siteName: "Nisa Dental & Surgical",
    locale: "en_US",
    type: "website",
    images: [{ url: `${SITE_URL}/logo.png`, width: 512, height: 512, alt: "Nisa Dental & Surgical" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Best Dental Clinic in Sialkot | Nisa Dental & Surgical",
    description: "Leading dental clinic in Sialkot — root canal, scaling & polishing, braces, implants and more.",
    images: [`${SITE_URL}/logo.png`],
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
