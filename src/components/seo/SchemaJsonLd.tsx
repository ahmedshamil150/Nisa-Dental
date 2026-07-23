export function SchemaJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "MedicalBusiness",
        "@id": "https://nisa-dental.vercel.app/#business",
        name: "Nisa Dental & Surgical",
        alternateName: "Nisa Dental Clinic",
        url: "https://nisa-dental.vercel.app",
        logo: "https://nisa-dental.vercel.app/logo.png",
        image: "https://nisa-dental.vercel.app/logo.png",
        description:
          "Professional dental care services and premium surgical products in Sialkot. Expert dental treatments including general dentistry, cosmetic procedures, and oral surgery.",
        telephone: "+92-334-1710086",
        email: "info@nisadental.com",
        address: {
          "@type": "PostalAddress",
          streetAddress: "Aimnabad Road",
          addressLocality: "Sialkot",
          addressCountry: "PK",
        },
        openingHoursSpecification: [
          { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "09:00", closes: "18:00" },
          { "@type": "OpeningHoursSpecification", dayOfWeek: "Saturday", opens: "10:00", closes: "14:00" },
        ],
        areaServed: "Sialkot",
        priceRange: "$$",
      },
      {
        "@type": "WebSite",
        "@id": "https://nisa-dental.vercel.app/#website",
        url: "https://nisa-dental.vercel.app",
        name: "Nisa Dental & Surgical",
        description: "Professional dental services and premium surgical products in Sialkot.",
        inLanguage: "en-US",
        potentialAction: {
          "@type": "SearchAction",
          target: { "@type": "EntryPoint", urlTemplate: "https://nisa-dental.vercel.app/shop?search={search_term_string}" },
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "MedicalWebPage",
        "@id": "https://nisa-dental.vercel.app/#webpage",
        url: "https://nisa-dental.vercel.app",
        name: "Nisa Dental & Surgical - Advanced Dental Care",
        description: "Professional dental services and premium surgical products. Book your appointment today.",
        isPartOf: { "@id": "https://nisa-dental.vercel.app/#website" },
        about: { "@id": "https://nisa-dental.vercel.app/#business" },
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://nisa-dental.vercel.app/#breadcrumb",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://nisa-dental.vercel.app/" },
          { "@type": "ListItem", position: 2, name: "Shop", item: "https://nisa-dental.vercel.app/shop" },
          { "@type": "ListItem", position: 3, name: "Appointment", item: "https://nisa-dental.vercel.app/appointment" },
          { "@type": "ListItem", position: 4, name: "About", item: "https://nisa-dental.vercel.app/about" },
          { "@type": "ListItem", position: 5, name: "Contact", item: "https://nisa-dental.vercel.app/contact" },
        ],
      },
      {
        "@type": "FAQPage",
        "@id": "https://nisa-dental.vercel.app/#faq",
        mainEntity: [
          {
            "@type": "Question",
            name: "What dental services do you offer?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "We offer general dentistry, cosmetic dentistry, orthodontics, oral surgery, and pediatric care at our Sialkot clinic.",
            },
          },
          {
            "@type": "Question",
            name: "How do I book an appointment?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "You can book an appointment through our website's appointment form or by calling us at +92-334-1710086.",
            },
          },
          {
            "@type": "Question",
            name: "Do you sell dental products online?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes, we offer a range of premium dental care and surgical products through our online shop with delivery in Sialkot.",
            },
          },
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
