const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.rjstudio.ma";

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "DanceStudio",
  "@id": `${siteUrl}/#organization`,
  name: "RJ Studio",
  description: "Premier open studio de danse et de bien-être à Casablanca. Studios entièrement équipés à la réservation pour professeurs indépendants, coachs et artistes. Réservation à l'heure ou en packs, 7j/7.",
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
