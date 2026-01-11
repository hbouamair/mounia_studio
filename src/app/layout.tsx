import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Étoile Dance Studio | Transform Through Movement",
  description: "Discover your rhythm at San Francisco's premier dance studio. Expert instructors, diverse classes from Ballet to Hip Hop, and a welcoming community.",
  keywords: ["dance studio", "ballet", "hip hop", "contemporary dance", "dance classes", "San Francisco"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
