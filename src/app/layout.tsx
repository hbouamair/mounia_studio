import type { Metadata } from "next";
import "./globals.css";
import ConditionalWhatsApp from "@/components/ConditionalWhatsApp";
import JsonLd from "@/components/JsonLd";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.rjstudio.ma";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "RJ Studio | Studio de Danse à Casablanca",
    template: "%s | RJ Studio",
  },
  description:
    "RJ Studio est le premier open studio de danse et de bien-être à Casablanca. Studios à la réservation pour professeurs indépendants et artistes. Location à l'heure ou en packs, 7j/7.",
  keywords: [
    "open studio danse",
    "studio danse Casablanca",
    "location studio danse",
    "cours danse bien-être",
    "réservation studio",
    "RJ Studio",
    "Casablanca",
    "professeur indépendant",
    "atelier danse",
  ],
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
    description:
      "Open studio de danse et bien-être à Casablanca. Location de studios à la réservation pour enseignants et artistes.",
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
    description:
      "Open studio de danse et bien-être à Casablanca. Studios à la réservation, 7j/7.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

/**
 * Fonts load at runtime via <link> (not next/font/google) so Vercel builds
 * do not fail when Google Fonts is unreachable during `next build`.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" data-scroll-behavior="smooth" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Caveat:wght@600&family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,600;0,9..40,700;1,9..40,400&family=Outfit:wght@600;700&family=Sora:wght@700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <JsonLd />
        {children}
        <ConditionalWhatsApp />
      </body>
    </html>
  );
}
