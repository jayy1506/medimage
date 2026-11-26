"use client";

import React from "react";
import { LexiLogo } from "./LexiLogo";
import { useLexiChat } from "@/context/LexiChatContext";
import { useAuth } from "@/context/AuthContext";
import { Brain, Cpu, CheckCircle2, Sliders, ArrowUpRight } from "lucide-react";

const SUGGESTED_PROMPTS = [
  {
    icon: Brain,
    title: "Course Syllabus & Physics",
    prompt: "What are the 6 syllabus modules and radiation physics covered in AIDS 12605.1?",
  },
  {
    icon: Sliders,
    title: "CT Windowing Presets",
    prompt: "How do CT Window Width and Level (WW/WL) sliders work for Brain vs Bone?",
  },
  {
    icon: CheckCircle2,
    title: "Mastery Assessment Rule",
    prompt: "What is the assessment mastery threshold rule and how does anti-cheating work?",
  },
  {
    icon: Cpu,
    title: "Pyodide Python Sandbox",
    prompt: "How does the in-browser Pyodide WebAssembly Python coding sandbox work?",
  },
];

export const EmptyState: React.FC = () => {
  const { mode, sendMessage } = useLexiChat();
  const { user, profile } = useAuth();

  const firstName =
    profile?.full_name?.split(" ")[0] ||
    profile?.username ||
    user?.displayName?.split(" ")[0] ||
    (user?.email ? user.email.split("@")[0].split(".")[0] : null) ||
    "Scholar";

  // Dynamic greeting based on time of day (Claude style)
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  const isNormalMode = mode === "normal";
  const displayedPrompts = isNormalMode ? SUGGESTED_PROMPTS.slice(0, 2) : SUGGESTED_PROMPTS;
  const logoSize = mode === "full" ? 56 : 42;

  return (
    <div className="flex flex-col items-center justify-center min-h-[75%] px-4 py-8 text-center animate-fadeIn">
      {/* Claude Starburst / Lexi Logo */}
      <div className="mb-4">
        <LexiLogo size={logoSize} />
      </div>

      {/* Claude-Style Editorial Greeting */}
      <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[var(--lexi-text)] mb-2 font-sans">
        {greeting}, {firstName}
      </h1>

      <p className="text-xs sm:text-sm text-[var(--lexi-text-muted)] max-w-md mb-8 leading-relaxed">
        I&apos;m Lexi, your academic AI guide for Medical Text &amp; Image Processing (AIDS 12605.1).
        Ask me anything from the course curriculum, labs, or playgrounds.
      </p>

      {/* Suggested Prompt Cards */}
      <div
        className={`w-full max-w-xl ${
          isNormalMode ? "grid grid-cols-1 gap-2.5" : "grid grid-cols-1 sm:grid-cols-2 gap-2.5"
        }`}
      >
        {displayedPrompts.map((item, index) => {
          const Icon = item.icon;
          return (
            <button
              key={index}
              onClick={() => sendMessage(item.prompt)}
              className="flex items-start gap-3 p-3.5 rounded-2xl border border-[var(--lexi-border)] bg-[var(--lexi-surface)] hover:bg-[var(--lexi-surface-2)] hover:border-[var(--lexi-text-muted)]/30 text-left transition-all duration-150 group shadow-2xs hover:shadow-xs cursor-pointer"
              aria-label={`Ask: ${item.title}`}
            >
              <div className="p-2 rounded-xl bg-[var(--lexi-primary-light)] text-[var(--lexi-primary)] shrink-0 group-hover:scale-105 transition-transform">
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold text-[var(--lexi-text)] flex items-center justify-between">
                  <span>{item.title}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-[var(--lexi-text-muted)] transition-opacity" />
                </div>
                <div className="text-[11px] text-[var(--lexi-text-muted)] line-clamp-2 mt-0.5 leading-relaxed">
                  {item.prompt}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
