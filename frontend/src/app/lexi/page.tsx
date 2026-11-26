"use client";

import React, { useEffect } from "react";
import { useLexiChat } from "@/context/LexiChatContext";

export default function LexiStandalonePage() {
  const { setMode, openChat } = useLexiChat();

  useEffect(() => {
    setMode("full");
    openChat();
  }, [setMode, openChat]);

  return (
    <div className="flex-1 flex items-center justify-center min-h-[80vh] bg-[var(--lexi-bg)] text-[var(--lexi-text)]">
      <div className="text-center text-sm text-[var(--lexi-text-muted)] animate-pulse">
        Opening Lexi Academic Workspace...
      </div>
    </div>
  );
}
