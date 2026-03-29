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
        // Primary accent — indigo
        "accent": "#6366f1",
        "accent-light": "#818cf8",
        "accent-dim": "#4338ca",
        // Secondary — violet
        "secondary": "#7c3aed",
        "secondary-light": "#a78bfa",
        // Status colors (subtle)
        "clr-success": "#10b981",
        "clr-warn": "#f59e0b",
        "clr-danger": "#f43f5e",
        // Legacy names kept so existing Tailwind classes don't break
        // — remapped to the new clean palette
        "neon-green": "#10b981",   // was #39ff14 (aggressive neon green → calm emerald)
        "neon-cyan": "#6366f1",    // was #00f5ff (acid cyan → indigo)
        "neon-pink": "#a78bfa",    // was #ff00a0 (hot pink → soft violet)
        "neon-yellow": "#f59e0b",  // was #fff01f (harsh yellow → amber)
        "neon-orange": "#f97316",  // stays close
        "deep-black": "#060609",
        "glass-dark": "rgba(12, 12, 22, 0.7)",
        "glass-border": "rgba(99, 102, 241, 0.18)",
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
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 4px currentColor, 0 0 12px currentColor" },
          "50%": { boxShadow: "0 0 12px currentColor, 0 0 32px currentColor" },
        },
      },
      boxShadow: {
        "neon-green": "0 0 8px #10b981, 0 0 20px #10b98130",
        "neon-cyan": "0 0 8px #6366f1, 0 0 20px #6366f130",
        "neon-pink": "0 0 8px #a78bfa, 0 0 20px #a78bfa30",
        "glass": "0 8px 32px 0 rgba(99,102,241,0.08), inset 0 0 0 1px rgba(99,102,241,0.12)",
      },
    },
  },
  plugins: [],
};

export default config;
