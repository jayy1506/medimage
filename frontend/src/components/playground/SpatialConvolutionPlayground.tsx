"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Grid, Sparkles, RefreshCw, Layers, Eye, HelpCircle, Info, Sliders } from "lucide-react";
import { MathView, EquationCard } from "@/components/ui/MathView";
import CurtainCompareSlider from "./CurtainCompareSlider";
import LiveHistogramView from "./LiveHistogramView";
import { computeHistogram, HistogramData } from "@/lib/imagingEngine";

interface FilterPreset {
  name: string;
  kernel: number[][];
  divisor: number;
  bias: number;
  clinicalPurpose: string;
  mathMechanism: string;
}

const FILTER_PRESETS: FilterPreset[] = [
  {
    name: "Sobel Horizontal (Gx)",
    kernel: [
      [-1, 0, 1],
      [-2, 0, 2],
      [-1, 0, 1]
    ],
    divisor: 1,
    bias: 128,
    clinicalPurpose: "Cortical Bone & Spine Margin Detection",
    mathMechanism: "Antisymmetric 1st derivative along X-axis combined with orthogonal smoothing (suppresses quantum noise)."
  },
  {
    name: "Sobel Vertical (Gy)",
    kernel: [
      [-1, -2, -1],
      [0, 0, 0],
      [1, 2, 1]
    ],
    divisor: 1,
    bias: 128,
    clinicalPurpose: "Horizontal Rib Arch & Diaphragm Boundary Detection",
    mathMechanism: "Antisymmetric 1st derivative along Y-axis; highlights horizontal air-fluid interfaces."
  },
  {
    name: "Laplacian (2nd Derivative)",
    kernel: [
      [0, 1, 0],
      [1, -4, 1],
      [0, 1, 0]
    ],
    divisor: 1,
    bias: 128,
    clinicalPurpose: "Microcalcification & Zero-Crossing Edge Detection",
    mathMechanism: "Isotropic second-order differential operator: detects sharp transitions regardless of orientation."
  },
  {
    name: "Gaussian Smoothing",
    kernel: [
      [1, 2, 1],
      [2, 4, 2],
      [1, 2, 1]
    ],
    divisor: 16,
    bias: 0,
    clinicalPurpose: "Quantum Mottle & Poisson Noise Suppression",
    mathMechanism: "Normalized 2D Gaussian approximation (Sum = 16/16 = 1.0); blurs high-frequency detector noise."
  },
  {
    name: "Sharpen (High Boost)",
    kernel: [
      [0, -1, 0],
      [-1, 5, -1],
      [0, -1, 0]
    ],
    divisor: 1,
    bias: 0,
    clinicalPurpose: "Bone Trabecular & Fine Hairline Fracture Enhancement",
    mathMechanism: "Subtracts scaled low-frequency components from original pixel to boost high spatial frequencies."
  }
];

