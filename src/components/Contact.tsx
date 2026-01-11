"use client";

import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export default function Contact() {
  return (
    <section
      id="contact"
      className="relative pt-[88px] sm:pt-[96px] md:pt-[104px] pb-12 sm:pb-16 md:pb-20 lg:pb-24 overflow-hidden"
    >
      {/* Smooth gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-cream via-white to-cream" />
      
      {/* Animated gradient overlay */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-tr from-secondary-500/3 via-transparent to-primary-500/3"
        animate={{ 
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header - 2026 Design */}
        <motion.div
          className="text-center mb-12 sm:mb-16 md:mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="relative inline-block mb-6">
            <motion.h2 
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold px-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <span className="text-charcoal">Visitez Notre </span>
              <span className="relative inline-block">
                <span className="text-primary-500">Studio</span>
                <motion.div
                  className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                />
              </span>
            </motion.h2>
          </div>
          
          <motion.p 
            className="text-base sm:text-lg md:text-xl text-soft-charcoal max-w-3xl mx-auto px-4 leading-relaxed"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Venez découvrir notre espace magnifique et rencontrer notre communauté.
            <span className="block mt-2 text-primary-500 font-medium">Nous avons hâte de danser avec vous !</span>
          </motion.p>
        </motion.div>
        
        {/* Contact Grid - Modern Design */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
          {[
            {
              icon: MapPin,
              title: "Adresse",
              content: "Casablanca, Maroc\nZone Industrielle",
              color: "#1E3A5F",
              gradient: "from-primary-500/20 to-primary-500/5"
            },
            {
              icon: Phone,
              title: "Téléphone",
              content: "+212 6XX XXX XXX\nLun-Sam: 9h-21h",
              color: "#2A9D8F",
              gradient: "from-secondary-500/20 to-secondary-500/5"
            },
            {
              icon: Mail,
              title: "Email",
              content: "contact@studiorj.ma\ninfo@studiorj.ma",
              color: "#1E3A5F",
              gradient: "from-primary-500/20 to-primary-500/5"
            },
            {
              icon: Clock,
              title: "Horaires",
              content: "Lun-Ven: 6h-22h\nSam-Dim: 8h-20h",
              color: "#2A9D8F",
              gradient: "from-secondary-500/20 to-secondary-500/5"
            },
          ].map((item, index) => (
            <motion.div
              key={item.title}
              className={`relative rounded-4xl p-6 sm:p-8 text-center group overflow-hidden bg-gradient-to-br ${item.gradient} border border-white shadow-skeu-md`}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -12, scale: 1.03 }}
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
                  className="w-14 h-14 sm:w-18 sm:h-18 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-skeu-sm"
                  style={{ backgroundColor: `${item.color}30` }}
                  whileHover={{ rotate: 360, scale: 1.15 }}
                  transition={{ duration: 0.6 }}
                >
                  <item.icon className="w-7 h-7 sm:w-9 sm:h-9" style={{ color: item.color }} />
                </motion.div>
                
                <h3 className="text-lg sm:text-xl font-display font-bold text-charcoal mb-3">
                  {item.title}
                </h3>
                
                <p className="text-sm sm:text-base text-soft-charcoal whitespace-pre-line leading-relaxed font-medium">
                  {item.content}
                </p>
              </div>
              
              {/* Glow effect on hover */}
              <motion.div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-4xl"
                style={{
                  boxShadow: `0 0 30px ${item.color}40`
                }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

