"use client";

import { useState } from "react";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import ClassesGrid from "@/components/ClassesGrid";
import Schedule from "@/components/Schedule";
import BookingModal from "@/components/BookingModal";
import Instructors from "@/components/Instructors";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [preselectedClassId, setPreselectedClassId] = useState<string | undefined>(undefined);
  
  const handleBookClass = (classId?: string) => {
    setPreselectedClassId(classId);
    setIsBookingModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsBookingModalOpen(false);
    setPreselectedClassId(undefined);
  };
  
  return (
    <>
      {/* Navigation */}
      <Navigation />
      
      {/* Main Content */}
      <main className="relative">
        <Hero />
        <ClassesGrid onBookClass={handleBookClass} />
        <Schedule onOpenBooking={() => handleBookClass()} />
        <Instructors />
        <Contact />
      </main>
      
      {/* Footer */}
      <Footer />
      
      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={handleCloseModal}
        preselectedClassId={preselectedClassId}
      />
    </>
  );
}

