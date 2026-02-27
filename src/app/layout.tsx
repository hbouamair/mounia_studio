import type { Metadata } from "next";
import "./globals.css";
import WhatsAppButton from "@/components/WhatsAppButton";

export const metadata: Metadata = {
  title: "RJ Studio | Studio de Danse à Casablanca",
  description: "Rejoignez RJ Studio, votre studio de danse professionnel à Casablanca. Cours de danse, location de studios, instructeurs experts. Transformez votre vie grâce à l'art de la danse.",
  keywords: ["studio de danse", "danse Casablanca", "cours de danse", "location studio", "ballet", "hip hop", "danse contemporaine", "RJ Studio", "Casablanca"],
  icons: {
    icon: "/logo_white.ico",
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
        {children}
        <WhatsAppButton />
      </body>
    </html>
  );
}
