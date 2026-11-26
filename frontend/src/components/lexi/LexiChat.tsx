"use client";

import React, { useState } from "react";
import { useLexiChat } from "@/context/LexiChatContext";
import { LexiHeader } from "./LexiHeader";
import { Sidebar } from "./Sidebar";
import { MessageList } from "./MessageList";
import { Composer } from "./Composer";
import { LexiLogo } from "./LexiLogo";
import { MessageSquare, Sparkles } from "lucide-react";

export const LexiChat: React.FC = () => {
  const { isOpen, mode, toggleOpen, launcherRef } = useLexiChat();

  const [isSidebarOpen, setIsSidebarOpen] = useState(mode === "full");
  const [showNormalHistoryDrawer, setShowNormalHistoryDrawer] = useState(false);

  // Sync sidebar open state when switching to full mode
  React.useEffect(() => {
    if (mode === "full") {
      setIsSidebarOpen(true);
    } else if (mode === "half") {
      setIsSidebarOpen(false);
    }
  }, [mode]);

  // Mode-specific container styling classes
  const getContainerClasses = () => {
    if (!isOpen) {
      return "pointer-events-none opacity-0 scale-95 translate-y-4 fixed bottom-6 right-6 z-40";
    }

    switch (mode) {
      case "normal":
        return "fixed inset-0 sm:inset-auto sm:bottom-5 sm:right-5 z-40 w-full sm:w-[380px] h-full sm:h-[600px] sm:max-h-[80vh] rounded-none sm:rounded-2xl shadow-2xl border border-[var(--lexi-border)] bg-[var(--lexi-surface)] flex flex-col overflow-hidden";

      case "half":
        return "fixed top-0 right-0 z-40 w-full md:w-[40vw] lg:w-[50vw] h-full shadow-2xl border-l border-[var(--lexi-border)] bg-[var(--lexi-surface)] flex flex-col overflow-hidden";

      case "full":
        return "fixed inset-0 z-50 w-full h-full bg-[var(--lexi-bg)] flex flex-col overflow-hidden";

      default:
        return "fixed inset-0 sm:inset-auto sm:bottom-5 sm:right-5 z-40 w-full sm:w-[380px] h-full sm:h-[600px] sm:max-h-[80vh] rounded-none sm:rounded-2xl shadow-2xl border border-[var(--lexi-border)] bg-[var(--lexi-surface)] flex flex-col overflow-hidden";
    }
  };

  return (
    <>
      {/* Floating Circular Launcher Button (Visible when closed) */}
      {!isOpen && (
        <button
          ref={launcherRef}
          onClick={toggleOpen}
          className="fixed bottom-6 right-6 z-40 group flex items-center gap-2 p-3.5 rounded-full bg-[var(--lexi-primary)] text-white shadow-xl hover:scale-105 active:scale-95 transition-all focus:outline-none focus:ring-4 focus:ring-[var(--lexi-primary)]/20"
          title="Open Lexi AI Tutor (Ctrl+J)"
          aria-label="Open Lexi AI Tutor"
        >
          <LexiLogo size={28} />
          <span className="hidden sm:inline-block pr-1.5 text-xs font-bold tracking-wide">
            Lexi AI
          </span>
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-sky-500"></span>
          </span>
        </button>
      )}

      {/* Main Single Mounted Chat Window */}
      <div
        className={`${getContainerClasses()} lexi-transition`}
        role="dialog"
        aria-label="Lexi chat"
        aria-modal={mode === "full"}
      >
        {/* Chat Header */}
        <LexiHeader
          showHistoryButton={mode === "normal"}
          onToggleHistoryDrawer={() => setShowNormalHistoryDrawer(!showNormalHistoryDrawer)}
        />

        {/* Body Content */}
        <div className="flex-1 flex overflow-hidden relative">
          {/* Sidebar in Half or Full mode */}
          {mode !== "normal" && (
            <Sidebar
              isOpen={isSidebarOpen}
              onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
            />
          )}

          {/* Slide-over History Drawer in Normal mode */}
          {mode === "normal" && showNormalHistoryDrawer && (
            <div className="absolute inset-0 z-30 flex">
              <div
                className="fixed inset-0 bg-black/20"
                onClick={() => setShowNormalHistoryDrawer(false)}
              />
              <Sidebar
                isOpen={true}
                onToggle={() => setShowNormalHistoryDrawer(false)}
                isMobileDrawer={false}
              />
            </div>
          )}

          {/* Central Conversation Column */}
          <main
            className={`flex-1 flex flex-col h-full overflow-hidden bg-[var(--lexi-surface)] ${
              mode === "full" ? "max-w-[48rem] mx-auto w-full" : "w-full"
            }`}
          >
            <MessageList />
            <Composer />
          </main>
        </div>
      </div>
    </>
  );
};
