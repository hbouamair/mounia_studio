import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RJ Studio | Studio de Danse à Casablanca",
  description: "Rejoignez RJ Studio, votre studio de danse professionnel à Casablanca. Cours de danse, location de studios, instructeurs experts. Transformez votre vie grâce à l'art de la danse.",
  keywords: ["studio de danse", "danse Casablanca", "cours de danse", "location studio", "ballet", "hip hop", "danse contemporaine", "RJ Studio", "Casablanca"],
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
      </body>
    </html>
  );
}
