import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CodeScribble — Cyberpunk Code Guessing Game",
  description:
    "A real-time multiplayer game where one player codes a hidden prompt and others race to guess it. Featuring anti-gravity UI, 3D particle backgrounds, and sabotage power-ups.",
  keywords: ["code game", "multiplayer", "coding", "guessing game", "websockets"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="crt-on">
        {children}
      </body>
    </html>
  );
}
