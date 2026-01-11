"use client";

import { motion } from "framer-motion";
import { Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";

interface StudioPlan {
  id: string;
  name: string;
  price: string;
  size?: string;
  capacity?: string;
  offer: string;
  image: string;
}

const studios: StudioPlan[] = [
  {
    id: "1",
    name: "STUDIO 1",
    price: "450 DHS/heure",
    size: "m² et capacité",
    offer: "Offre: 10h = 1 cours gratuit",
    image: "/studio-image.jpg"
  },
  {
    id: "2",
    name: "STUDIO 2",
    price: "450 DHS/heure",
    offer: "Offre: 10h = 1 cours gratuit",
    image: "/studio-image.jpg"
  },
  {
    id: "3",
    name: "STUDIO 3",
    price: "250 DHS/heure",
    offer: "Offre: 10h = 1 cours gratuit",
    image: "/studio-image.jpg"
  }
];

export default function FlexiblePlans() {
  return (
    <section
      id="flexible-plans"
      className="relative py-12 sm:py-16 md:py-20 lg:py-24 overflow-hidden"
    >
      {/* Modern gradient background with animated overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-cream/30 to-white" />
      
      {/* Animated gradient blobs */}
      <motion.div
        className="absolute top-20 -right-40 w-[800px] h-[800px] rounded-full bg-gradient-to-br from-primary-500/10 to-secondary-500/10 blur-3xl hidden md:block"
        animate={{ 
          x: [0, 50, 0],
          y: [0, 30, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-20 -left-40 w-[700px] h-[700px] rounded-full bg-gradient-to-tr from-secondary-500/10 to-accent-500/10 blur-3xl hidden md:block"
        animate={{ 
          x: [0, -50, 0],
          y: [0, -30, 0],
          scale: [1, 1.15, 1]
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
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
          
          {/* Title with modern typography */}
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
            className="text-base sm:text-lg md:text-xl text-soft-charcoal max-w-3xl mx-auto px-4 leading-relaxed"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            Choisissez la formule qui correspond à vos besoins et à votre rythme
          </motion.p>
        </motion.div>
        
        {/* Modern Studio Cards Grid - 2026 Design */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 max-w-6xl mx-auto">
          {studios.map((studio, index) => (
            <motion.div
              key={studio.id}
              className="group relative"
              initial={{ opacity: 0, y: 50, rotateX: -15 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true }}
              transition={{ 
                duration: 0.8, 
                delay: 0.2 + index * 0.15,
                type: "spring",
                stiffness: 100
              }}
              whileHover={{ 
                y: -12,
                rotateY: 2,
                transition: { duration: 0.3 }
              }}
              style={{ perspective: "1000px" }}
            >
              {/* Card Container with Glassmorphism */}
              <div className="relative h-full bg-white/80 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl border border-white/50">
                {/* Animated gradient overlay */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-secondary-500/5"
                  animate={{ 
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: index * 0.5 }}
                />
                
                {/* Image Section with Modern Overlay */}
                <div className="relative h-48 sm:h-56 md:h-64 overflow-hidden">
                  <motion.div 
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                      backgroundImage: `url(${studio.image})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                  />
                  
                  {/* Modern gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/40 to-transparent" />
                  
                  {/* Floating badge */}
                  <motion.div
                    className="absolute top-4 right-4 px-4 py-2 rounded-full backdrop-blur-md"
                    style={{
                      background: 'rgba(255, 255, 255, 0.2)',
                      border: '1px solid rgba(255, 255, 255, 0.3)'
                    }}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <span className="text-white text-xs font-bold">POPULAIRE</span>
                  </motion.div>
                  
                  {/* Studio name overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-3xl sm:text-4xl font-black text-white mb-1" style={{
                      textShadow: '0 2px 10px rgba(0,0,0,0.5)'
                    }}>
                      {studio.name}
                    </h3>
                    {studio.size && (
                      <p className="text-white/80 text-sm font-medium">{studio.size}</p>
                    )}
                  </div>
                </div>
                
                {/* Content Section with Modern Design */}
                <div 
                  className="relative p-5 sm:p-6"
                  style={{
                    background: 'linear-gradient(135deg, #2A9D8F, #1E3A5F)'
                  }}
                >
                  {/* Price with gradient */}
                  <div className="mb-3">
                    <p className="text-2xl sm:text-3xl font-black mb-2">
                      <span 
                        className="text-white"
                        style={{
                          color: '#ffffff',
                          fontWeight: 900,
                          textShadow: '0 2px 10px rgba(0,0,0,0.3)'
                        }}
                      >
                        {studio.price.split('/')[0]}
                      </span>
                      <span 
                        className="text-white/90 text-xl"
                        style={{
                          color: 'rgba(255, 255, 255, 0.9)',
                          textShadow: '0 1px 5px rgba(0,0,0,0.2)'
                        }}
                      >
                        /{studio.price.split('/')[1]}
                      </span>
                    </p>
                  </div>
                  
                  {/* Offer badge */}
                  <motion.div
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4"
                    style={{
                      background: 'rgba(255, 255, 255, 0.2)',
                      border: '1px solid rgba(255, 255, 255, 0.3)'
                    }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <CheckCircle2 className="w-4 h-4 text-white" style={{ color: '#ffffff' }} />
                    <span className="text-sm font-semibold text-white" style={{ color: '#ffffff' }}>{studio.offer}</span>
                  </motion.div>
                  
                  {/* Modern CTA Button */}
                  <motion.button
                    className="group/btn w-full py-3 px-5 rounded-xl font-bold text-sm sm:text-base overflow-hidden relative"
                    style={{
                      background: '#ffffff',
                      color: '#1E3A5F',
                      boxShadow: '0 10px 30px rgba(255, 255, 255, 0.3)'
                    }}
                    whileHover={{ 
                      scale: 1.05,
                      y: -2,
                      boxShadow: '0 15px 40px rgba(255, 255, 255, 0.4)'
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2" style={{ color: '#1E3A5F', fontWeight: 700 }}>
                      RÉSERVER MAINTENANT
                      <motion.span
                        animate={{ x: [0, 4, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <ArrowRight className="w-5 h-5" style={{ color: '#1E3A5F' }} />
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
                </div>
                
                {/* Decorative corner accent */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-500/10 to-transparent rounded-bl-full" />
              </div>
              
              {/* Glow effect on hover */}
              <motion.div
                className="absolute -inset-1 bg-gradient-to-r from-primary-500/20 to-secondary-500/20 rounded-3xl blur-xl opacity-0 -z-10"
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
          ))}
        </div>
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
