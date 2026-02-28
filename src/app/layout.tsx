import type { Metadata } from "next";
import "./globals.css";
import WhatsAppButton from "@/components/WhatsAppButton";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.rjstudio.ma";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "RJ Studio | Studio de Danse à Casablanca",
    template: "%s | RJ Studio",
  },
  description: "Rejoignez RJ Studio, votre studio de danse professionnel à Casablanca. Cours de danse, location de studios, instructeurs experts. Transformez votre vie grâce à l'art de la danse.",
  keywords: ["studio de danse", "danse Casablanca", "cours de danse", "location studio", "ballet", "hip hop", "danse contemporaine", "RJ Studio", "Casablanca", "réserver studio danse"],
  authors: [{ name: "RJ Studio", url: siteUrl }],
  creator: "RJ Studio",
  publisher: "RJ Studio",
  formatDetection: { email: false, address: false, telephone: false },
  icons: {
    icon: "/logo_white.ico",
  },
  openGraph: {
    type: "website",
    locale: "fr_MA",
    url: siteUrl,
    siteName: "RJ Studio",
    title: "RJ Studio | Studio de Danse à Casablanca",
    description: "Studio de danse et location de studios à Casablanca. Cours de ballet, hip hop, contemporain. Réservez en ligne.",
    images: [
      {
        url: "/studio-image.jpg",
        width: 1200,
        height: 630,
        alt: "RJ Studio - Studio de danse Casablanca",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "RJ Studio | Studio de Danse à Casablanca",
    description: "Studio de danse et location de studios à Casablanca. Cours et réservation en ligne.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  verification: {
    // À remplir quand vous avez les codes (Google Search Console, Bing, etc.)
    // google: "votre-code-google",
    // yandex: "votre-code-yandex",
  },
  alternates: {
    canonical: siteUrl,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="scroll-smooth">
      <body className="antialiased">
        <JsonLd />
        {children}
        <WhatsAppButton />
      </body>
    </html>
  );
}
