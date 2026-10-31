"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Gamepad2, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  Star, 
  Sparkles, 
  Radio, 
  Eye, 
  ShieldAlert, 
  Atom, 
  Sliders, 
  ChevronRight,
  Info,
  Check
} from "lucide-react";
import { useGamification } from "@/context/GamificationContext";
import { MRI_TISSUES, computeMRISignal, MRITissueParams } from "@/lib/imagingEngine";

export default function MiniGamesHub() {
  const [activeGame, setActiveGame] = useState<"filter" | "artifact" | "fourier" | "mri">("filter");
  const { unlockBadge } = useGamification();

  // --- GAME 1: FILTER MATCH STATE ---
  const FILTER_CASES = [
    {
      id: "f-case-1",
      noiseType: "Salt-and-Pepper Detector Impulse Noise",
      description: "A faulty ADC detector photodiode produced saturated black (0) and white (255) dead pixels scattered randomly across the thoracic bone scan.",
      correctFilter: "Median Filter",
      options: ["3×3 Mean Box Filter", "5×5 Gaussian Smoothing", "3×3 Median Filter", "Laplacian Sharpening"],
      explanation: "Median filtering is a non-linear order-statistic filter that replaces extreme outlier pixels with the median of neighboring values, preserving sharp bone edges without blurring."
    },
    {
      id: "f-case-2",
      noiseType: "Low-Dose CT Quantum Mottle (Gaussian / Poisson Noise)",
      description: "Low-mA pediatric CT protocol produced pervasive fine-grain quantum mottle across liver parenchyma.",
      correctFilter: "Gaussian Smoothing",
      options: ["5×5 Gaussian Smoothing", "Laplacian High-Pass", "Sobel Gradient Filter", "Maximum Rank Filter"],
      explanation: "Gaussian smoothing applies a weighted isotropic Gaussian kernel that optimally suppresses high-frequency Gaussian quantum noise according to the central limit theorem."
    },
    {
      id: "f-case-3",
      noiseType: "Fine Trabecular Bone Blurriness",
      description: "A radiologist requested edge boosting to visualize hairline cortical fracture lines that appear softened.",
      correctFilter: "Unsharp Masking",
      options: ["Mean Filter", "Bilateral Smoothing", "Unsharp Masking (High Boost)", "Median Filter"],
      explanation: "Unsharp masking subtracts a blurred version of the image from the original, creating Mach band overshoot at edges to heighten hairline fractures."
    }
  ];

  const [filterCaseIdx, setFilterCaseIdx] = useState<number>(0);
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [filterAnswerChecked, setFilterAnswerChecked] = useState<boolean>(false);
  const [filterScore, setFilterScore] = useState<number>(0);

  // --- GAME 2: SPOT THE ARTIFACT STATE ---
  const ARTIFACT_CASES = [
    {
      id: "art-1",
      title: "CT Petrous Bone Dark Streaks",
      imageHint: "Dark bands extending between dense posterior temporal bone pyramids across the brainstem.",
      options: ["Beam Hardening Artifact", "Motion Ghosting", "Phase Aliasing (Wrap-around)", "Ring Artifact"],
      correct: "Beam Hardening Artifact",
      rationale: "Lower energy polychromatic X-ray photons are preferentially absorbed by dense petrous bone. The 'hardened' beam emerges with higher average energy, causing CT reconstruction algorithms to underestimate attenuation and generate characteristic dark inter-bone bands."
    },
    {
      id: "art-2",
      title: "Discrete Concentric Circular Rings on Axial Slice",
      imageHint: "A series of sharp concentric circles centered precisely on the scanner axis of rotation.",
      options: ["Ring Artifact (Detector Drift)", "Truncation Gibbs Phenomenon", "Metal Streak Artifact", "Chemical Shift"],
      correct: "Ring Artifact (Detector Drift)",
      rationale: "In 3rd generation CT scanners, a miscalibrated or defective detector element creates a constant error in the sinogram along one projection ray, which backprojects into a concentric circle."
    },
    {
      id: "art-3",
      title: "Ghost Duplicate Anatomy Across Phase-Encoding Axis",
      imageHint: "Periodic faint replicas of the anterior abdominal wall propagated across the phase direction.",
      options: ["Respiratory Motion Ghosting", "Nyquist N/2 Ghost", "Zipper Artifact", "Magic Angle Effect"],
      correct: "Respiratory Motion Ghosting",
      rationale: "Periodic physiological movement (breathing or pulsatile vascular flow) modulates phase-encoding steps over the acquisition duration, producing ghost copies exclusively along the phase-encoding axis."
    },
    {
      id: "art-4",
      title: "Anatomy Folded Over to the Opposite Edge of Field of View",
      imageHint: "Nose and facial profile wrapped around and appearing behind the occipital skull.",
      options: ["Phase Aliasing / Wrap-Around", "Partial Volume Effect", "Susceptibility Distortion", "Spike Noise"],
      correct: "Phase Aliasing / Wrap-Around",
      rationale: "Occurs when the field of view (FOV) is smaller than the imaged anatomical structure, causing spatial frequencies exceeding the Nyquist sampling rate in the phase-encoding direction to wrap into the opposite border."
    }
  ];

  const [artifactCaseIdx, setArtifactCaseIdx] = useState<number>(0);
  const [selectedArtifact, setSelectedArtifact] = useState<string | null>(null);
  const [artifactAnswerChecked, setArtifactAnswerChecked] = useState<boolean>(false);
  const [artifactCorrectCount, setArtifactCorrectCount] = useState<number>(0);

  // --- GAME 3: FOURIER FREQUENCY MASK STUDIO STATE ---
  const [fourierFilterType, setFourierFilterType] = useState<"lowpass" | "highpass" | "notch">("lowpass");
  const [cutoffRadius, setCutoffRadius] = useState<number>(45);
  const fourierCanvasRef = useRef<HTMLCanvasElement>(null);
  const spatialCanvasRef = useRef<HTMLCanvasElement>(null);

  // Draw 2D Fourier Spectrum and reconstructed spatial image
  useEffect(() => {
    if (activeGame !== "fourier") return;

    // 1. Draw Spectrum
    const sCanvas = fourierCanvasRef.current;
    if (sCanvas) {
      const sCtx = sCanvas.getContext("2d");
      if (sCtx) {
        const w = sCanvas.width;
        const h = sCanvas.height;
        const cx = w / 2;
        const cy = h / 2;

        sCtx.fillStyle = "#030712";
        sCtx.fillRect(0, 0, w, h);

        // Draw simulated centered 2D power spectrum
        const grad = sCtx.createRadialGradient(cx, cy, 2, cx, cy, 90);
        grad.addColorStop(0, "#ffffff");
        grad.addColorStop(0.2, "#38bdf8");
        grad.addColorStop(0.6, "#1e3a8a");
        grad.addColorStop(1, "#030712");
        sCtx.fillStyle = grad;
        sCtx.beginPath();
        sCtx.arc(cx, cy, 90, 0, Math.PI * 2);
        sCtx.fill();

        // High frequency periodic harmonic spikes
        sCtx.fillStyle = "#facc15";
        sCtx.beginPath();
        sCtx.arc(cx - 55, cy, 4, 0, Math.PI * 2);
        sCtx.arc(cx + 55, cy, 4, 0, Math.PI * 2);
        sCtx.fill();

        // Draw Filter Mask Overlay
        sCtx.strokeStyle = fourierFilterType === "notch" ? "#ef4444" : "#10b981";
        sCtx.lineWidth = 2;
        sCtx.setLineDash([4, 4]);

        if (fourierFilterType === "lowpass") {
          sCtx.beginPath();
          sCtx.arc(cx, cy, cutoffRadius, 0, Math.PI * 2);
          sCtx.stroke();
        } else if (fourierFilterType === "highpass") {
          sCtx.beginPath();
          sCtx.arc(cx, cy, cutoffRadius, 0, Math.PI * 2);
          sCtx.stroke();
        } else {
          // Notch mask around spikes
          sCtx.beginPath();
          sCtx.arc(cx - 55, cy, 14, 0, Math.PI * 2);
          sCtx.arc(cx + 55, cy, 14, 0, Math.PI * 2);
          sCtx.stroke();
        }
        sCtx.setLineDash([]);
      }
    }

    // 2. Draw Reconstructed Spatial Image
    const imgCanvas = spatialCanvasRef.current;
    if (imgCanvas) {
      const iCtx = imgCanvas.getContext("2d");
      if (iCtx) {
        const w = imgCanvas.width;
        const h = imgCanvas.height;
        const cx = w / 2;
        const cy = h / 2;

        iCtx.fillStyle = "#020617";
        iCtx.fillRect(0, 0, w, h);

        if (fourierFilterType === "lowpass") {
          // Low-pass: blurred brain anatomy
          const blurAmount = Math.max(0, 60 - cutoffRadius) / 6;
          iCtx.filter = `blur(${blurAmount}px)`;
          iCtx.fillStyle = "#64748b";
          iCtx.beginPath();
          iCtx.ellipse(cx, cy, 65, 80, 0, 0, Math.PI * 2);
          iCtx.fill();
          iCtx.fillStyle = "#cbd5e1";
          iCtx.beginPath();
          iCtx.arc(cx + 20, cy - 20, 18, 0, Math.PI * 2);
          iCtx.fill();
          iCtx.filter = "none";
        } else if (fourierFilterType === "highpass") {
          // High-pass: extracted edges only
          iCtx.strokeStyle = "#38bdf8";
          iCtx.lineWidth = 2;
          iCtx.beginPath();
          iCtx.ellipse(cx, cy, 65, 80, 0, 0, Math.PI * 2);
          iCtx.stroke();
          iCtx.beginPath();
          iCtx.arc(cx + 20, cy - 20, 18, 0, Math.PI * 2);
          iCtx.stroke();
        } else {
          // Notch: periodic stripes eliminated!
          iCtx.fillStyle = "#64748b";
          iCtx.beginPath();
          iCtx.ellipse(cx, cy, 65, 80, 0, 0, Math.PI * 2);
          iCtx.fill();
          iCtx.fillStyle = "#cbd5e1";
          iCtx.beginPath();
          iCtx.arc(cx + 20, cy - 20, 18, 0, Math.PI * 2);
          iCtx.fill();
        }
      }
    }
  }, [activeGame, fourierFilterType, cutoffRadius]);

  // --- GAME 4: MRI SPIN-ECHO SIMULATOR (TR / TE) STATE ---
  const [tr, setTr] = useState<number>(2500); // ms (Repetition Time)
  const [te, setTe] = useState<number>(90); // ms (Echo Time)
  const mriCanvasRef = useRef<HTMLCanvasElement>(null);

  // Compute live tissue signals
  const csfSignal = computeMRISignal(MRI_TISSUES.csf, tr, te);
  const wmSignal = computeMRISignal(MRI_TISSUES.whiteMatter, tr, te);
  const gmSignal = computeMRISignal(MRI_TISSUES.grayMatter, tr, te);
  const fatSignal = computeMRISignal(MRI_TISSUES.fat, tr, te);

  // Classify MRI weighting
  const weightingName =
    tr < 800 && te < 30
      ? "T1-Weighted (Short TR, Short TE)"
      : tr > 2000 && te > 80
      ? "T2-Weighted (Long TR, Long TE)"
      : tr > 2000 && te < 30
      ? "Proton Density (PD-Weighted) (Long TR, Short TE)"
      : "Intermediate Mixed Weighting";

  // Draw MRI Brain slice with computed tissue brightness
  useEffect(() => {
    if (activeGame !== "mri") return;
    const canvas = mriCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    const cx = w / 2;
    const cy = h / 2;

    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, w, h);

    // Subcutaneous Fat / Scalp
    const fatVal = Math.round(fatSignal * 255);
    ctx.fillStyle = `rgb(${fatVal}, ${fatVal}, ${fatVal})`;
    ctx.beginPath();
    ctx.ellipse(cx, cy, 85, 100, 0, 0, Math.PI * 2);
    ctx.fill();

    // Skull Bone (zero mobile protons -> always dark black)
    ctx.fillStyle = "#000000";
    ctx.beginPath();
    ctx.ellipse(cx, cy, 78, 92, 0, 0, Math.PI * 2);
    ctx.fill();

    // Gray Matter (Cortex)
    const gmVal = Math.round(gmSignal * 255);
    ctx.fillStyle = `rgb(${gmVal}, ${gmVal}, ${gmVal})`;
    ctx.beginPath();
    ctx.ellipse(cx, cy, 72, 86, 0, 0, Math.PI * 2);
    ctx.fill();

    // White Matter (Centrum semiovale)
    const wmVal = Math.round(wmSignal * 255);
    ctx.fillStyle = `rgb(${wmVal}, ${wmVal}, ${wmVal})`;
    ctx.beginPath();
    ctx.ellipse(cx, cy, 54, 65, 0, 0, Math.PI * 2);
    ctx.fill();

    // Ventricles / CSF
    const csfVal = Math.round(csfSignal * 255);
    ctx.fillStyle = `rgb(${csfVal}, ${csfVal}, ${csfVal})`;
    ctx.beginPath();
    ctx.ellipse(cx - 14, cy - 5, 8, 22, 0.2, 0, Math.PI * 2);
    ctx.ellipse(cx + 14, cy - 5, 8, 22, -0.2, 0, Math.PI * 2);
    ctx.fill();
  }, [activeGame, tr, te, csfSignal, wmSignal, gmSignal, fatSignal]);

  return (
    <div className="space-y-6 font-sans">
      {/* Game Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {[
          { id: "filter", label: "Game 1: Filter Match", icon: Sliders },
          { id: "artifact", label: "Game 2: Spot the Artifact", icon: ShieldAlert },
          { id: "fourier", label: "Game 3: Fourier Mask Studio", icon: Radio },
          { id: "mri", label: "Game 4: MRI Contrast Physics (TR/TE)", icon: Atom }
        ].map((tab) => {
          const isActive = activeGame === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveGame(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 border ${
                isActive
                  ? "bg-adani-navy text-white border-adani-navy shadow-md"
                  : "bg-white text-slate-700 hover:bg-slate-100 border-slate-200"
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? "text-adani-cyan" : "text-slate-400"}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* GAME 1: FILTER MATCH */}
      {activeGame === "filter" && (
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-adani-cyan">
                Clinical Spatial Filtering
              </span>
              <h2 className="text-lg font-black text-slate-900">
                Case {filterCaseIdx + 1} / {FILTER_CASES.length}: {FILTER_CASES[filterCaseIdx].noiseType}
              </h2>
            </div>
            <div className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-mono">
              Score: {filterScore} pts
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed">
            <span className="font-bold text-slate-900 block mb-1">Clinical Diagnostic Scenario:</span>
            {FILTER_CASES[filterCaseIdx].description}
          </div>

          <div className="space-y-3">
            <span className="text-xs font-bold text-slate-800 block">
              Which image filter operator is clinically recommended?
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {FILTER_CASES[filterCaseIdx].options.map((opt) => {
                const isSelected = selectedFilter === opt;
                const isCorrect = opt === FILTER_CASES[filterCaseIdx].correctFilter;
                let btnStyle = "bg-white border-slate-200 text-slate-800 hover:bg-slate-50";

                if (filterAnswerChecked) {
                  if (isCorrect) btnStyle = "bg-emerald-50 border-emerald-500 text-emerald-900 font-bold";
                  else if (isSelected && !isCorrect) btnStyle = "bg-rose-50 border-rose-400 text-rose-900";
                } else if (isSelected) {
                  btnStyle = "bg-adani-cyan/10 border-adani-cyan text-adani-navy font-bold";
                }

                return (
                  <button
                    key={opt}
                    disabled={filterAnswerChecked}
                    onClick={() => setSelectedFilter(opt)}
                    className={`p-3.5 rounded-xl border text-xs text-left transition-all flex items-center justify-between ${btnStyle}`}
                  >
                    <span>{opt}</span>
                    {filterAnswerChecked && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                    {filterAnswerChecked && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-rose-500" />}
                  </button>
                );
              })}
            </div>
          </div>

          {filterAnswerChecked ? (
            <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200 text-xs space-y-2">
              <span className="font-bold text-adani-navy block">Physiological / Math Explanation:</span>
              <p className="text-slate-700 leading-relaxed">{FILTER_CASES[filterCaseIdx].explanation}</p>
              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => {
                    if (filterCaseIdx < FILTER_CASES.length - 1) {
                      setFilterCaseIdx((prev) => prev + 1);
                      setSelectedFilter(null);
                      setFilterAnswerChecked(false);
                    } else {
                      unlockBadge("badge-otsu");
                    }
                  }}
                  className="px-4 py-2 rounded-xl bg-adani-navy text-white text-xs font-bold hover:bg-adani-dark transition-all"
                >
                  {filterCaseIdx < FILTER_CASES.length - 1 ? "Next Diagnostic Case →" : "Completed! Re-play"}
                </button>
              </div>
            </div>
          ) : (
            <button
              disabled={!selectedFilter}
              onClick={() => {
                setFilterAnswerChecked(true);
                if (selectedFilter === FILTER_CASES[filterCaseIdx].correctFilter) {
                  setFilterScore((s) => s + 50);
                }
              }}
              className="px-5 py-2.5 rounded-xl bg-adani-cyan hover:bg-sky-500 text-white font-bold text-xs disabled:opacity-40 transition-all"
            >
              Confirm Clinical Filter Selection
            </button>
          )}
        </div>
      )}

      {/* GAME 2: SPOT THE ARTIFACT */}
      {activeGame === "artifact" && (
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-rose-600">
                Clinical Pathology &amp; Physics Quality Control
              </span>
              <h2 className="text-lg font-black text-slate-900">
                Artifact {artifactCaseIdx + 1} / {ARTIFACT_CASES.length}: {ARTIFACT_CASES[artifactCaseIdx].title}
              </h2>
            </div>
            <div className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-mono">
              Accuracy: {artifactCorrectCount} / {artifactCaseIdx + (artifactAnswerChecked ? 1 : 0)}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 leading-relaxed">
            <span className="font-bold block mb-1">Visual Clue on DICOM Viewer:</span>
            {ARTIFACT_CASES[artifactCaseIdx].imageHint}
          </div>

          <div className="space-y-3">
            <span className="text-xs font-bold text-slate-800 block">
              Identify the root imaging artifact:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {ARTIFACT_CASES[artifactCaseIdx].options.map((opt) => {
                const isSelected = selectedArtifact === opt;
                const isCorrect = opt === ARTIFACT_CASES[artifactCaseIdx].correct;
                let btnStyle = "bg-white border-slate-200 text-slate-800 hover:bg-slate-50";

                if (artifactAnswerChecked) {
                  if (isCorrect) btnStyle = "bg-emerald-50 border-emerald-500 text-emerald-900 font-bold";
                  else if (isSelected && !isCorrect) btnStyle = "bg-rose-50 border-rose-400 text-rose-900";
                } else if (isSelected) {
                  btnStyle = "bg-rose-50 border-rose-400 text-rose-900 font-bold";
                }

                return (
                  <button
                    key={opt}
                    disabled={artifactAnswerChecked}
                    onClick={() => setSelectedArtifact(opt)}
                    className={`p-3.5 rounded-xl border text-xs text-left transition-all flex items-center justify-between ${btnStyle}`}
                  >
                    <span>{opt}</span>
                    {artifactAnswerChecked && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                    {artifactAnswerChecked && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-rose-500" />}
                  </button>
                );
              })}
            </div>
          </div>

          {artifactAnswerChecked ? (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
              <span className="font-bold text-slate-900 block">Physics &amp; Reconstruction Origin:</span>
              <p className="text-slate-700 leading-relaxed">{ARTIFACT_CASES[artifactCaseIdx].rationale}</p>
              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => {
                    if (artifactCaseIdx < ARTIFACT_CASES.length - 1) {
                      setArtifactCaseIdx((prev) => prev + 1);
                      setSelectedArtifact(null);
                      setArtifactAnswerChecked(false);
                    } else {
                      unlockBadge("badge-artifact");
                    }
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-all"
                >
                  {artifactCaseIdx < ARTIFACT_CASES.length - 1 ? "Next Artifact →" : "Completed All! Re-play"}
                </button>
              </div>
            </div>
          ) : (
            <button
              disabled={!selectedArtifact}
              onClick={() => {
                setArtifactAnswerChecked(true);
                if (selectedArtifact === ARTIFACT_CASES[artifactCaseIdx].correct) {
                  setArtifactCorrectCount((c) => c + 1);
                }
              }}
              className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs disabled:opacity-40 transition-all"
            >
              Submit Artifact Diagnosis
            </button>
          )}
        </div>
      )}

      {/* GAME 3: FOURIER MASK STUDIO */}
      {activeGame === "fourier" && (
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-adani-purple">
              2D k-Space Frequency Domain Interaction
            </span>
            <h2 className="text-lg font-black text-slate-900">
              Draw Frequency Masks &amp; Watch Real-time iFFT Reconstruction
            </h2>
            <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
              Place Ideal Circular Low-Pass, High-Pass, or Notch rejection filters on the centered 2D Fourier power spectrum. Observe immediate inverse FFT synthesis on diagnostic edges.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* 2D Frequency Power Spectrum Canvas */}
            <div className="p-4 rounded-2xl bg-black border border-slate-800 text-white space-y-2 text-center">
              <div className="flex items-center justify-between text-xs px-1">
                <span className="font-bold text-sky-400">2D Fourier Power Spectrum |F(u, v)|</span>
                <span className="text-[10px] text-slate-400 font-mono">Centered DC (0,0)</span>
              </div>
              <div className="flex justify-center p-2 bg-slate-950 rounded-xl">
                <canvas
                  ref={fourierCanvasRef}
                  width={220}
                  height={220}
                  className="rounded-lg border border-slate-800"
                />
              </div>
              <span className="text-[10px] text-slate-400">
                Dashed line indicates frequency cutoff radius
              </span>
            </div>

            {/* Reconstructed Spatial Image Canvas */}
            <div className="p-4 rounded-2xl bg-black border border-slate-800 text-white space-y-2 text-center">
              <div className="flex items-center justify-between text-xs px-1">
                <span className="font-bold text-emerald-400">Reconstructed Spatial Image f(x, y)</span>
                <span className="text-[10px] text-slate-400 font-mono">Real-time iFFT</span>
              </div>
              <div className="flex justify-center p-2 bg-slate-950 rounded-xl">
                <canvas
                  ref={spatialCanvasRef}
                  width={220}
                  height={220}
                  className="rounded-lg border border-slate-800"
                />
              </div>
              <span className="text-[10px] text-slate-400">
                Inverse transform of the masked frequency spectrum
              </span>
            </div>
          </div>

          {/* Controls Bar */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700">Filter Type:</span>
              {(["lowpass", "highpass", "notch"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => {
                    setFourierFilterType(t);
                    if (t === "notch") unlockBadge("badge-fourier");
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                    fourierFilterType === t
                      ? "bg-adani-purple text-white shadow-sm"
                      : "bg-white text-slate-600 hover:bg-slate-200 border border-slate-200"
                  }`}
                >
                  {t === "lowpass" ? "Low-Pass (Smooth)" : t === "highpass" ? "High-Pass (Edges)" : "Notch (Suppress RF)"}
                </button>
              ))}
            </div>

            {fourierFilterType !== "notch" && (
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-700">
                  Cutoff Radius (D0): <strong className="font-mono text-adani-navy">{cutoffRadius} px</strong>
                </span>
                <input
                  type="range"
                  min={10}
                  max={80}
                  value={cutoffRadius}
                  onChange={(e) => setCutoffRadius(parseInt(e.target.value))}
                  className="w-36 accent-adani-purple cursor-pointer"
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* GAME 4: MRI SPIN-ECHO CONTRAST PHYSICS (TR / TE) */}
      {activeGame === "mri" && (
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-adani-cyan">
              Module 1 • NMR Bloch Vector Relaxation Equations
            </span>
            <h2 className="text-lg font-black text-slate-900">
              Interactive MRI Spin-Echo Simulator (TR &amp; TE Sliders)
            </h2>
            <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
              Modulate Repetition Time (TR) and Echo Time (TE) to govern longitudinal T1 recovery and transverse T2 decay:
              <code className="text-adani-purple font-mono ml-1 font-bold">S ≈ ρ · (1 - e^&#123;-TR/T1&#125;) · e^&#123;-TE/T2&#125;</code>.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Synthetic MRI Scan Display (col-span-5) */}
            <div className="md:col-span-5 p-4 rounded-2xl bg-black border border-slate-800 text-white space-y-2 text-center">
              <div className="flex items-center justify-between text-xs px-1">
                <span className="font-bold text-sky-400">Simulated 3.0T Brain Scan</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-800">
                  {weightingName}
                </span>
              </div>
              <div className="flex justify-center p-2 bg-slate-950 rounded-xl">
                <canvas
                  ref={mriCanvasRef}
                  width={220}
                  height={220}
                  className="rounded-lg border border-slate-800"
                />
              </div>
              <span className="text-[10px] text-slate-400">
                Notice CSF inversion between T1 (dark) and T2 (bright)
              </span>
            </div>

            {/* Sliders & Physics Calculation Panel (col-span-7) */}
            <div className="md:col-span-7 space-y-5">
              {/* TR Slider */}
              <div className="space-y-1.5 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="flex justify-between text-xs font-bold text-slate-800">
                  <span>Repetition Time (TR) — Controls T1 Recovery:</span>
                  <span className="font-mono text-adani-cyan bg-white px-2 py-0.5 rounded border border-slate-200">
                    {tr} ms
                  </span>
                </div>
                <input
                  type="range"
                  min={300}
                  max={4000}
                  step={50}
                  value={tr}
                  onChange={(e) => setTr(parseInt(e.target.value))}
                  className="w-full accent-adani-cyan cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>300 ms (Short TR / T1)</span>
                  <span>4000 ms (Long TR / T2, PD)</span>
                </div>
              </div>

              {/* TE Slider */}
              <div className="space-y-1.5 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="flex justify-between text-xs font-bold text-slate-800">
                  <span>Echo Time (TE) — Controls T2 Dephasing:</span>
                  <span className="font-mono text-adani-purple bg-white px-2 py-0.5 rounded border border-slate-200">
                    {te} ms
                  </span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={150}
                  step={2}
                  value={te}
                  onChange={(e) => setTe(parseInt(e.target.value))}
                  className="w-full accent-adani-purple cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>10 ms (Short TE / Minimal Decay)</span>
                  <span>150 ms (Long TE / Heavy T2 Weighting)</span>
                </div>
              </div>

              {/* Live Signal Table */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2.5 rounded-xl bg-slate-100 border border-slate-200">
                  <span className="text-[10px] text-slate-500 font-bold block">CSF Signal</span>
                  <strong className="text-sm font-mono text-slate-900">
                    {Math.round(csfSignal * 100)}%
                  </strong>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-100 border border-slate-200">
                  <span className="text-[10px] text-slate-500 font-bold block">Gray Matter</span>
                  <strong className="text-sm font-mono text-slate-900">
                    {Math.round(gmSignal * 100)}%
                  </strong>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-100 border border-slate-200">
                  <span className="text-[10px] text-slate-500 font-bold block">White Matter</span>
                  <strong className="text-sm font-mono text-slate-900">
                    {Math.round(wmSignal * 100)}%
                  </strong>
                </div>
              </div>

              {/* Preset Shortcuts */}
              <div className="flex items-center gap-2 pt-1">
                <span className="text-xs text-slate-500 font-medium">Quick Presets:</span>
                <button
                  onClick={() => { setTr(500); setTe(15); }}
                  className="px-2.5 py-1 rounded-lg text-xs font-bold bg-sky-50 text-adani-cyan border border-sky-200 hover:bg-sky-100 transition-colors"
                >
                  T1-Weighted (500/15)
                </button>
                <button
                  onClick={() => { setTr(3000); setTe(90); }}
                  className="px-2.5 py-1 rounded-lg text-xs font-bold bg-purple-50 text-adani-purple border border-purple-200 hover:bg-purple-100 transition-colors"
                >
                  T2-Weighted (3000/90)
                </button>
                <button
                  onClick={() => { setTr(3000); setTe(15); }}
                  className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors"
                >
                  Proton Density (3000/15)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
