"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { 
  Scissors, 
  Layers, 
  RotateCcw, 
  Target, 
  Sliders, 
  Info, 
  CheckCircle2, 
  Crosshair,
  BarChart2,
  Sparkles
} from "lucide-react";

export default function SegmentationPlayground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const histCanvasRef = useRef<HTMLCanvasElement>(null);

  const [mode, setMode] = useState<"otsu" | "region_growing">("otsu");
  const [threshold, setThreshold] = useState<number>(128);
  const [optimalOtsu, setOptimalOtsu] = useState<number>(128);
  const [tolerance, setTolerance] = useState<number>(25);
  const [connectivity, setConnectivity] = useState<4 | 8>(4);
  const [seedPoint, setSeedPoint] = useState<{ x: number; y: number } | null>({ x: 95, y: 95 });
  const [segmentedCount, setSegmentedCount] = useState<number>(0);

  // Synthetic bimodal CT brain phantom with hyperdense lesion (200x200)
  const baseImgRef = useRef<Uint8Array | null>(null);

  useEffect(() => {
    const size = 200;
    const img = new Uint8Array(size * size);
    const hist = new Uint32Array(256);

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const idx = y * size + x;
        const dx = x - 100;
        const dy = y - 100;
        const dist = Math.sqrt(dx * dx + dy * dy);

        let val = 20; // Background air/cranial table

        if (dist < 85) {
          // Brain parenchyma background (Gaussian around 85)
          const noise = (Math.sin(x * 0.4) + Math.cos(y * 0.4)) * 6;
          val = Math.max(0, Math.min(255, Math.round(85 + noise)));

          // Ventricular CSF spaces (hypodense ~35)
          if ((Math.abs(dx) < 14 && Math.abs(dy) < 35) || (Math.abs(dx) < 26 && dy > 5 && dy < 35)) {
            val = 35 + Math.round(Math.random() * 5);
          }

          // Acute intracranial hemorrhage / tumor lesion (hyperdense ~180-210) centered at (95, 95)
          const ldx = x - 95;
          const ldy = y - 95;
          const ldist = Math.sqrt(ldx * ldx + ldy * ldy);
          if (ldist < 24) {
            const falloff = 1 - (ldist / 24);
            val = Math.round(185 + falloff * 25 + (Math.random() * 8 - 4));
          }
        }

        // Dense skull bone ring (dist between 85 and 92, val ~240)
        if (dist >= 85 && dist <= 92) {
          val = 240 + Math.round(Math.random() * 10);
        }

        img[idx] = val;
        hist[val]++;
      }
    }

    baseImgRef.current = img;

    // Calculate Optimal Otsu Threshold via Maximum Between-Class Variance sigma_B^2
    const totalPixels = size * size;
    let sumTotal = 0;
    for (let i = 0; i < 256; i++) sumTotal += i * hist[i];

    let sumB = 0;
    let wB = 0;
    let maxVariance = 0;
    let bestT = 128;

    for (let t = 0; t < 256; t++) {
      wB += hist[t];
      if (wB === 0) continue;
      const wF = totalPixels - wB;
      if (wF === 0) break;

      sumB += t * hist[t];
      const mB = sumB / wB;
      const mF = (sumTotal - sumB) / wF;

      const betweenVariance = wB * wF * Math.pow(mB - mF, 2);
      if (betweenVariance > maxVariance) {
        maxVariance = betweenVariance;
        bestT = t;
      }
    }

    setOptimalOtsu(bestT);
    setThreshold(bestT);
  }, []);

  // Render Segmentation Canvas
  useEffect(() => {
    if (!baseImgRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const size = 200;
    const imgData = ctx.createImageData(size, size);
    const data = imgData.data;
    const raw = baseImgRef.current;

    let count = 0;

    if (mode === "otsu") {
      // Global thresholding mask
      for (let i = 0; i < size * size; i++) {
        const val = raw[i];
        const pIdx = i * 4;

        if (val >= threshold) {
          // Highlight segmented tissue in cyan/gold
          data[pIdx] = 0;       // R
          data[pIdx + 1] = 210; // G
          data[pIdx + 2] = 255; // B
          data[pIdx + 3] = 255;
          count++;
        } else {
          // Grayscale anatomy
          data[pIdx] = val;
          data[pIdx + 1] = val;
          data[pIdx + 2] = val;
          data[pIdx + 3] = 255;
        }
      }
    } else {
      // Seeded Region Growing
      const visited = new Uint8Array(size * size);
      const queue: number[] = [];

      if (seedPoint) {
        const seedIdx = seedPoint.y * size + seedPoint.x;
        const seedIntensity = raw[seedIdx];
        queue.push(seedIdx);
        visited[seedIdx] = 1;

        const neighbors = connectivity === 4 
          ? [[0, -1], [0, 1], [-1, 0], [1, 0]]
          : [[0, -1], [0, 1], [-1, 0], [1, 0], [-1, -1], [1, -1], [-1, 1], [1, 1]];

        while (queue.length > 0) {
          const curr = queue.shift()!;
          count++;
          const cx = curr % size;
          const cy = Math.floor(curr / size);

          for (const [dx, dy] of neighbors) {
            const nx = cx + dx;
            const ny = cy + dy;
            if (nx >= 0 && nx < size && ny >= 0 && ny < size) {
              const nIdx = ny * size + nx;
              if (!visited[nIdx]) {
                const diff = Math.abs(raw[nIdx] - seedIntensity);
                if (diff <= tolerance) {
                  visited[nIdx] = 1;
                  queue.push(nIdx);
                }
              }
            }
          }
        }
      }

      for (let i = 0; i < size * size; i++) {
        const val = raw[i];
        const pIdx = i * 4;

        if (visited[i]) {
          // Highlight region in emerald green
          data[pIdx] = 16;      // R
          data[pIdx + 1] = 185; // G
          data[pIdx + 2] = 129; // B
          data[pIdx + 3] = 255;
        } else {
          data[pIdx] = val;
          data[pIdx + 1] = val;
          data[pIdx + 2] = val;
          data[pIdx + 3] = 255;
        }
      }
    }

    ctx.putImageData(imgData, 0, 0);
    setSegmentedCount(count);

    // Render Histogram on Hist Canvas
    if (histCanvasRef.current) {
      const hCanvas = histCanvasRef.current;
      const hCtx = hCanvas.getContext("2d");
      if (hCtx) {
        const w = hCanvas.width;
        const h = hCanvas.height;
        hCtx.clearRect(0, 0, w, h);

        // Count bins
        const bins = new Uint32Array(256);
        for (let i = 0; i < size * size; i++) bins[raw[i]]++;
        const maxBin = Math.max(...Array.from(bins));

        // Draw histogram bars
        for (let b = 0; b < 256; b++) {
          const barH = (bins[b] / maxBin) * (h - 20);
          const x = (b / 256) * w;
          const barW = w / 256;

          hCtx.fillStyle = b >= threshold ? "#00B4D8" : "#94A3B8";
          hCtx.fillRect(x, h - barH, Math.max(1, barW), barH);
        }

        // Draw threshold marker
        const threshX = (threshold / 256) * w;
        hCtx.strokeStyle = "#EF4444";
        hCtx.lineWidth = 2;
        hCtx.beginPath();
        hCtx.moveTo(threshX, 0);
        hCtx.lineTo(threshX, h);
        hCtx.stroke();
      }
    }
  }, [mode, threshold, tolerance, connectivity, seedPoint]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (mode !== "region_growing" || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = 200 / rect.width;
    const scaleY = 200 / rect.height;
    const clickX = Math.floor((e.clientX - rect.left) * scaleX);
    const clickY = Math.floor((e.clientY - rect.top) * scaleY);
    setSeedPoint({ x: clickX, y: clickY });
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 sm:p-8 space-y-6">
      {/* Simulation Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-adani-cyan/10 text-adani-cyan text-[10px] font-bold uppercase tracking-wider">
              CO3 • Clinical Segmentation Lab
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs text-slate-500 font-medium">Module 5 Theory</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Otsu Thresholding &amp; Seeded Region Growing
          </h2>
          <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
            Delineate intracranial pathology through automated histogram variance maximization (Otsu method) or interactive spatial neighborhood connectivity (Region Growing).
          </p>
        </div>

        {/* Mode Selector */}
        <div className="flex rounded-xl bg-slate-100 p-1 space-x-1 text-xs font-bold self-start md:self-center">
          <button
            onClick={() => setMode("otsu")}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              mode === "otsu" ? "bg-white text-adani-navy shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Otsu Global Threshold
          </button>
          <button
            onClick={() => setMode("region_growing")}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              mode === "region_growing" ? "bg-white text-adani-navy shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Seeded Region Growing
          </button>
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Viewport Stage (col-span-6) */}
        <div className="lg:col-span-6 space-y-3">
          <div className="bg-slate-900 rounded-2xl p-4 flex flex-col items-center justify-center border border-slate-800 relative">
            <canvas
              ref={canvasRef}
              width={200}
              height={200}
              onClick={handleCanvasClick}
              className={`w-full max-w-[320px] aspect-square rounded-xl object-contain ${
                mode === "region_growing" ? "cursor-crosshair" : "cursor-default"
              }`}
            />

            {mode === "region_growing" && seedPoint && (
              <div className="absolute top-6 left-6 px-2.5 py-1 rounded-md bg-black/80 backdrop-blur text-[10px] text-emerald-400 font-mono border border-emerald-500/40">
                Seed: ({seedPoint.x}, {seedPoint.y})
              </div>
            )}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span>Delineated Voxels: <strong className="text-slate-900">{segmentedCount.toLocaleString()}</strong> ({((segmentedCount / 40000) * 100).toFixed(1)}%)</span>
            {mode === "region_growing" && (
              <span className="text-emerald-600 font-semibold flex items-center gap-1">
                <Target className="w-3.5 h-3.5" /> Tap lesion to re-plant seed
              </span>
            )}
          </div>
        </div>

        {/* Right: Controls & Analytical Graphs (col-span-6) */}
        <div className="lg:col-span-6 space-y-6">
          {mode === "otsu" ? (
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-800">Global Threshold Cutoff (T):</label>
                  <span className="text-xs font-mono font-bold text-adani-cyan px-2 py-0.5 rounded bg-sky-50 border border-sky-200">
                    {threshold} / 255
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={255}
                  value={threshold}
                  onChange={(e) => setThreshold(Number(e.target.value))}
                  className="w-full accent-adani-cyan cursor-pointer"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">Optimal Otsu Threshold:</span>
                  <span className="text-[11px] text-slate-500">Maximizes between-class variance $\sigma_B^2$</span>
                </div>
                <button
                  onClick={() => setThreshold(optimalOtsu)}
                  className="px-3 py-1 rounded-lg bg-adani-cyan text-white text-xs font-bold hover:bg-sky-600 shadow-sm transition-all"
                >
                  Snap to {optimalOtsu}
                </button>
              </div>

              {/* Histogram View */}
              <div>
                <span className="text-xs font-bold text-slate-700 block mb-1 flex items-center gap-1">
                  <BarChart2 className="w-3.5 h-3.5 text-slate-500" /> Gray-Level Frequency Distribution &amp; Cutoff:
                </span>
                <canvas
                  ref={histCanvasRef}
                  width={300}
                  height={80}
                  className="w-full h-20 bg-slate-100 rounded-xl border border-slate-200"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-800">Intensity Tolerance Range (ΔI):</label>
                  <span className="text-xs font-mono font-bold text-emerald-600 px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200">
                    ± {tolerance} Grayscale Units
                  </span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={80}
                  value={tolerance}
                  onChange={(e) => setTolerance(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Higher tolerance expands into surrounding tissue; lower tolerance constrains strictly to core lesion.
                </span>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1.5">Spatial Neighborhood Connectivity:</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setConnectivity(4)}
                    className={`p-3 rounded-xl border text-xs font-bold transition-all text-left ${
                      connectivity === 4
                        ? "bg-emerald-50 border-emerald-300 text-emerald-900 shadow-xs"
                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    4-Connected Neighbors
                    <span className="block text-[10px] text-slate-500 font-normal mt-0.5">Horizontal &amp; vertical adjacent voxels only</span>
                  </button>

                  <button
                    onClick={() => setConnectivity(8)}
                    className={`p-3 rounded-xl border text-xs font-bold transition-all text-left ${
                      connectivity === 8
                        ? "bg-emerald-50 border-emerald-300 text-emerald-900 shadow-xs"
                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    8-Connected Neighbors
                    <span className="block text-[10px] text-slate-500 font-normal mt-0.5">Includes diagonal corner connections</span>
                  </button>
                </div>
              </div>

              <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-200 text-xs text-emerald-900 leading-relaxed">
                <strong className="block mb-0.5 font-bold">Interactive Instructions:</strong>
                Click anywhere on the phantom above to plant a new seed coordinate. The algorithm evaluates recursive neighbor similarity in real time.
              </div>
            </div>
          )}

          {/* Academic Formulation Callout */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1">
            <span className="font-bold text-slate-900 block">Exam Derivation Highlight:</span>
            <p className="leading-relaxed text-[11px]">
              Otsu maximizes between-class variance: $\sigma_B^2(t) = \omega_0(t)\omega_1(t)[\mu_0(t) - \mu_1(t)]^2$. Because total variance $\sigma_T^2 = \sigma_W^2 + \sigma_B^2$ is constant, maximizing $\sigma_B^2$ is mathematically equivalent to minimizing intra-class variance $\sigma_W^2$.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
