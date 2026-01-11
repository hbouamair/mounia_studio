"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Play, Sparkles, TrendingUp } from "lucide-react";
import { useRef, useState, useEffect } from "react";

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });
  
  // Parallax only on desktop
  const y = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  
  return (
    <section
      ref={containerRef}
      id="hero"
      className="relative min-h-screen w-full overflow-hidden bg-cream"
    >
      {/* Modern Mesh Gradient Background */}
      <div className="absolute inset-0">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-cream via-white to-cream" />
        
        {/* Animated mesh gradients */}
          <motion.div
            className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-primary-500/20 via-primary-500/10 to-transparent rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, 30, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-[700px] h-[700px] bg-gradient-to-tr from-secondary-500/20 via-secondary-500/10 to-transparent rounded-full blur-3xl"
          animate={{ 
            scale: [1.2, 1, 1.2],
            x: [0, -30, 0],
            y: [0, -50, 0]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Subtle grid overlay */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: 'radial-gradient(circle, #2C2C2C 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}
        />
      </div>
      
      {/* Content */}
      <motion.div
        className="relative z-10 min-h-screen flex items-start pt-[88px] sm:pt-[96px] md:pt-[104px]"
        style={{ 
          // Disable parallax on mobile, enable on desktop
          y: isMobile ? 0 : y,
          opacity: isMobile ? 1 : opacity
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 md:pt-10 pb-20 sm:pb-24 md:pb-32 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-16 items-center">
            
            {/* Left Content - Main Message */}
            <div className="lg:col-span-7 space-y-6 sm:space-y-8">
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div 
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full shadow-lg"
                  style={{
                    background: 'linear-gradient(135deg, #1E3A5F, #2A9D8F)',
                    color: '#ffffff'
                  }}
                >
                  <Sparkles className="w-4 h-4 text-white" style={{ color: '#ffffff' }} />
                  <span className="text-sm font-semibold text-white" style={{ color: '#ffffff' }}>Studio de Danse à Casablanca</span>
                  <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                </div>
              </motion.div>
              
              {/* Headline */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="relative"
              >
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl font-display font-extrabold leading-tight sm:leading-[0.95]">
                  {/* "Dance" - Large and bold */}
                  <motion.span 
                    className="block text-charcoal relative"
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                  >
                    Dance
                    {/* Subtle glow effect */}
                    <motion.span
                      className="absolute inset-0 blur-2xl opacity-20"
                      animate={{ opacity: [0.1, 0.3, 0.1] }}
                      transition={{ duration: 3, repeat: Infinity }}
                      style={{ 
                        background: 'linear-gradient(90deg, #1E3A5F, #2A9D8F)',
                        filter: 'blur(20px)'
                      }}
                    />
                  </motion.span>
                  
                  {/* "with Soul" - Gradient with animation */}
                  <motion.span 
                    className="relative inline-block mt-2 sm:mt-3 md:mt-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                  >
                    <span className="relative inline-block">
                      {/* Animated gradient text - Solid color with gradient overlay */}
                      <motion.span
                        className="relative font-extrabold text-primary-500"
                        style={{
                          color: '#1E3A5F',
                          textShadow: '0 2px 8px rgba(30, 58, 95, 0.2)',
                        }}
                      >
                        with Soul
                        {/* Animated gradient overlay for shimmer effect */}
                        <motion.span
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-secondary-500/40 to-transparent"
                          animate={{
                            x: ['-100%', '200%'],
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "linear",
                            repeatDelay: 1
                          }}
                          style={{
                            mixBlendMode: 'overlay',
                            pointerEvents: 'none',
                          }}
                        />
                      </motion.span>
                      
                      {/* Animated underline with gradient */}
                      <motion.div
                        className="absolute -bottom-3 left-0 right-0 h-3 rounded-full"
                        initial={{ scaleX: 0, opacity: 0 }}
                        animate={{ scaleX: 1, opacity: 1 }}
                        transition={{ duration: 1, delay: 1.2, ease: "easeOut" }}
                        style={{
                          background: 'linear-gradient(90deg, #1E3A5F, #2A9D8F, #1E3A5F)',
                          backgroundSize: '200% 100%',
                        }}
                      >
                        <motion.div
                          className="absolute inset-0 rounded-full"
                          animate={{
                            backgroundPosition: ['0%', '100%', '0%'],
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "linear"
                          }}
                          style={{
                            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                            backgroundSize: '200% 100%',
                          }}
                        />
                      </motion.div>
                      
                      {/* Decorative sparkles */}
                      <motion.div
                        className="absolute -top-2 -right-8 hidden sm:block"
                        animate={{ 
                          rotate: [0, 180, 360],
                          scale: [1, 1.2, 1]
                        }}
                        transition={{ 
                          duration: 4, 
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        <Sparkles className="w-6 h-6 text-primary-500/60" />
                      </motion.div>
                    </span>
                  </motion.span>
                </h1>
              </motion.div>
              
              {/* Description */}
              <motion.p
                className="text-xl md:text-2xl text-soft-charcoal max-w-2xl leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                Transformez votre corps et votre esprit grâce à l&apos;art du mouvement. 
                Rejoignez notre communauté de danseurs passionnés à Casablanca.
              </motion.p>
              
              {/* CTA Buttons */}
              <motion.div
                className="flex flex-col sm:flex-row gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1 }}
              >
                <motion.a
                  href="/studios"
                  className="group relative px-8 py-5 text-white font-bold rounded-2xl overflow-hidden shadow-lg"
                  style={{ 
                    background: 'linear-gradient(to right, #1E3A5F, #182E4C)',
                    color: '#ffffff'
                  }}
                  whileHover={{ scale: 1.02, boxShadow: "0 20px 40px rgba(30, 58, 95, 0.3)" }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2" style={{ color: '#ffffff' }}>
                    Start Your Journey
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" style={{ color: '#ffffff' }} />
                  </span>
                  <motion.div
                    className="absolute inset-0"
                    style={{ background: 'linear-gradient(to right, #182E4C, #2A9D8F)' }}
                    initial={{ x: "100%" }}
                    whileHover={{ x: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.a>
                
                <motion.a
                  href="/classes"
                  className="group px-6 sm:px-8 py-4 sm:py-5 bg-white border-2 border-charcoal/10 text-charcoal font-bold rounded-2xl hover:border-primary-500 hover:bg-primary-500/5 transition-all flex items-center justify-center gap-2 text-sm sm:text-base"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Play className="w-4 h-4 sm:w-5 sm:h-5" />
                  Voir les Classes
                </motion.a>
              </motion.div>
              
              {/* Stats */}
              <motion.div
                className="flex flex-wrap gap-4 sm:gap-6 md:gap-8 pt-6 sm:pt-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 1.2 }}
              >
                {[
                  { value: "8+", label: "Expert Instructors" },
                  { value: "10+", label: "Dance Styles" },
                  { value: "50+", label: "Weekly Classes" }
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    className="relative"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.4 + index * 0.1 }}
                    whileHover={{ y: -4 }}
                  >
                    <div className="text-4xl md:text-5xl font-display font-bold text-primary-500">
                      {stat.value}
                    </div>
                    <div className="text-sm text-soft-charcoal font-medium mt-1">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
            
            {/* Right Content - Studio Image */}
            <div className="lg:col-span-5 relative">
              <motion.div
                className="relative"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.6 }}
              >
                {/* Studio Image Card */}
                <div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl">
                  {/* Studio Image */}
                  <div 
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{
                      backgroundImage: 'url("https://images.unsplash.com/photo-1518611012118-696072aa579a?w=1200&q=80")'
                    }}
                  >
                    {/* Gradient overlay for text readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/40 to-transparent" />
                  </div>
                  
                  {/* Content overlay */}
                  <div className="relative h-full flex flex-col justify-end p-6 sm:p-8">
                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <h3 className="text-2xl sm:text-3xl font-display font-bold text-cream mb-2">
                        Start Today
                      </h3>
                      <p className="text-cream/80 text-sm sm:text-base">
                        First class is always free for new members
                      </p>
                    </motion.div>
                  </div>
                  
                  {/* Floating badge */}
                  <motion.div
                    className="absolute top-6 right-6 px-4 py-2 rounded-full shadow-lg"
                    style={{
                      background: 'linear-gradient(135deg, #1E3A5F, #2A9D8F)',
                      color: '#ffffff'
                    }}
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-white" style={{ color: '#ffffff' }} />
                      <span className="text-xs font-bold text-white" style={{ color: '#ffffff', fontWeight: 700 }}>Top Rated</span>
                    </div>
                  </motion.div>
                  
                  {/* Decorative corner accent */}
                  <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-primary-500/30 to-transparent" />
                </div>
                
                {/* Floating elements */}
                <motion.div
                  className="absolute -top-6 -left-6 w-32 h-32 rounded-3xl bg-gradient-to-br from-primary-500 to-primary-500/50 backdrop-blur-sm shadow-xl hidden lg:block"
                  animate={{ 
                    rotate: [0, 5, 0],
                    y: [0, -10, 0]
                  }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                />
                
                <motion.div
                  className="absolute -bottom-6 -right-6 w-40 h-40 rounded-3xl bg-gradient-to-br from-secondary-500 to-secondary-500/50 backdrop-blur-sm shadow-xl hidden lg:block"
                  animate={{ 
                    rotate: [0, -5, 0],
                    y: [0, 10, 0]
                  }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                />
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Scroll Indicator */}
      <motion.a
        href="/classes"
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer group"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        <span className="text-sm font-medium text-charcoal/60 group-hover:text-charcoal transition-colors">
          Explore
        </span>
          <motion.div
            className="w-8 h-12 rounded-full border-2 border-charcoal/20 flex items-start justify-center pt-2"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <motion.div
              className="w-1.5 h-3 rounded-full bg-primary-500"
            animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </motion.a>
    </section>
  );
}
