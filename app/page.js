"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import HeroSection from "@/components/hero";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";
import { features } from "@/data/features";
import { faqs } from "@/data/faqs";
import { howItWorks } from "@/data/howItWorks";

export default function LandingPage() {
  // Animation variants for staggered lists
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="relative min-h-screen text-white selection:bg-purple-500/30">
      <div className="grid-background"></div>

      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <section className="w-full py-20 lg:py-32 relative z-10">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-sm font-semibold text-purple-400 uppercase tracking-wider mb-2">Features</h2>
            <h3 className="text-3xl md:text-4xl font-bold">
              Accelerate your growth using <br className="hidden md:block" /> streamlined AI processes.
            </h3>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto"
          >
            {features.map((feature, index) => {
              const FeatureIcon = feature.icon;

              return (
                <motion.div key={index} variants={itemVariants}>
                  <Card
                    className="glass-card bg-slate-900/50 border-white/5 hover:border-purple-500/50 transition-all duration-500 group overflow-hidden relative h-full"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                    <CardContent className="pt-8 text-left relative z-10">
                      <div className="mb-6 w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400 border border-purple-500/30 shadow-[0_0_15px_rgba(147,51,234,0.2)]">
                        <FeatureIcon className="h-6 w-6" />
                      </div>
                      <h3 className="text-xl font-semibold mb-3 text-white group-hover:text-purple-300 transition-colors">{feature.title}</h3>
                      <p className="text-gray-400 text-sm leading-relaxed">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="w-full py-16 border-y border-white/5 bg-slate-950/50 backdrop-blur-lg relative z-10">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto text-center"
          >
            {[
              { number: "50+", label: "Industries Covered" },
              { number: "1000+", label: "Interview Questions" },
              { number: "95%", label: "Success Rate" },
              { number: "24/7", label: "AI Support" }
            ].map((stat, i) => (
              <motion.div key={i} variants={itemVariants} className="flex flex-col items-center justify-center space-y-2">
                <h3 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-purple-600">
                  {stat.number}
                </h3>
                <p className="text-sm text-gray-400 uppercase tracking-wider">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="w-full py-24 relative z-10">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-3xl font-bold mb-4">Built on Trust. Driven by AI.</h2>
            <p className="text-gray-400">
              Four simple steps to accelerate your career growth
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto"
          >
            {howItWorks.map((item, index) => {
              const StepIcon = item.icon;

              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="flex flex-col items-center text-center p-6 glass-card bg-slate-900/30 rounded-2xl border border-white/5 hover:border-purple-500/30 transition-colors"
                >
                  <div className="text-5xl font-black text-white/5 mb-4 relative">
                    0{index + 1}
                    <div className="absolute inset-0 flex items-center justify-center text-purple-400 text-xl drop-shadow-[0_0_10px_rgba(147,51,234,0.5)]">
                      <StepIcon className="h-6 w-6" />
                    </div>
                  </div>
                  <h3 className="font-semibold text-lg text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-400">{item.description}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="w-full py-24 bg-slate-950/80 relative z-10">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-12"
          >
            <h2 className="text-3xl font-bold mb-4 text-white">Most Popular Questions</h2>
            <p className="text-gray-400">Everything you need to know about our AI platform.</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="max-w-3xl mx-auto glass-card bg-slate-900/50 border border-white/5 rounded-2xl p-2 md:p-6"
          >
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border-white/10">
                  <AccordionTrigger className="text-left text-gray-200 hover:text-purple-400 px-4 transition-colors">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-400 px-4 pb-4">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-24 relative z-10 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-purple-600 rounded-full blur-[150px] opacity-20 pointer-events-none"></div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="container mx-auto px-4 relative z-20"
        >
          <div className="glass-card bg-slate-900/80 backdrop-blur-xl rounded-3xl p-12 md:p-20 text-center max-w-4xl mx-auto border border-purple-500/30 shadow-[0_0_50px_rgba(147,51,234,0.1)]">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Start Your Career <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">Journey Today</span>
            </h2>
            <p className="mx-auto max-w-2xl text-gray-400 mb-10 text-lg">
              Sign up now and experience the power of AI-driven career design without any commitment.
            </p>
            <Link href="/dashboard" passHref>
              <Button
                size="lg"
                className="h-14 px-8 rounded-full bg-purple-600 hover:bg-purple-700 text-white font-semibold text-lg shadow-[0_0_20px_rgba(147,51,234,0.4)] hover:shadow-[0_0_30px_rgba(147,51,234,0.6)] transition-all"
              >
                Get Started <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}