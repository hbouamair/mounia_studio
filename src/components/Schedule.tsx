"use client";

import { motion } from "framer-motion";
import { Calendar, Clock, TrendingUp } from "lucide-react";

interface ScheduleProps {
  onOpenBooking: () => void;
}

export default function Schedule({ onOpenBooking }: ScheduleProps) {
  return (
    <section
      id="schedule"
      className="relative py-16 sm:py-20 md:py-24 lg:py-32 overflow-hidden"
    >
      {/* Smooth gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-cream via-white to-cream" />
      
      {/* Animated gradient overlay */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-terracotta/3 via-transparent to-deep-violet/3"
        animate={{ 
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header - 2026 Design */}
        <motion.div
          className="text-center mb-12 sm:mb-16"
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
            <Calendar className="w-4 h-4 fill-terracotta" />
            <span>Book Your Spot</span>
          </motion.div>
          
          <div className="relative inline-block mb-6">
            <motion.h2 
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold px-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <span className="text-charcoal">Weekly </span>
              <span className="relative inline-block">
                <span className="text-terracotta">Schedule</span>
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
            className="text-base sm:text-lg md:text-xl text-soft-charcoal max-w-3xl mx-auto mb-8 sm:mb-10 px-4 leading-relaxed"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            View our full schedule and reserve your spot in just a few clicks.
            <span className="block mt-2 text-terracotta font-medium">Classes fill up fast!</span>
          </motion.p>
          
          <motion.button
            onClick={onOpenBooking}
            className="px-10 sm:px-14 py-5 sm:py-6 bg-gradient-to-r from-terracotta to-[#c66647] text-white text-base sm:text-lg font-bold rounded-full shadow-skeu-lg w-full sm:w-auto"
            whileHover={{ scale: 1.05, y: -4, boxShadow: "0 20px 40px rgba(217, 119, 87, 0.3)" }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.8 }}
            style={{ color: '#ffffff' }}
          >
            View Full Schedule & Book Now →
          </motion.button>
        </motion.div>
        
        {/* Quick Stats - Modern Cards */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {[
            {
              icon: Calendar,
              title: "50+ Classes",
              subtitle: "Every Week",
              color: "#D97757",
              gradient: "from-terracotta/20 to-terracotta/5"
            },
            {
              icon: Clock,
              title: "Flexible Times",
              subtitle: "6am - 10pm Daily",
              color: "#6B4E97",
              gradient: "from-deep-violet/20 to-deep-violet/5"
            },
            {
              icon: TrendingUp,
              title: "All Levels",
              subtitle: "Beginner to Advanced",
              color: "#D97757",
              gradient: "from-terracotta/20 to-terracotta/5"
            },
          ].map((stat, index) => (
            <motion.div
              key={stat.title}
              className={`relative rounded-4xl p-8 text-center overflow-hidden bg-gradient-to-br ${stat.gradient} border border-white shadow-skeu-md`}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
              whileHover={{ y: -8, scale: 1.03 }}
            >
              {/* Animated background */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-tr from-white/50 to-transparent"
                animate={{ 
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: index * 0.3 }}
              />
              
              <div className="relative z-10">
                <motion.div
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-skeu-sm"
                  style={{ backgroundColor: `${stat.color}30` }}
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                >
                  <stat.icon className="w-8 h-8 sm:w-10 sm:h-10" style={{ color: stat.color }} />
                </motion.div>
                
                <h3 className="text-2xl sm:text-3xl font-display font-bold text-charcoal mb-2">
                  {stat.title}
                </h3>
                <p className="text-sm sm:text-base text-soft-charcoal font-medium">{stat.subtitle}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

