"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Sliders, Info, Eye, Crosshair, Sparkles, BookOpen, Move } from "lucide-react";

interface Preset {
  name: string;
  wl: number;
  ww: number;
  description: string;
  targetClinical: string;
}

const PRESETS: Preset[] = [
  { 
    name: "Brain", 
    wl: 40, 
    ww: 80, 
    description: "Narrow 80 HU span centered at 40 HU to differentiate gray matter (40 HU) from white matter (30 HU) and acute blood (85 HU).",
    targetClinical: "Acute Stroke & Hemorrhage" 
  },
  { 
    name: "Bone", 
    wl: 400, 
    ww: 1800, 
    description: "Wide 1800 HU dynamic range centered at 400 HU to resolve trabecular bone patterns and microfractures without brightness saturation.",
    targetClinical: "Skull & Spine Fractures" 
  },
  { 
    name: "Lung", 
    wl: -600, 
    ww: 1500, 
    description: "Centered deep in negative HUs (-600 HU) with 1500 HU width to examine aerated pulmonary alveoli and delicate bronchial margins.",
    targetClinical: "Emphysema & Pneumothorax" 
  },
  { 
    name: "Soft Tissue", 
    wl: 50, 
    ww: 350, 
    description: "Standard visceral window (WL: 50, WW: 350) for delineating liver, kidneys, spleen, and mesenteric lymphadenopathy.",
    targetClinical: "Abdominal Viscera & Muscle" 
  }
];

