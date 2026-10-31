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
  Search
} from "lucide-react";
import { UserNav } from "@/components/UserNav";
import { BrandLogo } from "@/components/BrandLogo";

interface PlaygroundItem {
  id: string;
  title: string;
  slug: string;
  category: "ct" | "filtering" | "dicom" | "segmentation" | "frequency";
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
      "Sobel Gx & Gy directional gradient operators",
      "Gaussian Blur smoothing & speckle noise reduction",
      "Laplacian edge enhancement & high-pass sharpening",
      "Interactive custom kernel matrix editor & pixel inspector"
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
      "Optimal Otsu threshold calculation maximizing between-class variance",
      "Interactive click-to-plant seed point lesion delineation",
      "4-connected vs. 8-connected spatial neighbor evaluation",
      "Real-time segmented voxel counter & tissue coverage ratio"
    ],
    clinicalContext: "Accurate volumetric segmentation is required for radiation oncology tumor targeting, neurosurgical planning, and organ volume quantification."
  },
  {
    id: "fourier-transforms",
    title: "2D Discrete Fourier Frequency Studio",
    slug: "/playground/fourier",
    category: "frequency",
    categoryLabel: "Frequency Domain & Transforms",
    moduleBadge: "Module 5 • CO3",
    coTags: ["CO3"],
    icon: Radio,
    colorClass: "text-indigo-700",
    bgClass: "bg-indigo-50",
    borderClass: "border-indigo-200 hover:border-indigo-400",
    description: "Deconstruct spatial images into 2D orthogonal sinusoidal frequency bases. Filter high-frequency noise and sharpen tissue margins in Fourier magnitude spectrum |F(u,v)| with real-time inverse FFT.",
    features: [
      "Centered DC frequency peak F(0,0) visualization",
      "Ideal, Butterworth, and Gaussian low-pass / high-pass filter masks",
      "Interactive cutoff radius D0 slider with ring overlay",
      "Real-time inverse 2D reconstruction demonstrating Gibbs ringing"
    ],
    clinicalContext: "MRI k-space data is acquired directly in the 2D spatial frequency domain and transformed into clinical anatomical images via 2D Inverse FFT."
  }
];

export default function PlaygroundsDirectoryPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredPlaygrounds = PLAYGROUNDS_CATALOG.filter((item) => {
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.moduleBadge.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link
              href="/dashboard"
              className="p-2 text-slate-500 hover:text-adani-navy hover:bg-slate-100 rounded-lg transition-colors"
              title="Return to Dashboard"
            >
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <Link href="/dashboard" className="flex items-center gap-2">
              <BrandLogo className="w-8 h-8" size={32} />
              <div className="hidden sm:block">
                <span className="text-xs font-black tracking-tight text-slate-900 block leading-tight">
                  Adani University
                </span>
                <span className="text-[10px] text-adani-cyan font-bold block">
                  Interactive Clinical Laboratories
                </span>
              </div>
            </Link>
            <div className="hidden sm:block h-5 w-px bg-slate-200" />
            <span className="text-xs font-bold text-adani-navy uppercase tracking-wider hidden md:inline">
              AIDS 12605.1 • Simulation Playgrounds
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              href="/course"
              className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors hidden sm:inline-flex"
            >
              Course Modules
            </Link>
            <UserNav />
          </div>
        </div>
      </header>

      {/* Main Catalog View */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 space-y-8 w-full">
        {/* Academic Hero Banner */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-adani-navy via-slate-900 to-adani-dark text-white shadow-xl relative overflow-hidden">
          <div className="space-y-3 max-w-3xl relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-adani-cyan/20 text-adani-cyan text-xs font-bold uppercase tracking-wider border border-adani-cyan/30">
              <Gamepad2 className="w-3.5 h-3.5" />
              100% Client-Side Computational Simulations
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Interactive Medical Image Laboratories
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
              Hands-on experimental workstations for the accredited curriculum. Experience real-time physical CT windowing, spatial 2D convolution filters, DICOM Part 10 metadata inspection, Otsu segmentation, and 2D Fourier transforms.
            </p>
          </div>

          {/* Decorative Background Badges */}
          <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-10 hidden lg:block pointer-events-none">
            <Atom className="w-64 h-64 text-white" />
          </div>
        </div>

        {/* Filter Bar & Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          {/* Category Tabs */}
          <div className="flex rounded-2xl bg-slate-200/80 p-1 space-x-1 text-xs font-bold text-slate-700 overflow-x-auto">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
                selectedCategory === "all" ? "bg-white text-adani-navy shadow-sm" : "hover:text-slate-900 text-slate-600"
              }`}
            >
              All Simulations ({PLAYGROUNDS_CATALOG.length})
            </button>
            <button
              onClick={() => setSelectedCategory("ct")}
              className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
                selectedCategory === "ct" ? "bg-white text-adani-navy shadow-sm" : "hover:text-slate-900 text-slate-600"
              }`}
            >
              CT Physics
            </button>
            <button
              onClick={() => setSelectedCategory("filtering")}
              className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
                selectedCategory === "filtering" ? "bg-white text-adani-navy shadow-sm" : "hover:text-slate-900 text-slate-600"
              }`}
            >
              Spatial Kernels
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
              className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-adani-cyan shadow-xs"
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
      </main>
    </div>
  );
}
