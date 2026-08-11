export function SchemaJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "MedicalClinic",
        "@id": "https://nisa-dental.vercel.app/#business",
        name: "Nisa Dental & Surgical",
        alternateName: "Nisa Dental Clinic",
        url: "https://nisa-dental.vercel.app",
        logo: "https://nisa-dental.vercel.app/logo.png",
        image: "https://nisa-dental.vercel.app/logo.png",
        description:
          "Professional dental care services in Sialkot. Expert dental treatments including general dentistry, root canal, orthodontics, and oral surgery.",
        telephone: "+92-334-1710086",
        email: "info@nisadental.com",
        priceRange: "$$",
        address: {
          "@type": "PostalAddress",
          streetAddress: "Aimnabad Road",
          addressLocality: "Sialkot",
          addressCountry: "PK",
        },
        areaServed: "Sialkot",
        openingHoursSpecification: [
          { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "09:00", closes: "18:00" },
          { "@type": "OpeningHoursSpecification", dayOfWeek: "Saturday", opens: "10:00", closes: "14:00" },
        ],
        medicalSpecialty: ["Dentistry", "Orthodontics", "OralSurgery"],
      },
      {
        "@type": "WebSite",
        "@id": "https://nisa-dental.vercel.app/#website",
        url: "https://nisa-dental.vercel.app",
        name: "Nisa Dental & Surgical",
        description: "Professional dental services in Sialkot.",
        inLanguage: "en-US",
        publisher: { "@id": "https://nisa-dental.vercel.app/#business" },
      },
      {
        "@type": "MedicalWebPage",
        "@id": "https://nisa-dental.vercel.app/#webpage",
        url: "https://nisa-dental.vercel.app",
        name: "Nisa Dental & Surgical - Advanced Dental Care",
        description: "Professional dental services in Sialkot. Book your appointment today.",
        isPartOf: { "@id": "https://nisa-dental.vercel.app/#website" },
        about: { "@id": "https://nisa-dental.vercel.app/#business" },
        primaryImageOfPage: "https://nisa-dental.vercel.app/logo.png",
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://nisa-dental.vercel.app/#breadcrumb",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://nisa-dental.vercel.app/" },
          { "@type": "ListItem", position: 2, name: "Services", item: "https://nisa-dental.vercel.app/services" },
          { "@type": "ListItem", position: 3, name: "Appointment", item: "https://nisa-dental.vercel.app/appointment" },
          { "@type": "ListItem", position: 4, name: "About", item: "https://nisa-dental.vercel.app/about" },
          { "@type": "ListItem", position: 5, name: "Blog", item: "https://nisa-dental.vercel.app/blog" },
          { "@type": "ListItem", position: 6, name: "Contact", item: "https://nisa-dental.vercel.app/contact" },
        ],
      },
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
