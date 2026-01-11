"use client";

import Navigation from "@/components/Navigation";
import StudioRental from "@/components/StudioRental";
import FlexiblePlans from "@/components/FlexiblePlans";
import Footer from "@/components/Footer";

export default function StudiosPage() {
  return (
    <>
      {/* Navigation */}
      <Navigation />
      
      {/* Main Content */}
      <main className="relative">
        <StudioRental />
        <FlexiblePlans />
      </main>
      
      {/* Footer */}
      <Footer />
    </>
  );
}

