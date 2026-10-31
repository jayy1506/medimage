"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Sliders, 
  Grid, 
  FileText, 
  Scissors, 
  Radio, 
  ChevronLeft, 
  ArrowRight, 
  Activity, 
  Sparkles, 
  Layers, 
  Binary, 
  CheckCircle2, 
  Play, 
  Gamepad2, 
  Atom, 
  Search,
  Target,
  Trophy,
  Flame,
  Award,
  ShieldCheck,
  Check
} from "lucide-react";
import { UserNav } from "@/components/UserNav";
import { BrandLogo } from "@/components/BrandLogo";
import { useGamification, ALL_BADGES } from "@/context/GamificationContext";

interface PlaygroundItem {
  id: string;
  title: string;
  slug: string;
  category: "missions" | "ct" | "filtering" | "dicom" | "segmentation" | "frequency";
  categoryLabel: string;
  moduleBadge: string;
  coTags: string[];
  icon: any;
  colorClass: string;
  bgClass: string;
  borderClass: string;
  description: string;
  features: string[];
  clinicalContext: string;
}

const PLAYGROUNDS_CATALOG: PlaygroundItem[] = [
  {
    id: "clinical-missions",
    title: "Clinical Diagnostic Missions",
    slug: "/playground/missions",
    category: "missions",
    categoryLabel: "Goal-Based Missions",
    moduleBadge: "All Modules • CO1-CO4",
    coTags: ["CO1", "CO2", "CO3"],
    icon: Target,
    colorClass: "text-amber-600",
    bgClass: "bg-amber-50",
    borderClass: "border-amber-200 hover:border-amber-400 ring-2 ring-amber-400/20",
    description: "Objective challenges with target measures: configure bone windows for temporal fractures, subdural hematoma contrast, lung emphysema, and Otsu tumor delineation with live scoring and star ratings.",
    features: [
      "Target contrast ratio scoring against calibrated phantoms",
      "1 to 3 Star achievement system based on clinical precision",
      "Staged physiological hints with hint usage penalty",
      "Personal best score tracking and persistent leaderboard"
    ],
    clinicalContext: "Diagnostic accuracy requires precise parameter tuning. Practice clinical scenario trade-offs with immediate feedback."
  },
  {
    id: "pipeline-builder",
    title: "Bioimage Pipeline Builder",
    slug: "/playground/pipeline",
    category: "filtering",
    categoryLabel: "Workflow Graphs",
    moduleBadge: "Module 5 • CO3, CO4",
    coTags: ["CO3", "CO4"],
    icon: Layers,
    colorClass: "text-adani-purple",
    bgClass: "bg-purple-50",
    borderClass: "border-purple-200 hover:border-purple-400 ring-2 ring-purple-400/20",
    description: "Chain visual blocks (Blur → Otsu Threshold → Morphology → Measure) matching Fiji/Bioimage workflows. Inspect intermediate thumbnails and export production-ready Python OpenCV/SciPy code.",
    features: [
      "Visual block sequence with intermediate canvas previews",
      "Automatic Otsu variance thresholding & morphological filters",
      "Quantitative lesion area (px) and centroid calculation",
      "One-click export of runnable Python / SciPy / OpenCV script"
    ],
    clinicalContext: "Real clinical image analysis relies on repeatable pipelines chaining filtering, binarization, and morphological measurement."
  },
  {
    id: "mini-games-hub",
    title: "Clinical Mini-Games Studio",
    slug: "/playground/games",
    category: "missions",
    categoryLabel: "Interactive Mini-Games",
    moduleBadge: "Module 1, 5 • CO1, CO3",
    coTags: ["CO1", "CO3"],
    icon: Gamepad2,
    colorClass: "text-emerald-700",
    bgClass: "bg-emerald-50",
    borderClass: "border-emerald-200 hover:border-emerald-400 ring-2 ring-emerald-400/20",
    description: "Fast-paced clinical diagnostic games: match ideal noise filters, spot CT/MRI imaging artifacts, draw 2D Fourier frequency spectrum masks, and explore MRI TR/TE contrast equations.",
    features: [
      "Filter Match: Pick optimal filter for Salt-and-Pepper vs Poisson noise",
      "Spot the Artifact: Diagnose Beam Hardening, Motion, Aliasing, Ring",
      "Fourier Mask Studio: Mask 2D k-space and watch real-time iFFT",
      "MRI Spin-Echo Simulator: TR / TE sliders for T1 vs T2 vs PD weighting"
    ],
    clinicalContext: "Master the physical trade-offs of acquisition noise and k-space reconstruction through interactive challenges."
  },
  {
    id: "ct-windowing",
    title: "CT Hounsfield Window / Level Lab",
    slug: "/playground/windowing",
    category: "ct",
    categoryLabel: "CT Physics & Attenuation",
    moduleBadge: "Module 4 • CO2, CO3",
    coTags: ["CO2", "CO3"],
    icon: Sliders,
    colorClass: "text-adani-cyan",
    bgClass: "bg-sky-50",
    borderClass: "border-sky-200 hover:border-sky-400",
    description: "Interactive clinical window width (WW) and window level (WL) piecewise linear mapping. Explore physical CT attenuation spans (-1000 to +3000 HU) converted to visible 8-bit monitor grayscale.",
    features: [
      "Brain (WL: 40, WW: 80) & Subdural hematoma contrast",
      "Bone (WL: 400, WW: 1500) fine trabecular detail",
      "Lung (WL: -600, WW: 1500) pulmonary parenchyma",
      "Live Intensity Transfer Function (ITF) transfer curve & HUD"
    ],
    clinicalContext: "Diagnostic CT monitors cannot display 4096 shades of gray. Windowing maps narrow diagnostic tissue spans into monitor dynamic range."
  },
  {
    id: "spatial-convolution",
    title: "2D Spatial Convolution & Kernel Studio",
    slug: "/playground/convolution",
    category: "filtering",
    categoryLabel: "Spatial Domain Processing",
    moduleBadge: "Module 5 • CO3",
    coTags: ["CO3"],
    icon: Grid,
    colorClass: "text-adani-purple",
    bgClass: "bg-purple-50",
    borderClass: "border-purple-200 hover:border-purple-400",
    description: "Slide arbitrary 3×3 and 5×5 spatial convolution matrices across anatomical thorax phantoms. Observe spatial edge detection, Gaussian noise suppression, and Laplacian sharpening.",
    features: [
      "See the Math: 3×3 neighborhood pixel hover calculation",
      "Curtain Compare Slider: drag before/after split divider",
      "Sobel Gx & Gy directional gradient operators",
      "Live 256-bin convolved intensity distribution histogram"
    ],
    clinicalContext: "Spatial convolution forms the foundation of all clinical edge detection, unsharp masking, and deep convolutional neural networks (CNNs)."
  },
  {
    id: "dicom-explorer",
    title: "DICOM Part 10 Tag & Pixel Explorer",
    slug: "/playground/dicom",
    category: "dicom",
    categoryLabel: "Standards & PACS Archives",
    moduleBadge: "Module 2 & 3 • CO2, CO4",
    coTags: ["CO2", "CO4"],
    icon: FileText,
    colorClass: "text-adani-magenta",
    bgClass: "bg-pink-50",
    borderClass: "border-pink-200 hover:border-pink-400",
    description: "Inspect authentic medical imaging file headers. Deconstruct SOP Class UIDs, Photometric Interpretations, Patient Orientation vectors, and Value Representation (VR) dictionaries under HIPAA protocols.",
    features: [
      "SOP Class UID & Transfer Syntax identification",
      "Multi-modality comparison (Head CT vs. 3.0T MRI vs. Chest X-Ray)",
      "Instant searchable tag registry (Group, Element)",
      "HIPAA Safe Harbor 18-identifier anonymization checklist"
    ],
    clinicalContext: "DICOM is the universal international standard (ISO 12052) governing hospital PACS storage, interoperability, and AI model ingestion."
  },
  {
    id: "otsu-segmentation",
    title: "Otsu Thresholding & Region Growing Lab",
    slug: "/playground/segmentation",
    category: "segmentation",
    categoryLabel: "Morphology & Segmentation",
    moduleBadge: "Module 5 • CO3",
    coTags: ["CO3"],
    icon: Scissors,
    colorClass: "text-emerald-700",
    bgClass: "bg-emerald-50",
    borderClass: "border-emerald-200 hover:border-emerald-400",
    description: "Delineate intracranial pathology through automated histogram variance maximization (Otsu method) or interactive spatial neighborhood connectivity (Region Growing).",
    features: [
      "Between-Class Variance sigma_B^2(t) maximum curve",
      "Interactive Seeded Region Growing with Euclidean distance threshold",
      "Live 256-bin grayscale histogram with dynamic threshold cursor",
      "Dice Similarity Coefficient (DSC) segmentation validation"
    ],
    clinicalContext: "Segmentation transforms raw clinical pixels into segmented organs and tumors for radiation oncology planning and volumetric measurement."
  },
  {
    id: "fourier-playground",
    title: "2D Fourier Transform & Frequency Filtering",
    slug: "/playground/fourier",
    category: "frequency",
    categoryLabel: "Frequency Domain & k-Space",
    moduleBadge: "Module 5 • CO3",
    coTags: ["CO3"],
    icon: Radio,
    colorClass: "text-blue-600",
    bgClass: "bg-blue-50",
    borderClass: "border-blue-200 hover:border-blue-400",
    description: "Decompose clinical scans into spatial frequencies. Inspect centered 2D Fourier power spectrum, apply Ideal, Butterworth, and Gaussian low/high-pass filters with live inverse FFT.",
    features: [
      "Interactive 2D Fourier magnitude power spectrum HUD",
      "Low-Pass Smoothing vs. High-Pass Edge Isolation",
      "Butterworth roll-off order modulation",
      "Periodic RF interference stripe removal simulation"
    ],
    clinicalContext: "MRI acquires data directly in the 2D spatial frequency domain (k-Space). Frequency filtering allows precise artifact removal without blurring edges."
  }
];

