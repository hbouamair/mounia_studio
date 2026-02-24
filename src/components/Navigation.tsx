"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Logo from "./Logo";
import { PICKTIME_BOOKING_URL } from "@/lib/constants";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  const navItems = [
    { name: "Accueil", href: "/" },
    { name: "Studios", href: "/studios" },
    { name: "Classes", href: "/classes" },
    { name: "À Propos", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];
  
  return (
    <motion.nav
      className={cn(
        "fixed top-0 left-0 right-0 z-[100] transition-all duration-500",
        isScrolled
          ? "bg-white/90 backdrop-blur-xl shadow-md border-b border-charcoal/5"
          : "bg-black/50 backdrop-blur-xl border-b border-white/10"
      )}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo - white over video, default when scrolled */}
          <div className="flex items-center">
            <Logo size="md" variant={isScrolled ? "default" : "white"} className="cursor-interactive" />
          </div>
          
          {/* Desktop Navigation - visible over video when at top */}
          <div className="hidden md:flex items-center gap-1 lg:gap-2">
            {navItems.map((item, index) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "relative px-4 lg:px-5 py-2.5 font-nav font-medium cursor-interactive transition-colors duration-300 group rounded-lg",
                  !isScrolled && "hover:bg-white/10"
                )}
              >
                <motion.span
                  className={cn(
                    "block transition-colors duration-300",
                    isScrolled
                      ? pathname === item.href
                        ? "text-primary-500"
                        : "text-soft-charcoal group-hover:text-charcoal"
                      : pathname === item.href
                        ? "text-white"
                        : "text-white/90 group-hover:text-white"
                  )}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                  whileHover={{ y: -2 }}
                >
                  {item.name}
                </motion.span>
                {pathname === item.href && (
                  <motion.div
                    className={cn(
                      "absolute bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full",
                      isScrolled ? "bg-primary-500" : "bg-white"
                    )}
                    layoutId="activeNav"
                    transition={{ duration: 0.2 }}
                  />
                )}
                {pathname !== item.href && (
                  <motion.div
                    className={cn(
                      "absolute bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity",
                      isScrolled ? "bg-primary-500" : "bg-white"
                    )}
                    transition={{ duration: 0.2 }}
                  />
                )}
              </Link>
            ))}
            
            {/* Réserver button - hover & animation */}
            <a
              href={PICKTIME_BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-4 group/btn"
            >
              <motion.span
                className="relative inline-flex items-center justify-center gap-2 px-6 py-3 font-nav font-bold text-white rounded-full overflow-hidden cursor-pointer border border-white/20"
                style={{
                  background: isScrolled
                    ? "linear-gradient(135deg, #1E3A5F 0%, #182E4C 100%)"
                    : "linear-gradient(135deg, #2A9D8F 0%, #1E3A5F 100%)",
                  boxShadow: "0 4px 14px rgba(0,0,0,0.3)",
                }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
                whileHover={{
                  scale: 1.06,
                  boxShadow: "0 10px 32px rgba(42, 157, 143, 0.45), 0 0 0 1px rgba(255,255,255,0.3)",
                  transition: { duration: 0.25 },
                }}
                whileTap={{ scale: 0.97 }}
              >
                <span className="relative z-10 flex items-center gap-2">
                  Réserver
                    <span className="inline-block transition-transform duration-300 group-hover/btn:translate-x-1">
                    →
                  </span>
                </span>
                {/* Hover shine - runs when parent is hovered */}
                <span
                  className="absolute inset-0 w-[60%] bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover/btn:translate-x-[200%] transition-transform duration-500 pointer-events-none"
                  aria-hidden
                />
              </motion.span>
            </a>
          </div>
          
          {/* Mobile Menu Button - visible over video */}
          <motion.button
            className={cn(
              "md:hidden w-11 h-11 flex items-center justify-center rounded-full border cursor-interactive shadow-sm hover:shadow-md transition-all",
              isScrolled
                ? "bg-white border-charcoal/10"
                : "bg-white/10 border-white/30 hover:bg-white/20"
            )}
            onClick={() => setIsOpen(!isOpen)}
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.05 }}
            aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
          >
            {isOpen ? (
              <X className={cn("w-5 h-5", isScrolled ? "text-charcoal" : "text-white")} />
            ) : (
              <Menu className={cn("w-5 h-5", isScrolled ? "text-charcoal" : "text-white")} />
            )}
          </motion.button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="md:hidden bg-white/95 backdrop-blur-xl border-t border-charcoal/10 shadow-lg"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-4 sm:px-6 py-6 space-y-2">
              {navItems.map((item, index) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                >
                  <motion.div
                    className={cn(
                      "block px-4 py-3 text-base rounded-xl transition-all cursor-interactive font-nav font-medium",
                      pathname === item.href
                        ? "text-primary-500 bg-primary-500/10"
                        : "text-soft-charcoal hover:text-charcoal hover:bg-primary-500/5"
                    )}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    {item.name}
                  </motion.div>
                </Link>
              ))}
              
              <a
                href={PICKTIME_BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsOpen(false)}
              >
                <motion.div
                  className="block text-center px-6 py-4 text-white font-nav font-bold rounded-2xl cursor-interactive shadow-md mt-4"
                  style={{ 
                    background: 'linear-gradient(to right, #1E3A5F, #182E4C)',
                    color: '#ffffff'
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  Réserver
                </motion.div>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
