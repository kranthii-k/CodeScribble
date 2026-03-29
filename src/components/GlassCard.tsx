"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  glow?: "cyan" | "green" | "pink" | "none";
  float?: boolean;
  delay?: number;
}

const glowMap = {
  cyan: "shadow-neon-cyan border-[rgba(0,245,255,0.3)]",
  green: "shadow-neon-green border-[rgba(57,255,20,0.3)]",
  pink: "shadow-neon-pink border-[rgba(255,0,160,0.3)]",
  none: "border-[rgba(255,255,255,0.08)]",
};

export function GlassCard({ children, className, glow = "cyan", float = true, delay = 0 }: GlassCardProps) {
  return (
    <motion.div
      className={cn(
        "relative rounded-xl border backdrop-blur-xl",
        "bg-[rgba(5,5,20,0.65)]",
        glowMap[glow],
        className
      )}
      animate={float ? { y: [0, -6, 0] } : undefined}
      transition={
        float
          ? { duration: 5 + delay * 0.5, repeat: Infinity, ease: "easeInOut", delay }
          : undefined
      }
    >
      {/* Scan-line overlay */}
      <div
        className="pointer-events-none absolute inset-0 rounded-xl overflow-hidden opacity-[0.03]"
        style={{
          background:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,245,255,1) 2px, rgba(0,245,255,1) 4px)",
        }}
      />
      <div className="relative z-10 h-full">{children}</div>
    </motion.div>
  );
}
