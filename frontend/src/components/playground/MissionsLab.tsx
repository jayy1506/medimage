"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { 
  Target, 
  Award, 
  HelpCircle, 
  RotateCcw, 
  CheckCircle2, 
  AlertTriangle, 
  Star, 
  ChevronRight, 
  Sparkles, 
  Sliders, 
  Eye, 
  Info, 
  Flame,
  ArrowRight
} from "lucide-react";
import { CLINICAL_MISSIONS, MissionDefinition, scoreMissionAttempt } from "@/data/missionsDatabase";
import { useGamification } from "@/context/GamificationContext";
import LiveHistogramView from "./LiveHistogramView";
import { computeHistogram, HistogramData, ctWindowTransfer } from "@/lib/imagingEngine";

export default function MissionsLab() {
  const [activeMissionIndex, setActiveMissionIndex] = useState<number>(0);
  const mission: MissionDefinition = CLINICAL_MISSIONS[activeMissionIndex];

  const { bestScores, recordMissionScore } = useGamification();

  const [params, setParams] = useState<Record<string, number>>(mission.initialParams);
  const [hintsRevealed, setHintsRevealed] = useState<number>(0);
  const [evalResult, setEvalResult] = useState<{
    score: number;
    stars: number;
    isPassed: boolean;
    feedback: string;
  } | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [histogram, setHistogram] = useState<HistogramData | null>(null);

  // Reset when active mission changes
  useEffect(() => {
    setParams(mission.initialParams);
    setHintsRevealed(0);
    setEvalResult(null);
  }, [activeMissionIndex, mission]);

  // Synthetic Medical Scan Generator
  const drawScan = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    const imgData = ctx.createImageData(w, h);
    const data = imgData.data;

    const cx = w / 2;
    const cy = h / 2;

    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const idx = (y * w + x) * 4;
        const dx = x - cx;
        const dy = y - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);

        let hu = -1000; // Air background

        if (mission.id === "mission-bone-window") {
          // Skull Phantom: Skull calvarium (+900 HU), brain (+35 HU), sinus (-900 HU)
          if (dist < 95 && dist >= 80) {
            hu = 950 + 150 * Math.sin(x * 0.4); // cortical bone
          } else if (dist < 80) {
            hu = 38 + 5 * Math.cos((x + y) * 0.2); // brain parenchyma
            if (dist < 20) hu = 0; // CSF ventricles
          }
        } else if (mission.id === "mission-subdural-hematoma") {
          // Subdural Hematoma: Crescent along left skull margin (+75 HU) vs cortex (+35 HU)
          if (dist < 92 && dist >= 82) {
            hu = 900; // Skull
          } else if (dist < 82) {
            // Crescent hematoma on left
            if (x < cx - 40 && dist < 82 && dist > 55) {
              hu = 72 + Math.random() * 6; // acute clotted blood (+70 to +78 HU)
            } else {
              hu = 37 + (Math.sin(x * 0.1) * 4); // brain
            }
          }
        } else if (mission.id === "mission-lung-emphysema") {
          // Chest CT: Chest wall (+50), Ribs (+700), Lung parenchyma (-650), Emphysema bulla (-980)
          if (dist < 100 && dist >= 88) {
            hu = 45; // Muscle chest wall
            if (Math.abs(dx) > 60 && Math.abs(dy) > 30) hu = 800; // ribs
          } else if (dist < 88) {
            // Mediastinum center
            if (Math.abs(dx) < 25) {
              hu = 40; // heart / vessels
            } else {
              hu = -620 + Math.sin(x * 0.3) * 30; // normal lung
              // Emphysema bulla on right lung
              if (dx > 35 && dy > 10 && dy < 45) {
                hu = -960; // trapped alveolar air / bulla
              }
            }
          }
        } else if (mission.id === "mission-otsu-threshold") {
          // Brain Glioblastoma: Brain parenchyma (gray 90), Enhancing ring (gray 190), Necrotic core (gray 110)
          let grayVal = 20;
          if (dist < 90) {
            grayVal = 95 + Math.sin(x * 0.1) * 10;
            // Glioblastoma mass
            const tdx = x - (cx + 25);
            const tdy = y - (cy - 15);
            const tDist = Math.sqrt(tdx * tdx + tdy * tdy);
            if (tDist < 28 && tDist > 14) {
              grayVal = 195; // Hyperintense enhancing rim
            } else if (tDist <= 14) {
              grayVal = 115; // necrotic core
            }
          }
          const th = params.threshold ?? 128;
          const displayGray = grayVal >= th ? 255 : grayVal;
          data[idx] = displayGray;
          data[idx + 1] = grayVal >= th ? 220 : displayGray;
          data[idx + 2] = grayVal >= th ? 50 : displayGray; // golden tint for segmented area
          data[idx + 3] = 255;
          continue;
        } else if (mission.id === "mission-fourier-periodic") {
          // MRI with high-frequency RF stripes
          let baseVal = dist < 85 ? 120 + Math.cos(x * 0.1) * 30 : 15;
          // Add periodic stripe artifact
          const stripeNoise = Math.sin(x * 0.5) * 45;
          const notchDist = params.notchFrequency ?? 20;
          const notchRad = params.notchRadius ?? 2;
          // Filtering logic: if user tuned close to harmonic spike (64px, rad>=7), suppress noise
          const isSuppressed = Math.abs(notchDist - 64) < 10 && notchRad >= 6;
          const finalVal = isSuppressed ? baseVal : Math.max(0, Math.min(255, baseVal + stripeNoise));

          data[idx] = finalVal;
          data[idx + 1] = finalVal;
          data[idx + 2] = finalVal;
          data[idx + 3] = 255;
          continue;
        }

        // Apply Window/Level transfer
        const wl = params.windowLevel ?? 40;
        const ww = params.windowWidth ?? 400;
        const mapped = ctWindowTransfer(hu, wl, ww);

        data[idx] = mapped;
        data[idx + 1] = mapped;
        data[idx + 2] = mapped;
        data[idx + 3] = 255;
      }
    }

    ctx.putImageData(imgData, 0, 0);
    setHistogram(computeHistogram(imgData));
  }, [mission.id, params]);

  useEffect(() => {
    drawScan();
  }, [drawScan]);

  const handleParamChange = (paramKey: string, val: number) => {
    setParams((prev) => ({ ...prev, [paramKey]: val }));
    setEvalResult(null); // clear evaluation on change
  };

  const handleEvaluate = () => {
    const res = scoreMissionAttempt(mission, params, hintsRevealed);
    setEvalResult(res);
    recordMissionScore(mission.id, res.score);
  };

  const handleRevealHint = () => {
    if (hintsRevealed < mission.hintLevels.length) {
      setHintsRevealed((prev) => prev + 1);
    }
  };

  const personalBest = bestScores[mission.id] || 0;

  return (
    <div className="space-y-6">
      {/* Missions Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {CLINICAL_MISSIONS.map((m, idx) => {
          const isActive = idx === activeMissionIndex;
          const score = bestScores[m.id] || 0;
          return (
            <button
              key={m.id}
              onClick={() => setActiveMissionIndex(idx)}
              className={`px-3.5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 border ${
                isActive
                  ? "bg-adani-navy text-white border-adani-navy shadow-md shadow-slate-900/10"
                  : "bg-white text-slate-700 hover:bg-slate-100 border-slate-200"
              }`}
            >
              <Target className={`w-3.5 h-3.5 ${isActive ? "text-adani-cyan" : "text-slate-400"}`} />
              <span>{m.title.split(":")[0]}</span>
              {score > 0 && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                  score >= 90 ? "bg-amber-400/20 text-amber-300" : score >= 75 ? "bg-emerald-500/20 text-emerald-300" : "bg-slate-200 text-slate-600"
                }`}>
                  {score}%
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Main Mission Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Col: Clinical Brief, Controls & Hints (col-span-7) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Clinical Case Brief Card */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-adani-cyan/10 text-adani-cyan text-[11px] font-bold">
                <Target className="w-3.5 h-3.5" />
                {mission.moduleBadge}
              </span>
              <div className="flex items-center space-x-2 text-xs">
                <span className="text-slate-400">Personal Best:</span>
                <span className="font-extrabold text-slate-800 font-mono">
                  {personalBest > 0 ? `${personalBest} / 100` : "Unattempted"}
                </span>
              </div>
            </div>

            <h2 className="text-lg font-black text-slate-900 tracking-tight">
              {mission.title}
            </h2>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
              <span className="font-bold text-slate-700 flex items-center gap-1.5 uppercase text-[10px] tracking-wider text-adani-purple">
                <Info className="w-3.5 h-3.5" />
                Patient Clinical Presentation
              </span>
              <p className="text-slate-600 leading-relaxed">
                {mission.patientHistory}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-sky-50/80 border border-sky-200 text-xs space-y-1">
              <span className="font-bold text-adani-navy block">🎯 Objective Goal:</span>
              <p className="text-slate-700 leading-relaxed font-medium">
                {mission.goal}
              </p>
            </div>
          </div>

          {/* Interactive Parameters Sliders */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-adani-cyan" />
                Diagnostic Parameter Controls
              </span>
              <button
                onClick={() => setParams(mission.initialParams)}
                className="text-[11px] text-slate-500 hover:text-slate-800 flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                Reset Defaults
              </button>
            </div>

            <div className="space-y-4 pt-1">
              {Object.entries(mission.paramBounds).map(([paramKey, bounds]) => {
                const currentVal = params[paramKey] ?? bounds.min;
                return (
                  <div key={paramKey} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <label className="font-bold text-slate-700">
                        {bounds.label}
                      </label>
                      <span className="font-mono font-black text-adani-navy bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                        {currentVal} {bounds.unit}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={bounds.min}
                      max={bounds.max}
                      step={bounds.step}
                      value={currentVal}
                      onChange={(e) => handleParamChange(paramKey, parseFloat(e.target.value))}
                      className="w-full accent-adani-cyan h-2 bg-slate-200 rounded-lg cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                      <span>{bounds.min} {bounds.unit}</span>
                      <span>{bounds.max} {bounds.unit}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-2">
              <button
                onClick={handleEvaluate}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-adani-cyan via-adani-purple to-adani-magenta text-white font-bold text-xs uppercase tracking-wider shadow-md hover:opacity-95 transition-all flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                Score Diagnosis Against Clinical Standard
              </button>
            </div>
          </div>

          {/* Evaluation Result Display */}
          {evalResult && (
            <div className={`p-5 rounded-2xl border shadow-lg space-y-3 transition-all ${
              evalResult.isPassed
                ? "bg-emerald-950/20 border-emerald-500/40 text-emerald-950"
                : "bg-rose-950/20 border-rose-500/40 text-rose-950"
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                    evalResult.isPassed ? "bg-emerald-600 text-white" : "bg-rose-600 text-white"
                  }`}>
                    {evalResult.score}%
                  </div>
                  <div>
                    <span className="text-xs font-black block text-slate-900">
                      {evalResult.isPassed ? "Diagnostic Benchmark Cleared!" : "Below Pass Threshold (>75%)"}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Evaluated against calibrated phantom contrast
                    </span>
                  </div>
                </div>

                {/* Stars Rating */}
                <div className="flex items-center space-x-1">
                  {[1, 2, 3].map((starIdx) => (
                    <Star
                      key={starIdx}
                      className={`w-5 h-5 ${
                        starIdx <= evalResult.stars
                          ? "text-amber-400 fill-amber-400"
                          : "text-slate-300"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed bg-white/80 p-3 rounded-xl border border-slate-200">
                {evalResult.feedback}
              </p>

              {evalResult.isPassed && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 space-y-1">
                  <span className="font-bold block text-emerald-900">Physiological Rationale:</span>
                  <p>{mission.clinicalExplanation}</p>
                </div>
              )}
            </div>
          )}

          {/* Staged Hints Drawer */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-amber-500" />
                Staged Clinical Hints ({hintsRevealed} / {mission.hintLevels.length})
              </span>
              {hintsRevealed < mission.hintLevels.length && (
                <button
                  onClick={handleRevealHint}
                  className="text-xs font-bold text-amber-600 hover:text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 transition-colors"
                >
                  Reveal Hint {hintsRevealed + 1} (-5 pts)
                </button>
              )}
            </div>

            {hintsRevealed === 0 ? (
              <p className="text-xs text-slate-400 italic">
                Attempt the mission first without hints for maximum 100% score!
              </p>
            ) : (
              <div className="space-y-2">
                {mission.hintLevels.slice(0, hintsRevealed).map((hint, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-amber-50/70 border border-amber-200/80 text-xs text-amber-900">
                    <span className="font-bold text-[10px] uppercase tracking-wider text-amber-800 block">
                      Hint {idx + 1}:
                    </span>
                    {hint}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Live Medical Scan Canvas & Histogram (col-span-5) */}
        <div className="lg:col-span-5 space-y-5 sticky top-24">
          {/* Scan Canvas Card */}
          <div className="p-4 rounded-2xl bg-black border border-slate-800 shadow-xl space-y-3 text-white">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold flex items-center gap-1.5 text-slate-300">
                <Eye className="w-4 h-4 text-adani-cyan" />
                Live Diagnostic Display
              </span>
              <span className="font-mono text-[10px] text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                256 × 256 Matrix
              </span>
            </div>

            <div className="flex justify-center p-2 bg-slate-950 rounded-xl border border-slate-900">
              <canvas
                ref={canvasRef}
                width={256}
                height={256}
                className="w-full max-w-[280px] aspect-square object-contain rounded-lg shadow-inner"
              />
            </div>

            <div className="text-[11px] text-slate-400 flex items-center justify-between px-1">
              <span>Patient Slice #14 (Axial)</span>
              <span>FOV: 220 mm</span>
            </div>
          </div>

          {/* Live Histogram Panel */}
          <LiveHistogramView histogram={histogram} />
        </div>

      </div>
    </div>
  );
}
