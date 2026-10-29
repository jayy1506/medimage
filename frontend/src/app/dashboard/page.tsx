"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import {
  Award,
  CheckCircle2,
  Circle,
  AlertTriangle,
  RotateCcw,
  BookOpen,
  ArrowRight,
  TrendingUp,
  Activity,
  BarChart3,
  LogOut,
  Sparkles,
  Layers,
  ChevronDown,
  ChevronRight,
  Clock,
  Code,
  Sliders,
  Shield,
  FileText
} from "lucide-react";

interface TopicItem {
  id: string;
  slug: string;
  title: string;
  readTime: number;
  coTag: string;
  isCompleted: boolean;
}

interface CurriculumModule {
  id: string;
  moduleCode: string;
  title: string;
  description: string;
  theoryHours: number;
  coTarget: string;
  bestScorePct: number;
  latestScorePct: number;
  attemptsCount: number;
  isPassed: boolean;
  status: "cleared" | "needs_remediation" | "not_started";
  topics: TopicItem[];
}

export default function UnifiedCurriculumDashboard() {
  const { user, role, signOut } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [expandedModule, setExpandedModule] = useState<string>("mod-1");

  // Full accredited curriculum data for AIDS 12605.1
  const [modules, setModules] = useState<CurriculumModule[]>([
    {
      id: "mod-1",
      moduleCode: "MODULE 01",
      title: "Medical Image Sources & Physics",
      description: "Radiology, electromagnetic spectrum, basic X-ray physics, differential photon attenuation, Beer-Lambert formulation, CT, MRI, ultrasound, and nuclear medicine.",
      theoryHours: 8,
      coTarget: "CO1, CO2",
      bestScorePct: 84.5,
      latestScorePct: 84.5,
      attemptsCount: 2,
      isPassed: true,
      status: "cleared",
      topics: [
        {
          id: "m1-t1",
          slug: "m1-t1-radiology-spectrum",
          title: "Radiology & The Diagnostic Electromagnetic Spectrum",
          readTime: 15,
          coTag: "CO1",
          isCompleted: true
        },
        {
          id: "m1-t2",
          slug: "xray-ct-physics",
          title: "X-Ray Physics, Attenuation & Half-Value Layer (HVL)",
          readTime: 20,
          coTag: "CO1",
          isCompleted: true
        },
        {
          id: "m1-t3",
          slug: "computed-tomography-intro",
          title: "Computed Tomography (CT) Principles & Projection Geometry",
          readTime: 25,
          coTag: "CO1, CO4",
          isCompleted: false
        }
      ]
    },
    {
      id: "mod-2",
      moduleCode: "MODULE 02",
      title: "Image Processing in Clinical Practice",
      description: "Clinical image databases, Hospital Information Systems (HIS), PACS infrastructure, intensity operations, contrast stretching, and clinical workflow.",
      theoryHours: 8,
      coTarget: "CO2",
      bestScorePct: 78.0,
      latestScorePct: 78.0,
      attemptsCount: 1,
      isPassed: true,
      status: "cleared",
      topics: [
        {
          id: "m2-t1",
          slug: "dicom-standards",
          title: "Clinical Image Databases & PACS Architecture",
          readTime: 18,
          coTag: "CO2",
          isCompleted: true
        },
        {
          id: "m2-t2",
          slug: "intensity-windowing",
          title: "Radiographic Contrast Transformations & Transfer Curves",
          readTime: 22,
          coTag: "CO2",
          isCompleted: false
        }
      ]
    },
    {
      id: "mod-3",
      moduleCode: "MODULE 03",
      title: "Image Representation & DICOM Standards",
      description: "Pixels and voxels, standardized Hounsfield Units (HU), DICOM Part 10 tag structures, transfer syntaxes, and window width/level (WW/WL) calibration.",
      theoryHours: 8,
      coTarget: "CO2, CO4",
      bestScorePct: 72.0,
      latestScorePct: 72.0,
      attemptsCount: 1,
      isPassed: false,
      status: "needs_remediation",
      topics: [
        {
          id: "m3-t1",
          slug: "pixel-voxel-standards",
          title: "Spatial Sampling, Grayscale Depth & HU Calibration",
          readTime: 20,
          coTag: "CO2",
          isCompleted: true
        },
        {
          id: "m3-t2",
          slug: "dicom-metadata-parsing",
          title: "DICOM Tag Dictionaries & HIPAA De-Identification",
          readTime: 25,
          coTag: "CO2",
          isCompleted: false
        }
      ]
    },
    {
      id: "mod-4",
      moduleCode: "MODULE 04",
      title: "Tomographic Reconstruction & Radon Transform",
      description: "Parallel & fan-beam projections, continuous Radon transform, projection slice theorem, sinograms, and Filtered Backprojection (FBP) with Ram-Lak kernels.",
      theoryHours: 8,
      coTarget: "CO3, CO4",
      bestScorePct: 0.0,
      latestScorePct: 0.0,
      attemptsCount: 0,
      isPassed: false,
      status: "not_started",
      topics: [
        {
          id: "m4-t1",
          slug: "radon-transform-sinogram",
          title: "Line Integrals, Projection Geometry & Sinograms",
          readTime: 25,
          coTag: "CO3",
          isCompleted: false
        },
        {
          id: "m4-t2",
          slug: "filtered-backprojection",
          title: "Projection Slice Theorem & Frequency Ramp Filtering",
          readTime: 30,
          coTag: "CO4",
          isCompleted: false
        }
      ]
    },
    {
      id: "mod-5",
      moduleCode: "MODULE 05",
      title: "Medical Image Segmentation & 2D Spatial Filtering",
      description: "2D spatial convolutions (Sobel, Laplacian, Gaussian), histogram equalization, Otsu thresholding, morphological operations, and U-Net architectures.",
      theoryHours: 8,
      coTarget: "CO3, CO4",
      bestScorePct: 0.0,
      latestScorePct: 0.0,
      attemptsCount: 0,
      isPassed: false,
      status: "not_started",
      topics: [
        {
          id: "m5-t1",
          slug: "spatial-convolution",
          title: "2D Spatial Kernels, Edge Enhancement & High-Pass Filters",
          readTime: 20,
          coTag: "CO3",
          isCompleted: false
        },
        {
          id: "m5-t2",
          slug: "clinical-segmentation-unet",
          title: "Otsu Adaptive Thresholding & Semantic U-Net Models",
          readTime: 25,
          coTag: "CO4",
          isCompleted: false
        }
      ]
    },
    {
      id: "mod-6",
      moduleCode: "MODULE 06",
      title: "Clinical NLP & Multimodal Medical AI",
      description: "Biomedical entity extraction, BioBERT/ClinicalBERT, structured radiology report summarization, and multimodal image-text clinical diagnostic pipelines.",
      theoryHours: 8,
      coTarget: "CO5",
      bestScorePct: 0.0,
      latestScorePct: 0.0,
      attemptsCount: 0,
      isPassed: false,
      status: "not_started",
      topics: [
        {
          id: "m6-t1",
          slug: "radiology-nlp-biobert",
          title: "Biomedical Named Entity Recognition (NER) & Report Summarization",
          readTime: 25,
          coTag: "CO5",
          isCompleted: false
        },
        {
          id: "m6-t2",
          slug: "multimodal-clinical-ai",
          title: "Vision-Language Grounding in Diagnostic Imaging",
          readTime: 30,
          coTag: "CO5",
          isCompleted: false
        }
      ]
    }
  ]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Key KPI Aggregations
  const totalModules = modules.length;
  const clearedModules = modules.filter((m) => m.isPassed).length;
  const completionPct = Math.round((clearedModules / totalModules) * 100);

  const totalTopics = modules.reduce((acc, m) => acc + m.topics.length, 0);
  const completedTopics = modules.reduce(
    (acc, m) => acc + m.topics.filter((t) => t.isCompleted).length,
    0
  );

  const coAttainments = [
    { code: "CO1", title: "Medical Image Sources & Physics", score: 84.5, target: 75.0, status: "Met" },
    { code: "CO2", title: "DICOM Standards & Protocols", score: 81.2, target: 75.0, status: "Met" },
    { code: "CO3", title: "2D Filtering & Transforms", score: 72.0, target: 75.0, status: "In Progress" },
    { code: "CO4", title: "3D Reconstruction & Segmentation", score: 0.0, target: 75.0, status: "Pending" },
    { code: "CO5", title: "Clinical NLP & Diagnostics", score: 0.0, target: 75.0, status: "Pending" }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col">
      {/* Institutional Top Navbar without image logo */}
      <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 via-purple-600 to-pink-500 flex items-center justify-center text-white font-black text-sm shadow-md">
              AI
            </div>
            <div>
              <span className="text-sm font-bold tracking-wide text-white block">
                Adani Institute of Higher Education and Research
              </span>
              <span className="text-xs text-sky-400 font-medium">
                Faculty of Engineering & Technology • AIDS 12605.1
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/playground"
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 transition-colors flex items-center gap-1.5 border border-slate-700/60"
            >
              <Layers className="w-3.5 h-3.5 text-purple-400" />
              Playgrounds
            </Link>

            {role && ["admin", "faculty"].includes(role) && (
              <Link
                href="/faculty"
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-purple-300 bg-purple-950/60 hover:bg-purple-900/60 border border-purple-800/50 transition-colors flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Faculty Studio
              </Link>
            )}

            {role === "admin" && (
              <Link
                href="/admin"
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-purple-300 bg-purple-900/40 hover:bg-purple-800/60 border border-purple-700/50 transition-colors flex items-center gap-1.5"
              >
                <Shield className="w-3.5 h-3.5" />
                Admin Console
              </Link>
            )}

            <div className="h-4 w-px bg-slate-800" />
            <button
              onClick={() => signOut()}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-red-400 hover:bg-red-950/30 transition-colors flex items-center gap-1"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Banner with Progress Dial */}
        <section className="bg-gradient-to-r from-slate-900 via-slate-900 to-sky-950/40 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-semibold uppercase tracking-wider mb-2">
                <Activity className="w-3.5 h-3.5" />
                B.Tech Semester VI • Comprehensive Course Dashboard
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Medical Text and Image Processing
              </h1>
              <p className="text-slate-400 text-sm mt-1 max-w-2xl leading-relaxed">
                Candidate: <span className="text-sky-300 font-mono font-medium">{user?.email || "student.fet@adani.edu.in"}</span>.
                Master all 6 clinical modules through interactive dual-panel theory, in-browser code sandbox, and strict &gt;75.0% pass rule assessments.
              </p>
            </div>

            {/* Dial & Stats */}
            <div className="flex items-center gap-6 bg-slate-950/80 border border-slate-800 p-4 rounded-2xl">
              <div className="relative w-16 h-16 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-800"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-sky-500 transition-all duration-1000 ease-out"
                    strokeDasharray={`${completionPct}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute text-center">
                  <span className="text-sm font-bold text-white">{completionPct}%</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-xs text-slate-400 font-medium block">Mastery Clearance</span>
                <span className="text-sm font-bold text-white block">
                  {clearedModules} of {totalModules} Modules Cleared
                </span>
                <span className="text-[11px] text-amber-400 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> Pass Rule: &gt; 75.00%
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* 2-Column: Course Outcome Meters & Quick Workstations */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: NBA Tier-1 CO Attainment */}
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-sky-400" />
                Course Outcome (CO) Metrics
              </h2>
              <span className="text-[10px] font-semibold text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded">
                NBA Tier-1
              </span>
            </div>

            <div className="space-y-3 pt-1">
              {coAttainments.map((co) => (
                <div key={co.code} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-300">
                      {co.code}: <span className="font-normal text-slate-400">{co.title}</span>
                    </span>
                    <span
                      className={`font-mono text-xs font-semibold ${
                        co.score > co.target
                          ? "text-emerald-400"
                          : co.score > 0
                          ? "text-amber-400"
                          : "text-slate-600"
                      }`}
                    >
                      {co.score > 0 ? `${co.score}%` : "Pending"}
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        co.score > co.target
                          ? "bg-emerald-500"
                          : co.score > 0
                          ? "bg-amber-500"
                          : "bg-slate-700"
                      }`}
                      style={{ width: `${Math.min(co.score, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Quick Interactive Workstations (2 Cols) */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link
              href="/playground"
              className="bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-purple-500/40 rounded-2xl p-4 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center mb-3">
                  <Sliders className="w-4 h-4" />
                </div>
                <h3 className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors">
                  CT Windowing (WW/WL)
                </h3>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                  Real-time 60 FPS client canvas transfer curves: Brain, Bone, Lung & Soft Tissue.
                </p>
              </div>
              <span className="text-[11px] font-semibold text-purple-400 flex items-center gap-1 mt-4">
                Open Canvas <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </Link>

            <Link
              href="/playground"
              className="bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-sky-500/40 rounded-2xl p-4 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center mb-3">
                  <Code className="w-4 h-4" />
                </div>
                <h3 className="text-xs font-bold text-white group-hover:text-sky-300 transition-colors">
                  Spatial Convolution & FFT
                </h3>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                  Interactive $3 \times 3$ kernel grid: Sobel, Laplacian, Gaussian & Fourier filtering.
                </p>
              </div>
              <span className="text-[11px] font-semibold text-sky-400 flex items-center gap-1 mt-4">
                Test Kernels <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </Link>

            <Link
              href="/playground"
              className="bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-emerald-500/40 rounded-2xl p-4 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-3">
                  <FileText className="w-4 h-4" />
                </div>
                <h3 className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">
                  DICOM Tag Explorer
                </h3>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                  Searchable tag tree & HIPAA de-identification sandbox with clinical TCIA sample scans.
                </p>
              </div>
              <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1 mt-4">
                Inspect Tags <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </Link>
          </div>
        </div>

        {/* FULL ACCREDITED CURRICULUM SECTION (ALL 6 MODULES) */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-sky-400" />
                Course Curriculum & Module Directory
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Select any module below to view topics, open the Dual-Panel Workstation, or launch the Mastery Assessment.
              </p>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              Completed Topics: <strong className="text-sky-400">{completedTopics}</strong> / {totalTopics}
            </span>
          </div>

          {/* Module Cards Accordion */}
          <div className="space-y-3">
            {modules.map((m) => {
              const isExpanded = expandedModule === m.id;
              return (
                <div
                  key={m.id}
                  className="bg-slate-900/60 border border-slate-800/80 rounded-2xl overflow-hidden transition-all"
                >
                  {/* Module Header Bar */}
                  <div
                    onClick={() => setExpandedModule(isExpanded ? "" : m.id)}
                    className="p-4 sm:p-5 flex items-center justify-between cursor-pointer hover:bg-slate-800/40 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col items-center justify-center w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 flex-shrink-0">
                        <span className="text-[10px] font-bold text-sky-400">MOD</span>
                        <span className="text-base font-extrabold text-white">
                          {m.moduleCode.replace("MODULE ", "")}
                        </span>
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm sm:text-base font-bold text-white">{m.title}</h3>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                            {m.coTarget}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5 line-clamp-1 max-w-2xl">
                          {m.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      {/* Status Badge */}
                      <div className="text-right hidden sm:block">
                        {m.status === "cleared" && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Cleared ({m.bestScorePct}%)
                          </span>
                        )}
                        {m.status === "needs_remediation" && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            <AlertTriangle className="w-3.5 h-3.5" /> Retake Req ({m.bestScorePct}%)
                          </span>
                        )}
                        {m.status === "not_started" && (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-400">
                            Not Attempted
                          </span>
                        )}
                      </div>

                      <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400">
                        {isExpanded ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Topics & Action Controls */}
                  {isExpanded && (
                    <div className="px-5 pb-5 pt-2 border-t border-slate-800/60 bg-slate-950/40 space-y-4">
                      {/* Topics List */}
                      <div className="space-y-2">
                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                          Syllabus Topic Sections:
                        </span>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                          {m.topics.map((t) => (
                            <Link
                              key={t.id}
                              href={`/course/${m.id}/${t.slug}`}
                              className="p-3 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-sky-500/40 rounded-xl flex items-center justify-between group transition-all"
                            >
                              <div className="flex items-center gap-3">
                                {t.isCompleted ? (
                                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                                ) : (
                                  <Circle className="w-4 h-4 text-slate-600 flex-shrink-0" />
                                )}
                                <div>
                                  <span className="text-xs font-medium text-slate-200 group-hover:text-white transition-colors block">
                                    {t.title}
                                  </span>
                                  <span className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                                    <Clock className="w-3 h-3" /> {t.readTime} mins • {t.coTag}
                                  </span>
                                </div>
                              </div>
                              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-sky-400 group-hover:translate-x-1 transition-all" />
                            </Link>
                          ))}
                        </div>
                      </div>

                      {/* Module Assessment Trigger Bar */}
                      <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/60 p-3.5 rounded-xl border border-slate-800/80">
                        <div>
                          <span className="text-xs font-bold text-white flex items-center gap-1.5">
                            <Award className="w-4 h-4 text-purple-400" />
                            Mastery Assessment Clearance (&gt;75.0% Rule)
                          </span>
                          <span className="text-[11px] text-slate-400 block mt-0.5">
                            {m.attemptsCount > 0
                              ? `Attempts Recorded: ${m.attemptsCount} • Best Score: ${m.bestScorePct}%`
                              : "No assessment attempts recorded yet."}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Link
                            href={`/course/${m.id}/${m.topics[0]?.slug || "topic-1"}`}
                            className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
                          >
                            Open Dual-Panel Theory
                          </Link>
                          <Link
                            href={`/course/${m.id}/quiz`}
                            className="px-4 py-1.5 rounded-lg text-xs font-semibold text-white bg-gradient-to-r from-sky-500 to-purple-600 hover:opacity-95 shadow-md transition-all flex items-center gap-1.5"
                          >
                            <Award className="w-3.5 h-3.5" />
                            Take Assessment Quiz
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Footer with No Image Logo */}
        <footer className="border-t border-slate-800 pt-6 text-center text-xs text-slate-500 space-y-1">
          <p>
            AIDS 12605.1 Medical Text and Image Processing • Faculty of Engineering and Technology
          </p>
          <p className="text-[11px] text-slate-600">
            Adani Institute of Higher Education and Research (Deemed to be University), Shantigram, Ahmedabad, Gujarat 382421.
          </p>
        </footer>
      </main>
    </div>
  );
}
