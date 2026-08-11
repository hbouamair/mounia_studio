import { ArrowRight, Building2, CalendarCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import HeroVideo from "@/components/HeroVideo";
import { BOOKING_URL, BASE_PATH } from "@/lib/constants";

/** Grain texture — kills the "stock video" look (inline SVG, no request). */
const NOISE_DATA_URI =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")";

/**
 * Cinematic hero — full-bleed studio photo with responsive content placement.
 * Mobile: text sits under the nav. Desktop: bottom-left composition.
 */
export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-[100svh] w-full overflow-hidden bg-charcoal"
    >
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src="/hero-background.png"
          alt="Studio RJ à Casablanca — salle en bois baignée de lumière"
          fill
          priority
          fetchPriority="high"
          sizes="100vw"
          className="object-cover object-[38%_50%] sm:object-[42%_45%]"
          quality={90}
        />
        <HeroVideo />

        <div
          className="absolute inset-0 pointer-events-none mix-blend-overlay"
          style={{
            background:
              "linear-gradient(135deg, rgba(30,58,95,0.32) 0%, rgba(42,157,143,0.16) 100%)",
          }}
          aria-hidden
        />

        {/* Mobile: stronger top wash so text under nav stays readable */}
        <div
          className="absolute inset-0 pointer-events-none md:hidden"
          style={{
            background:
              "linear-gradient(180deg, rgba(8,12,22,0.72) 0%, rgba(8,12,22,0.45) 28%, rgba(8,12,22,0.2) 52%, rgba(8,12,22,0.55) 100%)",
          }}
          aria-hidden
        />

        {/* Desktop: left + bottom scrim */}
        <div
          className="absolute inset-0 pointer-events-none hidden md:block"
          style={{
            background:
              "radial-gradient(ellipse 110% 85% at 50% 45%, transparent 35%, rgba(10,16,28,0.3) 100%), linear-gradient(180deg, rgba(10,16,28,0.18) 0%, rgba(10,16,28,0.06) 38%, rgba(10,16,28,0.4) 70%, rgba(10,16,28,0.78) 100%), linear-gradient(90deg, rgba(10,16,28,0.62) 0%, rgba(10,16,28,0.12) 52%)",
          }}
          aria-hidden
        />

        <div
          className="absolute inset-0 pointer-events-none opacity-[0.045]"
          style={{ backgroundImage: NOISE_DATA_URI }}
          aria-hidden
        />
      </div>

      <div className="relative z-10 min-h-[100svh] flex flex-col justify-start md:justify-end pt-[5.75rem] sm:pt-28 md:pt-[104px] pb-10 sm:pb-14 md:pb-32">
        <div className="max-w-7xl 2xl:max-w-8xl mx-auto w-full px-5 sm:px-6 lg:px-8 2xl:px-10 flex-1 flex flex-col justify-center md:justify-end md:flex-none">
          <div className="max-w-xl md:max-w-2xl">
            <p className="mb-3 sm:mb-4 text-[10px] sm:text-xs font-bold uppercase tracking-[0.22em] text-[#F2E7AF]/90 animate-fade-up">
              RJ Studio · Casablanca
            </p>

            <h1
              className="text-[2.25rem] sm:text-5xl md:text-6xl lg:text-7xl font-display font-extrabold leading-[1.06] sm:leading-[1.02] tracking-tight text-white animate-fade-up stagger-1"
              style={{ textShadow: "0 4px 28px rgba(0,0,0,0.5)" }}
            >
              Chaque projet
              <br />
              mérite{" "}
              <span
                className="text-[#F2E7AF]"
                style={{ textShadow: "0 4px 20px rgba(0,0,0,0.45)" }}
              >
                son espace.
              </span>
            </h1>

            <p
              className="mt-3.5 sm:mt-5 text-[0.95rem] sm:text-lg text-white/88 font-medium max-w-md leading-relaxed animate-fade-up stagger-2"
              style={{ textShadow: "0 1px 10px rgba(0,0,0,0.4)" }}
            >
              Studios de danse et fitness à la location — à l&apos;heure, sans
              engagement.
            </p>

            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-2.5 sm:gap-3 w-full sm:w-auto animate-fade-up stagger-3">
              <a
                href={BOOKING_URL}
                className="group inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3.5 sm:px-7 sm:py-4 rounded-2xl font-bold text-white shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98] text-[0.95rem] sm:text-base"
                style={{
                  background:
                    "linear-gradient(135deg, #1E3A5F 0%, #2A9D8F 100%)",
                  boxShadow: "0 10px 28px rgba(30, 58, 95, 0.4)",
                }}
              >
                <CalendarCheck className="w-4 h-4 shrink-0" aria-hidden />
                Réserver un créneau
                <ArrowRight
                  className="w-4 h-4 shrink-0 group-hover:translate-x-0.5 transition-transform duration-150"
                  aria-hidden
                />
              </a>
              <a
                href={`${BASE_PATH}/studios`}
                className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3.5 sm:px-7 sm:py-4 rounded-2xl font-bold text-white border border-white/35 bg-white/[0.08] backdrop-blur-md hover:bg-white/15 transition-colors active:scale-[0.98] text-[0.95rem] sm:text-base"
              >
                <Building2 className="w-4 h-4 shrink-0" aria-hidden />
                Nos studios
              </a>
            </div>

            <div className="mt-5 sm:mt-7 flex flex-wrap items-center gap-x-2.5 gap-y-1 animate-fade-up stagger-4">
              <Link
                href={BOOKING_URL}
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-white/85 hover:text-white transition-colors"
              >
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary-400" />
                </span>
                Dès 150 MAD/h
              </Link>
              <span className="text-white/30" aria-hidden>
                ·
              </span>
              <span className="text-[11px] sm:text-xs font-medium text-white/60">
                Sans engagement
              </span>
            </div>
          </div>
        </div>
      </div>

      <a
        href="#studios-selection"
        className="hidden md:flex absolute bottom-7 right-10 flex-col items-center gap-1.5 text-white/55 hover:text-white/90 transition-colors"
        aria-label="Faire défiler vers le contenu"
      >
        <span className="text-[10px] font-medium tracking-[0.2em] uppercase">
          Explorer
        </span>
        <div className="w-5 h-8 rounded-full border border-white/30 flex justify-center pt-1.5 animate-scroll-cue">
          <div className="w-1 h-1.5 rounded-full bg-white/80 animate-scroll-dot" />
        </div>
      </a>
    </section>
  );
}