export default function PlaygroundCatalogPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const { xp, streakDays, unlockedBadges, leaderboard, dailyChallengeCompleted, completeDailyChallenge } = useGamification();

  const filteredPlaygrounds = PLAYGROUNDS_CATALOG.filter((item) => {
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.features.some((f) => f.toLowerCase().includes(searchQuery.toLowerCase())) ||
      item.clinicalContext.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard" className="flex items-center gap-3">
              <BrandLogo className="w-9 h-9" size={36} />
              <div>
                <span className="text-base font-extrabold tracking-tight text-adani-navy block leading-none">
                  Adani University
                </span>
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mt-0.5">
                  Clinical Imaging Labs &amp; Workstations
                </span>
              </div>
            </Link>
            <div className="hidden md:block h-6 w-px bg-slate-300" />
            <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
              <Gamepad2 className="w-4 h-4 text-adani-cyan" />
              <span>Interactive Simulator Hub</span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Gamification Status Pills */}
            <div className="flex items-center space-x-2">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold shadow-2xs">
                <Trophy className="w-3.5 h-3.5 text-amber-500" />
                <span>{xp} XP</span>
              </div>
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold shadow-2xs">
                <Flame className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                <span>{streakDays} Day Streak</span>
              </div>
            </div>

            <Link
              href="/dashboard"
              className="inline-flex items-center text-xs font-bold text-slate-700 hover:text-adani-navy px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
            >
              Dashboard
            </Link>
            <UserNav />
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 flex-1 space-y-8">
        
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-adani-navy via-slate-900 to-adani-dark rounded-3xl p-8 text-white shadow-xl space-y-4 relative overflow-hidden">
          <div className="relative z-10 space-y-3">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-adani-cyan/20 text-adani-cyan text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Interactive Clinical Simulations • B.Tech Semester VI</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Medical Imaging Virtual Labs &amp; Workstations
            </h1>

            <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
              Real-time interactive environments for radiology physics, digital signal processing, CT Hounsfield calibration, 2D Fourier filtering, and quantitative clinical segmentation.
            </p>
          </div>

          {/* Decorative Backdrops */}
          <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none flex items-center justify-center">
            <Atom className="w-80 h-80 text-white animate-spin-slow" />
          </div>
        </div>

        {/* Daily Challenge Card */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-300/60 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-700 flex-shrink-0">
              <Flame className="w-5 h-5 fill-amber-500 text-amber-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-amber-500/20 text-amber-800 uppercase tracking-wider">
                  Daily Clinical Challenge
                </span>
                <span className="text-xs text-slate-500 font-medium">+150 XP</span>
              </div>
              <h3 className="text-sm font-bold text-slate-900 mt-0.5">
                Optimize Temporal Bone CT Windowing (Mission 1)
              </h3>
              <p className="text-xs text-slate-600">
                Score &gt;80% on the Calvarial Bone Fracture Delineation mission to maintain your daily clinical streak.
              </p>
            </div>
          </div>

          <div className="flex-shrink-0">
            {dailyChallengeCompleted ? (
              <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold">
                <Check className="w-4 h-4 text-emerald-600" />
                Completed Today!
              </span>
            ) : (
              <Link
                href="/playground/missions"
                onClick={completeDailyChallenge}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-md transition-all"
              >
                <span>Launch Mission 1</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>
        </div>

        {/* Filter Tabs & Search Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Category Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none bg-slate-200/60 p-1 rounded-2xl text-xs font-bold">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
                selectedCategory === "all" ? "bg-white text-adani-navy shadow-sm" : "hover:text-slate-900 text-slate-600"
              }`}
            >
              All Labs ({PLAYGROUNDS_CATALOG.length})
            </button>
            <button
              onClick={() => setSelectedCategory("missions")}
              className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
                selectedCategory === "missions" ? "bg-white text-adani-navy shadow-sm" : "hover:text-slate-900 text-slate-600"
              }`}
            >
              🎯 Missions &amp; Mini-Games
            </button>
            <button
              onClick={() => setSelectedCategory("ct")}
              className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
                selectedCategory === "ct" ? "bg-white text-adani-navy shadow-sm" : "hover:text-slate-900 text-slate-600"
              }`}
            >
              CT Physics &amp; Windowing
            </button>
            <button
              onClick={() => setSelectedCategory("filtering")}
              className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
                selectedCategory === "filtering" ? "bg-white text-adani-navy shadow-sm" : "hover:text-slate-900 text-slate-600"
              }`}
            >
              Spatial Kernels &amp; Pipelines
            </button>
            <button
              onClick={() => setSelectedCategory("dicom")}
              className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
                selectedCategory === "dicom" ? "bg-white text-adani-navy shadow-sm" : "hover:text-slate-900 text-slate-600"
              }`}
            >
              DICOM Standards
            </button>
            <button
              onClick={() => setSelectedCategory("segmentation")}
              className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
                selectedCategory === "segmentation" ? "bg-white text-adani-navy shadow-sm" : "hover:text-slate-900 text-slate-600"
              }`}
            >
              Segmentation
            </button>
            <button
              onClick={() => setSelectedCategory("frequency")}
              className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
                selectedCategory === "frequency" ? "bg-white text-adani-navy shadow-sm" : "hover:text-slate-900 text-slate-600"
              }`}
            >
              2D Fourier
            </button>
          </div>

          {/* Search Box */}
          <div className="relative max-w-xs w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search simulations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-adani-cyan shadow-2xs"
            />
          </div>
        </div>

        {/* Playgrounds Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlaygrounds.map((item) => {
            const IconComponent = item.icon;

            return (
              <div
                key={item.id}
                className={`bg-white rounded-3xl border ${item.borderClass} p-6 shadow-sm hover:shadow-lg transition-all duration-200 flex flex-col justify-between group`}
              >
                <div className="space-y-4">
                  {/* Top Modality Tags */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-10 h-10 rounded-2xl ${item.bgClass} ${item.colorClass} flex items-center justify-center font-bold shadow-2xs group-hover:scale-110 transition-transform`}>
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                          {item.categoryLabel}
                        </span>
                        <span className="text-[11px] font-bold text-adani-cyan">
                          {item.moduleBadge}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-adani-navy transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed line-clamp-3">
                      {item.description}
                    </p>
                  </div>

                  {/* Features Bullet List */}
                  <div className="pt-3 border-t border-slate-100 space-y-1.5">
                    <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wider block">
                      Laboratory Capabilities:
                    </span>
                    {item.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-1.5 text-xs text-slate-600">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 flex-shrink-0" />
                        <span className="leading-tight">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Action Button */}
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex space-x-1">
                    {item.coTags.map((co) => (
                      <span key={co} className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-bold font-mono">
                        {co}
                      </span>
                    ))}
                  </div>

                  <Link
                    href={item.slug}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-adani-navy hover:bg-adani-dark text-white text-xs font-bold transition-all shadow-md group-hover:bg-gradient-to-r group-hover:from-adani-cyan group-hover:to-adani-purple group-hover:shadow-sky-500/20"
                  >
                    <span>Launch Game</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Section: Badges & Restrained Institutional Leaderboard */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
          
          {/* Earned Clinical Badges Showcase (col-span-6) */}
          <div className="lg:col-span-6 p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <Award className="w-5 h-5 text-amber-500" />
                <h3 className="text-sm font-extrabold text-slate-900">
                  Earned Clinical Badges ({unlockedBadges.length} / {ALL_BADGES.length})
                </h3>
              </div>
              <span className="text-xs text-slate-400">Institutional Competencies</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {ALL_BADGES.map((b) => {
                const isUnlocked = unlockedBadges.includes(b.id);
                return (
                  <div
                    key={b.id}
                    className={`p-3 rounded-2xl border text-center space-y-1.5 transition-all ${
                      isUnlocked
                        ? "bg-amber-50/60 border-amber-300 shadow-2xs"
                        : "bg-slate-50/50 border-slate-200 opacity-50 grayscale"
                    }`}
                  >
                    <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center font-bold text-xs ${
                      isUnlocked ? "bg-amber-500 text-white shadow-sm" : "bg-slate-200 text-slate-400"
                    }`}>
                      ★
                    </div>
                    <span className="font-bold text-[11px] block text-slate-900 truncate">
                      {b.name}
                    </span>
                    <p className="text-[10px] text-slate-500 line-clamp-2 leading-tight">
                      {b.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Anonymized Institutional Leaderboard (col-span-6) */}
          <div className="lg:col-span-6 p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <Trophy className="w-5 h-5 text-adani-cyan" />
                <h3 className="text-sm font-extrabold text-slate-900">
                  Class Diagnostic Leaderboard
                </h3>
              </div>
              <span className="text-[11px] text-slate-400 font-medium">
                Anonymized Student Aliases
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {leaderboard.slice(0, 5).map((entry) => {
                const isUser = entry.alias.includes("You");
                return (
                  <div
                    key={entry.rank}
                    className={`py-2.5 px-3 rounded-xl flex items-center justify-between text-xs transition-colors ${
                      isUser ? "bg-sky-50/80 font-bold text-adani-navy" : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-mono font-bold ${
                        entry.rank === 1 ? "bg-amber-400 text-white" : entry.rank === 2 ? "bg-slate-300 text-slate-700" : entry.rank === 3 ? "bg-amber-700 text-white" : "text-slate-400"
                      }`}>
                        #{entry.rank}
                      </span>
                      <span className="font-mono text-slate-900">
                        {entry.alias}
                      </span>
                    </div>

                    <div className="flex items-center space-x-4">
                      <span className="text-[11px] text-slate-400">
                        {entry.missionsCompleted} Missions
                      </span>
                      <span className="font-mono font-extrabold text-adani-purple bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                        {entry.xp} XP
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-1 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Class cohort: B.Tech Sem VI AIDS</span>
              <span>Faculty visibility enabled</span>
            </div>
          </div>

        </div>

      </main>
    </div>
  );
}
