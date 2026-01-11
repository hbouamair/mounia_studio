"use client";

import { useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { danceClasses } from "@/data/classes";
import { DanceStyle } from "@/data/types";
import ClassCard from "./ClassCard";
import { useRef } from "react";

interface ClassesGridProps {
  onBookClass: (classId: string) => void;
}

const danceStyles: (DanceStyle | "All")[] = [
  "All",
  "Ballet",
  "Hip Hop",
  "Contemporary",
  "Jazz",
  "Salsa",
  "Ballroom",
];

export default function ClassesGrid({ onBookClass }: ClassesGridProps) {
  const [selectedStyle, setSelectedStyle] = useState<DanceStyle | "All">("All");
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  
  const y1 = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [50, -50]);
  
  const filteredClasses = selectedStyle === "All" 
    ? danceClasses 
    : danceClasses.filter(c => c.style === selectedStyle);
  
  return (
    <section
      ref={containerRef}
      id="classes"
      className="relative py-16 sm:py-20 md:py-24 lg:py-32 overflow-hidden"
    >
      {/* Smooth gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-cream via-white to-cream" />
      
      {/* Animated subtle overlay */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-terracotta/3 via-transparent to-deep-violet/3"
        animate={{ 
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Smooth Parallax Background Elements */}
      <motion.div
        className="absolute top-40 -right-20 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-terracotta/8 to-transparent blur-3xl"
        style={{ y: y1 }}
      />
      <motion.div
        className="absolute bottom-40 -left-20 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-deep-violet/8 to-transparent blur-3xl"
        style={{ y: y2 }}
      />
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header - 2026 Design */}
        <motion.div
          className="text-center mb-12 sm:mb-16 md:mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass-morphism shadow-skeu-sm text-terracotta font-semibold text-sm mb-6 border border-terracotta/20"
            initial={{ opacity: 0, scale: 0.8, y: -20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ scale: 1.05, y: -2 }}
          >
            <motion.span
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              💃
            </motion.span>
            <span>Our Classes</span>
            <motion.span
              animate={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
            >
              🕺
            </motion.span>
          </motion.div>
          
          <div className="relative inline-block mb-6">
            <motion.h2 
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold px-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <span className="text-charcoal">Find Your</span>
              <br />
              <span className="relative inline-block">
                <span className="text-terracotta">Perfect Class</span>
                <motion.div
                  className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-terracotta to-deep-violet rounded-full"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                />
              </span>
            </motion.h2>
          </div>
          
          <motion.p 
            className="text-base sm:text-lg md:text-xl text-soft-charcoal max-w-3xl mx-auto px-4 leading-relaxed"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            From classical ballet to urban hip hop, explore our diverse range of dance styles.
            <span className="block mt-2 text-terracotta font-medium">Taught by world-class instructors.</span>
          </motion.p>
        </motion.div>
        
        {/* Style Filter */}
        <motion.div
          className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-12 sm:mb-16 px-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {danceStyles.map((style, index) => (
            <motion.button
              key={style}
              onClick={() => setSelectedStyle(style)}
              className={`px-4 sm:px-6 py-2 sm:py-3 rounded-full text-sm sm:text-base font-medium transition-all cursor-interactive ${
                selectedStyle === style
                  ? "bg-gradient-to-r from-terracotta to-[#c66647] text-white shadow-skeu-md"
                  : "bg-white text-soft-charcoal shadow-skeu-sm hover:shadow-skeu-md"
              }`}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              layoutId={selectedStyle === style ? "activeFilter" : undefined}
            >
              {style}
            </motion.button>
          ))}
        </motion.div>
        
        {/* Classes Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
          layout
        >
          {filteredClasses.map((danceClass, index) => (
            <ClassCard
              key={danceClass.id}
              danceClass={danceClass}
              index={index}
              onBook={() => onBookClass(danceClass.id)}
            />
          ))}
        </motion.div>
        
        {/* Empty State */}
        {filteredClasses.length === 0 && (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-xl text-soft-charcoal">
              No classes found for this style.
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}

