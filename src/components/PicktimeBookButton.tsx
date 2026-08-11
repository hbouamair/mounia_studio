"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { BOOKING_URL, PICKTIME_BUTTON_IMAGE } from "@/lib/constants";

type Variant = "image" | "hero" | "nav" | "card";

/**
 * Legacy Picktime button — now points to the internal /reservation flow.
 * Kept for compatibility with older pages that still import this component.
 */
export default function PicktimeBookButton({
  variant = "hero",
  className = "",
  label = "Réserver",
}: {
  variant?: Variant;
  className?: string;
  label?: string;
}) {
  if (variant === "image") {
    return (
      <Link href={BOOKING_URL} className={`inline-block ${className}`}>
        <Image
          src={PICKTIME_BUTTON_IMAGE}
          alt={label}
          width={200}
          height={60}
          className="h-auto w-auto max-w-full"
        />
      </Link>
    );
  }

  const styles: Record<Exclude<Variant, "image">, string> = {
    hero: "inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl font-bold text-white bg-gradient-to-r from-primary-500 to-secondary-500 shadow-lg",
    nav: "inline-flex items-center justify-center px-4 py-2 rounded-full text-sm font-semibold text-white bg-primary-500 hover:bg-primary-600",
    card: "inline-flex items-center justify-center w-full min-h-11 px-5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-primary-500 to-secondary-500",
  };

  return (
    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
      <Link href={BOOKING_URL} className={`${styles[variant]} ${className}`}>
        {label}
      </Link>
    </motion.div>
  );
}
