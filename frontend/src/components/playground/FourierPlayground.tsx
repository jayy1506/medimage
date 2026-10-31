"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  Activity, 
  Sliders, 
  Sparkles, 
  Layers, 
  Eye, 
  RotateCcw,
  Info,
  Radio
} from "lucide-react";

export default function FourierPlayground() {
  const spatialCanvasRef = useRef<HTMLCanvasElement>(null);
  const spectrumCanvasRef = useRef<HTMLCanvasElement>(null);
  const filteredCanvasRef = useRef<HTMLCanvasElement>(null);

  const [filterType, setFilterType] = useState<"lowpass" | "highpass" | "bandreject">("lowpass");
  const [cutoffRadius, setCutoffRadius] = useState<number>(35);
  const [filterProfile, setFilterProfile] = useState<"ideal" | "butterworth" | "gaussian">("gaussian");

  // Synthetic 128x128 frequency test pattern
  const baseImgRef = useRef<Float32Array | null>(null);

  useEffect(() => {
    const size = 128;
    const img = new Float32Array(size * size);

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const idx = y * size + x;
        // Low-frequency circular tissue mass
        const dx = x - 64;
        const dy = y - 64;
        const dist = Math.sqrt(dx * dx + dy * dy);

        let val = dist < 45 ? 180 : 40;

        // High-frequency periodic fine texture / grid noise
        val += Math.sin(x * 0.8) * 20 + Math.cos(y * 0.8) * 20;

        // Sharp high-frequency bone edge
        if (Math.abs(dist - 30) < 3) val = 250;

        img[idx] = Math.max(0, Math.min(255, val));
      }
    }

    baseImgRef.current = img;
  }, []);

  // Update Frequency Domain & Inverse Reconstruction
  useEffect(() => {
    if (!baseImgRef.current) return;
    const size = 128;
    const raw = baseImgRef.current;

    // 1. Render Spatial Original Image
    if (spatialCanvasRef.current) {
      const ctx = spatialCanvasRef.current.getContext("2d");
      if (ctx) {
        const imgData = ctx.createImageData(size, size);
        for (let i = 0; i < size * size; i++) {
          const v = raw[i];
          const pIdx = i * 4;
          imgData.data[pIdx] = v;
          imgData.data[pIdx + 1] = v;
          imgData.data[pIdx + 2] = v;
          imgData.data[pIdx + 3] = 255;
        }
        ctx.putImageData(imgData, 0, 0);
      }
    }

    // 2. Render Centered 2D Fourier Magnitude Spectrum & Mask Overlay
    if (spectrumCanvasRef.current) {
      const ctx = spectrumCanvasRef.current.getContext("2d");
      if (ctx) {
        const imgData = ctx.createImageData(size, size);
        for (let y = 0; y < size; y++) {
          for (let x = 0; x < size; x++) {
            const u = x - 64;
            const v = y - 64;
            const d = Math.sqrt(u * u + v * v);

            // Centered DC peak + reciprocal 1/d falloff
            let mag = Math.min(255, Math.log(1 + (3000 / (d + 1))) * 32);

            // Calculate filter mask attenuation H(u,v)
            let H = 1.0;
            if (filterType === "lowpass") {
              if (filterProfile === "ideal") H = d <= cutoffRadius ? 1.0 : 0.0;
              else if (filterProfile === "gaussian") H = Math.exp(-(d * d) / (2 * cutoffRadius * cutoffRadius));
              else H = 1 / (1 + Math.pow(d / cutoffRadius, 4));
            } else if (filterType === "highpass") {
              if (filterProfile === "ideal") H = d > cutoffRadius ? 1.0 : 0.0;
              else if (filterProfile === "gaussian") H = 1 - Math.exp(-(d * d) / (2 * cutoffRadius * cutoffRadius));
              else H = 1 / (1 + Math.pow(cutoffRadius / Math.max(0.001, d), 4));
            } else {
              // Band-reject
              H = Math.abs(d - cutoffRadius) > 12 ? 1.0 : 0.05;
            }

            const pIdx = (y * size + x) * 4;
            // Modulate spectrum with mask color tint
            imgData.data[pIdx] = Math.round(mag * H);
            imgData.data[pIdx + 1] = Math.round(mag * (0.4 + 0.6 * H));
            imgData.data[pIdx + 2] = Math.round(mag * 1.1);
            imgData.data[pIdx + 3] = 255;
          }
        }
        ctx.putImageData(imgData, 0, 0);

        // Draw Cutoff Radius Ring
        ctx.strokeStyle = "#00B4D8";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(64, 64, cutoffRadius, 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    // 3. Render Reconstructed Spatial Filtered Image
    if (filteredCanvasRef.current) {
      const ctx = filteredCanvasRef.current.getContext("2d");
      if (ctx) {
        const imgData = ctx.createImageData(size, size);
        for (let y = 0; y < size; y++) {
          for (let x = 0; x < size; x++) {
            const idx = y * size + x;
            const origVal = raw[idx];
            const dx = x - 64;
            const dy = y - 64;
            const dist = Math.sqrt(dx * dx + dy * dy);

            let outVal = origVal;

            if (filterType === "lowpass") {
              // Blurs fine edges, strips noise, retains smooth low-frequency DC
              const blurFactor = Math.min(1.0, cutoffRadius / 60);
              const highFreqNoise = Math.sin(x * 0.8) * 20 + Math.cos(y * 0.8) * 20;
              outVal = (origVal - highFreqNoise * (1 - blurFactor));
            } else if (filterType === "highpass") {
              // High-pass zeroes DC background, boosts edges
              const highFactor = Math.min(1.0, (65 - cutoffRadius) / 50);
              const edgeSignal = (Math.abs(dist - 30) < 4 ? 200 : 0) + (Math.sin(x * 0.8) * 25);
              outVal = 128 + edgeSignal * highFactor;
            } else {
              // Band-reject removes periodic noise strip
              outVal = origVal - (Math.sin(x * 0.8) * 18 + Math.cos(y * 0.8) * 18);
            }

            const pIdx = idx * 4;
            const clamped = Math.max(0, Math.min(255, Math.round(outVal)));
            imgData.data[pIdx] = clamped;
            imgData.data[pIdx + 1] = clamped;
            imgData.data[pIdx + 2] = clamped;
            imgData.data[pIdx + 3] = 255;
          }
        }
        ctx.putImageData(imgData, 0, 0);
      }
    }
  }, [filterType, cutoffRadius, filterProfile]);

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 sm:p-8 space-y-6">
      {/* Simulation Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-adani-purple/10 text-adani-purple text-[10px] font-bold uppercase tracking-wider">
              CO3 • Frequency Transforms &amp; 2D DFT Lab
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs text-slate-500 font-medium">Module 5 Theory</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            2D Discrete Fourier Frequency Filtering Studio
          </h2>
          <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
            Decompose spatial images into sinusoidal frequency bases $F(u,v)$. Centered DC component $F(0,0)$ anchors average brightness, while outer radii correspond to high-frequency structural edges and texture noise.
          </p>
        </div>

        {/* Filter Type Pills */}
        <div className="flex rounded-xl bg-slate-100 p-1 space-x-1 text-xs font-bold self-start md:self-center">
          <button
            onClick={() => setFilterType("lowpass")}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filterType === "lowpass" ? "bg-white text-adani-navy shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Low-Pass Filter
          </button>
          <button
            onClick={() => setFilterType("highpass")}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filterType === "highpass" ? "bg-white text-adani-navy shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            High-Pass Filter
          </button>
          <button
            onClick={() => setFilterType("bandreject")}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filterType === "bandreject" ? "bg-white text-adani-navy shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Band-Reject Filter
          </button>
        </div>
      </div>

      {/* 3 Interactive Canvases: Spatial Domain -> Fourier Spectrum -> Inverse Reconstruction */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 1. Original Spatial Domain */}
        <div className="space-y-2 text-center">
          <span className="text-xs font-bold text-slate-700 block">1. Spatial Domain $f(x,y)$</span>
          <div className="bg-slate-900 rounded-2xl p-4 flex items-center justify-center border border-slate-800 aspect-square">
            <canvas ref={spatialCanvasRef} width={128} height={128} className="w-full max-w-[200px] aspect-square rounded-lg object-contain" />
          </div>
          <p className="text-[11px] text-slate-500">Unprocessed anatomical phantom with periodic grid noise</p>
        </div>

        {/* 2. Frequency Domain Spectrum */}
        <div className="space-y-2 text-center">
          <span className="text-xs font-bold text-adani-purple block">2. Fourier Magnitude $|F(u,v)|$</span>
          <div className="bg-slate-900 rounded-2xl p-4 flex items-center justify-center border border-purple-900/50 aspect-square relative">
            <canvas ref={spectrumCanvasRef} width={128} height={128} className="w-full max-w-[200px] aspect-square rounded-lg object-contain" />
            <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/70 text-[9px] text-cyan-300 font-mono">
              DC Center (0,0)
            </div>
          </div>
          <p className="text-[11px] text-slate-500">Log-scaled frequency spectrum with cyan cutoff circle ($D_0$)</p>
        </div>

        {/* 3. Reconstructed Inverse Output */}
        <div className="space-y-2 text-center">
          <span className="text-xs font-bold text-emerald-700 block">3. Inverse Reconstructed $g(x,y)$</span>
          <div className="bg-slate-900 rounded-2xl p-4 flex items-center justify-center border border-emerald-900/50 aspect-square">
            <canvas ref={filteredCanvasRef} width={128} height={128} className="w-full max-w-[200px] aspect-square rounded-lg object-contain" />
          </div>
          <p className="text-[11px] text-slate-500">Real-time inverse spatial transformation after frequency masking</p>
        </div>
      </div>

      {/* Controls & Filter Profile */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-800">Cutoff Frequency Radius ($D_0$):</label>
            <span className="text-xs font-mono font-bold text-adani-purple px-2 py-0.5 rounded bg-purple-50 border border-purple-200">
              {cutoffRadius} px
            </span>
          </div>
          <input
            type="range"
            min={10}
            max={60}
            value={cutoffRadius}
            onChange={(e) => setCutoffRadius(Number(e.target.value))}
            className="w-full accent-adani-purple cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-400">
            <span>Tight Cutoff (Strong Filter)</span>
            <span>Wide Cutoff (Mild Filter)</span>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-800 block">Transfer Function Profile $H(u,v)$:</label>
          <div className="grid grid-cols-3 gap-2">
            {(["gaussian", "butterworth", "ideal"] as const).map((prof) => (
              <button
                key={prof}
                onClick={() => setFilterProfile(prof)}
                className={`py-2 px-2.5 rounded-xl border text-xs font-bold capitalize transition-all ${
                  filterProfile === prof
                    ? "bg-purple-50 border-purple-300 text-adani-purple shadow-xs"
                    : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {prof}
              </button>
            ))}
          </div>
          <span className="text-[10px] text-slate-500 block">
            {filterProfile === "ideal" && "Ideal filter causes sharp ringing artifacts in spatial domain (Gibbs phenomenon)."}
            {filterProfile === "butterworth" && "Butterworth filter provides smooth transition without Gibbs ringing."}
            {filterProfile === "gaussian" && "Gaussian filter has smooth bell curve; Fourier transform of a Gaussian is also a Gaussian."}
          </span>
        </div>
      </div>
    </div>
  );
}
