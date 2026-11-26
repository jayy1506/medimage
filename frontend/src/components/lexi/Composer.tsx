"use client";

import React, { useState, useEffect, useRef } from "react";
import { ArrowUp, Square, Sparkles } from "lucide-react";
import { useLexiChat } from "@/context/LexiChatContext";

export const Composer: React.FC = () => {
  const { sendMessage, isStreaming, stopStreaming, composerRef } = useLexiChat();
  const [text, setText] = useState("");

  const localRef = useRef<HTMLTextAreaElement | null>(null);

  // Sync ref with context composerRef
  const setRefs = (element: HTMLTextAreaElement | null) => {
    localRef.current = element;
    if (composerRef && typeof composerRef === "object") {
      (composerRef as any).current = element;
    }
  };

  // Auto-grow textarea height
  useEffect(() => {
    if (localRef.current) {
      localRef.current.style.height = "auto";
      localRef.current.style.height = `${Math.min(localRef.current.scrollHeight, 180)}px`;
    }
  }, [text]);

  // Ctrl/Cmd + K listener to focus composer
  useEffect(() => {
    const handleGlobalKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && (e.key === "k" || e.key === "K")) {
        e.preventDefault();
        localRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleGlobalKey);
    return () => window.removeEventListener("keydown", handleGlobalKey);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    const trimmed = text.trim();
    if (!trimmed || isStreaming) return;
    sendMessage(trimmed);
    setText("");
    if (localRef.current) {
      localRef.current.style.height = "auto";
    }
  };

  const hasText = text.trim().length > 0;

  return (
    <div className="w-full px-4 pb-3 pt-1 sm:px-6 sm:pb-4 bg-transparent shrink-0">
      {/* Floating Claude-Style Card */}
      <div className="relative rounded-2xl sm:rounded-3xl border border-[var(--lexi-border)] bg-[var(--lexi-surface)] shadow-xs hover:border-[var(--lexi-text-muted)]/40 focus-within:border-[var(--lexi-primary)]/60 focus-within:shadow-md transition-all p-3">
        {/* Text Input Area */}
        <textarea
          ref={setRefs}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Reply to Lexi or ask about course topics... (Ctrl+K)"
          rows={1}
          className="w-full max-h-44 min-h-[44px] px-1 py-1 bg-transparent text-sm text-[var(--lexi-text)] placeholder-[var(--lexi-text-muted)] resize-none outline-none leading-relaxed"
          aria-label="Message Lexi"
        />

        {/* Inner Card Toolbar */}
        <div className="flex items-center justify-between pt-2 mt-1 border-t border-[var(--lexi-border)]/40">
          {/* Left Model Badge (Claude Style) */}
          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--lexi-surface-2)] border border-[var(--lexi-border)]/50 text-[11px] font-medium text-[var(--lexi-text-muted)] select-none">
              <Sparkles className="w-3 h-3 text-[var(--lexi-primary)]" />
              <span>Lexi Academic Guide</span>
            </span>
          </div>

          {/* Right Circular Send / Stop Button (Claude Style) */}
          <div className="flex items-center shrink-0">
            {isStreaming ? (
              <button
                onClick={stopStreaming}
                className="w-8 h-8 rounded-full bg-rose-600 hover:bg-rose-700 text-white transition-all flex items-center justify-center shadow-xs active:scale-95"
                aria-label="Stop generation"
                title="Stop generation"
              >
                <Square className="w-3.5 h-3.5 fill-current" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!hasText}
                className={`w-8 h-8 rounded-full transition-all flex items-center justify-center shadow-xs ${
                  hasText
                    ? "bg-[var(--lexi-primary)] hover:bg-[var(--lexi-primary-hover)] text-white cursor-pointer active:scale-95"
                    : "bg-[var(--lexi-surface-2)] text-[var(--lexi-text-muted)] opacity-50 cursor-not-allowed"
                }`}
                aria-label="Send message"
                title="Send message (Enter)"
              >
                <ArrowUp className="w-4 h-4 stroke-[2.5]" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Claude-Style Centered Disclaimer */}
      <div className="text-center mt-2 text-[11px] text-[var(--lexi-text-muted)] tracking-wide">
        Lexi can make mistakes. Verify important medical & course information.
      </div>
    </div>
  );
};
