"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Target, Trophy, Flame } from "lucide-react";
import MissionsLab from "@/components/playground/MissionsLab";
import { UserNav } from "@/components/UserNav";
import { BrandLogo } from "@/components/BrandLogo";
import { useGamification } from "@/context/GamificationContext";

export default function MissionsPage() {
  const { xp, streakDays } = useGamification();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link
              href="/playground"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Playground Hub</span>
            </Link>
            <span className="text-slate-300">/</span>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-sky-100 text-adani-cyan flex items-center justify-center font-bold text-xs">
                <Target className="w-4 h-4" />
              </div>
              <span className="text-xs font-extrabold text-slate-900">
                Clinical Missions &amp; Diagnostic Challenges
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* XP & Streak Pills */}
            <div className="hidden sm:flex items-center space-x-2">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold">
                <Trophy className="w-3.5 h-3.5 text-amber-500" />
                <span>{xp} XP</span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold">
                <Flame className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                <span>{streakDays} Day Streak</span>
              </div>
            </div>
            <UserNav />
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
        <MissionsLab />
      </main>
    </div>
  );
}
