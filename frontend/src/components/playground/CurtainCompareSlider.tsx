"use client";

import React, { useState, useRef, useCallback } from "react";
import { Sliders, Eye } from "lucide-react";

interface CurtainCompareSliderProps {
  beforeCanvasRef: React.RefObject<HTMLCanvasElement>;
  afterCanvasRef: React.RefObject<HTMLCanvasElement>;
  beforeLabel?: string;
  afterLabel?: string;
  width?: number;
  height?: number;
  className?: string;
}

export function CurtainCompareSlider({
  beforeCanvasRef,
  afterCanvasRef,
  beforeLabel = "Original Scan",
  afterLabel = "Filtered Output",
  width = 380,
  height = 380,
  className = ""
}: CurtainCompareSliderProps) {
  const [sliderPos, setSliderPos] = useState<number>(50); // percentage 0-100
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef<boolean>(false);

  const handlePointerDown = (e: React.PointerEvent) => {
    isDragging.current = true;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    updateSliderFromPointer(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    updateSliderFromPointer(e.clientX);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    isDragging.current = false;
  };

  const updateSliderFromPointer = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(pct);
  }, []);

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      className={`relative select-none overflow-hidden rounded-2xl bg-black border border-slate-800 touch-none cursor-ew-resize group shadow-lg ${className}`}
      style={{ width, height, maxWidth: "100%" }}
    >
      {/* Background (After Canvas) */}
      <div className="absolute inset-0 w-full h-full">
        {afterCanvasRef.current && (
          <img
            src={afterCanvasRef.current.toDataURL()}
            alt="After Scan"
            className="w-full h-full object-contain pointer-events-none"
          />
        )}
      </div>

      {/* Foreground Clipped (Before Canvas) */}
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        style={{ width: `${sliderPos}%` }}
      >
        <div style={{ width, height }} className="relative h-full">
          {beforeCanvasRef.current && (
            <img
              src={beforeCanvasRef.current.toDataURL()}
              alt="Before Scan"
              className="w-full h-full object-contain pointer-events-none"
              style={{ width, height }}
            />
          )}
        </div>
      </div>

      {/* Dividing Curtain Bar & Handle */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)] pointer-events-none"
        style={{ left: `${sliderPos}%` }}
      >
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white text-slate-900 shadow-xl flex items-center justify-center font-bold text-xs ring-2 ring-sky-500">
          <Sliders className="w-4 h-4 text-slate-700" />
        </div>
      </div>

      {/* Floating Labels */}
      <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-black/70 backdrop-blur text-white text-[10px] font-bold uppercase tracking-wider border border-white/20 pointer-events-none">
        {beforeLabel}
      </div>
      <div className="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-black/70 backdrop-blur text-sky-400 text-[10px] font-bold uppercase tracking-wider border border-sky-500/30 pointer-events-none">
        {afterLabel}
      </div>
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[9px] text-white/60 bg-black/60 px-2 py-0.5 rounded-full pointer-events-none">
        Drag slider to compare before / after
      </div>
    </div>
  );
}

export default CurtainCompareSlider;
