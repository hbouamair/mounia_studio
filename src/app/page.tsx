import type { Metadata } from "next";
import ComingSoonPage from "@/components/ComingSoonPage";

export const metadata: Metadata = {
  title: "Coming Soon 2026",
  description: "RJ Studio — Nouveau site en préparation. Studio de danse & bien-être à Casablanca. 2026.",
};

export default function HomePage() {
  return <ComingSoonPage />;
}
