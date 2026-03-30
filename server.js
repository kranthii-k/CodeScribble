// ─────────────────────────────────────────────
//  CodeScribble — Socket.io Custom Node Server
//  Replaces the default Next.js server to allow
//  Socket.io on the same HTTP port.
// ─────────────────────────────────────────────

const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");
const { Server } = require("socket.io");
const { v4: uuidv4 } = require("uuid");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

// ─────────────────────────────────────────────
//  In-memory room store
// ─────────────────────────────────────────────
const rooms = new Map(); // roomId → Room
const timers = new Map(); // roomId → intervalId

// Each prompt has a canonical name + accepted aliases for fuzzy matching
const PROMPTS = [
  { name: "Binary Search",            aliases: ["binary search", "bsearch", "bisect"] },
  { name: "Reverse a Linked List",    aliases: ["reverse linked list", "linked list reverse", "reverse list"] },
  { name: "FizzBuzz",                 aliases: ["fizzbuzz", "fizz buzz"] },
  { name: "Two Sum",                  aliases: ["two sum", "twosum", "2 sum"] },
  { name: "Check Palindrome",         aliases: ["palindrome", "is palindrome", "check palindrome"] },
  { name: "Fibonacci Sequence",       aliases: ["fibonacci", "fib", "fibonacci sequence"] },
  { name: "Bubble Sort",              aliases: ["bubble sort", "bubblesort"] },
  { name: "Merge Sort",               aliases: ["merge sort", "mergesort"] },
  { name: "Quick Sort",               aliases: ["quick sort", "quicksort"] },
  { name: "Factorial",                aliases: ["factorial", "n factorial"] },
  { name: "Depth First Search",       aliases: ["dfs", "depth first search", "depth-first"] },
  { name: "Breadth First Search",     aliases: ["bfs", "breadth first search", "breadth-first"] },
  { name: "Stack Implementation",     aliases: ["stack", "implement stack", "stack implementation"] },
  { name: "Queue Implementation",     aliases: ["queue", "implement queue"] },
  { name: "Valid Parentheses",        aliases: ["valid parentheses", "balanced parentheses", "matching brackets"] },
  { name: "Find Maximum Subarray",    aliases: ["maximum subarray", "kadane", "max subarray", "kadane's algorithm"] },
  { name: "Reverse a String",         aliases: ["reverse string", "string reverse"] },
  { name: "Count Vowels",             aliases: ["count vowels", "vowel count"] },
  { name: "Power of Two",             aliases: ["power of two", "is power of two", "pow 2"] },
  { name: "Anagram Check",            aliases: ["anagram", "check anagram", "is anagram"] },
  { name: "Remove Duplicates",        aliases: ["remove duplicates", "deduplicate", "unique elements"] },
  { name: "Insertion Sort",           aliases: ["insertion sort", "insertionsort"] },
  { name: "Selection Sort",           aliases: ["selection sort", "selectionsort"] },
  { name: "Flatten Nested Array",     aliases: ["flatten", "flatten array", "flatten nested array"] },
  { name: "Linked List Cycle Detection", aliases: ["cycle detection", "detect cycle", "floyd's algorithm", "linked list cycle"] },
];

// ─────────────────────────────────────────────
//  Fuzzy / similarity matching
// ─────────────────────────────────────────────

/** Normalize: lowercase, strip punctuation/extra spaces */
function normalize(str) {
  return str.toLowerCase().replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
}

/** Levenshtein distance */
function levenshtein(a, b) {
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, (_, i) =>
    Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  );
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] = a[i-1] === b[j-1] ? dp[i-1][j-1]
        : 1 + Math.min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]);
  return dp[m][n];
}

/**
 * Returns true when the guess is close enough to the prompt.
 * Strategy (OR-chain — any one match wins):
 *  1. Exact match (after normalization)
 *  2. Alias match
 *  3. Levenshtein similarity ≥ 70% on the canonical name
 *  4. Every significant word in the prompt appears in the guess
 */
