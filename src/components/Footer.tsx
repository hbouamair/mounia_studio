"use client";

import { motion } from "framer-motion";
import { Instagram, Facebook, Youtube, Twitter, Heart } from "lucide-react";
import Logo from "./Logo";

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
        className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl"
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div 
        className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary-500/10 rounded-full blur-3xl"
        animate={{ 
          scale: [1.2, 1, 1.2],
          opacity: [0.2, 0.1, 0.2]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="mb-3 sm:mb-4">
              <Logo size="lg" variant="white" />
            </div>
            <p className="text-sm sm:text-base text-cream/70 mb-4 sm:mb-6">
              Transformez votre vie grâce à l&apos;art de la danse à Casablanca.
            </p>
            
            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social, idx) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-11 h-11 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center cursor-interactive hover:bg-primary-500 border border-white/20 transition-all shadow-skeu-sm"
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
            <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Liens Rapides</h4>
            <ul className="space-y-3">
              {[
                { name: "Classes", href: "/classes" },
                { name: "Studios", href: "/studios" },
                { name: "Instructeurs", href: "/instructors" },
                { name: "Contact", href: "/contact" }
              ].map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-cream/70 hover:text-primary-500 transition-colors cursor-interactive"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Classes */}
          <div>
            <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Cours Populaires</h4>
            <ul className="space-y-3">
              {["Ballet", "Hip Hop", "Contemporain", "Jazz"].map((style) => (
                <li key={style}>
                  <a
                    href="/classes"
                    className="text-cream/70 hover:text-primary-500 transition-colors cursor-interactive"
                  >
                    {style}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Contactez-nous</h4>
            <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base text-cream/70">
              <li>Casablanca, Maroc</li>
              <li>Zone Industrielle</li>
              <li>+212 6XX XXX XXX</li>
              <li>contact@studiorj.ma</li>
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
            © 2026 RJ Studio. Tous droits réservés.
          </p>
          
          <motion.div 
            className="flex items-center gap-2 px-4 py-2 rounded-full glass-morphism border border-cream/10"
            whileHover={{ scale: 1.05 }}
          >
            <span className="text-cream/70 text-sm">Fait avec</span>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <Heart className="w-4 h-4 text-primary-500 fill-primary-500" />
            </motion.div>
            <span className="text-cream/70 text-sm">pour les danseurs</span>
          </motion.div>
          
          <div className="flex gap-6 text-sm">
            <motion.a 
              href="#" 
              className="text-cream/60 hover:text-primary-500 transition-colors cursor-interactive font-medium"
              whileHover={{ y: -2 }}
            >
              Privacy Policy
            </motion.a>
            <motion.a 
              href="#" 
              className="text-cream/60 hover:text-primary-500 transition-colors cursor-interactive font-medium"
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

