"use client";

import { useState } from "react";
import Navigation from "@/components/Navigation";
import ClassesGrid from "@/components/ClassesGrid";
import BookingModal from "@/components/BookingModal";
import Footer from "@/components/Footer";

export default function PreviewClassesPage() {
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
      <Navigation />
      <main className="relative">
        <ClassesGrid onBookClass={handleBookClass} />
      </main>
      <Footer />
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={handleCloseModal}
        preselectedClassId={preselectedClassId}
      />
    </>
  );
}
