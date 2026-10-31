"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { 
  Sliders, 
  Grid, 
  FileText, 
  X, 
  Maximize2, 
  Sparkles, 
  ExternalLink,
  ChevronRight,
  Layers,
  Activity
} from "lucide-react";
import WindowLevelPlayground from "@/components/playground/WindowLevelPlayground";
import SpatialConvolutionPlayground from "@/components/playground/SpatialConvolutionPlayground";
import DicomExplorerPlayground from "@/components/playground/DicomExplorerPlayground";

export default function PlaygroundNavModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"windowing" | "convolution" | "dicom">("windowing");
  const modalRef = useRef<HTMLDivElement>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  return (
    <>
      {/* PG NAVBAR BUTTON */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 flex items-center justify-center text-adani-navy hover:text-adani-cyan font-black text-xs transition-all shadow-2xs transform hover:scale-105 active:scale-95 touch-manipulation cursor-pointer"
        title="Interactive Lab Playgrounds (3 Simulations)"
      >
        <span className="font-mono text-[11px] font-bold text-adani-purple tracking-tight">PG</span>
      </button>

      {/* FLOATING PLAYGROUND MODAL */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
          <div 
            ref={modalRef}
            className="bg-white border border-slate-200 rounded-3xl shadow-2xl max-w-4xl w-full h-[88vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150"
          >
            {/* Header */}
            <header className="px-5 py-3.5 border-b border-slate-200 bg-white flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-adani-purple flex items-center justify-center font-bold text-xs border border-purple-100">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-black text-slate-900 flex items-center gap-1.5">
                    Interactive Medical Image Laboratory
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 hidden sm:inline">
                      3 Simulations Active
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Client-side real-time computational workbenches • AIDS 12605.1
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href="/playground"
                  onClick={() => setIsOpen(false)}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 hidden sm:flex items-center gap-1 transition-colors"
                  title="Open Dedicated Full-Screen Studio"
                >
                  <Maximize2 className="w-3.5 h-3.5 text-slate-500" />
                  <span>Full Screen Studio</span>
                </Link>

                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  title="Close Playground Window"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </header>

            {/* Navigation Tabs Bar */}
            <div className="px-5 py-2.5 border-b border-slate-100 bg-slate-50/70 flex items-center gap-2 overflow-x-auto flex-shrink-0">
              <button
                onClick={() => setActiveTab("windowing")}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === "windowing"
                    ? "bg-white text-adani-cyan border border-slate-200 shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>1. CT Windowing (WW/WL)</span>
              </button>

              <button
                onClick={() => setActiveTab("convolution")}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === "convolution"
                    ? "bg-white text-adani-cyan border border-slate-200 shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
                }`}
              >
                <Grid className="w-3.5 h-3.5" />
                <span>2. 2D Spatial Convolution &amp; FFT</span>
              </button>

              <button
                onClick={() => setActiveTab("dicom")}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === "dicom"
                    ? "bg-white text-adani-cyan border border-slate-200 shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>3. DICOM Tag Explorer</span>
              </button>
            </div>

            {/* Interactive Simulation Content Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50/30">
              {activeTab === "windowing" && (
                <div className="space-y-4">
                  <div className="bg-sky-50/70 border border-sky-100 rounded-2xl p-3 text-xs text-slate-700 flex items-center justify-between">
                    <span>
                      <strong>Simulation 1:</strong> Adjust Window Center (WL) and Window Width (WW) to selectively reveal Brain tissue (+40 HU), Bone (+1000 HU), or Lung parenchyma (-600 HU).
                    </span>
                    <span className="text-[10px] font-mono font-bold text-adani-cyan uppercase ml-2 flex-shrink-0">
                      60 FPS Transfer Curve
                    </span>
                  </div>
                  <WindowLevelPlayground />
                </div>
              )}

              {activeTab === "convolution" && (
                <div className="space-y-4">
                  <div className="bg-purple-50/70 border border-purple-100 rounded-2xl p-3 text-xs text-slate-700 flex items-center justify-between">
                    <span>
                      <strong>Simulation 2:</strong> Test 3×3 spatial kernels (Sobel Horizontal/Vertical, Laplacian, Gaussian blur) and observe frequency spectrum shifts in Fourier space.
                    </span>
                    <span className="text-[10px] font-mono font-bold text-adani-purple uppercase ml-2 flex-shrink-0">
                      Spatial &amp; Frequency Domain
                    </span>
                  </div>
                  <SpatialConvolutionPlayground />
                </div>
              )}

              {activeTab === "dicom" && (
                <div className="space-y-4">
                  <div className="bg-emerald-50/70 border border-emerald-100 rounded-2xl p-3 text-xs text-slate-700 flex items-center justify-between">
                    <span>
                      <strong>Simulation 3:</strong> Search binary DICOM Part 10 tags by hexadecimal tag (e.g. 0028,1050), explore Value Representations (VR), and test HIPAA patient de-identification.
                    </span>
                    <span className="text-[10px] font-mono font-bold text-emerald-700 uppercase ml-2 flex-shrink-0">
                      HIPAA Tag Sandbox
                    </span>
                  </div>
                  <DicomExplorerPlayground />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
