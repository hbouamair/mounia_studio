"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { PICKTIME_BOOKING_URL, PICKTIME_BUTTON_IMAGE } from "@/lib/constants";

type Variant = "image" | "hero" | "nav" | "card";

interface PicktimeBookButtonProps {
  variant?: Variant;
  className?: string;
  showLabel?: boolean;
}

export default function PicktimeBookButton({
  variant = "image",
  className = "",
  showLabel = false,
}: PicktimeBookButtonProps) {
  const baseProps = {
    href: PICKTIME_BOOKING_URL,
    target: "_blank",
    rel: "noopener noreferrer",
    "aria-label": "Réserver un créneau sur Picktime",
  };

  if (variant === "image") {
    return (
      <motion.a
        {...baseProps}
        className={`inline-block ${className}`}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
      >
        <Image
          src={PICKTIME_BUTTON_IMAGE}
          alt="Réserver un créneau - Book an appointment with studio"
          width={200}
          height={64}
          className="h-12 w-auto sm:h-14 md:h-16 object-contain rounded-xl shadow-lg hover:shadow-xl transition-shadow"
          style={{ maxHeight: "64px" }}
        />
      </motion.a>
    );
  }

  if (variant === "hero") {
    return (
      <motion.a
        {...baseProps}
        className={`group inline-flex items-center justify-center gap-3 rounded-xl overflow-hidden shadow-lg bg-white/95 hover:bg-white transition-colors border border-white/40 ${className}`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Image
          src={PICKTIME_BUTTON_IMAGE}
          alt="Réserver un créneau"
          width={160}
          height={48}
          className="h-10 sm:h-12 w-auto object-contain py-2 pl-3"
        />
        {showLabel && (
          <span className="font-bold text-charcoal pr-4 text-sm sm:text-base">
            Réserver
          </span>
        )}
      </motion.a>
    );
  }

  if (variant === "nav") {
    return (
      <a {...baseProps}>
        <motion.span
          className="ml-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-full shadow-md hover:shadow-lg transition-all bg-white/95 text-charcoal font-semibold border border-white/40"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
        >
          <Image
            src={PICKTIME_BUTTON_IMAGE}
            alt=""
            width={112}
            height={28}
            className="h-7 w-auto object-contain"
            aria-hidden
          />
          <span className="text-sm">Réserver</span>
        </motion.span>
      </a>
    );
  }

  // card variant: compact for studio cards etc.
  return (
    <motion.a
      {...baseProps}
      className={`inline-flex items-center justify-center gap-2 rounded-xl py-2.5 px-4 bg-white/90 hover:bg-white border border-white/50 shadow-md hover:shadow-lg transition-all ${className}`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Image
        src={PICKTIME_BUTTON_IMAGE}
        alt="Réserver"
        width={128}
        height={32}
        className="h-8 w-auto object-contain"
      />
      <span className="font-semibold text-charcoal text-sm">Réserver</span>
    </motion.a>
  );
}
