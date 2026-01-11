"use client";

import { motion } from "framer-motion";
import { Clock, TrendingUp, User, ArrowRight } from "lucide-react";
import { DanceClass } from "@/data/types";

interface ClassCardProps {
  danceClass: DanceClass;
  index: number;
  onBook: () => void;
}

export default function ClassCard({ danceClass, index, onBook }: ClassCardProps) {
  return (
    <motion.div
      className="group relative overflow-hidden cursor-pointer bg-white rounded-3xl border border-charcoal/5 hover:border-charcoal/10 transition-all duration-300"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ y: -8 }}
      layoutId={`class-${danceClass.id}`}
    >
      {/* Color accent bar - More visible */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-2 rounded-t-3xl shadow-sm"
        style={{ backgroundColor: danceClass.color }}
        layoutId={`accent-${danceClass.id}`}
      />
      
      {/* Subtle gradient overlay on hover */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `linear-gradient(135deg, ${danceClass.color}05 0%, transparent 100%)`
        }}
      />
      
      {/* Content */}
      <div className="relative z-10 p-8 h-full flex flex-col">
        {/* Header */}
        <div className="mb-6">
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold mb-4 bg-charcoal text-white shadow-sm"
            whileHover={{ scale: 1.05, y: -2 }}
          >
            {danceClass.style}
          </motion.div>
          
          <h3 className="text-2xl sm:text-3xl font-display font-bold text-charcoal mb-3 leading-tight group-hover:text-terracotta transition-colors">
            {danceClass.title}
          </h3>
          
          <p className="text-sm sm:text-base text-charcoal/70 leading-relaxed">
            {danceClass.description}
          </p>
        </div>
        
        {/* Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-charcoal/15 to-transparent my-6" />
        
        {/* Meta Information */}
        <div className="space-y-4 mb-6 flex-grow">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm"
              style={{ backgroundColor: `${danceClass.color}30` }}
            >
              <User className="w-5 h-5 text-charcoal" />
            </div>
            <div>
              <div className="text-xs text-soft-charcoal/70 font-medium uppercase tracking-wide">Instructor</div>
              <div className="font-bold text-charcoal text-base">{danceClass.instructor}</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cream border border-charcoal/10 shadow-sm">
              <Clock className="w-4 h-4 text-terracotta" />
              <span className="font-bold text-sm text-charcoal">{danceClass.duration} min</span>
            </div>
            
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cream border border-charcoal/10 shadow-sm">
              <TrendingUp className="w-4 h-4 text-terracotta" />
              <span className="font-bold text-sm text-charcoal">{danceClass.level}</span>
            </div>
          </div>
        </div>
        
        {/* CTA Button */}
        <motion.button
          onClick={(e) => {
            e.stopPropagation();
            onBook();
          }}
          className="w-full py-4 px-6 bg-charcoal text-white font-bold rounded-2xl group-hover:bg-gradient-to-r group-hover:from-terracotta group-hover:to-[#c66647] transition-all duration-300 flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          style={{ color: '#ffffff' }}
        >
          View Schedule
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </motion.button>
      </div>
      
      {/* Shadow on hover */}
      <motion.div
        className="absolute inset-0 -z-10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          boxShadow: `0 20px 60px ${danceClass.color}15`
        }}
      />
    </motion.div>
  );
}
