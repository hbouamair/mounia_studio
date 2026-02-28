"use client";

import { motion } from "framer-motion";
import { Instagram, Facebook, Youtube, Twitter } from "lucide-react";
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
            <p className="text-base text-cream/85 mb-4 sm:mb-6 leading-relaxed">
              Transformez votre vie grâce à l&apos;art de la danse à Casablanca.
            </p>
            
            {/* Social Links - retirés jusqu'à avoir les URLs */}
            <div className="flex gap-3" aria-hidden>
              {socialLinks.map((social, idx) => (
                <span
                  key={social.label}
                  className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center opacity-60"
                  title="Bientôt disponible"
                >
                  <social.icon className="w-5 h-5" />
                </span>
              ))}
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-white">Liens Rapides</h4>
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
                    className="text-cream/85 hover:text-white transition-colors text-base"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Classes */}
          <div>
            <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-white">Cours Populaires</h4>
            <ul className="space-y-3">
              {["Ballet", "Hip Hop", "Contemporain", "Jazz"].map((style) => (
                <li key={style}>
                  <a
                    href="/classes"
                    className="text-cream/85 hover:text-white transition-colors text-base"
                  >
                    {style}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-white">Contactez-nous</h4>
            <ul className="space-y-2 sm:space-y-3 text-base text-cream/85 leading-relaxed">
              <li>Rue Biranzarane, Casablanca</li>
              <li><a href="tel:+212661777421" className="hover:text-white transition-colors">+212 661 77 77 21</a></li>
              <li><a href="mailto:contact@studiorj.ma" className="hover:text-white transition-colors">contact@studiorj.ma</a></li>
            </ul>
          </div>
        </div>
        
        {/* Bottom Bar - Copyright & Made by Smarty */}
        <motion.div 
          className="pt-10 border-t border-cream/20 flex flex-col md:flex-row items-center justify-between gap-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <p className="text-cream/90 text-base text-center md:text-left font-medium">
            © 2026 RJ Studio. Tous droits réservés.
          </p>
          
          <p className="text-cream/90 text-base text-center md:text-left font-medium tracking-wide">
            Made by{" "}
            <a
              href="https://smarty.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="font-signature font-bold text-white text-xl md:text-2xl hover:text-secondary-400 transition-colors underline underline-offset-2 decoration-white/50 hover:decoration-white"
            >
              Smarty
            </a>
          </p>
          
          <div className="flex gap-6 text-base">
            <motion.a 
              href="/mentions-legales" 
              className="text-cream/80 hover:text-white transition-colors font-medium"
              whileHover={{ y: -2 }}
            >
              Mentions légales
            </motion.a>
            <motion.a 
              href="/cgu" 
              className="text-cream/80 hover:text-white transition-colors font-medium"
              whileHover={{ y: -2 }}
            >
              CGU
            </motion.a>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}

