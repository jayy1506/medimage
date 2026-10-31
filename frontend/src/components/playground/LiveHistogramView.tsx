"use client";

import React, { useMemo } from "react";
import { BarChart3, Activity } from "lucide-react";
import { HistogramData } from "@/lib/imagingEngine";

interface LiveHistogramViewProps {
  histogram: HistogramData | null;
  title?: string;
  threshold?: number;
  highlightRange?: [number, number]; // [lower, upper]
}

export function LiveHistogramView({
  histogram,
  title = "Live Intensity Distribution (256 Grayscale Bins)",
  threshold,
  highlightRange
}: LiveHistogramViewProps) {
  const { bins, maxVal } = useMemo(() => {
    if (!histogram || !histogram.bins) {
      return { bins: [], maxVal: 1 };
    }
    const max = Math.max(...histogram.bins, 1);
    return { bins: histogram.bins, maxVal: max };
  }, [histogram]);

  if (!histogram) {
    return (
      <div className="p-4 rounded-2xl bg-white border border-slate-200 text-slate-400 text-xs text-center flex flex-col items-center justify-center space-y-1 h-36">
        <BarChart3 className="w-5 h-5 text-slate-300 animate-pulse" />
        <span>Computing real-time intensity histogram...</span>
      </div>
    );
  }

  return (
    <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3 font-sans">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-adani-cyan/10 text-adani-cyan">
            <BarChart3 className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-slate-900">{title}</span>
        </div>
        <div className="flex items-center space-x-3 text-[11px] font-mono text-slate-500">
          <span>
            μ: <strong className="text-slate-800">{histogram.mean.toFixed(1)}</strong>
          </span>
          <span>
            σ: <strong className="text-slate-800">{histogram.stdDev.toFixed(1)}</strong>
          </span>
        </div>
      </div>

      {/* 256-Bar SVG Graphic */}
      <div className="relative h-24 w-full bg-slate-950 rounded-xl p-1.5 overflow-hidden flex items-end">
        <svg
          viewBox="0 0 256 100"
          preserveAspectRatio="none"
          className="w-full h-full overflow-visible"
        >
          {bins.map((count, bin) => {
            const h = (count / maxVal) * 95;
            let fill = "#38bdf8"; // default sky-400

            if (highlightRange && bin >= highlightRange[0] && bin <= highlightRange[1]) {
              fill = "#a855f7"; // purple-500 highlight
            } else if (threshold !== undefined && bin >= threshold) {
              fill = "#10b981"; // emerald-500 above threshold
            }

            return (
              <rect
                key={bin}
                x={bin}
                y={100 - h}
                width={1}
                height={h}
                fill={fill}
              />
            );
          })}

          {/* Threshold Marker Line */}
          {threshold !== undefined && (
            <line
              x1={threshold}
              y1={0}
              x2={threshold}
              y2={100}
              stroke="#f43f5e"
              strokeWidth={2}
              strokeDasharray="2,2"
            />
          )}
        </svg>

        {threshold !== undefined && (
          <div
            className="absolute top-1 text-[9px] font-mono font-bold text-rose-400 bg-black/80 px-1 rounded transform -translate-x-1/2 pointer-events-none"
            style={{ left: `${(threshold / 255) * 100}%` }}
          >
            T={threshold}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
        <span>0 (Air / Dark)</span>
        <span>128 (Soft Tissue)</span>
        <span>255 (Bone / Contrast)</span>
      </div>
    </div>
  );
}

export default LiveHistogramView;
