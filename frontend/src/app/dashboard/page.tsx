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
      description: "Fourier transforms, 2D FFT, contrast enhancement, histogram equalization, spatial vs frequency filtering, and clinical artifact reduction.",
      theoryHours: 8,
      coTarget: "CO2, CO3",
      bestScorePct: 79.0,
      latestScorePct: 79.0,
      attemptsCount: 1,
      isPassed: true,
      status: "cleared",
      topics: [
        {
          id: "m2-t1",
          slug: "fourier-transform-medical-imaging",
          title: "2D Discrete Fourier Transform & k-Space Principles",
          readTime: 20,
          coTag: "CO2",
          isCompleted: true
        },
        {
          id: "m2-t2",
          slug: "contrast-enhancement-clahe",
          title: "Histogram Equalization & Contrast Limited Adaptive HE (CLAHE)",
          readTime: 18,
          coTag: "CO3",
          isCompleted: false
        }
      ]
    },
    {
      id: "mod-3",
      moduleCode: "MODULE 03",
      title: "Image Representation & DICOM Standards",
      description: "Pixel representation, bit depth, photometric interpretation, DICOM header data elements, VRs, Transfer Syntaxes, and HIPAA Safe Harbor de-identification.",
      theoryHours: 8,
      coTarget: "CO2",
      bestScorePct: 62.0,
      latestScorePct: 62.0,
      attemptsCount: 2,
      isPassed: false,
      status: "needs_remediation",
      topics: [
        {
          id: "m3-t1",
          slug: "dicom-data-structure-vr",
          title: "DICOM File Format, Value Representations (VR) & Tag Elements",
          readTime: 20,
          coTag: "CO2",
          isCompleted: true
        },
        {
          id: "m3-t2",
          slug: "hipaa-deidentification-sanitization",
          title: "HIPAA Safe Harbor De-Identification & Clinical Data Privacy",
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
      description: "Radon transform, sinogram formation, projection geometry, Central Slice Theorem, Backprojection, and Filtered Backprojection (Ram-Lak / Shepp-Logan).",
      theoryHours: 9,
      coTarget: "CO4",
      bestScorePct: 0.0,
      latestScorePct: 0.0,
      attemptsCount: 0,
      isPassed: false,
      status: "not_started",
      topics: [
        {
          id: "m4-t1",
          slug: "radon-transform-sinogram",
          title: "Radon Transform Geometry & Sinogram Projection Mapping",
          readTime: 25,
          coTag: "CO4",
          isCompleted: false
        },
        {
          id: "m4-t2",
          slug: "filtered-backprojection-algorithm",
          title: "Filtered Backprojection (FBP) & Ram-Lak Ramp Filtering",
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
      description: "2D spatial kernels, Sobel/Laplacian operators, Gaussian blurring, Otsu automated thresholding, and semantic U-Net segmentation architectures.",
      theoryHours: 9,
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
          title: "Biomedical Named Entity Recognition & Report Summarization",
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
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col">
      {/* Institutional Top Navbar (White Theme) */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 via-purple-600 to-pink-500 flex items-center justify-center text-white font-black text-sm shadow-sm">
              AI
            </div>
            <div>
              <span className="text-sm font-bold tracking-wide text-adani-navy block">
                Adani Institute of Higher Education and Research
              </span>
              <span className="text-xs text-adani-cyan font-semibold">
                Faculty of Engineering &amp; Technology • AIDS 12605.1
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/playground"
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:text-adani-navy bg-slate-100 hover:bg-slate-200/80 transition-colors flex items-center gap-1.5 border border-slate-200"
            >
              <Layers className="w-3.5 h-3.5 text-adani-purple" />
              Playgrounds
            </Link>

            {role && ["admin", "faculty"].includes(role) && (
              <Link
                href="/faculty"
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-adani-purple bg-purple-50 hover:bg-purple-100/80 border border-purple-200 transition-colors flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Faculty Studio
              </Link>
            )}

            {role === "admin" && (
              <Link
                href="/admin"
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-adani-purple bg-purple-50 hover:bg-purple-100/80 border border-purple-200 transition-colors flex items-center gap-1.5"
              >
                <Shield className="w-3.5 h-3.5" />
                Admin Console
              </Link>
            )}

            <div className="h-4 w-px bg-slate-200" />
            <button
              onClick={() => signOut()}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors flex items-center gap-1"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Banner with Progress Dial (White Theme) */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-sky-50 border border-sky-200 text-adani-cyan text-xs font-bold uppercase tracking-wider mb-2">
                <Activity className="w-3.5 h-3.5" />
                B.Tech Semester VI • Comprehensive Course Dashboard
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Medical Text and Image Processing
              </h1>
              <p className="text-slate-600 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
                Candidate: <span className="text-adani-cyan font-mono font-bold">{user?.email || "student.fet@adani.edu.in"}</span>.
                Master all 6 clinical modules through interactive dual-panel theory, in-browser code sandbox, and strict &gt;75.0% pass rule assessments.
              </p>
            </div>

            {/* Dial & Stats */}
            <div className="flex items-center gap-6 bg-slate-50 border border-slate-200 p-4 rounded-2xl shadow-inner">
              <div className="relative w-16 h-16 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-200"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-adani-cyan transition-all duration-1000 ease-out"
                    strokeDasharray={`${completionPct}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute text-center">
                  <span className="text-sm font-black text-slate-900">{completionPct}%</span>
                </div>
              </div>

              <div className="space-y-0.5">
                <span className="text-xs text-slate-500 font-bold block">Mastery Clearance</span>
                <span className="text-sm font-black text-slate-900 block">
                  {clearedModules} of {totalModules} Modules Cleared
                </span>
                <span className="text-[11px] text-amber-700 font-semibold flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-amber-600" /> Pass Rule: &gt; 75.00%
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* 2-Column: Course Outcome Meters & Quick Workstations */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: NBA Tier-1 CO Attainment */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-adani-cyan" />
                Course Outcome (CO) Metrics
              </h2>
              <span className="text-[10px] font-bold text-adani-cyan bg-sky-50 px-2 py-0.5 rounded border border-sky-100">
                NBA Tier-1
              </span>
            </div>

            <div className="space-y-3 pt-1">
              {coAttainments.map((co) => (
                <div key={co.code} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-700">
                      {co.code}: <span className="font-normal text-slate-500">{co.title}</span>
                    </span>
                    <span
                      className={`font-mono text-xs font-bold ${
                        co.score > co.target
                          ? "text-emerald-700"
                          : co.score > 0
                          ? "text-amber-700"
                          : "text-slate-400"
                      }`}
                    >
                      {co.score > 0 ? `${co.score}%` : "Pending"}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        co.score > co.target
                          ? "bg-emerald-500"
                          : co.score > 0
                          ? "bg-amber-500"
                          : "bg-slate-300"
                      }`}
                      style={{ width: `${Math.min(co.score, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Quick Interactive Workstations */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link
              href="/playground"
              className="bg-white hover:bg-slate-50/80 border border-slate-200 hover:border-purple-300 rounded-2xl p-4 transition-all flex flex-col justify-between shadow-sm group"
            >
              <div>
                <div className="w-9 h-9 rounded-xl bg-purple-50 text-adani-purple border border-purple-100 flex items-center justify-center mb-3">
                  <Sliders className="w-4 h-4" />
                </div>
                <h3 className="text-xs font-bold text-slate-900 group-hover:text-adani-purple transition-colors">
                  CT Windowing (WW/WL)
                </h3>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                  Real-time 60 FPS client canvas transfer curves: Brain, Bone, Lung &amp; Soft Tissue.
                </p>
              </div>
              <span className="text-[11px] font-bold text-adani-purple flex items-center gap-1 mt-4">
                Open Canvas <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </Link>

            <Link
              href="/playground"
              className="bg-white hover:bg-slate-50/80 border border-slate-200 hover:border-sky-300 rounded-2xl p-4 transition-all flex flex-col justify-between shadow-sm group"
            >
              <div>
                <div className="w-9 h-9 rounded-xl bg-sky-50 text-adani-cyan border border-sky-100 flex items-center justify-center mb-3">
                  <Code className="w-4 h-4" />
                </div>
                <h3 className="text-xs font-bold text-slate-900 group-hover:text-adani-cyan transition-colors">
                  Spatial Convolution &amp; FFT
                </h3>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                  Interactive 3x3 kernel grid: Sobel, Laplacian, Gaussian &amp; Fourier filtering.
                </p>
              </div>
              <span className="text-[11px] font-bold text-adani-cyan flex items-center gap-1 mt-4">
                Test Kernels <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </Link>

            <Link
              href="/playground"
              className="bg-white hover:bg-slate-50/80 border border-slate-200 hover:border-emerald-300 rounded-2xl p-4 transition-all flex flex-col justify-between shadow-sm group"
            >
              <div>
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center mb-3">
                  <FileText className="w-4 h-4" />
                </div>
                <h3 className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                  DICOM Tag Explorer
                </h3>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                  Searchable tag tree &amp; HIPAA de-identification sandbox with clinical sample scans.
                </p>
              </div>
              <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1 mt-4">
                Inspect Tags <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </Link>
          </div>
        </div>

        {/* FULL ACCREDITED CURRICULUM SECTION (ALL 6 MODULES) */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-adani-cyan" />
                Course Curriculum &amp; Module Directory
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Select any module below to view topics, open the Dual-Panel Workstation, or launch the Mastery Assessment.
              </p>
            </div>
            <span className="text-xs text-slate-600 font-mono">
              Completed Topics: <strong className="text-adani-cyan font-bold">{completedTopics}</strong> / {totalTopics}
            </span>
          </div>

          {/* Module Cards Accordion (White Theme) */}
          <div className="space-y-3">
            {modules.map((m) => {
              const isExpanded = expandedModule === m.id;
              return (
                <div
                  key={m.id}
                  className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm transition-all"
                >
                  {/* Module Header Bar */}
                  <div
                    onClick={() => setExpandedModule(isExpanded ? "" : m.id)}
                    className="p-4 sm:p-5 flex items-center justify-between cursor-pointer hover:bg-slate-50/80 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col items-center justify-center w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex-shrink-0">
                        <span className="text-[10px] font-bold text-adani-cyan">MOD</span>
                        <span className="text-base font-black text-slate-900">
                          {m.moduleCode.replace("MODULE ", "")}
                        </span>
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm sm:text-base font-bold text-slate-900">{m.title}</h3>
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-sky-50 text-adani-cyan border border-sky-100">
                            {m.coTarget}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-0.5 line-clamp-1 max-w-2xl">
                          {m.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      {/* Status Badge */}
                      <div className="text-right hidden sm:block">
                        {m.status === "cleared" && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Cleared ({m.bestScorePct}%)
                          </span>
                        )}
                        {m.status === "needs_remediation" && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> Retake Req ({m.bestScorePct}%)
                          </span>
                        )}
                        {m.status === "not_started" && (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-500 border border-slate-200">
                            Not Attempted
                          </span>
                        )}
                      </div>

                      <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
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
                    <div className="px-5 pb-5 pt-3 border-t border-slate-100 bg-slate-50/60 space-y-4">
                      {/* Topics List */}
                      <div className="space-y-2">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                          Syllabus Topic Sections:
                        </span>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                          {m.topics.map((t) => (
                            <Link
                              key={t.id}
                              href={`/course/${m.id}/${t.slug}`}
                              className="p-3 bg-white hover:bg-slate-50 border border-slate-200 hover:border-adani-cyan rounded-xl flex items-center justify-between group transition-all shadow-sm"
                            >
                              <div className="flex items-center gap-3">
                                {t.isCompleted ? (
                                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                                ) : (
                                  <Circle className="w-4 h-4 text-slate-300 flex-shrink-0" />
                                )}
                                <div>
                                  <span className="text-xs font-bold text-slate-800 group-hover:text-adani-cyan transition-colors block">
                                    {t.title}
                                  </span>
                                  <span className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                                    <Clock className="w-3 h-3" /> {t.readTime} mins • {t.coTag}
                                  </span>
                                </div>
                              </div>
                              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-adani-cyan group-hover:translate-x-1 transition-all" />
                            </Link>
                          ))}
                        </div>
                      </div>

                      {/* Module Assessment Trigger Bar */}
                      <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                        <div>
                          <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                            <Award className="w-4 h-4 text-adani-purple" />
                            Mastery Assessment Clearance (&gt;75.0% Rule)
                          </span>
                          <span className="text-[11px] text-slate-500 block mt-0.5">
                            {m.attemptsCount > 0
                              ? `Attempts Recorded: ${m.attemptsCount} • Best Score: ${m.bestScorePct}%`
                              : "No assessment attempts recorded yet."}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Link
                            href={`/course/${m.id}/${m.topics[0]?.slug || "topic-1"}`}
                            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition-colors border border-slate-200"
                          >
                            Open Dual-Panel Theory
                          </Link>
                          <Link
                            href={`/course/${m.id}/quiz`}
                            className="px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-gradient-to-r from-adani-cyan to-adani-purple hover:opacity-95 shadow-sm transition-all flex items-center gap-1.5"
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
        <footer className="border-t border-slate-200 pt-6 text-center text-xs text-slate-500 space-y-1">
          <p>
            AIDS 12605.1 Medical Text and Image Processing • Faculty of Engineering and Technology
          </p>
          <p className="text-[11px] text-slate-400">
            Adani Institute of Higher Education and Research, Shantigram, Ahmedabad, Gujarat 382421.
          </p>
        </footer>
      </main>
    </div>
  );
}
