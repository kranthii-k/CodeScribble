"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { Bomb, Eye, Shuffle } from "lucide-react";
import type { SabotageType } from "@/types/game";

interface SabotageBarProps {
  onSabotage: (type: SabotageType) => void;
  disabled?: boolean;
}

const SABOTAGES: { type: SabotageType; label: string; icon: typeof Bomb; color: string; shadow: string; desc: string }[] = [
  {
    type: "flashbang",
    label: "FLASHBANG",
    icon: Bomb,
    color: "text-[#f59e0b]",
    shadow: "shadow-[0_0_10px_rgba(245,158,11,0.3)]",
    desc: "Blinds coder",
  },
  {
    type: "reverse",
    label: "REVERSE",
    icon: Eye,
    color: "text-[#a78bfa]",
    shadow: "shadow-[0_0_10px_rgba(167,139,250,0.3)]",
    desc: "Flips editor",
  },
  {
    type: "scramble",
    label: "SCRAMBLE",
    icon: Shuffle,
    color: "text-[#f97316]",
    shadow: "shadow-[0_0_10px_rgba(249,115,22,0.3)]",
    desc: "Jitters screen",
  },
];

export function SabotageBar({ onSabotage, disabled = false }: SabotageBarProps) {
  const cooldowns = useRef<Record<SabotageType, boolean>>({ flashbang: false, reverse: false, scramble: false });

  function handleClick(type: SabotageType) {
    if (disabled || cooldowns.current[type]) return;
    cooldowns.current[type] = true;
    onSabotage(type);
    setTimeout(() => { cooldowns.current[type] = false; }, 8000);
  }

  return (
    <div className="flex items-center gap-2 justify-center">
      <span className="text-[10px] font-mono text-gray-600 uppercase tracking-widest mr-1">
        SABOTAGE:
      </span>
      {SABOTAGES.map(({ type, label, icon: Icon, color, shadow, desc }) => (
        <motion.button
          key={type}
          onClick={() => handleClick(type)}
          disabled={disabled}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          className={`
            group flex items-center gap-1.5 px-3 py-1.5 rounded-lg
            border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.04)]
            hover:bg-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.2)]
            transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed
            ${!disabled ? shadow : ""}
          `}
          title={desc}
        >
          <Icon className={`w-3.5 h-3.5 ${color} group-hover:scale-110 transition-transform`} />
          <span className={`text-[10px] font-mono font-bold ${color} tracking-wider`}>{label}</span>
        </motion.button>
      ))}
    </div>
  );
}
