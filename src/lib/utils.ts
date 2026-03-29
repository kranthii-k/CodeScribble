import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateRoomId(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function getTimerColor(timeLeft: number): string {
  if (timeLeft > 30) return "#39ff14"; // neon-green
  if (timeLeft > 15) return "#fff01f"; // neon-yellow
  return "#ff00a0"; // neon-pink
}
