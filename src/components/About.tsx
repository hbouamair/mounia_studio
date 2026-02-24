"use client";

import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { Sparkles, Users, Award, Heart, Calendar, TrendingUp } from "lucide-react";

const AnimatedCounter = ({ end, duration = 2, suffix = "" }: { end: number; duration?: number; suffix?: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    
    let startTime: number;
    let animationFrame: number;
    
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = (timestamp - startTime) / (duration * 1000);
      
      if (progress < 1) {
        setCount(Math.floor(end * progress));
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };
    
    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [isInView, end, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
};

export default function About() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Parallax effects for decorative elements
  const y1 = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 360]);

  const stats = [
    { value: 12, suffix: "+", label: "Years of Excellence", icon: Award },
    { value: 5000, suffix: "+", label: "Happy Dancers", icon: Users },
    { value: 50, suffix: "+", label: "Expert Instructors", icon: Heart },
    { value: 200, suffix: "+", label: "Classes per Month", icon: Calendar },
  ];

  return (
    <section 
      ref={containerRef}
      id="about"
      className="relative py-32 overflow-hidden"
    >
      {/* Decorative Floating Elements */}
      <motion.div
        style={{ y: y1, rotate }}
        className="absolute top-20 right-10 w-32 h-32 rounded-full bg-gradient-to-br from-terracotta/20 to-deep-violet/20 blur-3xl"
      />
      <motion.div
        style={{ y: y2 }}
        className="absolute bottom-20 left-10 w-48 h-48 rounded-full bg-gradient-to-br from-deep-violet/20 to-terracotta/20 blur-3xl"
      />

      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto text-center mb-20"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", duration: 0.8 }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-terracotta/10 to-deep-violet/10 mb-6"
          >
            <Sparkles className="w-5 h-5 text-terracotta" />
            <span className="text-sm font-semibold font-nav text-charcoal">About Us</span>
          </motion.div>
          
          <h2 className="text-5xl md:text-7xl font-display font-bold mb-6 text-charcoal leading-tight">
            Where Movement <br />
            <span className="bg-gradient-to-r from-terracotta to-deep-violet bg-clip-text text-transparent">
              Meets Magic
            </span>
          </h2>
          
          <p className="text-lg md:text-xl text-soft-charcoal leading-relaxed font-body">
            More than a dance studio—we&apos;re a community where passion, creativity, 
            and artistry come together to create unforgettable moments.
          </p>
        </motion.div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {/* Large Story Card - Spans 2 columns */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            whileHover={{ y: -8 }}
            className="lg:col-span-2 lg:row-span-2 skeu-card p-8 md:p-12 relative overflow-hidden group"
          >
            {/* Animated gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-terracotta/5 via-transparent to-deep-violet/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative z-10">
              <motion.div
                initial={{ scale: 0.8 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", duration: 0.8, delay: 0.2 }}
                className="w-16 h-16 rounded-2xl bg-gradient-to-br from-terracotta to-deep-violet flex items-center justify-center mb-6 shadow-lg"
              >
                <Heart className="w-8 h-8 text-white" />
              </motion.div>
              
              <h3 className="text-3xl md:text-4xl font-display font-bold mb-6 text-charcoal">
                Our Story
              </h3>
              
              <div className="space-y-4 text-soft-charcoal font-body leading-relaxed">
                <p>
                  Founded in 2012, RJ Studio began with a simple dream: 
                  to create a space where people of all ages and skill levels could 
                  discover the joy of movement.
                </p>
                
                <p>
                  What started as a single studio with three instructors has blossomed 
                  into a thriving community of passionate dancers, celebrated instructors, 
                  and countless success stories.
                </p>
                
                <p>
                  Today, we&apos;re proud to be recognized as one of the premier dance 
                  destinations, offering world-class training in a warm, inclusive 
                  environment where every dancer can shine.
                </p>
              </div>

              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: "100%" }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.5 }}
                className="h-1 bg-gradient-to-r from-terracotta to-deep-violet rounded-full mt-8"
              />
            </div>
          </motion.div>

          {/* Stats Cards */}
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="skeu-card p-8 relative overflow-hidden group cursor-pointer"
            >
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-terracotta/10 to-deep-violet/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative z-10">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className="w-12 h-12 rounded-xl bg-gradient-to-br from-terracotta/20 to-deep-violet/20 flex items-center justify-center mb-4"
                >
                  <stat.icon className="w-6 h-6 text-terracotta" />
                </motion.div>
                
                <div className="text-4xl md:text-5xl font-display font-bold bg-gradient-to-r from-terracotta to-deep-violet bg-clip-text text-transparent mb-2">
                  <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                </div>
                
                <p className="text-sm font-nav font-medium text-soft-charcoal">
                  {stat.label}
                </p>
              </div>

              {/* Corner accent */}
              <div className="absolute -bottom-2 -right-2 w-16 h-16 bg-gradient-to-br from-terracotta/20 to-deep-violet/20 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500" />
            </motion.div>
          ))}

          {/* Mission Card - Spans 2 columns */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            whileHover={{ y: -8 }}
            className="lg:col-span-2 skeu-card p-8 md:p-10 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-deep-violet/5 via-transparent to-terracotta/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative z-10">
              <div className="flex items-start gap-4 mb-6">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="w-14 h-14 rounded-2xl bg-gradient-to-br from-deep-violet to-terracotta flex items-center justify-center shadow-lg flex-shrink-0"
                >
                  <TrendingUp className="w-7 h-7 text-white" />
                </motion.div>
                
                <div>
                  <h3 className="text-2xl md:text-3xl font-display font-bold text-charcoal mb-2">
                    Our Mission
                  </h3>
                  <p className="text-soft-charcoal font-body leading-relaxed">
                    To empower individuals through the art of dance, fostering confidence, 
                    creativity, and community in every step. We believe that dance is for 
                    everyone, and we&apos;re committed to making our studio a welcoming space 
                    where all can thrive.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Values Card - Spans 2 columns */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="lg:col-span-2 skeu-card p-8 md:p-10 relative overflow-hidden"
          >
            <h3 className="text-2xl md:text-3xl font-display font-bold text-charcoal mb-8">
              Our Values
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { title: "Excellence", desc: "Highest quality instruction and facilities" },
                { title: "Inclusivity", desc: "Welcoming dancers of all backgrounds" },
                { title: "Innovation", desc: "Constantly evolving our techniques" },
                { title: "Community", desc: "Building lasting connections" },
              ].map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  whileHover={{ x: 8 }}
                  className="flex items-start gap-3 group cursor-pointer"
                >
                  <motion.div
                    whileHover={{ scale: 1.2 }}
                    className="w-2 h-2 rounded-full bg-gradient-to-r from-terracotta to-deep-violet mt-2 group-hover:shadow-lg transition-shadow"
                  />
                  <div>
                    <h4 className="text-lg font-display font-semibold text-charcoal mb-1">
                      {value.title}
                    </h4>
                    <p className="text-sm text-soft-charcoal font-body">
                      {value.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mt-16"
        >
          <motion.a
            href="#contact"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-terracotta to-deep-violet text-white font-semibold font-nav rounded-full shadow-lg hover:shadow-xl transition-shadow"
          >
            <span>Join Our Community</span>
            <motion.span
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              →
            </motion.span>
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
