"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Zap } from "lucide-react";
import type { ChatMessage } from "@/types/game";

interface ChatPanelProps {
  messages: ChatMessage[];
  hackNotification: string | null;
  onSendMessage: (text: string) => void;
  onSubmitGuess: (guess: string) => void;
  myId: string | null;
  isGuesser: boolean;
  gameActive: boolean;
}

export function ChatPanel({
  messages,
  hackNotification,
  onSendMessage,
  onSubmitGuess,
  myId,
  isGuesser,
  gameActive,
}: ChatPanelProps) {
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function handleSend() {
    const text = input.trim();
    if (!text) return;
    if (isGuesser && gameActive) {
      onSubmitGuess(text);
    } else {
      onSendMessage(text);
    }
    setInput("");
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Hack notification banner */}
      <AnimatePresence>
        {hackNotification && (
          <motion.div
            className="mx-2 mt-2 px-3 py-2.5 rounded-lg border border-[rgba(57,255,20,0.5)] bg-[rgba(57,255,20,0.08)] text-center"
            initial={{ opacity: 0, scaleY: 0.7, y: -10 }}
            animate={{ opacity: 1, scaleY: 1, y: 0 }}
            exit={{ opacity: 0, scaleY: 0.7 }}
            transition={{ duration: 0.3 }}
          >
            <span
              className="font-mono font-bold text-neon-green text-sm tracking-wide"
              style={{ textShadow: "0 0 12px #39ff14" }}
            >
              {hackNotification}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Message list */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-2 custom-scrollbar">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className={`flex flex-col ${msg.senderId === myId ? "items-end" : "items-start"}`}
            >
              <span className="text-[10px] font-mono text-gray-500 mb-0.5 px-1">
                {msg.senderName}
              </span>
              <div
                className={`
                  max-w-[85%] px-3 py-1.5 rounded-lg text-sm font-mono
                  ${msg.senderId === myId
                    ? "bg-[rgba(0,245,255,0.12)] border border-[rgba(0,245,255,0.25)] text-neon-cyan"
                    : "bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.08)] text-gray-200"
                  }
                `}
              >
                {msg.text}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div className="p-3 border-t border-[rgba(255,255,255,0.06)]">
        <div className="flex items-center gap-2">
          {isGuesser && gameActive && (
            <Zap className="w-4 h-4 text-neon-yellow flex-shrink-0" style={{ filter: "drop-shadow(0 0 4px #fff01f)" }} />
          )}
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder={isGuesser && gameActive ? "Type your guess..." : "Send a message..."}
            className="
              flex-1 bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.1)]
              rounded-lg px-3 py-2 text-sm font-mono text-gray-200
              placeholder-gray-600 focus:outline-none focus:border-[rgba(0,245,255,0.4)]
              focus:bg-[rgba(0,245,255,0.04)] transition-all duration-200
            "
          />
          <button
            onClick={handleSend}
            className="
              flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center
              bg-[rgba(0,245,255,0.12)] border border-[rgba(0,245,255,0.3)]
              hover:bg-[rgba(0,245,255,0.2)] hover:shadow-neon-cyan
              transition-all duration-200 group
            "
          >
            <Send className="w-4 h-4 text-neon-cyan group-hover:scale-110 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}
