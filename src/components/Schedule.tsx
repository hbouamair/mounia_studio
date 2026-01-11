"use client";

import { motion } from "framer-motion";
import { Calendar, Sparkles, ArrowRight } from "lucide-react";

interface ScheduleProps {
  onOpenBooking: () => void;
}

export default function Schedule({ onOpenBooking }: ScheduleProps) {
  return (
    <section
      id="schedule"
      className="relative py-12 sm:py-16 md:py-20 lg:py-24 overflow-hidden"
    >
      {/* Modern gradient background */}
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(135deg, #2A9D8F 0%, #1E3A5F 50%, #2A9D8F 100%)',
        backgroundSize: '200% 200%'
      }}>
        <motion.div
          className="absolute inset-0"
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%', '0% 0%']
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{
            background: 'linear-gradient(135deg, rgba(42, 157, 143, 0.3) 0%, rgba(30, 58, 95, 0.3) 50%, rgba(42, 157, 143, 0.3) 100%)',
            backgroundSize: '200% 200%'
          }}
        />
      </div>
      
      {/* Animated background elements */}
      <motion.div
        className="absolute top-20 right-20 w-96 h-96 rounded-full bg-white/5 blur-3xl"
        animate={{ 
          x: [0, 50, 0],
          y: [0, 30, 0],
          scale: [1, 1.2, 1]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-20 left-20 w-96 h-96 rounded-full bg-white/5 blur-3xl"
        animate={{ 
          x: [0, -50, 0],
          y: [0, -30, 0],
          scale: [1, 1.2, 1]
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
      />
      
      {/* Subtle grid pattern */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}
      />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Modern Header - 2026 Design */}
        <motion.div
          className="text-center mb-8 sm:mb-10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {/* Badge */}
          <motion.div
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full backdrop-blur-md mb-4 sm:mb-6"
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              border: '1px solid rgba(255, 255, 255, 0.3)'
            }}
            initial={{ opacity: 0, scale: 0.8, y: -20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ scale: 1.05 }}
          >
            <Calendar className="w-4 h-4 text-white" />
            <span className="text-sm font-semibold text-white">Planning Hebdomadaire</span>
            <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
          </motion.div>
          
          {/* Title with modern typography */}
          <motion.h2 
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-extrabold text-white mb-6 sm:mb-8 px-4 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            style={{
              textShadow: '0 4px 20px rgba(0,0,0,0.3), 0 2px 10px rgba(0,0,0,0.2)'
            }}
          >
            <span className="relative inline-block">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-white/90 to-white">
                PLANNING DES COURS
              </span>
              <motion.div
                className="absolute -bottom-2 left-0 right-0 h-1.5 bg-white/30 rounded-full"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.8 }}
              />
            </span>
            <br />
            <span className="text-white">DE LA SEMAINE</span>
          </motion.h2>
          
          {/* Modern CTA Button */}
          <motion.button
            onClick={onOpenBooking}
            className="group relative px-10 sm:px-14 py-4 sm:py-5 bg-white text-primary-700 font-bold rounded-2xl overflow-hidden shadow-2xl"
            whileHover={{ 
              scale: 1.05,
              y: -4,
              boxShadow: '0 25px 50px rgba(255,255,255,0.3)'
            }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
            style={{
              color: '#1E3A5F'
            }}
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              VOIR LE PLANNING
              <motion.span
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ArrowRight className="w-5 h-5" />
              </motion.span>
            </span>
            
            {/* Hover gradient overlay */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-secondary-500/10"
              initial={{ x: "-100%" }}
              whileHover={{ x: 0 }}
              transition={{ duration: 0.3 }}
            />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
