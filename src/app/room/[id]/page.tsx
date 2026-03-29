"use client";

import { useEffect, useRef } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import { Code, Users, Zap, Play, Copy, Check, LogOut } from "lucide-react";
import { useGameSocket } from "@/hooks/useGameSocket";
import { useGameStore } from "@/store/useGameStore";
import { GlassCard } from "@/components/GlassCard";
import { NeonTimer } from "@/components/NeonTimer";
import { Leaderboard } from "@/components/Leaderboard";
import { ChatPanel } from "@/components/ChatPanel";
import { SabotageBar } from "@/components/SabotageBar";
import { SabotageOverlay } from "@/components/SabotageOverlay";
import { GameOverScreen } from "@/components/GameOverScreen";
import type { SabotageType } from "@/types/game";
import { useState } from "react";

const MonacoEditorPanel = dynamic(
  () => import("@/components/MonacoEditorPanel").then((m) => m.MonacoEditorPanel),
  { ssr: false, loading: () => <div className="h-full flex items-center justify-center font-mono text-neon-green text-xs animate-pulse">Loading terminal...</div> }
);

const AntiGravityBackground = dynamic(
  () => import("@/components/AntiGravityBackground").then((m) => m.AntiGravityBackground),
  { ssr: false }
);

export default function RoomPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const roomId = (params.id as string).toUpperCase();
  const initialUsername = searchParams.get("username") || localStorage.getItem("codescribble_username") || "hacker";

  const { joinRoom, startGame, sendCodeUpdate, submitGuess, sendChatMessage, sendSabotage } = useGameSocket(roomId);

  const {
    room, myId, myRole, currentCode, currentPrompt,
    timeLeft, messages, sabotageEffect, hackNotification,
    isGameOver, finalPlayers, username,
    setCurrentCode, setUsername,
  } = useGameStore();

  const [copied, setCopied] = useState(false);
  const joined = useRef(false);

  // Join room on mount
  useEffect(() => {
    if (!joined.current) {
      joined.current = true;
      const uname = initialUsername;
      setUsername(uname);
      joinRoom(uname);
    }
  }, []);

  function copyRoomId() {
    navigator.clipboard.writeText(roomId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleCodeChange(code: string) {
    setCurrentCode(code);
    sendCodeUpdate(code);
  }

  function handleSabotage(type: SabotageType) {
    sendSabotage(type, username);
  }

  const players = room?.players ?? [];
  const gameActive = room?.status === "playing";
  const isWaiting = room?.status === "waiting";
  const isCoder = myRole === "coder";
  const isGuesser = myRole === "guesser";
  const canStart = isWaiting && players.length >= 1;

  return (
    <>
      <AntiGravityBackground />
      <SabotageOverlay effect={isCoder ? sabotageEffect : null} />

      {isGameOver && (
        <GameOverScreen
          players={finalPlayers}
          prompt={room?.currentPrompt ?? null}
          onPlayAgain={() => {
            if (canStart) startGame();
          }}
        />
      )}

      <div className="relative z-10 min-h-screen flex flex-col p-3 gap-3" style={{ maxHeight: "100vh" }}>

        {/* ── TOP BAR ────────────────────────────────────────────────── */}
        <div className="flex items-center gap-3 h-12 flex-shrink-0">
          {/* Logo / back */}
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 font-mono text-sm text-gray-500 hover:text-neon-cyan transition-colors"
          >
            <LogOut className="w-4 h-4 rotate-180" />
            <span className="gradient-text font-bold text-base">CODESCRIBBLE</span>
          </button>

          {/* Room ID */}
          <button
            onClick={copyRoomId}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.04)] hover:bg-[rgba(255,255,255,0.08)] transition-all group"
          >
            <span className="font-mono text-xs text-gray-500">ROOM:</span>
            <span className="font-mono text-xs text-neon-cyan tracking-widest">{roomId}</span>
            {copied ? <Check className="w-3 h-3 text-neon-green" /> : <Copy className="w-3 h-3 text-gray-600 group-hover:text-gray-400" />}
          </button>

          {/* Role badge */}
          <div className={`
            flex items-center gap-1.5 px-3 py-1 rounded-lg border font-mono text-xs tracking-widest
            ${isCoder
              ? "border-[rgba(57,255,20,0.4)] bg-[rgba(57,255,20,0.08)] text-neon-green"
              : "border-[rgba(0,245,255,0.3)] bg-[rgba(0,245,255,0.07)] text-neon-cyan"
            }
          `}>
            {isCoder ? <Code className="w-3 h-3" /> : <Zap className="w-3 h-3" />}
            {gameActive ? (isCoder ? "CODER" : "GUESSER") : "WAITING"}
          </div>

          {/* Player count */}
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.07)]">
            <Users className="w-3 h-3 text-gray-500" />
            <span className="font-mono text-xs text-gray-400">{players.length}</span>
          </div>

          {/* Prompt display for coder */}
          <AnimatePresence>
            {isCoder && currentPrompt && (
              <motion.div
                className="flex items-center gap-2 px-3 py-1 rounded-lg border border-[rgba(255,240,31,0.4)] bg-[rgba(255,240,31,0.07)]"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <span className="font-mono text-[10px] text-gray-500">PROMPT:</span>
                <span className="font-mono text-xs text-neon-yellow font-bold" style={{ textShadow: "0 0 8px #fff01f" }}>
                  &ldquo;{currentPrompt}&rdquo;
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Timer */}
          <div className="w-48">
            <NeonTimer timeLeft={timeLeft} />
          </div>

          {/* Start button */}
          {isWaiting && (
            <motion.button
              onClick={startGame}
              disabled={!canStart}
              whileHover={{ scale: 1.04, boxShadow: "0 0 20px rgba(57,255,20,0.4)" }}
              whileTap={{ scale: 0.96 }}
              className="
                flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-xs font-bold
                uppercase tracking-widest border border-[rgba(57,255,20,0.4)]
                bg-[rgba(57,255,20,0.08)] text-neon-green
                hover:bg-[rgba(57,255,20,0.15)] transition-all duration-200
                disabled:opacity-40 disabled:cursor-not-allowed
              "
            >
              <Play className="w-3.5 h-3.5" />
              START
            </motion.button>
          )}
        </div>

        {/* ── MAIN 3-COLUMN GRID ─────────────────────────────────────── */}
        <div className="flex gap-3 flex-1 min-h-0">

          {/* LEFT — Leaderboard */}
          <GlassCard className="w-56 flex-shrink-0 flex flex-col overflow-hidden" float delay={0}>
            <div className="px-4 py-3 border-b border-[rgba(255,255,255,0.06)] flex items-center gap-2 flex-shrink-0">
              <span className="font-mono text-[10px] text-gray-500 uppercase tracking-widest">Leaderboard</span>
              <div className="ml-auto w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse" />
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar py-2">
              <Leaderboard players={players} myId={myId} />
            </div>
          </GlassCard>

          {/* CENTER — Editor */}
          <div className="flex-1 flex flex-col gap-2 min-w-0">
            <GlassCard className="flex-1 overflow-hidden p-0" glow="green" float={false}>
              <MonacoEditorPanel
                code={currentCode}
                isReadOnly={!isCoder || !gameActive}
                sabotageEffect={isCoder ? sabotageEffect : null}
                onChange={handleCodeChange}
              />
            </GlassCard>

            {/* Sabotage bar — only for guessers during game */}
            {isGuesser && gameActive && (
              <GlassCard className="py-2.5 px-4" glow="pink" float={false}>
                <SabotageBar onSabotage={handleSabotage} disabled={!gameActive} />
              </GlassCard>
            )}

            {/* Waiting state overlay */}
            {isWaiting && (
              <div className="absolute inset-0 m-[1px] flex items-center justify-center pointer-events-none rounded-xl">
                <motion.div
                  className="text-center"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <p className="font-mono text-gray-600 text-xs">Waiting for game to start...</p>
                </motion.div>
              </div>
            )}
          </div>

          {/* RIGHT — Chat */}
          <GlassCard className="w-72 flex-shrink-0 flex flex-col overflow-hidden p-0" float delay={1}>
            <div className="px-4 py-3 border-b border-[rgba(255,255,255,0.06)] flex items-center gap-2 flex-shrink-0">
              <span className="font-mono text-[10px] text-gray-500 uppercase tracking-widest">
                {isGuesser && gameActive ? "Guess Terminal" : "Chat"}
              </span>
              {isGuesser && gameActive && (
                <span className="ml-auto font-mono text-[10px] text-neon-yellow tracking-widest animate-pulse">LIVE</span>
              )}
            </div>
            <ChatPanel
              messages={messages}
              hackNotification={hackNotification}
              onSendMessage={(text) => sendChatMessage(text, username)}
              onSubmitGuess={(guess) => submitGuess(guess, username)}
              myId={myId}
              isGuesser={isGuesser}
              gameActive={gameActive}
            />
          </GlassCard>
        </div>
      </div>
    </>
  );
}
