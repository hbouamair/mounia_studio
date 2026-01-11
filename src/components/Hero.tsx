"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Play, Sparkles, TrendingUp } from "lucide-react";
import { useRef } from "react";

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  
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
          className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-terracotta/20 via-terracotta/10 to-transparent rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, 30, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-[700px] h-[700px] bg-gradient-to-tr from-deep-violet/20 via-deep-violet/10 to-transparent rounded-full blur-3xl"
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
        className="relative z-10 min-h-screen flex items-center"
        style={{ y, opacity }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-32 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left Content - Main Message */}
            <div className="lg:col-span-7 space-y-8">
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-terracotta/10 to-deep-violet/10 border border-terracotta/20">
                  <Sparkles className="w-4 h-4 text-terracotta" />
                  <span className="text-sm font-semibold text-charcoal">San Francisco's Premier Studio</span>
                  <div className="w-2 h-2 rounded-full bg-terracotta animate-pulse" />
                </div>
              </motion.div>
              
              {/* Headline */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-display font-bold leading-[0.95] text-charcoal">
                  Dance
                  <br />
                  <span className="relative inline-block">
                    <span className="relative bg-gradient-to-r from-terracotta via-terracotta to-deep-violet bg-clip-text text-transparent">
                      with Soul
                    </span>
                    <motion.div
                      className="absolute -bottom-2 left-0 right-0 h-2 bg-gradient-to-r from-terracotta to-deep-violet rounded-full"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.8, delay: 1.2 }}
                    />
                  </span>
                </h1>
              </motion.div>
              
              {/* Description */}
              <motion.p
                className="text-xl md:text-2xl text-soft-charcoal max-w-2xl leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                Transform your body and spirit through the art of movement. 
                Join our community of passionate dancers.
              </motion.p>
              
              {/* CTA Buttons */}
              <motion.div
                className="flex flex-col sm:flex-row gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1 }}
              >
                <motion.a
                  href="#schedule"
                  className="group relative px-8 py-5 bg-gradient-to-r from-terracotta to-[#c66647] text-white font-bold rounded-2xl overflow-hidden shadow-lg"
                  whileHover={{ scale: 1.02, boxShadow: "0 20px 40px rgba(217, 119, 87, 0.3)" }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Start Your Journey
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-[#c66647] to-deep-violet"
                    initial={{ x: "100%" }}
                    whileHover={{ x: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.a>
                
                <motion.a
                  href="#classes"
                  className="group px-8 py-5 bg-white border-2 border-charcoal/10 text-charcoal font-bold rounded-2xl hover:border-terracotta hover:bg-terracotta/5 transition-all flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Play className="w-5 h-5" />
                  Watch Classes
                </motion.a>
              </motion.div>
              
              {/* Stats */}
              <motion.div
                className="flex flex-wrap gap-8 pt-8"
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
                    <div className="text-4xl md:text-5xl font-display font-bold text-terracotta">
                      {stat.value}
                    </div>
                    <div className="text-sm text-soft-charcoal font-medium mt-1">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
            
            {/* Right Content - Visual Elements */}
            <div className="lg:col-span-5 relative">
              <motion.div
                className="relative"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.6 }}
              >
                {/* Main card */}
                <div className="relative aspect-[4/5] rounded-[3rem] bg-gradient-to-br from-charcoal via-charcoal/95 to-charcoal overflow-hidden shadow-2xl">
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-terracotta/20 via-transparent to-deep-violet/20" />
                  
                  {/* Content inside card */}
                  <div className="relative h-full flex flex-col justify-end p-8">
                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <div className="text-6xl mb-4">💃</div>
                      <h3 className="text-2xl font-display font-bold text-cream mb-2">
                        Start Today
                      </h3>
                      <p className="text-cream/70 text-sm">
                        First class is always free for new members
                      </p>
                    </motion.div>
                  </div>
                  
                  {/* Floating badge */}
                  <motion.div
                    className="absolute top-6 right-6 px-4 py-2 rounded-full bg-white/90 backdrop-blur-sm shadow-lg"
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-terracotta" />
                      <span className="text-xs font-bold text-charcoal">Top Rated</span>
                    </div>
                  </motion.div>
                </div>
                
                {/* Floating elements */}
                <motion.div
                  className="absolute -top-6 -left-6 w-32 h-32 rounded-3xl bg-gradient-to-br from-terracotta to-terracotta/50 backdrop-blur-sm shadow-xl hidden lg:block"
                  animate={{ 
                    rotate: [0, 5, 0],
                    y: [0, -10, 0]
                  }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                />
                
                <motion.div
                  className="absolute -bottom-6 -right-6 w-40 h-40 rounded-3xl bg-gradient-to-br from-deep-violet to-deep-violet/50 backdrop-blur-sm shadow-xl hidden lg:block"
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
        href="#classes"
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
            className="w-1.5 h-3 rounded-full bg-terracotta"
            animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </motion.a>
    </section>
  );
}
