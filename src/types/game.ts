// ─────────────────────────────────────────────
//  Game Types — CodeScribble
// ─────────────────────────────────────────────

export type SabotageType = "flashbang" | "reverse" | "scramble";

export type PlayerRole = "coder" | "guesser" | "spectator";

export interface Player {
  id: string;          // socket id
  username: string;
  score: number;
  role: PlayerRole;
  hasGuessed: boolean;
  avatar?: string;     // future: avatar url
}

export interface Room {
  id: string;
  players: Player[];
  status: "waiting" | "playing" | "gameover";
  currentPrompt: string | null;
  coderId: string | null;   // socket id of the coder
  codeContent: string;
  timeLeft: number;         // seconds remaining
  roundNumber: number;
}

export interface GameState {
  room: Room | null;
  myId: string | null;
  myRole: PlayerRole;
  username: string;
  sabotageEffect: SabotageType | null;
  messages: ChatMessage[];
  hackNotification: string | null;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: number;
  isCorrectGuess?: boolean;
}

// ─────────────────────────────────────────────
//  Socket.io Event Payloads
// ─────────────────────────────────────────────

export interface JoinRoomPayload {
  roomId: string;
  username: string;
}

export interface StartGamePayload {
  roomId: string;
}

export interface CodeUpdatePayload {
  roomId: string;
  code: string;
}

export interface SubmitGuessPayload {
  roomId: string;
  guess: string;
  username: string;
}

export interface SabotagePayload {
  roomId: string;
  type: SabotageType;
  fromUsername: string;
}

export interface CorrectGuessPayload {
  username: string;
  points: number;
  timeLeft: number;
}

export interface RoomUpdatePayload {
  room: Room;
}

export interface TimerTickPayload {
  timeLeft: number;
}
