"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { BOOKING_URL } from "@/lib/constants";

/**
 * Legacy preview section — kept so older imports still compile.
 * Prefer HomeStudiosSection / StudiosShowcase on the live site.
 */
export default function FormulesPreview() {
  return (
    <section className="relative py-16 md:py-24 bg-cream">
      <div className="container mx-auto px-4 text-center max-w-3xl">
        <p className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-charcoal/5 text-[11px] font-bold uppercase tracking-[0.16em] text-soft-charcoal mb-4">
          <Sparkles className="w-3.5 h-3.5 text-primary-500" aria-hidden />
          Formules
        </p>
        <h2 className="text-3xl md:text-5xl font-display font-bold text-charcoal mb-4">
          Réservez votre studio
        </h2>
        <p className="text-soft-charcoal mb-8">
          Location à l&apos;heure — cours en groupe ou privés.
        </p>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Link
            href={BOOKING_URL}
            className="inline-flex items-center gap-2 px-7 py-4 rounded-2xl font-bold text-white bg-gradient-to-r from-primary-500 to-secondary-500"
          >
            Voir les formules
            <ArrowRight className="w-4 h-4" aria-hidden />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
