"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  const navItems = [
    { name: "Classes", href: "#classes" },
    { name: "Schedule", href: "#schedule" },
    { name: "Instructors", href: "#instructors" },
    { name: "Contact", href: "#contact" },
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
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo - Clean Design */}
          <motion.a
            href="#hero"
            className="relative group cursor-interactive"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center gap-2">
              <motion.div
                className="w-2 h-2 rounded-full bg-terracotta"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="text-xl lg:text-2xl font-display font-extrabold text-charcoal">
                Étoile <span className="text-terracotta">Dance</span>
              </span>
            </div>
          </motion.a>
          
          {/* Desktop Navigation - Clean Links */}
          <div className="hidden md:flex items-center gap-1 lg:gap-2">
            {navItems.map((item, index) => (
              <motion.a
                key={item.name}
                href={item.href}
                className="relative px-4 lg:px-5 py-2.5 text-soft-charcoal hover:text-charcoal font-nav font-medium cursor-interactive transition-colors group"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.3 }}
                whileHover={{ y: -2 }}
              >
                {item.name}
                <motion.div
                  className="absolute bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-terracotta opacity-0 group-hover:opacity-100"
                  transition={{ duration: 0.2 }}
                />
              </motion.a>
            ))}
            
            <motion.a
              href="#schedule"
              className="ml-4 px-6 py-3 bg-gradient-to-r from-terracotta to-[#c66647] text-white font-nav font-bold cursor-interactive rounded-full shadow-md hover:shadow-lg transition-all"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
              whileHover={{ scale: 1.05, boxShadow: "0 8px 24px rgba(217, 119, 87, 0.25)" }}
              whileTap={{ scale: 0.98 }}
              style={{ color: '#ffffff' }}
            >
              Book a Class
            </motion.a>
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
            <div className="px-6 py-6 space-y-2">
              {navItems.map((item, index) => (
                <motion.a
                  key={item.name}
                  href={item.href}
                  className="block px-4 py-3 text-base text-soft-charcoal hover:text-charcoal hover:bg-terracotta/5 rounded-xl transition-all cursor-interactive font-nav font-medium"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </motion.a>
              ))}
              
              <motion.a
                href="#schedule"
                className="block text-center px-6 py-4 text-white bg-gradient-to-r from-terracotta to-[#c66647] font-nav font-bold rounded-2xl cursor-interactive shadow-md mt-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                onClick={() => setIsOpen(false)}
                style={{ color: '#ffffff' }}
              >
                Start Your Journey
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
