export function SchemaJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "MedicalClinic",
        "@id": "https://www.nisadental.pk/#business",
        name: "Nisa Dental & Surgical",
        alternateName: "Nisa Dental Clinic",
        url: "https://www.nisadental.pk",
        logo: "https://www.nisadental.pk/logo.png",
        image: "https://www.nisadental.pk/logo.png",
        description:
          "Best dental clinic in Sialkot. Expert dental treatments including general dentistry, root canal, scaling & polishing, orthodontics (braces), dental implants, fillings and oral surgery.",
        telephone: "+92-334-1710086",
        email: "info@nisadental.com",
        priceRange: "$$",
        address: {
          "@type": "PostalAddress",
          streetAddress: "Aimnabad Road, Sialkot Cantt",
          addressLocality: "Sialkot",
          postalCode: "51310",
          addressCountry: "PK",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: 32.4927,
          longitude: 74.5317,
        },
        hasMap: "https://www.google.com/maps/search/?api=1&query=Nisa+Dental+Sialkot",
        areaServed: ["Sialkot", "Sialkot Cantt", "Gujranwala", "Daska", "Sambrial", "Wazirabad"],
        contactPoint: {
          "@type": "ContactPoint",
          telephone: "+92-334-1710086",
          contactType: "customer service",
          areaServed: "PK",
          availableLanguage: ["English", "Urdu"],
        },
        openingHoursSpecification: [
          { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "09:00", closes: "18:00" },
          { "@type": "OpeningHoursSpecification", dayOfWeek: "Saturday", opens: "10:00", closes: "14:00" },
        ],
        medicalSpecialty: ["Dentistry", "Orthodontics", "OralSurgery"],
        sameAs: [
          "https://www.facebook.com/nisadental",
          "https://www.instagram.com/nisadental",
        ],
      },
      {
        "@type": "WebSite",
        "@id": "https://www.nisadental.pk/#website",
        url: "https://www.nisadental.pk",
        name: "Nisa Dental & Surgical",
        description: "Professional dental services in Sialkot.",
        inLanguage: "en-US",
        publisher: { "@id": "https://www.nisadental.pk/#business" },
      },
      {
        "@type": "MedicalWebPage",
        "@id": "https://www.nisadental.pk/#webpage",
        url: "https://www.nisadental.pk",
        name: "Nisa Dental & Surgical - Advanced Dental Care",
        description: "Professional dental services in Sialkot. Book your appointment today.",
        isPartOf: { "@id": "https://www.nisadental.pk/#website" },
        about: { "@id": "https://www.nisadental.pk/#business" },
        primaryImageOfPage: "https://www.nisadental.pk/logo.png",
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://www.nisadental.pk/#breadcrumb",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://www.nisadental.pk/" },
          { "@type": "ListItem", position: 2, name: "Services", item: "https://www.nisadental.pk/services" },
          { "@type": "ListItem", position: 3, name: "Appointment", item: "https://www.nisadental.pk/appointment" },
          { "@type": "ListItem", position: 4, name: "About", item: "https://www.nisadental.pk/about" },
          { "@type": "ListItem", position: 5, name: "Blog", item: "https://www.nisadental.pk/blog" },
          { "@type": "ListItem", position: 6, name: "Contact", item: "https://www.nisadental.pk/contact" },
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
