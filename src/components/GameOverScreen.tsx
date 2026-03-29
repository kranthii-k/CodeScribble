"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Zap } from "lucide-react";
import type { Player } from "@/types/game";

interface GameOverScreenProps {
  players: Player[];
  prompt: string | null;
  onPlayAgain: () => void;
}

export function GameOverScreen({ players, prompt, onPlayAgain }: GameOverScreenProps) {
  const sorted = [...players].sort((a, b) => b.score - a.score);
  const winner = sorted[0];

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(2,2,7,0.9)", backdropFilter: "blur(16px)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="w-full max-w-md rounded-2xl border border-[rgba(57,255,20,0.3)] bg-[rgba(5,15,5,0.9)] p-8 text-center"
        style={{ boxShadow: "0 0 40px rgba(57,255,20,0.15), 0 0 80px rgba(57,255,20,0.05)" }}
        initial={{ scale: 0.8, y: 40 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
      >
        {/* Header */}
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="mb-6"
        >
          <Trophy className="w-14 h-14 text-yellow-400 mx-auto mb-3" style={{ filter: "drop-shadow(0 0 20px #facc15)" }} />
          <h2 className="font-mono text-2xl font-bold text-neon-green" style={{ textShadow: "0 0 20px #39ff14" }}>
            GAME OVER
          </h2>
          {winner && (
            <p className="font-mono text-gray-400 mt-1 text-sm">
              <span className="text-neon-cyan">{winner.username}</span> wins!
            </p>
          )}
        </motion.div>

        {/* Prompt reveal */}
        {prompt && (
          <div className="mb-6 px-4 py-3 rounded-lg border border-[rgba(0,245,255,0.2)] bg-[rgba(0,245,255,0.05)]">
            <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1">The Prompt Was</p>
            <p className="font-mono font-bold text-neon-cyan text-lg" style={{ textShadow: "0 0 12px #00f5ff" }}>
              &ldquo;{prompt}&rdquo;
            </p>
          </div>
        )}

        {/* Scores */}
        <div className="space-y-2 mb-6">
          {sorted.map((p, i) => (
            <motion.div
              key={p.id}
              className="flex items-center gap-3 px-3 py-2 rounded-lg bg-[rgba(255,255,255,0.03)]"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <span className="font-mono text-sm text-gray-500 w-6">#{i + 1}</span>
              <span className="flex-1 font-mono text-sm text-gray-200 text-left">{p.username}</span>
              <span className="font-mono font-bold text-neon-green text-sm">{p.score.toLocaleString()} pts</span>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.button
          onClick={onPlayAgain}
          whileHover={{ scale: 1.04, boxShadow: "0 0 30px rgba(0,245,255,0.4)" }}
          whileTap={{ scale: 0.97 }}
          className="
            w-full py-3 rounded-xl font-mono font-bold text-sm tracking-widest uppercase
            bg-[rgba(0,245,255,0.1)] border border-[rgba(0,245,255,0.4)] text-neon-cyan
            hover:bg-[rgba(0,245,255,0.18)] transition-all duration-200
          "
        >
          <Zap className="inline w-4 h-4 mr-2 mb-0.5" />
          Play Again
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
