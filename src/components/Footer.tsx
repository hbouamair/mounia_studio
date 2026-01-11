"use client";

import { motion } from "framer-motion";
import { Instagram, Facebook, Youtube, Twitter, Heart } from "lucide-react";

export default function Footer() {
  const socialLinks = [
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Youtube, href: "#", label: "YouTube" },
    { icon: Twitter, href: "#", label: "Twitter" },
  ];
  
  return (
    <footer className="relative bg-gradient-to-br from-charcoal via-charcoal to-charcoal/95 text-cream py-12 sm:py-16 md:py-20 overflow-hidden">
      {/* Animated Background Glow */}
      <motion.div 
        className="absolute top-0 left-1/4 w-96 h-96 bg-terracotta/10 rounded-full blur-3xl"
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div 
        className="absolute bottom-0 right-1/4 w-96 h-96 bg-deep-violet/10 rounded-full blur-3xl"
        animate={{ 
          scale: [1.2, 1, 1.2],
          opacity: [0.2, 0.1, 0.2]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12 mb-12">
          {/* Brand */}
          <div>
            <h3 className="text-2xl sm:text-3xl font-display font-bold mb-3 sm:mb-4">
              Étoile <span className="text-terracotta">Dance</span>
            </h3>
            <p className="text-sm sm:text-base text-cream/70 mb-4 sm:mb-6">
              Transforming lives through the art of dance since 2010.
            </p>
            
            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social, idx) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-11 h-11 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center cursor-interactive hover:bg-terracotta border border-white/20 transition-all shadow-skeu-sm"
                  whileHover={{ scale: 1.15, y: -3, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Quick Links</h4>
            <ul className="space-y-3">
              {["Classes", "Schedule", "Instructors", "About Us"].map((link) => (
                <li key={link}>
                  <a
                    href={`#${link.toLowerCase().replace(" ", "-")}`}
                    className="text-cream/70 hover:text-terracotta transition-colors cursor-interactive"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Classes */}
          <div>
            <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Popular Classes</h4>
            <ul className="space-y-3">
              {["Ballet", "Hip Hop", "Contemporary", "Jazz"].map((style) => (
                <li key={style}>
                  <a
                    href="#classes"
                    className="text-cream/70 hover:text-terracotta transition-colors cursor-interactive"
                  >
                    {style}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Get In Touch</h4>
            <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base text-cream/70">
              <li>123 Dance Avenue</li>
              <li>San Francisco, CA 94102</li>
              <li>(555) 123-4567</li>
              <li>hello@etoiledance.com</li>
            </ul>
          </div>
        </div>
        
        {/* Bottom Bar - Modern Design */}
        <motion.div 
          className="pt-10 border-t border-cream/10 flex flex-col md:flex-row items-center justify-between gap-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <p className="text-cream/60 text-sm text-center md:text-left font-medium">
            © 2026 Étoile Dance Studio. All rights reserved.
          </p>
          
          <motion.div 
            className="flex items-center gap-2 px-4 py-2 rounded-full glass-morphism border border-cream/10"
            whileHover={{ scale: 1.05 }}
          >
            <span className="text-cream/70 text-sm">Made with</span>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <Heart className="w-4 h-4 text-terracotta fill-terracotta" />
            </motion.div>
            <span className="text-cream/70 text-sm">for dancers</span>
          </motion.div>
          
          <div className="flex gap-6 text-sm">
            <motion.a 
              href="#" 
              className="text-cream/60 hover:text-terracotta transition-colors cursor-interactive font-medium"
              whileHover={{ y: -2 }}
            >
              Privacy Policy
            </motion.a>
            <motion.a 
              href="#" 
              className="text-cream/60 hover:text-terracotta transition-colors cursor-interactive font-medium"
              whileHover={{ y: -2 }}
            >
              Terms of Service
            </motion.a>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}

