"use client";

import { useEffect, useRef } from "react";
import { getSocket } from "@/lib/socket-client";
import { useGameStore } from "@/store/useGameStore";
import type { Room, ChatMessage, SabotageType } from "@/types/game";

export function useGameSocket(roomId: string) {
  const {
    setMyId, setRoom, setMyRole, setCurrentCode,
    setCurrentPrompt, setTimeLeft, addMessage,
    setSabotageEffect, setHackNotification, setIsGameOver,
    setFinalPlayers, room,
  } = useGameStore();

  const sabotageTimeout = useRef<NodeJS.Timeout | null>(null);
  const hackTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const socket = getSocket();

    socket.on("connect", () => {
      setMyId(socket.id!);
    });

    socket.on("room_update", ({ room }: { room: Room }) => {
      setRoom(room);
      const me = room.players.find((p) => p.id === socket.id);
      if (me) setMyRole(me.role);
    });

    socket.on("game_started", ({ prompt, room }: { prompt: string | null; room: Room }) => {
      setRoom(room);
      setCurrentPrompt(prompt); // only set for coder
      setCurrentCode("");
      setIsGameOver(false);
      const me = room.players.find((p) => p.id === socket.id);
      if (me) setMyRole(me.role);
    });

    socket.on("code_update", ({ code }: { code: string }) => {
      setCurrentCode(code);
    });

    socket.on("timer_tick", ({ timeLeft }: { timeLeft: number }) => {
      setTimeLeft(timeLeft);
    });

    socket.on("correct_guess", ({ username }: { username: string }) => {
      const notification = `⚡ ${username} hacked the code!`;
      setHackNotification(notification);
      if (hackTimeout.current) clearTimeout(hackTimeout.current);
      hackTimeout.current = setTimeout(() => setHackNotification(null), 4000);
    });

    socket.on("chat_message", (msg: ChatMessage) => {
      addMessage(msg);
    });

    socket.on("sabotage", ({ type }: { type: SabotageType }) => {
      setSabotageEffect(type);
      if (sabotageTimeout.current) clearTimeout(sabotageTimeout.current);
      sabotageTimeout.current = setTimeout(() => setSabotageEffect(null), 2000);
    });

    socket.on("game_over", ({ players }: { players: Room["players"]; prompt: string }) => {
      setIsGameOver(true);
      setFinalPlayers(players);
      setTimeLeft(0);
    });

    return () => {
      socket.off("connect");
      socket.off("room_update");
      socket.off("game_started");
      socket.off("code_update");
      socket.off("timer_tick");
      socket.off("correct_guess");
      socket.off("chat_message");
      socket.off("sabotage");
      socket.off("game_over");
    };
  }, [roomId]);

  // ── Action emitters ──────────────────────────────────────
  function joinRoom(username: string) {
    const socket = getSocket();
    socket.emit("join_room", { roomId, username });
  }

  function startGame() {
    const socket = getSocket();
    socket.emit("start_game", { roomId });
  }

  function sendCodeUpdate(code: string) {
    const socket = getSocket();
    socket.emit("code_update", { roomId, code });
  }

  function submitGuess(guess: string, username: string) {
    const socket = getSocket();
    socket.emit("submit_guess", { roomId, guess, username });
  }

  function sendChatMessage(text: string, username: string) {
    const socket = getSocket();
    socket.emit("chat_message", { roomId, text, username });
  }

  function sendSabotage(type: SabotageType, fromUsername: string) {
    const socket = getSocket();
    socket.emit("sabotage", { roomId, type, fromUsername });
  }

  return { joinRoom, startGame, sendCodeUpdate, submitGuess, sendChatMessage, sendSabotage };
}