export default function SpatialConvolutionPlayground() {
  const origCanvasRef = useRef<HTMLCanvasElement>(null);
  const filteredCanvasRef = useRef<HTMLCanvasElement>(null);

  const [kernel, setKernel] = useState<number[][]>(FILTER_PRESETS[0].kernel);
  const [divisor, setDivisor] = useState<number>(FILTER_PRESETS[0].divisor);
  const [bias, setBias] = useState<number>(FILTER_PRESETS[0].bias);
  const [activePreset, setActivePreset] = useState<string>("Sobel Horizontal (Gx)");
  const [viewMode, setViewMode] = useState<"side" | "curtain">("side");
  const [histogram, setHistogram] = useState<HistogramData | null>(null);

  // Interactive Inspector state
  const [inspectedCoord, setInspectedCoord] = useState<{ x: number; y: number } | null>({ x: 100, y: 100 });

  // Synthetic anatomical phantom base (200x200)
  const baseImageRef = useRef<Uint8Array | null>(null);

  useEffect(() => {
    // Generate synthetic X-ray thorax phantom (ribs, spine, background)
    const size = 200;
    const img = new Uint8Array(size * size);

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const idx = y * size + x;
        // Background lung field
        let v = 40 + Math.sin(x * 0.05) * 5;

        // Central vertebral spine column
        if (Math.abs(x - 100) < 18) {
          v = 180 + ((y % 20 < 4) ? -40 : 20);
        }

        // Horizontal rib arches
        const ribY1 = 40 + Math.sin(x * 0.03) * 15;
        const ribY2 = 80 + Math.sin(x * 0.03) * 15;
        const ribY3 = 120 + Math.sin(x * 0.03) * 15;
        const ribY4 = 160 + Math.sin(x * 0.03) * 15;

        if (Math.abs(y - ribY1) < 7 || Math.abs(y - ribY2) < 7 || Math.abs(y - ribY3) < 7 || Math.abs(y - ribY4) < 7) {
          v += 60;
        }

        // Add small simulated microcalcification nodule at (140, 70)
        const dNodule = Math.hypot(x - 140, y - 70);
        if (dNodule < 4) {
          v = 240;
        }

        img[idx] = Math.max(0, Math.min(255, Math.round(v)));
      }
    }

    baseImageRef.current = img;
    drawOriginal();
    applyConvolution();
  }, []);

  const drawOriginal = useCallback(() => {
    const canvas = origCanvasRef.current;
    const img = baseImageRef.current;
    if (!canvas || !img) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const size = 200;
    const imgData = ctx.createImageData(size, size);
    for (let i = 0; i < img.length; i++) {
      const v = img[i];
      const pIdx = i * 4;
      imgData.data[pIdx] = v;
      imgData.data[pIdx + 1] = v;
      imgData.data[pIdx + 2] = v;
      imgData.data[pIdx + 3] = 255;
    }
    ctx.putImageData(imgData, 0, 0);

    // Highlight inspected 3x3 window if hovering
    if (inspectedCoord) {
      ctx.strokeStyle = "#F59E0B";
      ctx.lineWidth = 1.5;
      ctx.strokeRect(inspectedCoord.x - 1, inspectedCoord.y - 1, 3, 3);
    }
  }, [inspectedCoord]);

  const applyConvolution = useCallback(() => {
    const canvas = filteredCanvasRef.current;
    const img = baseImageRef.current;
    if (!canvas || !img) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const size = 200;
    const imgData = ctx.createImageData(size, size);
    const data = imgData.data;

    const safeDivisor = divisor === 0 ? 1 : divisor;

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        let sum = 0;

        // Convolve 3x3 neighborhood
        for (let ky = -1; ky <= 1; ky++) {
          for (let kx = -1; kx <= 1; kx++) {
            const px = Math.min(size - 1, Math.max(0, x + kx));
            const py = Math.min(size - 1, Math.max(0, y + ky));
            const pixelVal = img[py * size + px];
            const weight = kernel[ky + 1][kx + 1];
            sum += pixelVal * weight;
          }
        }

        const outVal = Math.round(sum / safeDivisor + bias);
        const clamped = Math.max(0, Math.min(255, outVal));

        const pIdx = (y * size + x) * 4;
        data[pIdx] = clamped;
        data[pIdx + 1] = clamped;
        data[pIdx + 2] = clamped;
        data[pIdx + 3] = 255;
      }
    }

    ctx.putImageData(imgData, 0, 0);
    setHistogram(computeHistogram(imgData));

    if (inspectedCoord) {
      ctx.strokeStyle = "#8B5CF6";
      ctx.lineWidth = 2;
      ctx.strokeRect(inspectedCoord.x - 1, inspectedCoord.y - 1, 3, 3);
    }
  }, [kernel, divisor, bias, inspectedCoord]);

  useEffect(() => {
    drawOriginal();
    applyConvolution();
  }, [drawOriginal, applyConvolution]);

  const selectPreset = (p: FilterPreset) => {
    setKernel(p.kernel.map((row) => [...row]));
    setDivisor(p.divisor);
    setBias(p.bias);
    setActivePreset(p.name);
  };

  const handleKernelCellChange = (r: number, c: number, val: number) => {
    const newK = kernel.map((row, ri) =>
      row.map((cell, ci) => (ri === r && ci === c ? val : cell))
    );
    setKernel(newK);
    setActivePreset("Custom");
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = e.currentTarget;
    const rect = canvas.getBoundingClientRect();
    const scaleX = 200 / rect.width;
    const scaleY = 200 / rect.height;

    const x = Math.floor((e.clientX - rect.left) * scaleX);
    const y = Math.floor((e.clientY - rect.top) * scaleY);

    if (x >= 1 && x < 199 && y >= 1 && y < 199) {
      setInspectedCoord({ x, y });
    }
  };

  // Get current 3x3 patch for math demonstration
  const getInspectedPatch = () => {
    if (!inspectedCoord || !baseImageRef.current) return null;
    const size = 200;
    const img = baseImageRef.current;
    const patch: number[][] = [];
    let sum = 0;

    for (let ky = -1; ky <= 1; ky++) {
      const row: number[] = [];
      for (let kx = -1; kx <= 1; kx++) {
        const val = img[(inspectedCoord.y + ky) * size + (inspectedCoord.x + kx)];
        row.push(val);
        sum += val * kernel[ky + 1][kx + 1];
      }
      patch.push(row);
    }

    const safeDiv = divisor === 0 ? 1 : divisor;
    const outputVal = Math.max(0, Math.min(255, Math.round(sum / safeDiv + bias)));

    return { patch, sum, outputVal };
  };

  const currentPatch = getInspectedPatch();
  const currentPresetObj = FILTER_PRESETS.find((p) => p.name === activePreset);

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center space-x-2">
            <Grid className="w-5 h-5 text-adani-purple" />
            <h3 className="text-xl font-black text-slate-900 tracking-tight">
              Spatial 2D Convolution &amp; Kernel Playground
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Slide 3×3 linear and differential convolution kernels across anatomical pixels to perform real-time edge detection, gradient estimation, and noise suppression.
          </p>
        </div>

        {/* Filter Presets */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-bold text-slate-400 mr-1 uppercase">Filters:</span>
          {FILTER_PRESETS.map((p) => (
            <button
              key={p.name}
              onClick={() => selectPreset(p)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activePreset === p.name
                  ? "bg-adani-purple text-white shadow-sm ring-2 ring-adani-purple/30"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      {/* View Mode Selector */}
      <div className="flex items-center justify-between bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
        <span className="text-xs font-bold text-slate-800">Inspection Display Mode:</span>
        <div className="flex rounded-xl bg-slate-100 p-1 space-x-1 text-xs font-bold text-slate-600">
          <button
            onClick={() => setViewMode("side")}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              viewMode === "side"
                ? "bg-white text-adani-purple shadow-sm font-extrabold"
                : "hover:text-slate-900"
            }`}
          >
            Side-by-Side (Pixel Hover)
          </button>
          <button
            onClick={() => setViewMode("curtain")}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              viewMode === "curtain"
                ? "bg-white text-adani-purple shadow-sm font-extrabold"
                : "hover:text-slate-900"
            }`}
          >
            Curtain Compare Slider
          </button>
        </div>
      </div>

      {/* Main Dual Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Canvases: Before & After */}
        <div className="lg:col-span-6 space-y-4">
          {viewMode === "side" ? (
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col items-center">
                <span className="text-xs font-bold text-slate-700 mb-2 flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5 text-slate-500" />
                  Original Scan
                </span>
                <div className="p-2 bg-slate-950 rounded-2xl border border-slate-800 shadow-md">
                  <canvas
                    ref={origCanvasRef}
                    width={200}
                    height={200}
                    onMouseMove={handleCanvasMouseMove}
                    className="rounded-xl w-44 h-44 cursor-crosshair [image-rendering:pixelated]"
                  />
                </div>
                <span className="text-[10px] text-slate-400 mt-1.5">Hover to inspect 3×3 patch</span>
              </div>

              <div className="flex flex-col items-center">
                <span className="text-xs font-bold text-adani-purple mb-2 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-adani-purple" />
                  Filtered Output
                </span>
                <div className="p-2 bg-slate-950 rounded-2xl border border-slate-800 shadow-md">
                  <canvas
                    ref={filteredCanvasRef}
                    width={200}
                    height={200}
                    onMouseMove={handleCanvasMouseMove}
                    className="rounded-xl w-44 h-44 cursor-crosshair [image-rendering:pixelated]"
                  />
                </div>
                <span className="text-[10px] text-slate-400 mt-1.5">Convolved response</span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <CurtainCompareSlider
                beforeCanvasRef={origCanvasRef}
                afterCanvasRef={filteredCanvasRef}
                beforeLabel="Original Scan"
                afterLabel={activePreset}
                width={360}
                height={360}
              />
              {/* Hidden canvases for rendering source */}
              <div className="hidden">
                <canvas ref={origCanvasRef} width={200} height={200} />
                <canvas ref={filteredCanvasRef} width={200} height={200} />
              </div>
            </div>
          )}

          {/* Live Intensity Histogram */}
          <LiveHistogramView histogram={histogram} title="Convolved Intensity Histogram" />

          {/* Interactive Voxel 3x3 Neighborhood Math Inspector */}
          {currentPatch && (
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-2">
              <div className="flex justify-between items-center text-[11px] font-bold text-slate-700 border-b border-slate-200 pb-1.5">
                <span>Inspected 3×3 Neighborhood at ({inspectedCoord?.x}, {inspectedCoord?.y})</span>
                <span className="font-mono text-adani-purple">Output Pixel = {currentPatch.outputVal}</span>
              </div>
              <div className="flex items-center justify-between gap-2 font-mono text-[11px] text-slate-600">
                <div className="bg-white p-2 rounded-lg border border-slate-200 text-center">
                  <span className="text-[9px] uppercase font-sans font-bold text-slate-400 block mb-1">Image Patch</span>
                  {currentPatch.patch.map((r, ri) => (
                    <div key={ri} className="flex gap-1.5 justify-center">
                      {r.map((c, ci) => (
                        <span key={ci} className="w-6 text-center">{c}</span>
                      ))}
                    </div>
                  ))}
                </div>
                <span className="font-bold text-base text-slate-400">×</span>
                <div className="bg-white p-2 rounded-lg border border-slate-200 text-center">
                  <span className="text-[9px] uppercase font-sans font-bold text-slate-400 block mb-1">Kernel Mask</span>
                  {kernel.map((r, ri) => (
                    <div key={ri} className="flex gap-1.5 justify-center font-bold text-adani-purple">
                      {r.map((c, ci) => (
                        <span key={ci} className="w-6 text-center">{c}</span>
                      ))}
                    </div>
                  ))}
                </div>
                <span className="font-bold text-base text-slate-400">=</span>
                <div className="bg-white p-2 rounded-lg border border-slate-200 text-center flex-1">
                  <span className="text-[9px] uppercase font-sans font-bold text-slate-400 block mb-1">Calculation</span>
                  <div className="text-[10px] text-slate-700">
                    Sum: <strong>{currentPatch.sum}</strong>
                  </div>
                  <div className="text-[10px] text-slate-500">
                    ÷ {divisor} + {bias} = <strong className="text-adani-purple">{currentPatch.outputVal}</strong>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Interactive 3x3 Matrix Editor */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                Interactive 3×3 Kernel Matrix
              </span>
              <span className="text-[11px] text-slate-400 font-medium">Click any cell to edit weights</span>
            </div>

            <div className="grid grid-cols-3 gap-2.5 max-w-[240px] mx-auto my-2">
              {kernel.map((row, r) =>
                row.map((cell, c) => (
                  <input
                    key={`${r}-${c}`}
                    type="number"
                    value={cell}
                    onChange={(e) => handleKernelCellChange(r, c, Number(e.target.value))}
                    className="w-16 h-12 text-center text-sm font-mono font-bold bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-adani-purple focus:border-adani-purple shadow-sm text-slate-900"
                  />
                ))
              )}
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Divisor Scale:</label>
                <input
                  type="number"
                  value={divisor}
                  onChange={(e) => setDivisor(Number(e.target.value) || 1)}
                  className="w-full px-3 py-1.5 text-xs font-mono font-bold bg-white border border-slate-300 rounded-lg shadow-sm"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Intensity Bias:</label>
                <input
                  type="number"
                  value={bias}
                  onChange={(e) => setBias(Number(e.target.value))}
                  className="w-full px-3 py-1.5 text-xs font-mono font-bold bg-white border border-slate-300 rounded-lg shadow-sm"
                />
              </div>
            </div>
          </div>

          {/* Clinical Insights Card */}
          {currentPresetObj && (
            <div className="p-4 bg-purple-50/70 border border-purple-200 rounded-2xl text-xs space-y-1.5 text-slate-800">
              <div className="font-bold text-adani-purple flex items-center gap-1.5 text-xs uppercase tracking-wide">
                <Info className="w-4 h-4 text-adani-purple" />
                <span>Clinical Target: {currentPresetObj.clinicalPurpose}</span>
              </div>
              <p className="text-slate-600 leading-relaxed text-[11px]">
                {currentPresetObj.mathMechanism}
              </p>
            </div>
          )}

          {/* Standard Academic Equation Card (White Card, Black Text) */}
          <EquationCard
            formula="g(x,y) = \sum_{s=-1}^{1} \sum_{t=-1}^{1} f(x-s, \, y-t) \, w(s,t)"
            equationNumber="Equation 5.1"
          />
        </div>
      </div>
    </div>
  );
}
