"use client";

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import Editor, { loader } from "@monaco-editor/react";
import type { SabotageType } from "@/types/game";

// Configure Monaco to use CDN (avoids Next.js webpack conflicts)
loader.config({ paths: { vs: "https://cdn.jsdelivr.net/npm/monaco-editor@0.50.0/min/vs" } });

const NEON_THEME_NAME = "codescribble-neon";

function defineNeonTheme(monaco: any) {
  monaco.editor.defineTheme(NEON_THEME_NAME, {
    base: "vs-dark",
    inherit: true,
    rules: [
      { token: "", foreground: "39ff14", background: "020207" },
      { token: "comment", foreground: "2a5a2a", fontStyle: "italic" },
      { token: "keyword", foreground: "00f5ff", fontStyle: "bold" },
      { token: "string", foreground: "ff00a0" },
      { token: "number", foreground: "fff01f" },
      { token: "type", foreground: "00f5ff" },
      { token: "variable", foreground: "a0ffb0" },
      { token: "function", foreground: "00f5ff" },
      { token: "operator", foreground: "ff6b00" },
    ],
    colors: {
      "editor.background": "#020207",
      "editor.foreground": "#39ff14",
      "editorCursor.foreground": "#00f5ff",
      "editor.lineHighlightBackground": "#0a1a0a",
      "editorLineNumber.foreground": "#1a4a1a",
      "editorLineNumber.activeForeground": "#39ff14",
      "editor.selectionBackground": "#00f5ff33",
      "editor.selectionHighlightBackground": "#00f5ff15",
      "editorBracketMatch.background": "#00f5ff20",
      "editorBracketMatch.border": "#00f5ff",
      "scrollbar.shadow": "#020207",
      "scrollbarSlider.background": "#39ff1420",
      "scrollbarSlider.hoverBackground": "#39ff1440",
      "scrollbarSlider.activeBackground": "#39ff1460",
    },
  });
}

interface MonacoEditorPanelProps {
  code: string;
  isReadOnly: boolean;
  sabotageEffect: SabotageType | null;
  onChange?: (value: string) => void;
}

export function MonacoEditorPanel({ code, isReadOnly, sabotageEffect, onChange }: MonacoEditorPanelProps) {
  const editorRef = useRef<any>(null);

  // Push live code updates into the editor for guessers only.
  // Coder's editor is fully uncontrolled — Monaco owns its own buffer.
  useEffect(() => {
    if (!editorRef.current || !isReadOnly) return;
    const model = editorRef.current.getModel();
    if (model && model.getValue() !== code) {
      model.setValue(code);
    }
  }, [code, isReadOnly]);

  const effect =
    sabotageEffect === "scramble" ? "scramble"
    : sabotageEffect === "reverse" ? "reverse"
    : "normal";

  const containerVariants = {
    scramble: { x: [0, -6, 6, -4, 4, -2, 2, 0], transition: { duration: 0.5, repeat: 4, repeatType: "loop" as const } },
    reverse: { scaleX: -1, transition: { duration: 0.3 } },
    normal: { x: 0, scaleX: 1 },
  };

  return (
    <motion.div
      className="w-full h-full flex flex-col rounded-lg overflow-hidden border border-[rgba(57,255,20,0.2)]"
      style={{ boxShadow: "0 0 20px rgba(57,255,20,0.08), inset 0 0 0 1px rgba(57,255,20,0.1)" }}
      animate={effect !== "normal" ? containerVariants[effect] : { x: 0, scaleX: 1 }}
      transition={effect !== "normal" ? containerVariants[effect].transition : undefined}
    >
      {/* Top bar — fixed height */}
      <div className="flex-shrink-0 flex items-center gap-2 px-4 py-2 bg-[rgba(57,255,20,0.05)] border-b border-[rgba(57,255,20,0.15)]">
        <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
        <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
        <div className="w-2.5 h-2.5 rounded-full bg-[#28c940]" />
        <span className="ml-2 font-mono text-xs text-[rgba(57,255,20,0.5)] tracking-widest">
          {isReadOnly ? "// LIVE FEED — READ ONLY" : "// CODING TERMINAL — YOU ARE THE CODER"}
        </span>
        {!isReadOnly && (
          <span className="ml-auto font-mono text-[10px] text-neon-green animate-pulse" style={{ textShadow: "0 0 8px #39ff14" }}>
            ● LIVE
          </span>
        )}
      </div>

      {/*
        Editor wrapper — flex-1 so it fills ALL remaining height after the top bar.
        Monaco needs an explicit pixel-height parent; flex-1 + min-h-0 provides that.
        KEY: remount Monaco fresh when isReadOnly flips (role change) so readOnly
        option is guaranteed correct from the very first render.
      */}
      <div className="flex-1 min-h-0">
        <Editor
          key={isReadOnly ? "ro" : "rw"}
          height="100%"
          defaultLanguage="javascript"
          defaultValue=""
          onChange={isReadOnly ? undefined : (v: string | undefined) => onChange?.(v ?? "")}
          options={{
            readOnly: isReadOnly,
            fontFamily: "JetBrains Mono, Fira Code, monospace",
            fontSize: 14,
            lineHeight: 22,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            padding: { top: 16, bottom: 16 },
            cursorBlinking: "phase",
            cursorStyle: isReadOnly ? "line-thin" : "block",
            renderLineHighlight: "line",
            formatOnType: false,
            wordWrap: "on",
            overviewRulerLanes: 0,
            hideCursorInOverviewRuler: true,
            scrollbar: { verticalScrollbarSize: 4, horizontalScrollbarSize: 4 },
          }}
          beforeMount={defineNeonTheme}
          onMount={(editor: any, monaco: any) => {
            editorRef.current = editor;
            monaco.editor.setTheme(NEON_THEME_NAME);
          }}
          theme={NEON_THEME_NAME}
        />
      </div>
    </motion.div>
  );
}
