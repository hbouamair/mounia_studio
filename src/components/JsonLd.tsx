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
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    opens: "09:00",
    closes: "21:00",
  },
  sameAs: [],
  priceRange: "$$",
  image: `${siteUrl}/studio-image.jpg`,
};

export default function JsonLd() {
  const json = JSON.stringify(localBusinessSchema);
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
