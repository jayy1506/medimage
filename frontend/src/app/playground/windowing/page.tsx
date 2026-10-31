"use client";

import React from "react";
import Link from "next/link";
import { ChevronLeft, Sliders, ArrowLeft, Layers, Activity } from "lucide-react";
import WindowLevelPlayground from "@/components/playground/WindowLevelPlayground";
import { UserNav } from "@/components/UserNav";
import { BrandLogo } from "@/components/BrandLogo";

export default function WindowingGamePage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link
              href="/playground"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>All Playgrounds</span>
            </Link>
            <span className="text-slate-300">/</span>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-sky-100 text-adani-cyan flex items-center justify-center font-bold text-xs">
                <Sliders className="w-4 h-4" />
              </div>
              <span className="text-xs sm:text-sm font-bold text-slate-900">
                CT Hounsfield Window / Level Simulation Lab
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <span className="hidden sm:inline-flex items-center px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-semibold border border-emerald-200">
              <Activity className="w-3 h-3 mr-1 text-emerald-500" />
              Interactive Workstation Active
            </span>
            <UserNav />
          </div>
        </div>
      </header>

      {/* Main Game Stage */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex-1 w-full space-y-6">
        <WindowLevelPlayground />
      </main>
    </div>
  );
}
