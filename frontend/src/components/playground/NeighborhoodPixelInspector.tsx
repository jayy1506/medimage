"use client";

import React from "react";
import { NeighborhoodInspection } from "@/lib/imagingEngine";
import { Calculator, Eye, HelpCircle } from "lucide-react";

interface NeighborhoodPixelInspectorProps {
  inspection: NeighborhoodInspection | null;
  kernelName?: string;
}

export function NeighborhoodPixelInspector({
  inspection,
  kernelName = "Convolution Kernel"
}: NeighborhoodPixelInspectorProps) {
  if (!inspection) {
    return (
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 text-xs text-center flex flex-col items-center justify-center space-y-2 min-h-[220px]">
        <Eye className="w-6 h-6 text-slate-500 animate-pulse" />
        <span className="font-semibold text-slate-300">Hover Over Any Pixel</span>
        <span className="text-[11px] text-slate-500 max-w-xs">
          Move your cursor across the scan canvas to deconstruct the 3×3 spatial neighborhood and live dot product.
        </span>
      </div>
    );
  }

  const { x, y, centerVal, grid, kernel, products, sum, normalizedOutput } = inspection;

  return (
    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-white shadow-xl space-y-4 font-sans">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-sky-500/20 text-sky-400">
            <Calculator className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-bold text-white block">See the Math: Discrete 2D Convolution</span>
            <span className="text-[10px] text-slate-400 font-mono">
              Coord: ({x}, {y}) • Pixel Gray: {centerVal}
            </span>
          </div>
        </div>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
          {kernelName}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
        {/* Step 1: 3x3 Image Neighborhood */}
        <div className="space-y-1.5 text-center">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            3×3 Patch I(x, y)
          </span>
          <div className="grid grid-cols-3 gap-1 bg-slate-900 p-1.5 rounded-xl border border-slate-800">
            {grid.map((row, rIdx) =>
              row.map((val, cIdx) => {
                const isCenter = rIdx === 1 && cIdx === 1;
                return (
                  <div
                    key={`p-${rIdx}-${cIdx}`}
                    className={`py-1 text-center font-mono text-[11px] rounded transition-colors ${
                      isCenter
                        ? "bg-sky-500/30 text-sky-300 font-bold border border-sky-400/40"
                        : "bg-slate-800/60 text-slate-300"
                    }`}
                  >
                    {val}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Math Symbol * (Convolution) */}
        <div className="hidden sm:flex flex-col items-center justify-center text-slate-500 text-sm font-bold">
          <span className="text-xl text-sky-400 font-mono">∗</span>
          <span className="text-[9px] uppercase tracking-wider text-slate-400">Pointwise</span>
        </div>

        {/* Step 2: Kernel Weights */}
        <div className="space-y-1.5 text-center">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Kernel K(i, j)
          </span>
          <div className="grid grid-cols-3 gap-1 bg-slate-900 p-1.5 rounded-xl border border-slate-800">
            {kernel.map((row, rIdx) =>
              row.map((wVal, cIdx) => {
                const isPos = wVal > 0;
                const isNeg = wVal < 0;
                return (
                  <div
                    key={`k-${rIdx}-${cIdx}`}
                    className={`py-1 text-center font-mono text-[11px] rounded ${
                      isPos
                        ? "bg-emerald-500/20 text-emerald-300 font-bold"
                        : isNeg
                        ? "bg-rose-500/20 text-rose-300 font-bold"
                        : "bg-slate-800/40 text-slate-500"
                    }`}
                  >
                    {wVal}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Step 3: Dot Product Sum Equation */}
      <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1 text-xs">
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-slate-400 font-mono">Σ (Patch × Kernel) =</span>
          <span className="font-mono font-bold text-sky-300">{sum}</span>
        </div>
        <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-800">
          <span className="text-slate-300 font-medium">Clamped Output Pixel:</span>
          <span className="font-mono font-extrabold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
            {normalizedOutput} / 255
          </span>
        </div>
      </div>
    </div>
  );
}

export default NeighborhoodPixelInspector;