function isCorrectGuess(guessRaw, prompt) {
  const guess = normalize(guessRaw);
  const canonical = normalize(prompt.name);

  // 1. Exact canonical
  if (guess === canonical) return true;

  // 2. Alias
  if (prompt.aliases.some((a) => guess === normalize(a))) return true;

  // 3. Levenshtein similarity
  const maxLen = Math.max(guess.length, canonical.length);
  if (maxLen > 0) {
    const similarity = 1 - levenshtein(guess, canonical) / maxLen;
    if (similarity >= 0.70) return true;
  }

  // 4. Key-word overlap: all non-trivial words of the answer exist in the guess
  const stopWords = new Set(["a", "an", "the", "of", "in", "to"]);
  const answerWords = canonical.split(" ").filter((w) => w.length > 1 && !stopWords.has(w));
  if (answerWords.length > 0 && answerWords.every((w) => guess.includes(w))) return true;

  return false;
}

function createRoom(id) {
  return {
    id,
    players: [],
    status: "waiting",
    currentPrompt: null,
    coderId: null,
    codeContent: "",
    timeLeft: 300,
    roundNumber: 0,
  };
}

function getOrCreateRoom(roomId) {
  if (!rooms.has(roomId)) rooms.set(roomId, createRoom(roomId));
  return rooms.get(roomId);
}

function getRoomForSocket(socketId) {
  for (const room of rooms.values()) {
    if (room.players.some((p) => p.id === socketId)) return room;
  }
  return null;
}

function startTimer(io, roomId) {
  if (timers.has(roomId)) clearInterval(timers.get(roomId));
  const interval = setInterval(() => {
    const room = rooms.get(roomId);
    if (!room) { clearInterval(interval); return; }
    room.timeLeft -= 1;
    io.to(roomId).emit("timer_tick", { timeLeft: room.timeLeft });
    if (room.timeLeft <= 0) {
      clearInterval(interval);
      timers.delete(roomId);
      room.status = "gameover";
      io.to(roomId).emit("game_over", {
        prompt: room.currentPrompt ? room.currentPrompt.name : null,
        players: room.players,
      });
      // Reset for next round after 5s
      setTimeout(() => {
        room.status = "waiting";
        room.currentPrompt = null;
        room.coderId = null;
        room.codeContent = "";
        room.timeLeft = 300;
        room.players.forEach((p) => { p.hasGuessed = false; p.role = "guesser"; });
        io.to(roomId).emit("room_update", { room });
      }, 5000);
    }
  }, 1000);
  timers.set(roomId, interval);
}