export default function WindowLevelPlayground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const graphRef = useRef<HTMLCanvasElement>(null);

  const [wl, setWl] = useState<number>(40);
  const [ww, setWw] = useState<number>(80);
  const [activePreset, setActivePreset] = useState<string>("Brain");

  // Mouse drag PACS interaction
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragStartRef = useRef<{ x: number; y: number; startWl: number; startWw: number } | null>(null);

  // Mouse hover HUD inspection
  const [hoverInfo, setHoverInfo] = useState<{
    x: number;
    y: number;
    hu: number;
    gray: number;
    tissue: string;
  } | null>(null);

  // Synthetic CT HU Matrix (256x256) cached in memory
  const huDataRef = useRef<Float32Array | null>(null);

  useEffect(() => {
    // Generate synthetic high-yield clinical head CT slice:
    // Air = -1000 HU
    // Cranial Skull Bone = +1200 HU
    // Subcutaneous Fat = -60 HU
    // Brain Parenchyma = +38 HU
    // Lateral Ventricles (CSF) = +12 HU
    // Acute Hematoma (Hyperdense Bleed) = +85 HU
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
          hu[idx] = -1000; // External ambient air
        } else if (dist > 100) {
          hu[idx] = 1200; // Dense cranial cortical skull bone
        } else if (dist > 95) {
          hu[idx] = -60; // Subcutaneous fat
        } else {
          // Brain tissue parenchyma
          let val = 38 + Math.sin(x * 0.1) * Math.cos(y * 0.1) * 3;

          // Lateral Ventricles (CSF = +12 HU)
          const leftVent = Math.hypot(x - (center - 22), y - (center - 5));
          const rightVent = Math.hypot(x - (center + 22), y - (center - 5));
          if (leftVent < 16 || rightVent < 16) {
            val = 12;
          }

          // Simulated acute subdural hematoma (Blood = +85 HU)
          const lesionDist = Math.hypot(x - (center + 45), y - (center + 25));
          if (lesionDist < 15) {
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

  const renderSlice = useCallback(() => {
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

    // If hover crosshair active, draw subtle crosshair
    if (hoverInfo) {
      ctx.strokeStyle = "rgba(0, 220, 255, 0.7)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(hoverInfo.x, hoverInfo.y, 6, 0, Math.PI * 2);
      ctx.stroke();
    }
  }, [wl, ww, hoverInfo]);

  const renderTransferFunction = useCallback(() => {
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

    // Draw background grid lines
    ctx.strokeStyle = "#F1F5F9";
    ctx.lineWidth = 1;
    [-1000, -500, 0, 500, 1000].forEach((gridVal) => {
      ctx.beginPath();
      ctx.moveTo(toX(gridVal), 0);
      ctx.lineTo(toX(gridVal), h);
      ctx.stroke();
    });

    // Reference lines for Water (0 HU) and Bone (+1000 HU)
    ctx.strokeStyle = "#CBD5E1";
    ctx.beginPath();
    ctx.moveTo(toX(0), 0);
    ctx.lineTo(toX(0), h);
    ctx.stroke();

    ctx.fillStyle = "#64748B";
    ctx.font = "bold 9px Inter, sans-serif";
    ctx.fillText("Water (0 HU)", toX(0) + 4, 12);

    // Draw Window Transfer Function line
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

    // Mark Center Point (WL)
    const wlX = toX(wl);
    const wlY = toY(128);
    ctx.fillStyle = "#B82662";
    ctx.beginPath();
    ctx.arc(wlX, wlY, 4, 0, Math.PI * 2);
    ctx.fill();

    // Mark current inspected voxel if available
    if (hoverInfo) {
      const hX = toX(hoverInfo.hu);
      const hY = toY(hoverInfo.gray);
      ctx.fillStyle = "#10B981";
      ctx.beginPath();
      ctx.arc(hX, hY, 5, 0, Math.PI * 2);
      ctx.fill();
    }
  }, [wl, ww, hoverInfo]);

  useEffect(() => {
    renderSlice();
    renderTransferFunction();
  }, [renderSlice, renderTransferFunction]);

  const applyPreset = (p: Preset) => {
    setWl(p.wl);
    setWw(p.ww);
    setActivePreset(p.name);
  };

  // Classify tissue by physical Hounsfield value
  const classifyTissue = (hu: number): string => {
    if (hu > 800) return "Dense Cranial Cortical Bone (+1200 HU)";
    if (hu >= 70 && hu <= 100) return "Acute Subdural Hematoma (Hyperdense Blood, +85 HU)";
    if (hu >= 25 && hu <= 55) return "Brain Parenchyma (Gray/White Matter, +38 HU)";
    if (hu >= 5 && hu <= 20) return "Lateral Ventricle (Cerebrospinal Fluid CSF, +12 HU)";
    if (hu <= -30 && hu >= -150) return "Subcutaneous Fat (-60 HU)";
    if (hu <= -800) return "External Ambient Air (-1000 HU)";
    return `Intermediate Attenuation (${Math.round(hu)} HU)`;
  };

  // Mouse down: begin PACS interactive drag
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      startWl: wl,
      startWw: ww,
    };
  };

  // Mouse move: update PACS windowing or HUD hover stats
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const hu = huDataRef.current;
    if (!canvas || !hu) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const pixelX = Math.floor((e.clientX - rect.left) * scaleX);
    const pixelY = Math.floor((e.clientY - rect.top) * scaleY);

    if (pixelX >= 0 && pixelX < 256 && pixelY >= 0 && pixelY < 256) {
      const val = hu[pixelY * 256 + pixelX];
      const lower = wl - ww / 2;
      const upper = wl + ww / 2;
      let gray = 0;
      if (val <= lower) gray = 0;
      else if (val >= upper) gray = 255;
      else gray = Math.round(((val - lower) / ww) * 255);

      setHoverInfo({
        x: pixelX,
        y: pixelY,
        hu: Math.round(val),
        gray,
        tissue: classifyTissue(val),
      });
    }

    // PACS dragging: Horizontal drag changes Width (WW), Vertical drag changes Level (WL)
    if (isDragging && dragStartRef.current) {
      const deltaX = e.clientX - dragStartRef.current.x;
      const deltaY = e.clientY - dragStartRef.current.y;

      const newWw = Math.max(1, Math.min(2500, Math.round(dragStartRef.current.startWw + deltaX * 3)));
      const newWl = Math.max(-1000, Math.min(1000, Math.round(dragStartRef.current.startWl - deltaY * 2)));

      setWw(newWw);
      setWl(newWl);
      setActivePreset("Custom");
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    dragStartRef.current = null;
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
    dragStartRef.current = null;
    setHoverInfo(null);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center space-x-2">
            <Sliders className="w-5 h-5 text-adani-cyan" />
            <h3 className="text-xl font-black text-slate-900 tracking-tight">
              Interactive CT Window / Level (WW/WL) Playground
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Clinical CT scanners acquire 12-bit physical Hounsfield Units (-1000 to +3000 HU). 
            Standard monitors display only 8-bit grayscale (0–255). Windowing maps the selected clinical attenuation span into visible grayscale.
          </p>
        </div>

        {/* Clinical Presets */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-bold text-slate-400 mr-1 uppercase">Presets:</span>
          {PRESETS.map((p) => (
            <button
              key={p.name}
              onClick={() => applyPreset(p)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activePreset === p.name
                  ? "bg-adani-cyan text-white shadow-sm ring-2 ring-adani-cyan/30"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Interactive CT Canvas with PACS Mouse Dragging */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="relative p-2 bg-slate-950 rounded-2xl shadow-xl border border-slate-800 group select-none">
            <canvas
              ref={canvasRef}
              width={256}
              height={256}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseLeave}
              className="rounded-xl w-72 h-72 [image-rendering:pixelated] cursor-crosshair"
            />

            {/* In-Canvas Clinical HUD */}
            <div className="absolute top-4 left-4 text-[10px] font-mono text-emerald-400 bg-slate-900/90 backdrop-blur px-2.5 py-1 rounded-md border border-slate-700 shadow-md">
              <span className="text-slate-400">WL:</span> {wl} HU <span className="text-slate-600">|</span> <span className="text-slate-400">WW:</span> {ww} HU
            </div>

            {/* PACS Drag Tooltip */}
            <div className="absolute bottom-4 right-4 text-[9px] font-bold text-slate-300 bg-slate-900/80 px-2 py-0.5 rounded border border-slate-700 flex items-center gap-1">
              <Move className="w-3 h-3 text-adani-cyan" />
              <span>Click &amp; Drag PACS Window</span>
            </div>
          </div>

          <span className="text-[11px] font-medium text-slate-500 mt-2">
            Synthetic Axial Head CT Phantom (256x256 Matrix)
          </span>

          {/* Real-time Tissue Density HUD */}
          <div className="w-full mt-4 p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1 text-xs">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-700 border-b border-slate-200 pb-1">
              <span className="flex items-center gap-1.5">
                <Crosshair className="w-3.5 h-3.5 text-adani-cyan" />
                Live Voxel Inspector:
              </span>
              <span className="font-mono text-slate-500">
                {hoverInfo ? `X: ${hoverInfo.x}, Y: ${hoverInfo.y}` : "Hover over slice"}
              </span>
            </div>

            {hoverInfo ? (
              <div className="space-y-1 pt-1">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Tissue Classification:</span>
                  <span className="font-bold text-slate-900">{hoverInfo.tissue}</span>
                </div>
                <div className="flex justify-between items-center font-mono">
                  <span className="text-slate-500 font-sans">Physical Attenuation:</span>
                  <span className="font-bold text-adani-cyan">{hoverInfo.hu} HU</span>
                </div>
                <div className="flex justify-between items-center font-mono">
                  <span className="text-slate-500 font-sans">8-Bit Monitor Brightness:</span>
                  <span className="font-bold text-adani-purple">{hoverInfo.gray} / 255</span>
                </div>
              </div>
            ) : (
              <p className="text-slate-400 text-[11px] py-1 text-center italic">
                Move cursor over brain, bone, or hemorrhage to inspect Hounsfield values.
              </p>
            )}
          </div>
        </div>

        {/* Right: Transfer Function Graph & Interactive Controls */}
        <div className="lg:col-span-7 space-y-6">
          {/* Transfer Function Visualization */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 shadow-inner">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-adani-cyan" />
                Intensity Transfer Function Curve (Ramp)
              </span>
              <span className="text-[11px] font-mono text-adani-purple font-bold">
                Window Span: [{wl - ww / 2} to {wl + ww / 2} HU]
              </span>
            </div>
            <canvas ref={graphRef} width={400} height={100} className="w-full h-24 bg-white rounded-lg border border-slate-200" />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1 px-1">
              <span>-1000 HU (Pure Air)</span>
              <span>0 HU (Pure Water)</span>
              <span>+1000 HU (Dense Cortical Bone)</span>
            </div>
          </div>

          {/* Sliders */}
          <div className="space-y-5">
            {/* Window Level (Center) */}
            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-slate-700">Window Level (WL / Center):</span>
                <span className="font-mono text-adani-cyan bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                  {wl} HU
                </span>
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

            {/* Window Width (Contrast Span) */}
            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-slate-700">Window Width (WW / Dynamic Contrast Range):</span>
                <span className="font-mono text-adani-purple bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                  {ww} HU
                </span>
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
                <span>Narrow (1 HU, Maximum Contrast)</span>
                <span>Wide (2500 HU, Broad Tissue Overview)</span>
              </div>
            </div>
          </div>

          {/* Clinical Case Study Insight */}
          <div className="p-4 bg-sky-50/70 border border-sky-200 rounded-2xl text-xs text-slate-800 space-y-2">
            <div className="flex items-center space-x-2 font-bold text-adani-navy text-xs uppercase tracking-wide">
              <Sparkles className="w-4 h-4 text-adani-cyan" />
              <span>Radiological Diagnostic Takeaway</span>
            </div>
            <p className="leading-relaxed text-slate-700">
              Notice how the <strong>acute subdural hematoma (+85 HU)</strong> and <strong>lateral ventricles (+12 HU)</strong> completely vanish into uniform white or gray when viewing in <em>Bone windowing (WL: 400, WW: 1800)</em>. Switching to <em>Brain windowing (WL: 40, WW: 80)</em> immediately expands the narrow 80 HU range across all 256 gray shades, rendering the acute hematoma starkly hyperdense (bright white) against the brain parenchyma.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
