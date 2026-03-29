"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { Zap, Users, Terminal, ChevronRight } from "lucide-react";
import { generateRoomId } from "@/lib/utils";
import { GlassCard } from "@/components/GlassCard";

// Dynamically import 3D background (no SSR)
const AntiGravityBackground = dynamic(
  () => import("@/components/AntiGravityBackground").then((m) => m.AntiGravityBackground),
  { ssr: false }
);

const FLOATING_CODE = `async function hackTheMatrix() {
  const payload = await inject(
    "SYSTEM", { level: "root" }
  );
  return decrypt(payload.secret);
}`;

export default function HomePage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [roomIdInput, setRoomIdInput] = useState("");
  const [tab, setTab] = useState<"create" | "join">("create");

  useEffect(() => {
    const stored = localStorage.getItem("codescribble_username");
    if (stored) setUsername(stored);
  }, []);

  function saveUsername() {
    if (username.trim()) localStorage.setItem("codescribble_username", username.trim());
  }

  function handleCreate() {
    if (!username.trim()) return;
    saveUsername();
    const id = generateRoomId();
    router.push(`/room/${id}?username=${encodeURIComponent(username.trim())}`);
  }

  function handleJoin() {
    if (!username.trim() || !roomIdInput.trim()) return;
    saveUsername();
    router.push(`/room/${roomIdInput.trim().toUpperCase()}?username=${encodeURIComponent(username.trim())}`);
  }

  return (
    <>
      <AntiGravityBackground />

      {/* Content */}
      <main className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-16">

        {/* Hero header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          {/* Badge */}
          <motion.div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[rgba(0,245,255,0.3)] bg-[rgba(0,245,255,0.07)] mb-6"
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse" />
            <span className="font-mono text-xs text-neon-cyan tracking-widest">MULTIPLAYER · REAL-TIME · CYBERPUNK</span>
          </motion.div>

          {/* Title */}
          <h1 className="gradient-text font-mono font-bold text-6xl md:text-8xl tracking-tight mb-4 leading-none">
            CODE<br />SCRIBBLE
          </h1>

          <motion.p
            className="font-mono text-gray-400 text-base md:text-lg max-w-md mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            One hacker codes the secret prompt. Others race to crack it.
            <br />
            <span className="text-neon-pink">Sabotage is encouraged.</span>
          </motion.p>
        </motion.div>

        {/* Main card */}
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <GlassCard className="p-6" float={false}>
            {/* Username input */}
            <div className="mb-5">
              <label className="block font-mono text-xs text-gray-500 uppercase tracking-widest mb-2">
                Hacker Handle
              </label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (tab === "create" ? handleCreate() : handleJoin())}
                placeholder="e.g. z3r0c0ol"
                maxLength={20}
                className="
                  w-full bg-[rgba(0,245,255,0.04)] border border-[rgba(0,245,255,0.2)]
                  rounded-lg px-4 py-3 font-mono text-sm text-gray-100
                  placeholder-gray-700 focus:outline-none focus:border-neon-cyan
                  focus:bg-[rgba(0,245,255,0.06)] transition-all duration-200
                "
              />
            </div>

            {/* Tab switcher */}
            <div className="flex mb-5 rounded-lg overflow-hidden border border-[rgba(255,255,255,0.08)]">
              {(["create", "join"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`
                    flex-1 py-2.5 font-mono text-xs uppercase tracking-widest transition-all duration-200
                    ${tab === t
                      ? "bg-[rgba(0,245,255,0.12)] text-neon-cyan"
                      : "bg-transparent text-gray-600 hover:text-gray-400"
                    }
                  `}
                >
                  {t === "create" ? "Create Room" : "Join Room"}
                </button>
              ))}
            </div>

            {tab === "join" && (
              <motion.div
                className="mb-5"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                <label className="block font-mono text-xs text-gray-500 uppercase tracking-widest mb-2">
                  Room Code
                </label>
                <input
                  value={roomIdInput}
                  onChange={(e) => setRoomIdInput(e.target.value.toUpperCase())}
                  placeholder="e.g. X7K2PQ"
                  maxLength={6}
                  className="
                    w-full bg-[rgba(0,245,255,0.04)] border border-[rgba(0,245,255,0.2)]
                    rounded-lg px-4 py-3 font-mono text-sm text-gray-100 uppercase tracking-widest
                    placeholder-gray-700 focus:outline-none focus:border-neon-cyan
                    focus:bg-[rgba(0,245,255,0.06)] transition-all duration-200
                  "
                />
              </motion.div>
            )}

            {/* CTA button */}
            <motion.button
              onClick={tab === "create" ? handleCreate : handleJoin}
              disabled={!username.trim() || (tab === "join" && !roomIdInput.trim())}
              whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(0,245,255,0.35)" }}
              whileTap={{ scale: 0.98 }}
              className="
                btn-neon-pulse relative w-full py-4 rounded-xl font-mono font-bold text-sm
                tracking-widest uppercase text-neon-cyan
                bg-[rgba(0,245,255,0.08)] border border-[rgba(0,245,255,0.4)]
                hover:bg-[rgba(0,245,255,0.15)] transition-all duration-200
                disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100
                flex items-center justify-center gap-2
              "
            >
              <Zap className="w-4 h-4" />
              {tab === "create" ? "Create Room" : "Join Game"}
              <ChevronRight className="w-4 h-4" />
            </motion.button>
          </GlassCard>
        </motion.div>

        {/* Feature pills */}
        <motion.div
          className="flex flex-wrap gap-3 mt-8 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          {[
            { icon: Terminal, label: "Live Code Sync", color: "text-neon-green" },
            { icon: Users, label: "Real-time Multiplayer", color: "text-neon-cyan" },
            { icon: Zap, label: "Sabotage Powers", color: "text-neon-pink" },
          ].map(({ icon: Icon, label, color }) => (
            <div
              key={label}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)]"
            >
              <Icon className={`w-3.5 h-3.5 ${color}`} />
              <span className="font-mono text-xs text-gray-400">{label}</span>
            </div>
          ))}
        </motion.div>

        {/* Floating code card */}
        <motion.div
          className="fixed bottom-8 right-8 hidden lg:block"
          animate={{ y: [0, -10, 0], rotate: [0, 1, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="glass px-5 py-4 rounded-xl max-w-xs opacity-50 hover:opacity-80 transition-opacity">
            <pre className="font-mono text-xs text-neon-green leading-relaxed" style={{ textShadow: "0 0 6px #39ff14" }}>
              {FLOATING_CODE}
            </pre>
          </div>
        </motion.div>
      </main>
    </>
  );
}
