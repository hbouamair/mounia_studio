"use client";

import { motion } from "framer-motion";
import { Globe, Clock, Building2, Package, Users, XCircle, Sparkles, ArrowRight } from "lucide-react";

const features = [
  {
    icon: Globe,
    title: "RÉSERVATION EN LIGNE",
    description: "Choisissez la salle, l'horaire et payez en toute sécurité – sans appel ni contrat."
  },
  {
    icon: Clock,
    title: "FLEXIBILITÉ",
    description: "Nos studios sont disponibles à l'heure, à la demi-journée ou à la journée."
  },
  {
    icon: Building2,
    title: "STUDIOS MODERNES",
    description: "Chaque salle est lumineuse, climatisée et équipée de miroirs, système audio, jeux de lumières.."
  },
  {
    icon: Package,
    title: "FORMULES AVANTAGEUSES",
    description: "Bénéficiez de tarifs dégressifs avec nos packs de 5 ou 10 heures. Plus vous dansez, plus vous économisez."
  },
  {
    icon: Users,
    title: "POUR TOUS LES PROFILS",
    description: "Cours privés, répétitions, workshops, tournages ou entraînements personnels: nos studios s'adaptent à tous les usages."
  },
  {
    icon: XCircle,
    title: "ANNULATION POSSIBLE",
    description: "Paiements sécurisés, annulation possible jusqu'à 72h à l'avance."
  }
];

export default function WhyChooseUs() {
  return (
    <section
      id="why-choose-us"
      className="relative py-12 sm:py-16 md:py-20 lg:py-24 overflow-hidden"
    >
      {/* Modern gradient background */}
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(135deg, #1E3A5F 0%, #182E4C 50%, #1E3A5F 100%)',
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
            background: 'linear-gradient(135deg, rgba(30, 58, 95, 0.5) 0%, rgba(24, 46, 76, 0.5) 50%, rgba(30, 58, 95, 0.5) 100%)',
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
      
      {/* Subtle grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }}
      />
      
      {/* Blurred background image effect */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: 'url(/studio-image.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(30px)'
        }}
      />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Modern Header - 2026 Design */}
        <motion.div
          className="text-center mb-10 sm:mb-12"
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
            <Sparkles className="w-4 h-4 text-white" />
            <span className="text-sm font-semibold text-white">Nos Avantages</span>
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
                POURQUOI CHOISIR
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
            <span className="text-white">STUDIO RJ?</span>
          </motion.h2>
        </motion.div>
        
        {/* Modern Features Grid - 2026 Design */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="group relative"
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ 
                duration: 0.6, 
                delay: 0.2 + index * 0.1,
                type: "spring",
                stiffness: 100
              }}
            >
              {/* Feature Card with Glassmorphism */}
              <motion.div
                className="relative bg-white/10 backdrop-blur-xl rounded-2xl p-6 sm:p-7 border border-white/20 shadow-2xl h-full flex flex-col"
                whileHover={{ 
                  y: -12,
                  scale: 1.03,
                  borderColor: 'rgba(255, 255, 255, 0.4)',
                  boxShadow: '0 25px 50px rgba(0,0,0,0.4)'
                }}
                transition={{ duration: 0.3 }}
              >
                {/* Animated background gradient */}
                <motion.div
                  className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/10 via-transparent to-white/5"
                  animate={{ 
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: index * 0.5 }}
                />
                
                {/* Icon with modern design */}
                <div className="relative mb-4 sm:mb-5">
                  <motion.div
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/10 backdrop-blur-md border-2 border-white/30 flex items-center justify-center mx-auto relative overflow-hidden"
                    whileHover={{ 
                      rotate: 360,
                      scale: 1.15
                    }}
                    transition={{ duration: 0.6 }}
                  >
                    {/* Animated gradient background */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-primary-400/30 to-secondary-400/30"
                      animate={{ 
                        rotate: [0, 360],
                      }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    />
                    
                    <feature.icon className="w-8 h-8 sm:w-10 sm:h-10 text-white relative z-10" />
                    
                    {/* Glow effect */}
                    <motion.div
                      className="absolute -inset-4 bg-gradient-to-br from-primary-400/50 to-secondary-400/50 rounded-full blur-xl opacity-0"
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.div>
                </div>
                
                {/* Content */}
                <div className="relative flex-1 flex flex-col justify-center text-center">
                  <motion.h3 
                    className="text-base sm:text-lg md:text-xl font-bold text-white mb-2 sm:mb-3 min-h-[3rem] flex items-center justify-center"
                    style={{
                      textShadow: '0 2px 10px rgba(0,0,0,0.3)'
                    }}
                  >
                    {feature.title}
                  </motion.h3>
                  <p className="text-white/80 text-xs sm:text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
                
                {/* Decorative elements */}
                <div className="absolute top-4 left-4 w-12 h-12 bg-white/5 rounded-full blur-xl" />
                <div className="absolute bottom-4 right-4 w-16 h-16 bg-white/5 rounded-full blur-xl" />
                
                {/* Hover arrow indicator */}
                <motion.div
                  className="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                  initial={{ y: -10 }}
                  whileHover={{ y: 0 }}
                >
                  <ArrowRight className="w-5 h-5 text-white rotate-90" />
                </motion.div>
              </motion.div>
              
              {/* Glow effect on hover */}
              <motion.div
                className="absolute -inset-1 bg-gradient-to-r from-primary-500/20 to-secondary-500/20 rounded-2xl blur-xl opacity-0 -z-10"
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
          ))}
        </div>
        
        {/* Modern CTA Button */}
        <motion.div
          className="text-center mt-10 sm:mt-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <motion.button
            className="group relative px-10 sm:px-14 py-4 sm:py-5 bg-white text-primary-700 font-bold rounded-2xl overflow-hidden shadow-2xl"
            whileHover={{ 
              scale: 1.05,
              y: -4,
              boxShadow: '0 25px 50px rgba(255,255,255,0.3)'
            }}
            whileTap={{ scale: 0.95 }}
            style={{
              color: '#1E3A5F'
            }}
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              RÉSERVER MON CRÉNEAU
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
