"use client";

import React, { useRef, useEffect, useState } from "react";
import { ArrowDown, Loader2, Sparkles } from "lucide-react";
import { useLexiChat } from "@/context/LexiChatContext";
import { MessageItem } from "./MessageItem";
import { EmptyState } from "./EmptyState";

export const MessageList: React.FC = () => {
  const { activeSession, isStreaming, statusText } = useLexiChat();
  const messages = activeSession?.messages || [];

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [showScrollBottom, setShowScrollBottom] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(true);

  // Check scroll position
  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
    const atBottom = distanceFromBottom < 60;
    setIsAtBottom(atBottom);
    setShowScrollBottom(!atBottom && messages.length > 2);
  };

  // Auto-scroll when new messages/tokens arrive if user is at bottom
  useEffect(() => {
    if (isAtBottom) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, statusText, isAtBottom]);

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    setIsAtBottom(true);
    setShowScrollBottom(false);
  };

  if (messages.length === 0) {
    return (
      <div className="flex-1 overflow-y-auto p-4 scrollbar-thin">
        <EmptyState />
      </div>
    );
  }

  return (
    <div className="relative flex-1 overflow-hidden bg-[var(--lexi-surface)]">
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="h-full overflow-y-auto py-4 space-y-2 scrollbar-thin"
        role="log"
        aria-live="polite"
      >
        {messages.map((msg) => (
          <MessageItem key={msg.id} message={msg} />
        ))}

        {/* Claude-Style Thinking Indicator */}
        {isStreaming && statusText && (
          <div className="flex items-center gap-3.5 px-4 sm:px-6 py-2.5 animate-fadeIn">
            <div className="w-6 h-6 rounded-lg bg-[var(--lexi-primary-light)] text-[var(--lexi-primary)] flex items-center justify-center shrink-0">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            </div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--lexi-surface-2)] border border-[var(--lexi-border)] text-xs text-[var(--lexi-text-muted)] shadow-2xs">
              <Loader2 className="w-3 h-3 animate-spin text-[var(--lexi-primary)]" />
              <span className="font-medium tracking-wide">{statusText}</span>
            </div>
          </div>
        )}

        <div ref={bottomRef} className="h-6" />
      </div>

      {/* Floating Scroll to Bottom Button */}
      {showScrollBottom && (
        <button
          onClick={scrollToBottom}
          className="absolute bottom-4 right-6 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--lexi-surface)] border border-[var(--lexi-border)] shadow-md text-xs font-semibold text-[var(--lexi-text)] hover:bg-[var(--lexi-surface-2)] transition animate-fadeIn"
          aria-label="Scroll to bottom"
        >
          <ArrowDown className="w-3.5 h-3.5" />
          <span>Scroll to bottom</span>
        </button>
      )}
    </div>
  );
};
