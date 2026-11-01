"use client";

import React, { useState, useRef, useEffect } from "react";
import { ZoomIn, ZoomOut, RotateCcw, Maximize2, Minimize2, X } from "lucide-react";
import { VisualAssetData } from "./DualPanelViewer";

interface ClinicalScanViewerProps {
  assets: VisualAssetData[];
  className?: string;
}

export default function ClinicalScanViewer({
  assets,
  className = ""
}: ClinicalScanViewerProps) {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);

  const activeAsset = assets[selectedIdx] || assets[0];

  const handleZoomIn = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setZoomLevel((prev) => Math.min(prev + 0.25, 3.5));
  };

  const handleZoomOut = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setZoomLevel((prev) => Math.max(prev - 0.25, 0.6));
  };

  const handleReset = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setZoomLevel(1);
    setPan({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoomLevel > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoomLevel > 1) {
      setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Reset zoom & pan when switching figures
  useEffect(() => {
    setZoomLevel(1);
    setPan({ x: 0, y: 0 });
  }, [selectedIdx]);

  if (!activeAsset) {
    return null;
  }

  return (
    <>
      <div className={`bg-white rounded-2xl border border-slate-200 p-5 text-slate-900 shadow-sm space-y-4 ${className}`}>
        {/* Top Header Row with Figure Tabs & Zoom Controls */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
          {/* Multi-Figure Switcher Pills */}
          {assets.length > 1 ? (
            <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
              {assets.map((asset, idx) => (
                <button
                  key={asset.id}
                  type="button"
                  onClick={() => setSelectedIdx(idx)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    selectedIdx === idx
                      ? "bg-slate-900 text-white shadow-sm"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                  }`}
                >
                  Figure {idx + 1}
                </button>
              ))}
            </div>
          ) : (
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Clinical Scan Reference
            </span>
          )}

          {/* Action Toolbar: Zoom In, Zoom Out, Reset, Enlarge */}
          <div className="flex items-center bg-slate-100 border border-slate-200 rounded-xl p-1 space-x-1 shadow-sm">
            <button
              type="button"
              onClick={handleZoomIn}
              title="Zoom In"
              className="p-1.5 rounded-lg hover:bg-white text-slate-700 transition-colors"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleZoomOut}
              title="Zoom Out"
              className="p-1.5 rounded-lg hover:bg-white text-slate-700 transition-colors"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleReset}
              title="Reset Zoom"
              className="p-1.5 rounded-lg hover:bg-white text-slate-700 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setIsFullscreen(true)}
              title="Enlarge Fullscreen"
              className="p-1.5 rounded-lg hover:bg-white text-slate-700 transition-colors"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Interactive Viewport Canvas */}
        <div
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className={`relative w-full h-[360px] sm:h-[420px] bg-slate-50/90 rounded-xl overflow-hidden flex items-center justify-center border border-slate-100 p-3 select-none ${
            zoomLevel > 1 ? (isDragging ? "cursor-grabbing" : "cursor-grab") : "cursor-default"
          }`}
        >
          <div
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoomLevel})`,
              transition: isDragging ? "none" : "transform 0.15s ease-out"
            }}
            className="w-full h-full flex items-center justify-center"
          >
            <img
              src={activeAsset.storage_url}
              alt={activeAsset.alt_text}
              className="max-h-full max-w-full object-contain mx-auto pointer-events-none"
              loading="eager"
            />
          </div>

          {zoomLevel !== 1 && (
            <span className="absolute bottom-3 right-3 bg-slate-900/80 text-white font-mono text-[10px] px-2 py-0.5 rounded backdrop-blur-sm pointer-events-none">
              {Math.round(zoomLevel * 100)}%
            </span>
          )}
        </div>

        {/* Metadata Footer */}
        <div className="pt-2 text-xs">
          <span className="font-bold text-slate-900 text-sm block mb-1">
            {activeAsset.title}
          </span>
          <p className="leading-relaxed text-slate-600">
            {activeAsset.alt_text}
          </p>
          {activeAsset.attribution && (
            <div className="text-[11px] text-slate-400 mt-2 font-mono">
              Source: {activeAsset.attribution} ({activeAsset.license})
            </div>
          )}
        </div>
      </div>

      {/* Enlarged Fullscreen Lightbox Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md p-4 sm:p-6 flex flex-col justify-between">
          {/* Top Modal Controls */}
          <div className="flex items-center justify-between text-white border-b border-white/10 pb-3">
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                {activeAsset.title}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5 max-w-xl truncate">
                {activeAsset.alt_text}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center bg-white/10 border border-white/20 rounded-xl p-1 space-x-1">
                <button
                  type="button"
                  onClick={handleZoomIn}
                  title="Zoom In"
                  className="p-1.5 rounded-lg hover:bg-white/20 text-white transition-colors"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleZoomOut}
                  title="Zoom Out"
                  className="p-1.5 rounded-lg hover:bg-white/20 text-white transition-colors"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  title="Reset Zoom"
                  className="p-1.5 rounded-lg hover:bg-white/20 text-white transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              <button
                type="button"
                onClick={() => setIsFullscreen(false)}
                title="Close Fullscreen"
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Large Modal Image Viewport */}
          <div
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className={`relative flex-1 w-full my-4 flex items-center justify-center overflow-hidden select-none ${
              zoomLevel > 1 ? (isDragging ? "cursor-grabbing" : "cursor-grab") : "cursor-default"
            }`}
          >
            <div
              style={{
                transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoomLevel})`,
                transition: isDragging ? "none" : "transform 0.15s ease-out"
              }}
              className="w-full h-full flex items-center justify-center"
            >
              <img
                src={activeAsset.storage_url}
                alt={activeAsset.alt_text}
                className="max-h-full max-w-full object-contain mx-auto pointer-events-none"
              />
            </div>
          </div>

          {/* Bottom Info & Figure Switcher in Modal */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 border-t border-white/10 pt-3">
            {assets.length > 1 && (
              <div className="flex items-center gap-1.5">
                {assets.map((asset, idx) => (
                  <button
                    key={asset.id}
                    type="button"
                    onClick={() => setSelectedIdx(idx)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                      selectedIdx === idx
                        ? "bg-white text-slate-900 shadow-sm"
                        : "bg-white/10 hover:bg-white/20 text-white"
                    }`}
                  >
                    Figure {idx + 1}
                  </button>
                ))}
              </div>
            )}
            {activeAsset.attribution && (
              <span className="font-mono text-[11px] text-slate-400">
                Source: {activeAsset.attribution} ({activeAsset.license})
              </span>
            )}
          </div>
        </div>
      )}
    </>
  );
}
