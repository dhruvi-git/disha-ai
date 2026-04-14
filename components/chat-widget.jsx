"use client";

import React from "react";
import Link from "next/link";
import { BotMessageSquare } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";

export default function ChatWidget() {
  const pathname = usePathname();

  // Hide the widget if we are already on the chat page to avoid redundancy
  if (pathname === "/chat") return null;

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0, y: 50 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      transition={{ duration: 0.6, type: "spring", bounce: 0.4, delay: 0.5 }}
      className="fixed bottom-6 right-6 z-50 group"
    >
      {/* Tooltip popping up on hover */}
      <div className="absolute -top-12 right-0 bg-slate-900 border border-white/10 text-white text-xs font-medium px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl pointer-events-none">
        Chat with Disha
      </div>

      <Link href="/chat">
        <Button
          size="icon"
          className="h-14 w-14 rounded-full bg-indigo-600 hover:bg-purple-600 text-white shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:shadow-[0_0_30px_rgba(147,51,234,0.6)] transition-all duration-300 hover:-translate-y-1"
        >
          <BotMessageSquare className="h-6 w-6 animate-pulse" />
        </Button>
      </Link>
    </motion.div>
  );
}
