"use client";

import Navigation from "@/components/Navigation";
import StudioRental from "@/components/StudioRental";
import FlexiblePlans from "@/components/FlexiblePlans";
import Footer from "@/components/Footer";

export default function PreviewStudiosPage() {
  return (
    <>
      <Navigation />
      <main className="relative">
        <StudioRental />
        <FlexiblePlans />
      </main>
      <Footer />
    </>
  );
}
