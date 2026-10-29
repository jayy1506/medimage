"use client";

import React, { useState, useEffect, useRef } from "react";
import { Sliders, RefreshCw, Info, Activity } from "lucide-react";

interface Preset {
  name: string;
  wl: number;
  ww: number;
  description: string;
}

const PRESETS: Preset[] = [
  { name: "Brain", wl: 40, ww: 80, description: "Highlights gray/white matter differentiation (WL: 40, WW: 80)" },
  { name: "Bone", wl: 400, ww: 1800, description: "Visualizes fine cortical microfractures and trabeculae (WL: 400, WW: 1800)" },
  { name: "Lung", wl: -600, ww: 1500, description: "Inspects bronchial tree and alveolar parenchyma (WL: -600, WW: 1500)" },
  { name: "Soft Tissue", wl: 50, ww: 350, description: "Differentiates abdominal viscera and musculature (WL: 50, WW: 350)" }
];

export default function WindowLevelPlayground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const graphRef = useRef<HTMLCanvasElement>(null);

  const [wl, setWl] = useState<number>(40);
  const [ww, setWw] = useState<number>(80);
  const [activePreset, setActivePreset] = useState<string>("Brain");

  // Synthetic CT HU Matrix (256x256) cached in memory
  const huDataRef = useRef<Float32Array | null>(null);

  useEffect(() => {
    // Generate synthetic educational CT axial head slice with physical HU values:
    // Background Air = -1000 HU
    // Cranial Skull Bone = +1200 HU
    // Brain Parenchyma = +38 HU
    // Ventricles (CSF) = +12 HU
    // Subdural Hematoma = +85 HU
    const size = 256;
    const hu = new Float32Array(size * size);
    const center = size / 2;

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const dx = x - center;
        const dy = y - center;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const idx = y * size + x;

        if (dist > 115) {
          hu[idx] = -1000; // Air outside patient
        } else if (dist > 100) {
          hu[idx] = 1200; // Dense Cranial Skull Bone
        } else if (dist > 95) {
          hu[idx] = -50; // Subcutaneous Fat layer
        } else {
          // Brain tissue base
          let val = 38 + Math.sin(x * 0.1) * Math.cos(y * 0.1) * 4;

          // Lateral Ventricles (CSF = +12 HU)
          const leftVent = Math.hypot(x - (center - 22), y - (center - 5));
          const rightVent = Math.hypot(x - (center + 22), y - (center - 5));
          if (leftVent < 15 || rightVent < 15) {
            val = 12;
          }

          // Simulated acute hemorrhage lesion (Blood = +85 HU)
          const lesionDist = Math.hypot(x - (center + 45), y - (center + 25));
          if (lesionDist < 14) {
            val = 85;
          }

          hu[idx] = val;
        }
      }
    }
    huDataRef.current = hu;
    renderSlice();
    renderTransferFunction();
  }, []);

  const renderSlice = () => {
    const canvas = canvasRef.current;
    const hu = huDataRef.current;
    if (!canvas || !hu) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const size = 256;
    const imgData = ctx.createImageData(size, size);
    const data = imgData.data;

    const lower = wl - ww / 2;
    const upper = wl + ww / 2;

    for (let i = 0; i < hu.length; i++) {
      const val = hu[i];
      let gray = 0;
      if (val <= lower) {
        gray = 0;
      } else if (val >= upper) {
        gray = 255;
      } else {
        gray = Math.round(((val - lower) / ww) * 255);
      }

      const pIdx = i * 4;
      data[pIdx] = gray;
      data[pIdx + 1] = gray;
      data[pIdx + 2] = gray;
      data[pIdx + 3] = 255;
    }

    ctx.putImageData(imgData, 0, 0);
  };

  const renderTransferFunction = () => {
    const graph = graphRef.current;
    if (!graph) return;
    const ctx = graph.getContext("2d");
    if (!ctx) return;

    const w = graph.width;
    const h = graph.height;
    ctx.clearRect(0, 0, w, h);

    // Coordinate mapping: HU range -1000 to +1500
    const huMin = -1000;
    const huMax = 1500;
    const toX = (val: number) => ((val - huMin) / (huMax - huMin)) * w;
    const toY = (gray: number) => h - (gray / 255) * h;

    // Draw grid
    ctx.strokeStyle = "#E2E8F0";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(toX(0), 0);
    ctx.lineTo(toX(0), h);
    ctx.stroke();

    // Draw Water 0 HU Label
    ctx.fillStyle = "#64748B";
    ctx.font = "10px Inter";
    ctx.fillText("0 HU (Water)", toX(0) + 4, 15);

    // Draw Transfer line
    const lower = wl - ww / 2;
    const upper = wl + ww / 2;

    ctx.strokeStyle = "#0077B6";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(toX(huMin), toY(0));
    ctx.lineTo(toX(Math.max(lower, huMin)), toY(0));
    ctx.lineTo(toX(Math.min(upper, huMax)), toY(255));
    ctx.lineTo(toX(huMax), toY(255));
    ctx.stroke();

    // Mark WL point
    const wlX = toX(wl);
    const wlY = toY(128);
    ctx.fillStyle = "#B82662";
    ctx.beginPath();
    ctx.arc(wlX, wlY, 4, 0, Math.PI * 2);
    ctx.fill();
  };

  useEffect(() => {
    renderSlice();
    renderTransferFunction();
  }, [wl, ww]);

  const applyPreset = (p: Preset) => {
    setWl(p.wl);
    setWw(p.ww);
    setActivePreset(p.name);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <Sliders className="w-5 h-5 text-adani-cyan" />
            <h3 className="text-lg font-black text-slate-900 tracking-tight">
              Interactive CT Window / Level (WW/WL) Playground
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Map 12-bit CT Hounsfield Units (-1000 to +3000 HU) to 8-bit monitor display (0–255 grayscale).
          </p>
        </div>

        {/* Presets */}
        <div className="flex flex-wrap gap-1.5">
          {PRESETS.map((p) => (
            <button
              key={p.name}
              onClick={() => applyPreset(p)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activePreset === p.name
                  ? "bg-adani-cyan text-white shadow-sm"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Canvas Display */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="relative p-2 bg-slate-950 rounded-2xl shadow-inner border border-slate-800">
            <canvas
              ref={canvasRef}
              width={256}
              height={256}
              className="rounded-xl w-64 h-64 [image-rendering:pixelated]"
            />
            <div className="absolute bottom-4 left-4 text-[10px] font-mono text-emerald-400 bg-slate-900/80 px-2 py-0.5 rounded border border-slate-700">
              WL: {wl} | WW: {ww}
            </div>
          </div>
          <span className="text-[11px] text-slate-400 mt-2">Synthetic Head CT Slice (256x256 Matrix)</span>
        </div>

        {/* Controls & Transfer Curve */}
        <div className="lg:col-span-7 space-y-6">
          {/* Transfer Function Visualization */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-800">Intensity Transfer Function Curve</span>
              <span className="text-[10px] font-mono text-adani-purple font-semibold">
                Window: [{wl - ww / 2} to {wl + ww / 2} HU]
              </span>
            </div>
            <canvas ref={graphRef} width={380} height={100} className="w-full h-24" />
          </div>

          {/* Sliders */}
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-slate-700">Window Level (WL / Center):</span>
                <span className="font-mono text-adani-cyan">{wl} HU</span>
              </div>
              <input
                type="range"
                min={-1000}
                max={1000}
                value={wl}
                onChange={(e) => {
                  setWl(Number(e.target.value));
                  setActivePreset("Custom");
                }}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-adani-cyan"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
                <span>-1000 HU (Air)</span>
                <span>0 HU (Water)</span>
                <span>+1000 HU (Bone)</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-slate-700">Window Width (WW / Dynamic Range):</span>
                <span className="font-mono text-adani-purple">{ww} HU</span>
              </div>
              <input
                type="range"
                min={1}
                max={2500}
                value={ww}
                onChange={(e) => {
                  setWw(Number(e.target.value));
                  setActivePreset("Custom");
                }}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-adani-purple"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
                <span>Narrow (High Contrast, 1 HU)</span>
                <span>Wide (Broad Tissue Span, 2500 HU)</span>
              </div>
            </div>
          </div>

          <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 flex items-start space-x-2">
            <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Clinical Takeaway: </span>
              Notice how the acute hematoma (+85 HU) and lateral ventricles (+12 HU) disappear in Bone windowing, but stand out distinctly with Brain windowing (WL: 40, WW: 80).
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
