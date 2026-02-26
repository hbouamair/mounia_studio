"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Play, ArrowRight } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { PICKTIME_BOOKING_URL } from "@/lib/constants";

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.15,
    },
  },
};

const itemUp = {
  initial: { opacity: 0, y: 28 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const videoScale = useTransform(scrollYProgress, [0, 0.45], [1, 1.06]);
  const contentY = useTransform(scrollYProgress, [0, 0.35], [0, 30]);

  return (
    <section
      ref={containerRef}
      id="hero"
      className="relative min-h-screen w-full overflow-hidden bg-charcoal"
    >
      {/* ——— Video: full viewport; on mobile fill 100% hero height (cover) ——— */}
      <motion.div
        className="absolute inset-0 overflow-hidden"
        style={{ scale: isMobile ? 1.3 : videoScale }}
      >
        <div className="absolute inset-0 overflow-hidden w-full">
          <iframe
            src="https://www.youtube.com/embed/-jz1t222qAg?autoplay=1&mute=1&loop=1&playlist=-jz1t222qAg&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&enablejsapi=1&disablekb=1&fs=0&iv_load_policy=3"
            title="Dance Studio Background Video"
            allow="autoplay; encrypted-media"
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            style={
              isMobile
                ? {
                    border: "none",
                    width: "177.78vh",
                    minWidth: "100%",
                    height: "100vh",
                    minHeight: "100vh",
                  }
                : {
                    border: "none",
                    width: "100vw",
                    minWidth: "100%",
                    height: "56.25vw",
                    minHeight: "100vh",
                  }
            }
          />
        </div>

        {/* Single overlay stack: readability + smooth handoff to next section */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.25) 35%, rgba(0,0,0,0.15) 60%, rgba(253,251,247,0.98) 100%)",
          }}
        />
        {/* Soft vignette: edges only */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            boxShadow: "inset 0 0 25vmin rgba(0,0,0,0.25)",
          }}
        />
      </motion.div>

      {/* ——— Content: aligned with video, one clear block ——— */}
      <motion.div
        className="relative z-10 min-h-screen flex flex-col justify-end pt-[88px] sm:pt-[96px] md:pt-[104px] pb-36"
        style={{
          y: isMobile ? 0 : contentY,
          opacity: isMobile ? 1 : opacity,
        }}
      >
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
          {/* Left-aligned content block: sits over video with clear hierarchy */}
          <motion.div
            className="max-w-2xl"
            variants={stagger}
            initial="initial"
            animate="animate"
          >
            {/* Block intégré à la vidéo : fond qui se fond avec l'image */}
            <div className="relative w-full max-w-2xl mx-auto">
              <div
                className="relative rounded-[2rem] sm:rounded-[2.5rem] p-8 sm:p-10 md:p-12 backdrop-blur-xl border border-white/10 overflow-hidden"
                style={{
                  background: "radial-gradient(ellipse 85% 90% at 50% 50%, rgba(0,0,0,0.22) 0%, rgba(0,0,0,0.08) 50%, rgba(0,0,0,0.03) 100%)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05), 0 20px 40px -20px rgba(0,0,0,0.35)",
                }}
              >
                {/* Légère lueur interne pour que la vidéo transparaisse aux bords */}
                <div className="absolute inset-0 rounded-[inherit] pointer-events-none" style={{ boxShadow: "inset 0 0 80px -20px rgba(0,0,0,0.12)" }} aria-hidden />
                <div className="relative flex flex-col items-center text-center space-y-6">
                  {/* Title — one line, bold */}
                  <motion.h1
                    variants={itemUp}
                    className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold leading-[1.05] tracking-tight text-white px-1"
                    style={{ textShadow: "0 4px 30px rgba(0,0,0,0.6)" }}
                  >
                    Chaque projet mérite son espace.
                  </motion.h1>

                  {/* Subtitle — location flexible */}
                  <motion.p
                    variants={itemUp}
                    className="text-sm sm:text-base text-white/90 font-medium max-w-md rounded-2xl bg-white/5 border border-white/10 px-5 py-3"
                    style={{ textShadow: "0 1px 8px rgba(0,0,0,0.35)" }}
                  >
                    Location flexible studios de danse et bien être à Casablanca
                  </motion.p>

                  {/* Inline tags: Réservation 24/7 | Paiement sécurisé | Sans engagement */}
                  <motion.div variants={itemUp} className="flex flex-wrap justify-center gap-x-2 gap-y-1">
                    <span className="text-xs font-semibold uppercase tracking-wider text-white/70">
                      Réservation en ligne 24/7
                    </span>
                    <span className="text-white/40" aria-hidden>|</span>
                    <span className="text-xs font-semibold uppercase tracking-wider text-white/70">
                      Paiement sécurisé
                    </span>
                    <span className="text-white/40" aria-hidden>|</span>
                    <span className="text-xs font-semibold uppercase tracking-wider text-white/70">
                      Sans engagement
                    </span>
                  </motion.div>

                  {/* CTAs — stacked or row, centered */}
                  <motion.div
                    variants={itemUp}
                    className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto justify-center"
                  >
                    <motion.a
                      href={PICKTIME_BOOKING_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl font-bold text-white shadow-lg"
                      style={{
                        background: "linear-gradient(135deg, #1E3A5F 0%, #2A9D8F 100%)",
                        boxShadow: "0 8px 24px rgba(30, 58, 95, 0.4)",
                      }}
                      whileHover={{
                        scale: 1.03,
                        boxShadow: "0 12px 32px rgba(42, 157, 143, 0.45)",
                        transition: { duration: 0.2 },
                      }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Réserver
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </motion.a>
                    <motion.a
                      href="/classes"
                      className="group inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl font-bold bg-white/95 text-charcoal border border-white/30 shadow-md hover:bg-white transition-colors"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Play className="w-4 h-4" />
                      Planning des Cours
                    </motion.a>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll cue */}
      <motion.a
        href="#studios-selection"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-white/60 hover:text-white/90 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal rounded-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        aria-label="Faire défiler vers le contenu"
      >
        <span className="text-[10px] font-medium tracking-[0.2em] uppercase">
          Explorer
        </span>
        <motion.div
          className="w-5 h-8 rounded-full border border-white/30 flex justify-center pt-1.5"
          animate={{ y: [0, 4, 0] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <motion.div
            className="w-1 h-1.5 rounded-full bg-white/80"
            animate={{ y: [0, 6, 0], opacity: [1, 0.3, 1] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>
      </motion.a>
    </section>
  );
}
