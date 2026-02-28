const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.rjstudio.ma";

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "DanceStudio",
  "@id": `${siteUrl}/#organization`,
  name: "RJ Studio",
  description: "Studio de danse et location de studios à Casablanca. Cours de ballet, hip hop, danse contemporaine, jazz. Réservation en ligne à l'heure, demi-journée ou journée.",
  url: siteUrl,
  telephone: "+212661777421",
  email: "contact@studiorj.ma",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Rue Biranzarane",
    addressLocality: "Casablanca",
    addressCountry: "MA",
  },
  geo: {
    "@type": "GeoCoordinates",
    // À remplir avec les coordonnées GPS exactes du studio pour Google Maps
    // "latitude": 33.5731,
    // "longitude": -7.5898,
  },
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    opens: "09:00",
    closes: "21:00",
  },
  sameAs: [
    // Ajouter les URLs des réseaux sociaux quand disponibles
    // "https://www.instagram.com/studiorj",
    // "https://www.facebook.com/studiorj",
  ],
  priceRange: "$$",
  image: `${siteUrl}/studio-image.jpg`,
};

export default function JsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(localBusinessSchema),
      }}
    />
  );
}
