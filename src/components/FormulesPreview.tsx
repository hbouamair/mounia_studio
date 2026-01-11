"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export default function FormulesPreview() {
  return (
    <section
      id="formules-preview"
      className="relative py-12 sm:py-16 md:py-20 lg:py-24 overflow-hidden"
    >
      {/* Modern gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-cream/30 to-white" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Modern Header */}
        <motion.div
          className="text-center mb-10 sm:mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {/* Badge */}
          <motion.div
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full shadow-lg font-semibold text-sm mb-4 sm:mb-6"
            style={{
              background: 'linear-gradient(135deg, #1E3A5F, #2A9D8F)',
              color: '#ffffff'
            }}
            initial={{ opacity: 0, scale: 0.8, y: -20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ scale: 1.05, y: -2 }}
          >
            <Sparkles className="w-4 h-4 text-white" style={{ color: '#ffffff' }} />
            <span style={{ color: '#ffffff', fontWeight: 600 }}>Nos Formules</span>
            <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
          </motion.div>
          
          {/* Title */}
          <motion.h2 
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-extrabold mb-4 sm:mb-5 px-4 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <span className="text-charcoal">DES FORMULES</span>
            <br />
            <span className="relative inline-block">
              <span 
                className="bg-clip-text text-transparent bg-gradient-to-r from-primary-500 via-secondary-500 to-primary-500"
                style={{
                  backgroundSize: '200% 100%',
                  animation: 'gradient-shift 3s ease infinite'
                }}
              >
                FLEXIBLES
              </span>
              <motion.div
                className="absolute -bottom-2 left-0 right-0 h-1.5 bg-gradient-to-r from-primary-500 via-secondary-500 to-primary-500 rounded-full"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.8 }}
              />
            </span>
            <br />
            <span className="text-charcoal">ADAPTÉES À VOTRE RYTHME</span>
          </motion.h2>
          
          <motion.p 
            className="text-base sm:text-lg md:text-xl text-soft-charcoal max-w-3xl mx-auto px-2 sm:px-4 leading-relaxed mb-6 sm:mb-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            Choisissez la formule qui correspond à vos besoins et à votre rythme
          </motion.p>
          
          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <Link href="/studios">
              <motion.button
                className="group relative px-8 sm:px-10 md:px-14 py-3 sm:py-4 md:py-5 font-bold rounded-2xl overflow-hidden shadow-2xl text-sm sm:text-base"
                style={{
                  background: 'linear-gradient(135deg, #1E3A5F, #2A9D8F)',
                  color: '#ffffff'
                }}
                whileHover={{ 
                  scale: 1.05,
                  y: -4,
                  boxShadow: '0 25px 50px rgba(30, 58, 95, 0.4)'
                }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative z-10 flex items-center justify-center gap-2" style={{ color: '#ffffff' }}>
                  Voir Toutes les Formules
                  <motion.span
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight className="w-5 h-5" style={{ color: '#ffffff' }} />
                  </motion.span>
                </span>
                
                {/* Hover gradient overlay */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-secondary-500 to-accent-500"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Add keyframes for gradient animation */}
      <style jsx>{`
        @keyframes gradient-shift {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
      `}</style>
    </section>
  );
}