// ─────────────────────────────────────────────
//  Server bootstrap
// ─────────────────────────────────────────────
app.prepare().then(() => {
  const httpServer = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  const io = new Server(httpServer, {
    cors: { origin: "*", methods: ["GET", "POST"] },
  });

  io.on("connection", (socket) => {
    console.log(`[Socket] Connected: ${socket.id}`);

    // ── join_room ──────────────────────────────
    socket.on("join_room", ({ roomId, username }) => {
      const room = getOrCreateRoom(roomId);
      // Prevent duplicate join
      if (!room.players.find((p) => p.id === socket.id)) {
        room.players.push({
          id: socket.id,
          username,
          score: 0,
          role: "guesser",
          hasGuessed: false,
        });
      }
      socket.join(roomId);
      io.to(roomId).emit("room_update", { room });
      console.log(`[Room] ${username} joined ${roomId}`);
    });

    // ── start_game ─────────────────────────────
    socket.on("start_game", ({ roomId }) => {
      const room = rooms.get(roomId);
      if (!room || room.status === "playing") return;
      // Pick a random prompt object
      const prompt = PROMPTS[Math.floor(Math.random() * PROMPTS.length)];
      // Pick the host (first player) as coder, or whoever sent start
      const players = room.players;
      let coder = players.find((p) => p.id === socket.id) || players[0];
      if (!coder) return;
      coder.role = "coder";
      players.filter((p) => p.id !== coder.id).forEach((p) => { p.role = "guesser"; p.hasGuessed = false; });
      room.status = "playing";
      room.currentPrompt = prompt.name; // store as string — the full object must NOT be put in room
      room.coderId = coder.id;
      room.codeContent = "";
      room.timeLeft = 300; // 5 minutes
      room.roundNumber += 1;
      // Send the prompt (name only) to the coder; guessers get null
      // We build a sanitized room snapshot (currentPrompt already a string now)
      io.to(coder.id).emit("game_started", { prompt: prompt.name, room });
      // Guessers don't see the prompt name
      socket.to(roomId).emit("game_started", { prompt: null, room });
      startTimer(io, roomId);
      console.log(`[Game] Started in ${roomId}. Prompt: "${prompt.name}". Coder: ${coder.username}`);
    });

    // ── code_update ────────────────────────────
    socket.on("code_update", ({ roomId, code }) => {
      const room = rooms.get(roomId);
      if (!room) return;
      room.codeContent = code;
      // Broadcast to everyone except the coder
      socket.to(roomId).emit("code_update", { code });
    });

    // ── submit_guess ───────────────────────────
    socket.on("submit_guess", ({ roomId, guess, username }) => {
      const room = rooms.get(roomId);
      if (!room || room.status !== "playing") return;
      const player = room.players.find((p) => p.id === socket.id);
      if (!player || player.role === "coder" || player.hasGuessed) return;

      // Build a temporary prompt object for matching (currentPrompt is now stored as a string)
      const promptObj = room.currentPrompt
        ? PROMPTS.find((p) => p.name === room.currentPrompt) || { name: room.currentPrompt, aliases: [] }
        : null;
      const correct = promptObj && isCorrectGuess(guess, promptObj);

      if (correct) {
        const points = Math.max(100, room.timeLeft * 10);
        player.score += points;
        player.hasGuessed = true;
        io.to(roomId).emit("correct_guess", { username, points, timeLeft: room.timeLeft });
        io.to(roomId).emit("room_update", { room });
        console.log(`[Guess] ${username} guessed correctly ("${guess}" ≈ "${room.currentPrompt}") +${points} pts`);

        // Check if all guessers have guessed
        const guessers = room.players.filter((p) => p.role === "guesser");
        const allGuessed = guessers.every((p) => p.hasGuessed);
        if (allGuessed && guessers.length > 0) {
          clearInterval(timers.get(roomId));
          timers.delete(roomId);
          room.status = "gameover";
          room.timeLeft = 0;
          io.to(roomId).emit("game_over", { prompt: room.currentPrompt.name, players: room.players });
        }
      } else {
        // Wrong guess — relay as a normal chat message so others can see it
        io.to(roomId).emit("chat_message", {
          id: uuidv4(),
          senderId: socket.id,
          senderName: username,
          text: guess,
          timestamp: Date.now(),
        });
      }
    });

    // ── chat_message (non-guess) ───────────────
    socket.on("chat_message", ({ roomId, text, username }) => {
      const msg = {
        id: uuidv4(),
        senderId: socket.id,
        senderName: username,
        text,
        timestamp: Date.now(),
      };
      io.to(roomId).emit("chat_message", msg);
    });

    // ── sabotage ───────────────────────────────
    socket.on("sabotage", ({ roomId, type, fromUsername }) => {
      const room = rooms.get(roomId);
      if (!room || room.status !== "playing") return;
      const player = room.players.find((p) => p.id === socket.id);
      if (!player || player.role !== "guesser") return;
      // Send sabotage only to the coder
      if (room.coderId) {
        io.to(room.coderId).emit("sabotage", { type, fromUsername });
      }
      console.log(`[Sabotage] ${fromUsername} used ${type} on coder`);
    });

    // ── disconnect ─────────────────────────────
    socket.on("disconnect", () => {
      const room = getRoomForSocket(socket.id);
      if (room) {
        room.players = room.players.filter((p) => p.id !== socket.id);
        if (room.players.length === 0) {
          if (timers.has(room.id)) { clearInterval(timers.get(room.id)); timers.delete(room.id); }
          rooms.delete(room.id);
        } else {
          // If coder left, end game
          if (room.coderId === socket.id && room.status === "playing") {
            room.status = "gameover";
            if (timers.has(room.id)) { clearInterval(timers.get(room.id)); timers.delete(room.id); }
            io.to(room.id).emit("game_over", { prompt: room.currentPrompt ?? null, players: room.players });
          }
          io.to(room.id).emit("room_update", { room });
        }
      }
      console.log(`[Socket] Disconnected: ${socket.id}`);
    });
  });

  // ── Find/Create rooms API endpoints ──────────────────────
  // These are handled via Next.js API routes, the socket just augments them.

  const PORT = parseInt(process.env.PORT || "3000", 10);
  httpServer.listen(PORT, () => {
    console.log(`\n🚀 CodeScribble server running on http://localhost:${PORT}\n`);
  });
});
