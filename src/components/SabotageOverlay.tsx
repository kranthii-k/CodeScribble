"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { SabotageType } from "@/types/game";

interface SabotageOverlayProps {
  effect: SabotageType | null;
}

export function SabotageOverlay({ effect }: SabotageOverlayProps) {
  return (
    <AnimatePresence>
      {effect === "flashbang" && (
        <motion.div
          key="flashbang"
          className="fixed inset-0 z-[999] pointer-events-none"
          style={{ background: "white" }}
          initial={{ opacity: 1 }}
          animate={{ opacity: [1, 0.8, 0] }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      )}

      {effect === "reverse" && (
        <motion.div
          key="reverse"
          className="fixed inset-0 z-[998] pointer-events-none"
          initial={{ scaleX: 1, rotate: 0 }}
          animate={{ scaleX: -1, rotate: [0, -3, 3, -2, 2, 0] }}
          exit={{ scaleX: 1, rotate: 0 }}
          transition={{ duration: 2 }}
          style={{ transformOrigin: "center" }}
        />
      )}

      {effect === "scramble" && (
        <motion.div
          key="scramble"
          className="fixed inset-0 z-[997] pointer-events-none"
          animate={{
            x: [0, -6, 6, -4, 4, -2, 2, 0],
            y: [0, 3, -3, 2, -2, 1, -1, 0],
          }}
          transition={{ duration: 0.6, repeat: 3, repeatType: "loop" }}
        >
          {/* Glitch lines */}
          <div className="absolute inset-0 overflow-hidden opacity-20">
            <div className="absolute h-[2px] bg-neon-pink w-full" style={{ top: "23%" }} />
            <div className="absolute h-[1px] bg-neon-cyan w-3/4" style={{ top: "61%" }} />
            <div className="absolute h-[3px] bg-neon-green w-1/2 right-0" style={{ top: "78%" }} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
