import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "neon-green": "#39ff14",
        "neon-cyan": "#00f5ff",
        "neon-pink": "#ff00a0",
        "neon-yellow": "#fff01f",
        "neon-orange": "#ff6b00",
        "deep-black": "#020207",
        "glass-dark": "rgba(5, 5, 20, 0.6)",
        "glass-border": "rgba(0, 245, 255, 0.2)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
      backdropBlur: {
        xs: "2px",
      },
      animation: {
        "float": "float 4s ease-in-out infinite",
        "float-slow": "float 6s ease-in-out infinite",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
        "neon-flicker": "neonFlicker 3s ease-in-out infinite",
        "scan-line": "scanLine 8s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 5px currentColor, 0 0 20px currentColor" },
          "50%": { boxShadow: "0 0 20px currentColor, 0 0 60px currentColor, 0 0 100px currentColor" },
        },
        neonFlicker: {
          "0%, 19%, 21%, 23%, 25%, 54%, 56%, 100%": { opacity: "1" },
          "20%, 24%, 55%": { opacity: "0.6" },
        },
        scanLine: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" },
        },
      },
      boxShadow: {
        "neon-green": "0 0 10px #39ff14, 0 0 30px #39ff1440, 0 0 60px #39ff1420",
        "neon-cyan": "0 0 10px #00f5ff, 0 0 30px #00f5ff40, 0 0 60px #00f5ff20",
        "neon-pink": "0 0 10px #ff00a0, 0 0 30px #ff00a040, 0 0 60px #ff00a020",
        "glass": "0 8px 32px 0 rgba(0, 245, 255, 0.1), inset 0 0 0 1px rgba(0, 245, 255, 0.15)",
      },
    },
  },
  plugins: [],
};

export default config;
