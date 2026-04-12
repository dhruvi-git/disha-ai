"use client";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden bg-slate-950 text-white pt-20">
      
      {/* Background Glowing Orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/30 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 container mx-auto px-4 text-center flex flex-col items-center">
        
        {/* Animated Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="px-4 py-1.5 mb-6 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-sm font-medium"
        >
          Your AI-Powered Career Coach
        </motion.div>

        {/* Main Headline */}
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 max-w-4xl"
        >
          Innovate Your Career Journey.<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">
            Precision Meets Potential.
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg md:text-xl text-slate-400 max-w-2xl mb-10"
        >
          Navigate professional success with personalized AI guidance. From crafting the perfect resume to acing your interviews.
        </motion.p>

        {/* Action Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Link 
            href="/dashboard" 
            className="px-8 py-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold transition-all shadow-[0_0_20px_rgba(147,51,234,0.4)]"
          >
            Get Started Now
          </Link>
        </motion.div>
      </div>

      {/* Animated Grid Background */}
      <div className="absolute bottom-0 left-0 w-full h-[50vh] bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_100%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />
    </section>
  );
}