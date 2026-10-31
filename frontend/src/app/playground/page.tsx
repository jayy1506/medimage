"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sliders, Grid, FileText, ChevronLeft, Activity, Layers, Binary } from "lucide-react";
import WindowLevelPlayground from "@/components/playground/WindowLevelPlayground";
import SpatialConvolutionPlayground from "@/components/playground/SpatialConvolutionPlayground";
import DicomExplorerPlayground from "@/components/playground/DicomExplorerPlayground";
import { UserNav } from "@/components/UserNav";
import { BrandLogo } from "@/components/BrandLogo";

export default function PlaygroundPage() {
  const [activeTab, setActiveTab] = useState<"windowing" | "convolution" | "dicom">("windowing");

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link href="/course" className="p-2 text-slate-500 hover:text-adani-navy hover:bg-slate-100 rounded-lg transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <Link href="/dashboard" className="flex items-center gap-2">
              <BrandLogo className="w-9 h-9" size={36} />
              <span className="text-sm font-bold tracking-tight text-adani-navy hidden sm:inline-block">
                Adani University
              </span>
            </Link>
            <div className="hidden sm:block h-5 w-px bg-slate-300" />
            <span className="hidden sm:block text-xs font-bold text-adani-navy uppercase tracking-wider">
              Interactive Image Workstation
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
              <Activity className="w-3 h-3 mr-1 text-emerald-500" />
              100% Client-Side Engine
            </span>
            <div className="h-4 w-px bg-slate-200 hidden sm:block" />
            <UserNav />
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 space-y-6">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 p-1.5 bg-slate-200/70 rounded-2xl max-w-xl text-xs font-bold text-slate-600">
          <button
            onClick={() => setActiveTab("windowing")}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl transition-all ${
              activeTab === "windowing"
                ? "bg-white text-adani-cyan shadow-sm"
                : "hover:text-slate-900"
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>CT Window / Level</span>
          </button>

          <button
            onClick={() => setActiveTab("convolution")}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl transition-all ${
              activeTab === "convolution"
                ? "bg-white text-adani-purple shadow-sm"
                : "hover:text-slate-900"
            }`}
          >
            <Grid className="w-4 h-4" />
            <span>2D Spatial Convolution</span>
          </button>

          <button
            onClick={() => setActiveTab("dicom")}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl transition-all ${
              activeTab === "dicom"
                ? "bg-white text-adani-magenta shadow-sm"
                : "hover:text-slate-900"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>DICOM Header Explorer</span>
          </button>
        </div>

        {/* Selected Playground Tool */}
        <div className="mt-6">
          {activeTab === "windowing" && <WindowLevelPlayground />}
          {activeTab === "convolution" && <SpatialConvolutionPlayground />}
          {activeTab === "dicom" && <DicomExplorerPlayground />}
        </div>
      </main>
    </div>
  );
}
