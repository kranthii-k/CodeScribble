"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { Player } from "@/types/game";
import { Trophy, Zap, Code } from "lucide-react";

interface LeaderboardProps {
  players: Player[];
  myId: string | null;
}

export function Leaderboard({ players, myId }: LeaderboardProps) {
  const sorted = [...players].sort((a, b) => b.score - a.score);

  return (
    <div className="flex flex-col gap-2 p-1">
      {sorted.map((player, i) => (
        <motion.div
          key={player.id}
          layout
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className={`
            flex items-center gap-3 rounded-lg px-3 py-2.5 border
            ${player.id === myId
              ? "bg-[rgba(0,245,255,0.08)] border-[rgba(0,245,255,0.3)]"
              : "bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.06)]"
            }
          `}
        >
          {/* Rank badge */}
          <span className="w-6 text-center font-mono text-sm font-bold">
            {i === 0 ? (
              <Trophy className="w-4 h-4 text-yellow-400" />
            ) : (
              <span className="text-gray-500">#{i + 1}</span>
            )}
          </span>

          {/* Role icon */}
          <span className="flex-shrink-0">
            {player.role === "coder" ? (
              <Code className="w-3.5 h-3.5 text-neon-green" />
            ) : (
              <Zap className="w-3.5 h-3.5 text-neon-cyan" />
            )}
          </span>

          {/* Name */}
          <span
            className={`flex-1 font-mono text-sm truncate ${
              player.id === myId ? "text-neon-cyan" : "text-gray-200"
            }`}
          >
            {player.username}
            {player.id === myId && " (you)"}
          </span>

          {/* Score */}
          <motion.span
            key={`score-${player.score}`}
            className="font-mono font-bold text-sm text-neon-green"
            style={{ textShadow: "0 0 8px #39ff14" }}
            initial={{ scale: 1.4, color: "#fff01f" }}
            animate={{ scale: 1, color: "#39ff14" }}
            transition={{ duration: 0.4 }}
          >
            {player.score.toLocaleString()}
          </motion.span>

          {/* Guessed indicator */}
          {player.hasGuessed && (
            <span className="text-[10px] font-mono text-neon-green bg-[rgba(57,255,20,0.1)] px-1.5 py-0.5 rounded border border-[rgba(57,255,20,0.3)]">
              ✓
            </span>
          )}
        </motion.div>
      ))}

      {players.length === 0 && (
        <p className="text-center text-gray-600 font-mono text-xs py-4">
          Waiting for players...
        </p>
      )}
    </div>
  );
}
