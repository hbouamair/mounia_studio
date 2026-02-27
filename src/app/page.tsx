"use client";

import { useState } from "react";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import StudioSelection from "@/components/StudioSelection";
import WhyChooseUs from "@/components/WhyChooseUs";
import FAQ from "@/components/FAQ";
import BookingModal from "@/components/BookingModal";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function Home() {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  
  const handleCloseModal = () => {
    setIsBookingModalOpen(false);
  };
  
  return (
    <>
      {/* Navigation */}
      <Navigation />
      
      {/* Main Content - Homepage Optimized */}
      <main className="relative">
        <Hero />
        <HowItWorks />
        <StudioSelection />
        <WhyChooseUs />
        <FAQ />
      </main>
      
      {/* Footer */}
      <Footer />
      
      {/* Floating WhatsApp button */}
      <WhatsAppButton />
      
      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={handleCloseModal}
        preselectedClassId={undefined}
      />
    </>
  );
}
