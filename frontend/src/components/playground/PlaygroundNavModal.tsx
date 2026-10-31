"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, Gamepad2 } from "lucide-react";

export default function PlaygroundNavModal() {
  return (
    <Link
      href="/playground"
      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-slate-100 hover:bg-purple-50 text-slate-700 hover:text-adani-purple border border-slate-200 hover:border-purple-200 text-xs font-bold transition-all shadow-2xs transform hover:scale-105 active:scale-95 touch-manipulation"
      title="Interactive Simulation Playgrounds (5 Games & Labs)"
    >
      <span className="w-5 h-5 rounded-full bg-gradient-to-tr from-adani-purple to-adani-magenta text-white font-mono text-[10px] font-black flex items-center justify-center shadow-xs">
        PG
      </span>
      <span className="hidden sm:inline font-bold text-[11px] text-slate-800">
        Playground
      </span>
    </Link>
  );
}
