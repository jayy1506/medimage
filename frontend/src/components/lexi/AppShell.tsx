"use client";

import React from "react";
import { useLexiChat } from "@/context/LexiChatContext";
import { LexiChat } from "./LexiChat";

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isOpen, mode } = useLexiChat();

  const isHalfModeDocked = isOpen && mode === "half";

  return (
    <div className="min-h-screen flex flex-col w-full overflow-x-hidden">
      <div
        className={`flex-1 flex flex-col w-full lexi-transition ${
          isHalfModeDocked ? "pr-0 sm:pr-[40vw] lg:pr-[50vw]" : ""
        }`}
      >
        {children}
      </div>
      <LexiChat />
    </div>
  );
};
