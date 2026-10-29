"use client";

import React, { useState, useEffect, useRef } from "react";
import { Grid, Sliders, RefreshCw, Layers } from "lucide-react";

interface FilterPreset {
  name: string;
  kernel: number[][];
  divisor: number;
  bias: number;
  description: string;
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
    description: "Detects vertical structural edges and bone margins."
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
    description: "Detects horizontal anatomical boundaries."
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
    description: "Isotropic edge detector sensitive to fine detail and zero-crossings."
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
    description: "Attenuates high-frequency quantum mottle noise."
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
    description: "Enhances fine trabecular and microvascular boundaries."
  }
];

export default function SpatialConvolutionPlayground() {
  const origCanvasRef = useRef<HTMLCanvasElement>(null);
  const filteredCanvasRef = useRef<HTMLCanvasElement>(null);

  const [kernel, setKernel] = useState<number[][]>(FILTER_PRESETS[0].kernel);
  const [divisor, setDivisor] = useState<number>(FILTER_PRESETS[0].divisor);
  const [bias, setBias] = useState<number>(FILTER_PRESETS[0].bias);
  const [activePreset, setActivePreset] = useState<string>("Sobel Horizontal (Gx)");

  // Synthetic anatomical phantom base (200x200)
  const baseImageRef = useRef<Uint8Array | null>(null);

  useEffect(() => {
    // Generate synthetic X-ray phantom (ribs, spine, background)
    const size = 200;
    const img = new Uint8Array(size * size);

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const idx = y * size + x;
        // Background lung field
        let v = 40 + Math.sin(x * 0.05) * 5;

        // Central spine column
        if (Math.abs(x - 100) < 18) {
          v = 180 + ((y % 20 < 4) ? -40 : 20);
        }

        // Horizontal rib arches
        const ribY = (y + Math.sin(x * 0.03) * 15) % 35;
        if (ribY > 10 && ribY < 24) {
          v = Math.max(v, 140 + Math.cos(x * 0.05) * 20);
        }

        img[idx] = Math.min(255, Math.max(0, Math.round(v)));
      }
    }
    baseImageRef.current = img;

    // Draw original canvas
    const origCanvas = origCanvasRef.current;
    if (origCanvas) {
      const ctx = origCanvas.getContext("2d");
      if (ctx) {
        const imgData = ctx.createImageData(size, size);
        for (let i = 0; i < img.length; i++) {
          const val = img[i];
          const p = i * 4;
          imgData.data[p] = val;
          imgData.data[p + 1] = val;
          imgData.data[p + 2] = val;
          imgData.data[p + 3] = 255;
        }
        ctx.putImageData(imgData, 0, 0);
      }
    }

    applyConvolution();
  }, []);

  const applyConvolution = () => {
    const filtCanvas = filteredCanvasRef.current;
    const src = baseImageRef.current;
    if (!filtCanvas || !src) return;

    const ctx = filtCanvas.getContext("2d");
    if (!ctx) return;

    const size = 200;
    const output = ctx.createImageData(size, size);
    const outData = output.data;

    const div = divisor === 0 ? 1 : divisor;

    for (let y = 1; y < size - 1; y++) {
      for (let x = 1; x < size - 1; x++) {
        let sum = 0;
        for (let ky = -1; ky <= 1; ky++) {
          for (let kx = -1; kx <= 1; kx++) {
            const pixel = src[(y + ky) * size + (x + kx)];
            const weight = kernel[ky + 1][kx + 1];
            sum += pixel * weight;
          }
        }
        const val = Math.min(255, Math.max(0, Math.round(sum / div + bias)));
        const p = (y * size + x) * 4;
        outData[p] = val;
        outData[p + 1] = val;
        outData[p + 2] = val;
        outData[p + 3] = 255;
      }
    }
    ctx.putImageData(output, 0, 0);
  };

  useEffect(() => {
    applyConvolution();
  }, [kernel, divisor, bias]);

  const selectPreset = (p: FilterPreset) => {
    setKernel(p.kernel);
    setDivisor(p.divisor);
    setBias(p.bias);
    setActivePreset(p.name);
  };

  const handleKernelCellChange = (r: number, c: number, val: number) => {
    const next = kernel.map((row, ri) =>
      row.map((cell, ci) => (ri === r && ci === c ? val : cell))
    );
    setKernel(next);
    setActivePreset("Custom");
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <Grid className="w-5 h-5 text-adani-purple" />
            <h3 className="text-lg font-black text-slate-900 tracking-tight">
              Spatial 2D Convolution &amp; Kernel Playground
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Slide $3 \times 3$ linear and differential convolution kernels across anatomical pixels.
          </p>
        </div>

        {/* Presets */}
        <div className="flex flex-wrap gap-1.5">
          {FILTER_PRESETS.map((p) => (
            <button
              key={p.name}
              onClick={() => selectPreset(p)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activePreset === p.name
                  ? "bg-adani-purple text-white shadow-sm"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Canvases: Before & After */}
        <div className="lg:col-span-6 grid grid-cols-2 gap-4">
          <div className="flex flex-col items-center">
            <span className="text-xs font-bold text-slate-700 mb-2">Original Scan</span>
            <div className="p-2 bg-slate-950 rounded-2xl border border-slate-800">
              <canvas ref={origCanvasRef} width={200} height={200} className="rounded-xl w-40 h-40" />
            </div>
          </div>

          <div className="flex flex-col items-center">
            <span className="text-xs font-bold text-adani-purple mb-2">Filtered Output</span>
            <div className="p-2 bg-slate-950 rounded-2xl border border-slate-800">
              <canvas ref={filteredCanvasRef} width={200} height={200} className="rounded-xl w-40 h-40" />
            </div>
          </div>
        </div>

        {/* Interactive 3x3 Matrix Editor */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-800">Interactive 3x3 Kernel Matrix</span>
              <span className="text-[10px] text-slate-400">Edit weights to experiment</span>
            </div>

            <div className="grid grid-cols-3 gap-2 max-w-[220px] mx-auto">
              {kernel.map((row, r) =>
                row.map((cell, c) => (
                  <input
                    key={`${r}-${c}`}
                    type="number"
                    value={cell}
                    onChange={(e) => handleKernelCellChange(r, c, Number(e.target.value))}
                    className="w-14 h-12 text-center text-sm font-mono font-bold bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-adani-purple focus:border-adani-purple shadow-sm"
                  />
                ))
              )}
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-600 font-bold mb-1">Divisor Scale:</label>
                <input
                  type="number"
                  value={divisor}
                  onChange={(e) => setDivisor(Number(e.target.value) || 1)}
                  className="w-full px-2.5 py-1.5 text-xs font-mono bg-white border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-bold mb-1">Intensity Bias:</label>
                <input
                  type="number"
                  value={bias}
                  onChange={(e) => setBias(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 text-xs font-mono bg-white border border-slate-300 rounded-lg"
                />
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed italic">
            {"Convolution formula: $g(x, y) = \\sum_{s=-1}^{1} \\sum_{t=-1}^{1} f(x-s, y-t) \\, w(s, t)$."}
          </p>
        </div>
      </div>
    </div>
  );
}
