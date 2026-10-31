"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Layers, 
  Plus, 
  Trash2, 
  Play, 
  Code, 
  Copy, 
  Check, 
  ArrowRight, 
  Sparkles, 
  Sliders, 
  Info, 
  RefreshCw,
  FileCode2,
  Activity
} from "lucide-react";
import { 
  PipelineStepConfig, 
  generatePythonPipelineCode,
  applyConvolution,
  applyMedianFilter,
  applyThreshold,
  applyErosion,
  applyDilation,
  computeOtsuThreshold,
  computeHistogram,
  measureBinaryRegion,
  RegionMeasurement
} from "@/lib/imagingEngine";
import { useGamification } from "@/context/GamificationContext";

export default function PipelineBuilder() {
  const { unlockBadge } = useGamification();

  const [steps, setSteps] = useState<PipelineStepConfig[]>([
    {
      id: "step-1",
      type: "blur",
      label: "Gaussian Blur (Denoising)",
      params: { kernelSize: 5, sigma: 1.2 }
    },
    {
      id: "step-2",
      type: "threshold",
      label: "Otsu Automated Thresholding",
      params: { method: "otsu", thresholdValue: 128 }
    },
    {
      id: "step-3",
      type: "morphology",
      label: "Morphological Erosion",
      params: { operation: "erode", radius: 2 }
    },
    {
      id: "step-4",
      type: "measure",
      label: "Measure Area & Centroid",
      params: {}
    }
  ]);

  const [selectedScan, setSelectedScan] = useState<"brain" | "lung" | "cells">("brain");
  const [measurement, setMeasurement] = useState<RegionMeasurement | null>(null);
  const [showCodeModal, setShowCodeModal] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  // Canvas refs for step thumbnail previews
  const sourceCanvasRef = useRef<HTMLCanvasElement>(null);
  const stepCanvasRefs = useRef<(HTMLCanvasElement | null)[]>([]);

  // Draw Base Phantom on source canvas
  const drawBaseScan = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    ctx.fillStyle = "#050b14";
    ctx.fillRect(0, 0, w, h);

    const cx = w / 2;
    const cy = h / 2;

    if (selectedScan === "brain") {
      // Skull + parenchyma + tumor
      ctx.fillStyle = "#222d3d";
      ctx.beginPath();
      ctx.ellipse(cx, cy, 75, 90, 0, 0, Math.PI * 2);
      ctx.fill();

      // Brain parenchyma
      ctx.fillStyle = "#55657e";
      ctx.beginPath();
      ctx.ellipse(cx, cy, 65, 80, 0, 0, Math.PI * 2);
      ctx.fill();

      // Ventricles
      ctx.fillStyle = "#161d27";
      ctx.beginPath();
      ctx.ellipse(cx - 15, cy - 5, 8, 25, 0.2, 0, Math.PI * 2);
      ctx.ellipse(cx + 15, cy - 5, 8, 25, -0.2, 0, Math.PI * 2);
      ctx.fill();

      // Hyperintense Tumor mass
      ctx.fillStyle = "#e2e8f0";
      ctx.beginPath();
      ctx.ellipse(cx + 25, cy - 25, 22, 20, 0.4, 0, Math.PI * 2);
      ctx.fill();

      // Add noise speckles
      ctx.fillStyle = "#ffffff";
      for (let i = 0; i < 200; i++) {
        const rx = cx - 60 + Math.random() * 120;
        const ry = cy - 70 + Math.random() * 140;
        ctx.fillRect(rx, ry, 1, 1);
      }
    } else if (selectedScan === "lung") {
      // Thorax outline
      ctx.fillStyle = "#334155";
      ctx.beginPath();
      ctx.ellipse(cx, cy, 85, 80, 0, 0, Math.PI * 2);
      ctx.fill();

      // Lungs (darker air)
      ctx.fillStyle = "#0f172a";
      ctx.beginPath();
      ctx.ellipse(cx - 35, cy, 25, 45, 0.1, 0, Math.PI * 2);
      ctx.ellipse(cx + 35, cy, 25, 45, -0.1, 0, Math.PI * 2);
      ctx.fill();

      // Nodule / consolidation
      ctx.fillStyle = "#cbd5e1";
      ctx.beginPath();
      ctx.arc(cx - 30, cy + 10, 14, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Biological cell microscopy
      ctx.fillStyle = "#090d16";
      ctx.fillRect(0, 0, w, h);

      // Multiple stained cells
      const cellPositions = [
        { x: cx - 40, y: cy - 30, r: 24 },
        { x: cx + 35, y: cy - 20, r: 28 },
        { x: cx - 10, y: cy + 40, r: 22 },
        { x: cx + 45, y: cy + 35, r: 18 }
      ];

      cellPositions.forEach((cell) => {
        ctx.fillStyle = "#64748b";
        ctx.beginPath();
        ctx.arc(cell.x, cell.y, cell.r, 0, Math.PI * 2);
        ctx.fill();

        // Dense cell nucleus
        ctx.fillStyle = "#f8fafc";
        ctx.beginPath();
        ctx.arc(cell.x, cell.y, cell.r * 0.45, 0, Math.PI * 2);
        ctx.fill();
      });
    }
  };

  // Execute Pipeline step by step
  const runPipeline = () => {
    const srcCanvas = sourceCanvasRef.current;
    if (!srcCanvas) return;
    const srcCtx = srcCanvas.getContext("2d");
    if (!srcCtx) return;

    drawBaseScan(srcCtx, srcCanvas.width, srcCanvas.height);
    let currentData = srcCtx.getImageData(0, 0, srcCanvas.width, srcCanvas.height);

    steps.forEach((step, idx) => {
      const stepCanvas = stepCanvasRefs.current[idx];
      if (!stepCanvas) return;
      const stepCtx = stepCanvas.getContext("2d");
      if (!stepCtx) return;

      if (step.type === "blur") {
        const k = [
          [1, 2, 1],
          [2, 4, 2],
          [1, 2, 1]
        ];
        currentData = applyConvolution(currentData, k, 16, 0);
      } else if (step.type === "threshold") {
        if (step.params.method === "otsu") {
          const hist = computeHistogram(currentData);
          const { threshold } = computeOtsuThreshold(hist.bins, currentData.width * currentData.height);
          currentData = applyThreshold(currentData, threshold);
        } else {
          currentData = applyThreshold(currentData, step.params.thresholdValue || 128);
        }
      } else if (step.type === "morphology") {
        if (step.params.operation === "erode") {
          currentData = applyErosion(currentData, step.params.radius || 2);
        } else if (step.params.operation === "dilate") {
          currentData = applyDilation(currentData, step.params.radius || 2);
        } else if (step.params.operation === "open") {
          currentData = applyDilation(applyErosion(currentData, step.params.radius || 2), step.params.radius || 2);
        } else {
          currentData = applyErosion(applyDilation(currentData, step.params.radius || 2), step.params.radius || 2);
        }
      } else if (step.type === "measure") {
        const meas = measureBinaryRegion(currentData);
        setMeasurement(meas);
      }

      stepCtx.putImageData(currentData, 0, 0);
    });

    if (steps.length >= 4) {
      unlockBadge("badge-pipeline");
    }
  };

  useEffect(() => {
    runPipeline();
  }, [selectedScan, steps]);

  const addStep = (type: "blur" | "threshold" | "morphology" | "measure") => {
    let label = "Gaussian Blur";
    let params: Record<string, any> = {};

    if (type === "blur") {
      label = "Gaussian Smoothing Filter";
      params = { kernelSize: 5, sigma: 1.2 };
    } else if (type === "threshold") {
      label = "Otsu Automatic Binarization";
      params = { method: "otsu", thresholdValue: 128 };
    } else if (type === "morphology") {
      label = "Morphological Opening";
      params = { operation: "open", radius: 2 };
    } else if (type === "measure") {
      label = "Quantitative Area & Centroid";
      params = {};
    }

    const newStep: PipelineStepConfig = {
      id: `step-${Date.now()}`,
      type,
      label,
      params
    };

    setSteps((prev) => [...prev, newStep]);
  };

  const removeStep = (index: number) => {
    setSteps((prev) => prev.filter((_, idx) => idx !== index));
  };

  const pythonScript = generatePythonPipelineCode(steps);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(pythonScript);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Info Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-adani-navy via-slate-900 to-adani-dark text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-adani-cyan/20 text-adani-cyan text-[11px] font-bold uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5" />
            Module 5 • Fiji / Bioimage Workflow Engine
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            Visual Bioimage Pipeline Builder
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Construct sequential clinical processing graphs (Blur → Segment → Erode → Measure). Inspect intermediate thumbnails at each phase and export production-ready Python OpenCV / SciPy code.
          </p>
        </div>

        <button
          onClick={() => setShowCodeModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-adani-cyan to-adani-purple text-white text-xs font-bold shadow-md hover:opacity-95 transition-all flex-shrink-0"
        >
          <Code className="w-4 h-4" />
          Export Python Script
        </button>
      </div>

      {/* Dataset Selection Bar */}
      <div className="flex items-center justify-between bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center space-x-2 text-xs font-bold text-slate-700">
          <span>Source Specimen:</span>
          {(["brain", "lung", "cells"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setSelectedScan(s)}
              className={`px-3 py-1.5 rounded-lg capitalize transition-all ${
                selectedScan === s
                  ? "bg-adani-cyan text-white shadow-sm font-extrabold"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {s === "brain" ? "Brain MRI (Tumor)" : s === "lung" ? "Chest CT (Nodule)" : "Microscopy (Cells)"}
            </button>
          ))}
        </div>

        <button
          onClick={runPipeline}
          className="text-xs font-bold text-slate-600 hover:text-adani-navy flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Re-run Pipeline
        </button>
      </div>

      {/* Pipeline Steps Sequence */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Pipeline Execution Flow ({steps.length + 1} Stages)
          </span>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">Add Block:</span>
            <button
              onClick={() => addStep("blur")}
              className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-sky-50 text-adani-cyan border border-sky-200 hover:bg-sky-100 transition-colors"
            >
              + Blur
            </button>
            <button
              onClick={() => addStep("threshold")}
              className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-purple-50 text-adani-purple border border-purple-200 hover:bg-purple-100 transition-colors"
            >
              + Threshold
            </button>
            <button
              onClick={() => addStep("morphology")}
              className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors"
            >
              + Morphology
            </button>
            <button
              onClick={() => addStep("measure")}
              className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 transition-colors"
            >
              + Measure
            </button>
          </div>
        </div>

        {/* Horizontal Pipeline Steps Carousel */}
        <div className="flex items-start gap-4 overflow-x-auto pb-4 scrollbar-thin">
          {/* Stage 0: Source Specimen */}
          <div className="w-52 flex-shrink-0 p-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-extrabold text-slate-800">0. Source Scan</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 font-mono text-slate-500">RAW</span>
            </div>
            <div className="flex justify-center p-1 bg-black rounded-xl">
              <canvas
                ref={sourceCanvasRef}
                width={160}
                height={160}
                className="w-full aspect-square object-contain rounded-lg"
              />
            </div>
            <span className="text-[10px] text-slate-500 block truncate text-center">
              {selectedScan.toUpperCase()} Specimen (256x256)
            </span>
          </div>

          {/* Sequential Dynamic Blocks */}
          {steps.map((step, idx) => (
            <React.Fragment key={step.id}>
              <div className="flex items-center self-center text-slate-300">
                <ArrowRight className="w-5 h-5" />
              </div>

              <div className="w-56 flex-shrink-0 p-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2 relative group hover:border-adani-cyan transition-colors">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-extrabold text-slate-800 truncate max-w-[130px]">
                    {idx + 1}. {step.label}
                  </span>
                  <button
                    onClick={() => removeStep(idx)}
                    className="text-slate-400 hover:text-rose-500 p-1 transition-colors"
                    title="Remove Step"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex justify-center p-1 bg-black rounded-xl">
                  <canvas
                    ref={(el) => {
                      stepCanvasRefs.current[idx] = el;
                    }}
                    width={160}
                    height={160}
                    className="w-full aspect-square object-contain rounded-lg"
                  />
                </div>

                {/* Step Parameter Controls */}
                <div className="text-[11px] text-slate-600 space-y-1 pt-1">
                  {step.type === "threshold" && (
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Method:</span>
                      <span className="font-bold text-adani-purple font-mono">Otsu Max Variance</span>
                    </div>
                  )}
                  {step.type === "morphology" && (
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Op / Disk Rad:</span>
                      <span className="font-bold text-emerald-700 font-mono">
                        {step.params.operation} (r={step.params.radius}px)
                      </span>
                    </div>
                  )}
                  {step.type === "blur" && (
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Kernel:</span>
                      <span className="font-bold text-sky-600 font-mono">Gaussian 3x3</span>
                    </div>
                  )}
                  {step.type === "measure" && measurement && (
                    <div className="p-1.5 rounded bg-amber-50 border border-amber-200 text-[10px] space-y-0.5">
                      <div className="flex justify-between font-bold text-amber-900">
                        <span>Area:</span>
                        <span>{measurement.areaPixels} px ({measurement.foregroundPercentage.toFixed(1)}%)</span>
                      </div>
                      <div className="flex justify-between text-amber-800">
                        <span>Centroid:</span>
                        <span>({measurement.centroidX}, {measurement.centroidY})</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Quantitative Analysis Card */}
      {measurement && (
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-800">
            <Activity className="w-4 h-4 text-emerald-600" />
            <span>Automated Clinical Morphology Measurement Results</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-500">Segmented Lesion Area</span>
              <p className="text-lg font-black text-slate-900 font-mono">
                {measurement.areaPixels} <span className="text-xs font-normal text-slate-500">pixels</span>
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-500">Centroid Coordinates (X, Y)</span>
              <p className="text-lg font-black text-adani-navy font-mono">
                ({measurement.centroidX}, {measurement.centroidY})
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-500">Foreground Density Ratio</span>
              <p className="text-lg font-black text-emerald-600 font-mono">
                {measurement.foregroundPercentage.toFixed(2)} %
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Python Script Export Modal */}
      {showCodeModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 text-white space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <FileCode2 className="w-5 h-5 text-adani-cyan" />
                <h3 className="text-sm font-extrabold text-white">
                  Export Equivalent Python (OpenCV &amp; SciPy) Pipeline
                </h3>
              </div>
              <button
                onClick={() => setShowCodeModal(false)}
                className="text-slate-400 hover:text-white text-xs font-bold"
              >
                Close ✕
              </button>
            </div>

            <div className="p-3 bg-slate-900 rounded-xl max-h-[380px] overflow-y-auto font-mono text-xs text-sky-300 border border-slate-800">
              <pre>{pythonScript}</pre>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-slate-400">
                Ready to execute in Jupyter Notebook or Google Colab with <code className="text-white">pip install opencv-python scipy</code>
              </span>
              <button
                onClick={copyToClipboard}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-adani-cyan hover:bg-sky-500 text-white font-bold text-xs shadow-md transition-all"
              >
                {copiedCode ? (
                  <>
                    <Check className="w-4 h-4 text-white" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-white" />
                    <span>Copy Code</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
