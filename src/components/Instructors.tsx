"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Award, Heart, Star } from "lucide-react";
import { instructors } from "@/data/instructors";
import { useRef } from "react";

export default function Instructors() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  
  const y1 = useTransform(scrollYProgress, [0, 1], [150, -150]);
  const y2 = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const y3 = useTransform(scrollYProgress, [0, 1], [50, -50]);
  
  return (
    <section
      ref={containerRef}
      id="instructors"
      className="relative py-16 sm:py-20 md:py-24 lg:py-32 overflow-hidden"
    >
      {/* Smooth gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-cream via-white to-cream" />
      
      {/* Animated overlay */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-tr from-deep-violet/3 via-transparent to-terracotta/3"
        animate={{ 
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      
      {/* Smooth Parallax Backgrounds */}
      <motion.div
        className="absolute top-20 right-10 w-[500px] h-[500px] rounded-full bg-gradient-to-bl from-deep-violet/6 to-transparent blur-3xl"
        style={{ y: y1 }}
      />
      <motion.div
        className="absolute bottom-40 left-10 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-terracotta/6 to-transparent blur-3xl"
        style={{ y: y2 }}
      />
      <motion.div
        className="absolute top-1/2 right-1/4 w-[400px] h-[400px] rounded-full bg-gradient-to-br from-terracotta/4 to-transparent blur-3xl"
        style={{ y: y3 }}
      />
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-12 sm:mb-16 md:mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {/* Floating Badge */}
          <motion.div
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-deep-violet text-white font-bold text-sm mb-6 shadow-md"
            initial={{ opacity: 0, scale: 0.8, y: -20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ scale: 1.05, y: -2 }}
          >
            <Star className="w-4 h-4 fill-white" />
            <span>World-Class Instructors</span>
            <Star className="w-4 h-4 fill-white" />
          </motion.div>
          
          {/* Main Heading with animated gradient */}
          <div className="relative inline-block mb-6">
            <motion.h2 
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold px-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <span className="text-charcoal">Meet Your</span>
              <br />
              <span className="relative inline-block">
                <span className="text-deep-violet">Dance Mentors</span>
                {/* Animated underline */}
                <motion.div
                  className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-terracotta via-deep-violet to-terracotta rounded-full"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                />
              </span>
            </motion.h2>
          </div>
          
          {/* Description */}
          <motion.p 
            className="text-base sm:text-lg md:text-xl text-soft-charcoal max-w-3xl mx-auto px-4 leading-relaxed"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            Our passionate instructors bring decades of professional experience and a genuine love for teaching. 
            <span className="block mt-2 text-deep-violet font-medium">Each mentor is dedicated to your growth.</span>
          </motion.p>
        </motion.div>
        
        {/* Instructors Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 sm:gap-6 auto-rows-[240px]">
          {instructors.map((instructor, index) => {
            // Bento grid layout pattern - varying sizes
            const isLarge = index === 0 || index === 3;
            const isTall = index === 1 || index === 6;
            const gridClass = isLarge 
              ? "lg:col-span-7 lg:row-span-2" 
              : isTall 
              ? "lg:col-span-5 lg:row-span-2"
              : "lg:col-span-4";
            
            return (
              <motion.div
                key={instructor.id}
                className={`group relative ${gridClass}`}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <motion.div
                  className="relative h-full rounded-4xl overflow-hidden shadow-skeu-md"
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                >
                  {/* Background Image/Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-terracotta/30 via-deep-violet/30 to-terracotta/40">
                    {/* Animated gradient overlay */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-tr from-deep-violet/20 to-terracotta/20"
                      animate={{ 
                        opacity: [0.3, 0.6, 0.3],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    />
                  </div>
                  
                  {/* Glassmorphic overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/95 via-charcoal/60 to-transparent" />
                  
                  {/* Content */}
                  <div className="relative h-full flex flex-col justify-end p-6 sm:p-8">
                    {/* Experience Badge */}
                    <motion.div
                      className="absolute top-4 right-4 px-4 py-2 rounded-full bg-white shadow-md"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      <div className="flex items-center gap-1.5 text-sm font-bold text-charcoal">
                        <Award className="w-4 h-4 text-terracotta" />
                        <span>{instructor.yearsExperience} years</span>
                      </div>
                    </motion.div>
                    
                    {/* Decorative element */}
                    <motion.div
                      className="absolute top-8 left-8 w-16 h-16 rounded-full bg-terracotta/20 blur-2xl"
                      animate={{ 
                        scale: [1, 1.3, 1],
                        opacity: [0.3, 0.6, 0.3]
                      }}
                      transition={{ duration: 4, repeat: Infinity }}
                    />
                    
                    {/* Name & Title */}
                    <div className="space-y-2 mb-4">
                      <h3 className="text-2xl sm:text-3xl font-display font-bold text-cream group-hover:text-white transition-colors">
                        {instructor.name}
                      </h3>
                      
                      <p className="text-sm sm:text-base text-terracotta font-semibold">
                        {instructor.title}
                      </p>
                    </div>
                    
                    {/* Bio - only show on larger cards */}
                    {(isLarge || isTall) && (
                      <p className="text-sm text-cream/80 leading-relaxed mb-4 line-clamp-3">
                        {instructor.bio}
                      </p>
                    )}
                    
                    {/* Specialties */}
                    <div className="flex flex-wrap gap-2">
                      {instructor.specialties.slice(0, isLarge || isTall ? 3 : 2).map((specialty) => (
                        <span
                          key={specialty}
                          className="px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm text-xs font-bold text-white border border-white/30 shadow-sm"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {/* Hover glow effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-t from-deep-violet/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  />
                  
                  {/* Border glow on hover */}
                  <motion.div
                    className="absolute inset-0 rounded-4xl ring-2 ring-terracotta/0 group-hover:ring-terracotta/50 transition-all duration-300"
                  />
                </motion.div>
              </motion.div>
            );
          })}
        </div>
        
        {/* CTA Section - Modern Design */}
        <motion.div
          className="mt-16 sm:mt-20 md:mt-24"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="relative max-w-5xl mx-auto rounded-5xl overflow-hidden shadow-skeu-lg">
            {/* Animated gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-deep-violet via-deep-violet/90 to-terracotta">
              <motion.div
                className="absolute inset-0 bg-gradient-to-tr from-terracotta/30 to-deep-violet/30"
                animate={{ 
                  opacity: [0.3, 0.7, 0.3],
                }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
            
            {/* Decorative blobs */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-terracotta/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
            
            {/* Content */}
            <div className="relative z-10 p-8 sm:p-12 md:p-16 text-center">
              {/* Icon */}
              <motion.div
                className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/20 backdrop-blur-sm mb-6"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <Heart className="w-8 h-8 sm:w-10 sm:h-10 text-white fill-white" />
              </motion.div>
              
              <h3 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-white mb-4 sm:mb-6">
                Ready to Start Your
                <span className="block text-cream">Dance Journey?</span>
              </h3>
              
              <p className="text-base sm:text-lg md:text-xl text-cream/90 mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed">
                Join our community of passionate dancers and experience the transformative power of movement.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <motion.a
                  href="#schedule"
                  className="w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-5 bg-white text-deep-violet text-sm sm:text-base font-bold rounded-full shadow-skeu-lg text-center"
                  whileHover={{ scale: 1.05, y: -3, boxShadow: "0 20px 40px rgba(0,0,0,0.2)" }}
                  whileTap={{ scale: 0.95 }}
                  style={{ color: '#6B4E97' }}
                >
                  Book Your First Class
                </motion.a>
                
                <motion.a
                  href="#classes"
                  className="w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-5 bg-white/10 backdrop-blur-sm text-white text-sm sm:text-base font-semibold rounded-full border-2 border-white/30 text-center"
                  whileHover={{ scale: 1.05, y: -3, backgroundColor: "rgba(255,255,255,0.2)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  Browse Classes
                </motion.a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

