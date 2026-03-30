"use client";

import { motion } from "framer-motion";
import { getTimerColor, formatTime } from "@/lib/utils";

interface NeonTimerProps {
  timeLeft: number;
  totalTime?: number;
}

export function NeonTimer({ timeLeft, totalTime = 180 }: NeonTimerProps) {
  const pct = (timeLeft / totalTime) * 100;
  const color = getTimerColor(timeLeft);

  return (
    <div className="w-full px-1">
      {/* Time label */}
      <div className="flex justify-between items-center mb-1">
        <span
          className="font-mono text-xs tracking-widest uppercase"
          style={{ color, textShadow: `0 0 8px ${color}` }}
        >
          TIME
        </span>
        <motion.span
          key={timeLeft}
          className="font-mono font-bold text-sm"
          style={{ color, textShadow: `0 0 12px ${color}` }}
          animate={timeLeft <= 10 ? { scale: [1, 1.15, 1] } : {}}
          transition={{ duration: 0.5, repeat: timeLeft <= 10 ? Infinity : 0 }}
        >
          {formatTime(timeLeft)}
        </motion.span>
      </div>

      {/* Progress bar */}
      <div className="h-2 w-full rounded-full bg-[rgba(255,255,255,0.05)] overflow-hidden border border-[rgba(255,255,255,0.08)]">
        <motion.div
          className="h-full rounded-full"
          style={{
            background: `linear-gradient(90deg, ${color}99, ${color})`,
            boxShadow: `0 0 12px ${color}, 0 0 24px ${color}40`,
          }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
