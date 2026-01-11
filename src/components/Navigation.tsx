"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Logo from "./Logo";

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
    { name: "Classes", href: "/classes" },
    { name: "Studios", href: "/studios" },
    { name: "Instructeurs", href: "/instructors" },
    { name: "Contact", href: "/contact" },
  ];
  
  return (
    <motion.nav
      className={cn(
        "fixed top-0 left-0 right-0 z-[100] transition-all duration-500",
        isScrolled
          ? "bg-white/80 backdrop-blur-xl shadow-sm border-b border-charcoal/5"
          : "bg-transparent"
      )}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo - Studio RJ Stylized */}
          <div className="flex items-center">
            <Logo size="md" className="cursor-interactive" />
          </div>
          
          {/* Desktop Navigation - Clean Links */}
          <div className="hidden md:flex items-center gap-1 lg:gap-2">
            {navItems.map((item, index) => (
              <Link
                key={item.name}
                href={item.href}
                className="relative px-4 lg:px-5 py-2.5 font-nav font-medium cursor-interactive transition-colors group"
              >
                <motion.span
                  className={cn(
                    "block",
                    pathname === item.href
                      ? "text-primary-500"
                      : "text-soft-charcoal hover:text-charcoal"
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
                    className="absolute bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary-500"
                    layoutId="activeNav"
                    transition={{ duration: 0.2 }}
                  />
                )}
                {pathname !== item.href && (
                  <motion.div
                    className="absolute bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary-500 opacity-0 group-hover:opacity-100"
                    transition={{ duration: 0.2 }}
                  />
                )}
              </Link>
            ))}
            
            <Link href="/studios">
              <motion.button
                className="ml-4 px-6 py-3 text-white font-nav font-bold cursor-interactive rounded-full shadow-md hover:shadow-lg transition-all"
                style={{ 
                  background: 'linear-gradient(to right, #1E3A5F, #182E4C)',
                  color: '#ffffff'
                }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
                whileHover={{ scale: 1.05, boxShadow: "0 8px 24px rgba(30, 58, 95, 0.25)" }}
                whileTap={{ scale: 0.98 }}
              >
                Réserver un Studio
              </motion.button>
            </Link>
          </div>
          
          {/* Mobile Menu Button */}
          <motion.button
            className="md:hidden w-11 h-11 flex items-center justify-center rounded-full bg-white border border-charcoal/10 cursor-interactive shadow-sm hover:shadow-md transition-all"
            onClick={() => setIsOpen(!isOpen)}
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.05 }}
          >
            {isOpen ? (
              <X className="w-5 h-5 text-charcoal" />
            ) : (
              <Menu className="w-5 h-5 text-charcoal" />
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
              
              <Link href="/studios" onClick={() => setIsOpen(false)}>
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
                  Réserver un Studio
                </motion.div>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
