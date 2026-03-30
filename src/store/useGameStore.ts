import { create } from "zustand";
import type { Room, PlayerRole, ChatMessage, SabotageType } from "@/types/game";

interface GameStore {
  // Identity
  myId: string | null;
  username: string;
  myRole: PlayerRole;

  // Room
  room: Room | null;

  // Game
  currentCode: string;
  currentPrompt: string | null; // only revealed to coder
  timeLeft: number;

  // Chat
  messages: ChatMessage[];

  // Effects
  sabotageEffect: SabotageType | null;
  hackNotification: string | null; // "[Username] hacked the code!"
  isGameOver: boolean;
  finalPlayers: Room["players"];

  // Setters
  setMyId: (id: string) => void;
  setUsername: (name: string) => void;
  setRoom: (room: Room) => void;
  setMyRole: (role: PlayerRole) => void;
  setCurrentCode: (code: string) => void;
  setCurrentPrompt: (prompt: string | null) => void;
  setTimeLeft: (t: number) => void;
  addMessage: (msg: ChatMessage) => void;
  setSabotageEffect: (effect: SabotageType | null) => void;
  setHackNotification: (msg: string | null) => void;
  setIsGameOver: (v: boolean) => void;
  setFinalPlayers: (players: Room["players"]) => void;
  reset: () => void;
}

const initialState = {
  myId: null,
  username: "",
  myRole: "guesser" as PlayerRole,
  room: null,
  currentCode: "",
  currentPrompt: null,
  timeLeft: 300,
  messages: [],
  sabotageEffect: null,
  hackNotification: null,
  isGameOver: false,
  finalPlayers: [],
};

export const useGameStore = create<GameStore>((set) => ({
  ...initialState,

  setMyId: (id) => set({ myId: id }),
  setUsername: (name) => set({ username: name }),
  setRoom: (room) => set({ room }),
  setMyRole: (role) => set({ myRole: role }),
  setCurrentCode: (code) => set({ currentCode: code }),
  setCurrentPrompt: (prompt) => set({ currentPrompt: prompt }),
  setTimeLeft: (t) => set({ timeLeft: t }),
  addMessage: (msg) => set((s) => ({ messages: [...s.messages, msg] })),
  setSabotageEffect: (effect) => set({ sabotageEffect: effect }),
  setHackNotification: (msg) => set({ hackNotification: msg }),
  setIsGameOver: (v) => set({ isGameOver: v }),
  setFinalPlayers: (players) => set({ finalPlayers: players }),
  reset: () => set(initialState),
}));
