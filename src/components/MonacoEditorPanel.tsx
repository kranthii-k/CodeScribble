"use client";

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import Editor, { loader } from "@monaco-editor/react";
import type { SabotageType } from "@/types/game";

loader.config({ paths: { vs: "https://cdn.jsdelivr.net/npm/monaco-editor@0.50.0/min/vs" } });

const THEME_NAME = "codescribble-dark";

function defineTheme(monaco: any) {
  monaco.editor.defineTheme(THEME_NAME, {
    base: "vs-dark",
    inherit: true,
    rules: [
      { token: "", foreground: "e2e8f0", background: "0a0a14" },
      { token: "comment", foreground: "475569", fontStyle: "italic" },
      { token: "keyword", foreground: "818cf8", fontStyle: "bold" },
      { token: "string", foreground: "a78bfa" },
      { token: "number", foreground: "f59e0b" },
      { token: "type", foreground: "818cf8" },
      { token: "variable", foreground: "c7d2fe" },
      { token: "function", foreground: "6366f1" },
      { token: "operator", foreground: "94a3b8" },
    ],
    colors: {
      "editor.background": "#0a0a14",
      "editor.foreground": "#e2e8f0",
      "editorCursor.foreground": "#818cf8",
      "editor.lineHighlightBackground": "#13131f",
      "editorLineNumber.foreground": "#334155",
      "editorLineNumber.activeForeground": "#818cf8",
      "editor.selectionBackground": "#6366f130",
      "editor.selectionHighlightBackground": "#6366f115",
      "editorBracketMatch.background": "#6366f120",
      "editorBracketMatch.border": "#6366f1",
      "scrollbar.shadow": "#0a0a14",
      "scrollbarSlider.background": "#6366f120",
      "scrollbarSlider.hoverBackground": "#6366f140",
      "scrollbarSlider.activeBackground": "#6366f160",
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
      className="w-full h-full flex flex-col rounded-lg overflow-hidden border border-[rgba(99,102,241,0.2)]"
      style={{ boxShadow: "0 0 20px rgba(99,102,241,0.06), inset 0 0 0 1px rgba(99,102,241,0.08)" }}
      animate={effect !== "normal" ? containerVariants[effect] : { x: 0, scaleX: 1 }}
      transition={effect !== "normal" ? containerVariants[effect].transition : undefined}
    >
      {/* Top bar */}
      <div className="flex-shrink-0 flex items-center gap-2 px-4 py-2 bg-[rgba(99,102,241,0.04)] border-b border-[rgba(99,102,241,0.12)]">
        <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
        <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
        <div className="w-2.5 h-2.5 rounded-full bg-[#28c940]" />
        <span className="ml-2 font-mono text-xs text-[rgba(129,140,248,0.6)] tracking-widest">
          {isReadOnly ? "// LIVE FEED — READ ONLY" : "// CODING TERMINAL — YOU ARE THE CODER"}
        </span>
        {!isReadOnly && (
          <span className="ml-auto font-mono text-[10px] text-accent-light animate-pulse">
            ● LIVE
          </span>
        )}
      </div>

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
          beforeMount={defineTheme}
          onMount={(editor: any, monaco: any) => {
            editorRef.current = editor;
            monaco.editor.setTheme(THEME_NAME);
          }}
          theme={THEME_NAME}
        />
      </div>
    </motion.div>
  );
}
