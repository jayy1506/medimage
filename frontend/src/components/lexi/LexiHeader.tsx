"use client";

import React from "react";
import {
  Minimize2,
  Columns,
  Maximize2,
  X,
  History,
  Sparkles,
} from "lucide-react";
import { useLexiChat } from "@/context/LexiChatContext";
import { LexiLogo } from "./LexiLogo";
import { DisplayMode } from "@/lib/lexi/storage";

interface LexiHeaderProps {
  onToggleHistoryDrawer?: () => void;
  showHistoryButton?: boolean;
}

export const LexiHeader: React.FC<LexiHeaderProps> = ({
  onToggleHistoryDrawer,
  showHistoryButton = false,
}) => {
  const { mode, setMode, closeChat } = useLexiChat();

  const handleModeChange = (newMode: DisplayMode) => {
    setMode(newMode);
  };

  return (
    <header className="flex items-center justify-between px-3 py-2.5 border-b border-[var(--lexi-border)] bg-[var(--lexi-surface)] shrink-0 select-none">
      {/* Title & Branding */}
      <div className="flex items-center gap-2 min-w-0">
        <LexiLogo size={22} />
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="text-xs sm:text-sm font-bold text-[var(--lexi-text)] truncate">
            Lexi
          </span>
          <span className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-[var(--lexi-primary-light)] text-[var(--lexi-primary)]">
            <Sparkles className="w-2.5 h-2.5" />
            <span>AI Tutor</span>
          </span>
        </div>
      </div>

      {/* Controls & Mode Switcher */}
      <div className="flex items-center gap-1">
        {/* History drawer trigger for Normal Mode */}
        {showHistoryButton && onToggleHistoryDrawer && (
          <button
            onClick={onToggleHistoryDrawer}
            className="p-1.5 rounded-lg text-[var(--lexi-text-muted)] hover:text-[var(--lexi-text)] hover:bg-[var(--lexi-surface-2)] transition"
            title="Chat History"
            aria-label="Open chat history"
          >
            <History className="w-4 h-4" />
          </button>
        )}

        {/* Mode Switcher */}
        <div className="flex items-center gap-0.5 p-0.5 rounded-lg bg-[var(--lexi-surface-2)] border border-[var(--lexi-border)]/60">
          <button
            onClick={() => handleModeChange("normal")}
            className={`p-1.5 rounded-md transition ${
              mode === "normal"
                ? "bg-[var(--lexi-surface)] text-[var(--lexi-primary)] shadow-xs font-bold"
                : "text-[var(--lexi-text-muted)] hover:text-[var(--lexi-text)]"
            }`}
            title="Normal mode (Floating window, Ctrl+Shift+1)"
            aria-label="Normal mode"
            aria-pressed={mode === "normal"}
          >
            <Minimize2 className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => handleModeChange("half")}
            className={`p-1.5 rounded-md transition ${
              mode === "half"
                ? "bg-[var(--lexi-surface)] text-[var(--lexi-primary)] shadow-xs font-bold"
                : "text-[var(--lexi-text-muted)] hover:text-[var(--lexi-text)]"
            }`}
            title="Half mode (Side docked panel, Ctrl+Shift+2)"
            aria-label="Half mode"
            aria-pressed={mode === "half"}
          >
            <Columns className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => handleModeChange("full")}
            className={`p-1.5 rounded-md transition ${
              mode === "full"
                ? "bg-[var(--lexi-surface)] text-[var(--lexi-primary)] shadow-xs font-bold"
                : "text-[var(--lexi-text-muted)] hover:text-[var(--lexi-text)]"
            }`}
            title="Full mode (Full screen, Ctrl+Shift+3)"
            aria-label="Full mode"
            aria-pressed={mode === "full"}
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Close Button */}
        <button
          onClick={closeChat}
          className="p-1.5 ml-1 rounded-lg text-[var(--lexi-text-muted)] hover:text-rose-600 hover:bg-[var(--lexi-surface-2)] transition"
          title="Close Lexi (Esc)"
          aria-label="Close chat"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
