"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  FileText, 
  BarChart3, 
  ChevronLeft, 
  ShieldCheck, 
  AlertCircle,
  PlusCircle,
  Trash2,
  BookOpen,
  Users,
  Search,
  Filter,
  ArrowRight,
  TrendingUp,
  Award,
  Layers,
  Clock,
  Shield,
  LogOut,
  ChevronDown,
  ChevronUp
} from "lucide-react";

interface CurriculumTopic {
  id: string;
  slug: string;
  title: string;
  readTime: number;
  coTag: string;
}

interface CurriculumModule {
  id: string;
  moduleCode: string;
  title: string;
  description: string;
  theoryHours: number;
  coTarget: string;
  topics: CurriculumTopic[];
}

interface StudentProgress {
  id: string;
  rollNo: string;
  fullName: string;
  email: string;
  clearedModules: number;
  totalModules: number;
  averageScorePct: number;
  status: "cleared" | "needs_remediation";
  lastActive: string;
  moduleBreakdown: {
    moduleCode: string;
    scorePct: number;
    attempts: number;
    isPassed: boolean;
  }[];
}

interface DraftVisual {
  id: string;
  title: string;
  storage_url: string;
  alt_text: string;
  license: string;
  prompt: string;
  status: "draft" | "approved" | "rejected";
}

const INITIAL_MODULES: CurriculumModule[] = [
  {
    id: "mod-1",
    moduleCode: "MODULE 01",
    title: "Medical Image Sources & Physics",
    description: "Radiology, electromagnetic spectrum, basic X-ray physics, differential photon attenuation, Beer-Lambert formulation, CT, MRI, ultrasound, and nuclear medicine.",
    theoryHours: 8,
    coTarget: "CO1, CO2",
    topics: [
      { id: "m1-t1", slug: "m1-t1-radiology-spectrum", title: "Radiology & Diagnostic Electromagnetic Spectrum", readTime: 15, coTag: "CO1" },
      { id: "m1-t2", slug: "xray-ct-physics", title: "X-Ray Physics, Attenuation & Half-Value Layer (HVL)", readTime: 20, coTag: "CO1" },
      { id: "m1-t3", slug: "computed-tomography-intro", title: "Computed Tomography (CT) Principles & Projection Geometry", readTime: 25, coTag: "CO1, CO4" }
    ]
  },
  {
    id: "mod-2",
    moduleCode: "MODULE 02",
    title: "Image Processing in Clinical Practice",
    description: "Fourier transforms, 2D FFT, contrast enhancement, histogram equalization, spatial vs frequency filtering, and clinical artifact reduction.",
    theoryHours: 8,
    coTarget: "CO2, CO3",
    topics: [
      { id: "m2-t1", slug: "fourier-transform-medical-imaging", title: "2D Discrete Fourier Transform & k-Space Principles", readTime: 20, coTag: "CO2" },
      { id: "m2-t2", slug: "contrast-enhancement-clahe", title: "Histogram Equalization & Contrast Limited Adaptive HE (CLAHE)", readTime: 18, coTag: "CO3" }
    ]
  },
  {
    id: "mod-3",
    moduleCode: "MODULE 03",
    title: "Image Representation & DICOM Standards",
    description: "Pixel representation, bit depth, photometric interpretation, DICOM header data elements, VRs, Transfer Syntaxes, and HIPAA Safe Harbor de-identification.",
    theoryHours: 8,
    coTarget: "CO2",
    topics: [
      { id: "m3-t1", slug: "dicom-data-structure-vr", title: "DICOM File Format, Value Representations (VR) & Tag Elements", readTime: 20, coTag: "CO2" },
      { id: "m3-t2", slug: "hipaa-deidentification-sanitization", title: "HIPAA Safe Harbor De-Identification & Clinical Data Privacy", readTime: 25, coTag: "CO2" }
    ]
  },
  {
    id: "mod-4",
    moduleCode: "MODULE 04",
    title: "Tomographic Reconstruction & Radon Transform",
    description: "Radon transform, sinogram formation, projection geometry, Central Slice Theorem, Backprojection, and Filtered Backprojection (Ram-Lak / Shepp-Logan).",
    theoryHours: 9,
    coTarget: "CO4",
    topics: [
      { id: "m4-t1", slug: "radon-transform-sinogram", title: "Radon Transform Geometry & Sinogram Projection Mapping", readTime: 25, coTag: "CO4" },
      { id: "m4-t2", slug: "filtered-backprojection-algorithm", title: "Filtered Backprojection (FBP) & Ram-Lak Ramp Filtering", readTime: 30, coTag: "CO4" }
    ]
  },
  {
    id: "mod-5",
    moduleCode: "MODULE 05",
    title: "Medical Image Segmentation & 2D Spatial Filtering",
    description: "2D spatial kernels, Sobel/Laplacian operators, Gaussian blurring, Otsu automated thresholding, and semantic U-Net segmentation architectures.",
    theoryHours: 9,
    coTarget: "CO3, CO4",
    topics: [
      { id: "m5-t1", slug: "spatial-convolution", title: "2D Spatial Kernels, Edge Enhancement & High-Pass Filters", readTime: 20, coTag: "CO3" },
      { id: "m5-t2", slug: "clinical-segmentation-unet", title: "Otsu Adaptive Thresholding & Semantic U-Net Models", readTime: 25, coTag: "CO4" }
    ]
  },
  {
    id: "mod-6",
    moduleCode: "MODULE 06",
    title: "Clinical NLP & Multimodal Medical AI",
    description: "Biomedical entity extraction, BioBERT/ClinicalBERT, structured radiology report summarization, and multimodal image-text clinical diagnostic pipelines.",
    theoryHours: 8,
    coTarget: "CO5",
    topics: [
      { id: "m6-t1", slug: "radiology-nlp-biobert", title: "Biomedical Named Entity Recognition & Report Summarization", readTime: 25, coTag: "CO5" },
      { id: "m6-t2", slug: "multimodal-clinical-ai", title: "Vision-Language Grounding in Diagnostic Imaging", readTime: 30, coTag: "CO5" }
    ]
  }
];

const INITIAL_STUDENTS: StudentProgress[] = [
  {
    id: "st-1",
    rollNo: "21FET01042",
    fullName: "Aarav Patel",
    email: "aarav.p@adani.edu.in",
    clearedModules: 6,
    totalModules: 6,
    averageScorePct: 88.5,
    status: "cleared",
    lastActive: "15 mins ago",
    moduleBreakdown: [
      { moduleCode: "MOD 01", scorePct: 92.0, attempts: 1, isPassed: true },
      { moduleCode: "MOD 02", scorePct: 86.5, attempts: 2, isPassed: true },
      { moduleCode: "MOD 03", scorePct: 88.0, attempts: 1, isPassed: true },
      { moduleCode: "MOD 04", scorePct: 82.5, attempts: 2, isPassed: true },
      { moduleCode: "MOD 05", scorePct: 90.0, attempts: 1, isPassed: true },
      { moduleCode: "MOD 06", scorePct: 92.0, attempts: 1, isPassed: true }
    ]
  },
  {
    id: "st-2",
    rollNo: "21FET01058",
    fullName: "Diya Sharma",
    email: "diya.s@adani.edu.in",
    clearedModules: 5,
    totalModules: 6,
    averageScorePct: 81.2,
    status: "cleared",
    lastActive: "1 hour ago",
    moduleBreakdown: [
      { moduleCode: "MOD 01", scorePct: 84.0, attempts: 1, isPassed: true },
      { moduleCode: "MOD 02", scorePct: 82.0, attempts: 1, isPassed: true },
      { moduleCode: "MOD 03", scorePct: 80.0, attempts: 2, isPassed: true },
      { moduleCode: "MOD 04", scorePct: 78.5, attempts: 2, isPassed: true },
      { moduleCode: "MOD 05", scorePct: 82.5, attempts: 1, isPassed: true },
      { moduleCode: "MOD 06", scorePct: 68.0, attempts: 1, isPassed: false }
    ]
  },
  {
    id: "st-3",
    rollNo: "21FET01083",
    fullName: "Kabir Mehta",
    email: "kabir.m@adani.edu.in",
    clearedModules: 2,
    totalModules: 6,
    averageScorePct: 69.4,
    status: "needs_remediation",
    lastActive: "3 hours ago",
    moduleBreakdown: [
      { moduleCode: "MOD 01", scorePct: 78.0, attempts: 2, isPassed: true },
      { moduleCode: "MOD 02", scorePct: 76.5, attempts: 3, isPassed: true },
      { moduleCode: "MOD 03", scorePct: 62.0, attempts: 2, isPassed: false },
      { moduleCode: "MOD 04", scorePct: 61.0, attempts: 1, isPassed: false },
      { moduleCode: "MOD 05", scorePct: 0.0, attempts: 0, isPassed: false },
      { moduleCode: "MOD 06", scorePct: 0.0, attempts: 0, isPassed: false }
    ]
  },
  {
    id: "st-4",
    rollNo: "21FET01102",
    fullName: "Ananya Iyer",
    email: "ananya.i@adani.edu.in",
    clearedModules: 6,
    totalModules: 6,
    averageScorePct: 94.2,
    status: "cleared",
    lastActive: "Just now",
    moduleBreakdown: [
      { moduleCode: "MOD 01", scorePct: 96.0, attempts: 1, isPassed: true },
      { moduleCode: "MOD 02", scorePct: 92.5, attempts: 1, isPassed: true },
      { moduleCode: "MOD 03", scorePct: 94.0, attempts: 1, isPassed: true },
      { moduleCode: "MOD 04", scorePct: 91.0, attempts: 1, isPassed: true },
      { moduleCode: "MOD 05", scorePct: 96.5, attempts: 1, isPassed: true },
      { moduleCode: "MOD 06", scorePct: 95.0, attempts: 1, isPassed: true }
    ]
  },
  {
    id: "st-5",
    rollNo: "21FET01115",
    fullName: "Rohan Deshmukh",
    email: "rohan.d@adani.edu.in",
    clearedModules: 3,
    totalModules: 6,
    averageScorePct: 71.8,
    status: "needs_remediation",
    lastActive: "Yesterday",
    moduleBreakdown: [
      { moduleCode: "MOD 01", scorePct: 76.0, attempts: 2, isPassed: true },
      { moduleCode: "MOD 02", scorePct: 72.0, attempts: 2, isPassed: false },
      { moduleCode: "MOD 03", scorePct: 78.5, attempts: 1, isPassed: true },
      { moduleCode: "MOD 04", scorePct: 60.5, attempts: 1, isPassed: false },
      { moduleCode: "MOD 05", scorePct: 0.0, attempts: 0, isPassed: false },
      { moduleCode: "MOD 06", scorePct: 0.0, attempts: 0, isPassed: false }
    ]
  }
];

const INITIAL_VISUALS: DraftVisual[] = [
  {
    id: "vis-1",
    title: "Radon Transform Sinogram Projection Model",
    storage_url: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80",
    alt_text: "Sinogram projection mapping showing Radon angle theta vs radial distance s",
    license: "CC BY 4.0",
    prompt: "A high-precision educational schematic of 1D parallel projections forming a 2D sinogram for CT reconstruction",
    status: "draft"
  },
  {
    id: "vis-2",
    title: "Floyd-Steinberg Error Diffusion Pattern",
    storage_url: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80",
    alt_text: "Dithering quantization matrix demonstrating diffuse noise spreading",
    license: "Educational Non-Commercial",
    prompt: "Microscopic view of 4-bit quantization dithering showing spatial error diffusion across adjacent pixels",
    status: "draft"
  }
];

export default function FacultyStudioPage() {
  const { user, role, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<"curriculum" | "students" | "visuals">("curriculum");

  // Curriculum State (Add/Delete Modules & Topics)
  const [modules, setModules] = useState<CurriculumModule[]>(INITIAL_MODULES);
  const [isAddingModule, setIsAddingModule] = useState(false);
  const [newModCode, setNewModCode] = useState("");
  const [newModTitle, setNewModTitle] = useState("");
  const [newModDesc, setNewModDesc] = useState("");
  const [newModHours, setNewModHours] = useState(8);
  const [newModCO, setNewModCO] = useState("CO5");

  // Adding topic to specific module
  const [activeModForTopic, setActiveModForTopic] = useState<string | null>(null);
  const [newTopicTitle, setNewTopicTitle] = useState("");
  const [newTopicSlug, setNewTopicSlug] = useState("");
  const [newTopicTime, setNewTopicTime] = useState(20);
  const [newTopicCO, setNewTopicCO] = useState("CO3");

  // Student Progress State
  const [students, setStudents] = useState<StudentProgress[]>(INITIAL_STUDENTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "cleared" | "needs_remediation">("all");
  const [expandedStudentId, setExpandedStudentId] = useState<string | null>(null);

  // Visuals State
  const [visuals, setVisuals] = useState<DraftVisual[]>(INITIAL_VISUALS);
  const [successAlert, setSuccessAlert] = useState<string | null>(null);

  const showAlert = (msg: string) => {
    setSuccessAlert(msg);
    setTimeout(() => setSuccessAlert(null), 3000);
  };

  const handleApproveVisual = (id: string) => {
    setVisuals((prev) =>
      prev.map((v) => (v.id === id ? { ...v, status: "approved" } : v))
    );
  };

  const handleRejectVisual = (id: string) => {
    setVisuals((prev) =>
      prev.map((v) => (v.id === id ? { ...v, status: "rejected" } : v))
    );
  };

  // 1. ADD CURRICULUM MODULE
  const handleAddModule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newModTitle || !newModCode) return;

    const newModule: CurriculumModule = {
      id: `mod-${Date.now()}`,
      moduleCode: newModCode.toUpperCase(),
      title: newModTitle,
      description: newModDesc || "Module curriculum syllabus content and clinical assessments.",
      theoryHours: Number(newModHours) || 8,
      coTarget: newModCO || "CO1",
      topics: []
    };

    setModules((prev) => [...prev, newModule]);
    setIsAddingModule(false);
    setNewModCode("");
    setNewModTitle("");
    setNewModDesc("");
    showAlert(`Successfully added ${newModule.moduleCode}: ${newModule.title}`);
  };

  // 2. DELETE CURRICULUM MODULE
  const handleDeleteModule = (id: string, moduleCode: string) => {
    if (confirm(`Are you sure you want to delete ${moduleCode}? This action cannot be undone.`)) {
      setModules((prev) => prev.filter((m) => m.id !== id));
      showAlert(`Module ${moduleCode} has been deleted.`);
    }
  };

  // 3. ADD TOPIC TO MODULE
  const handleAddTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeModForTopic || !newTopicTitle) return;

    const slug = newTopicSlug.trim() || newTopicTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const newTopic: CurriculumTopic = {
      id: `top-${Date.now()}`,
      slug: slug,
      title: newTopicTitle,
      readTime: Number(newTopicTime) || 15,
      coTag: newTopicCO || "CO1"
    };

    setModules((prev) =>
      prev.map((m) =>
        m.id === activeModForTopic
          ? { ...m, topics: [...m.topics, newTopic] }
          : m
      )
    );

    setActiveModForTopic(null);
    setNewTopicTitle("");
    setNewTopicSlug("");
    showAlert(`Added topic "${newTopic.title}" to module.`);
  };

  // 4. DELETE TOPIC FROM MODULE
  const handleDeleteTopic = (moduleId: string, topicId: string, topicTitle: string) => {
    if (confirm(`Delete topic "${topicTitle}"?`)) {
      setModules((prev) =>
        prev.map((m) =>
          m.id === moduleId
            ? { ...m, topics: m.topics.filter((t) => t.id !== topicId) }
            : m
        )
      );
      showAlert(`Topic "${topicTitle}" deleted.`);
    }
  };

  // Filter students
  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.rollNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ? true : s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalStudents = students.length;
  const clearedStudents = students.filter((s) => s.status === "cleared").length;
  const remediationStudents = students.filter((s) => s.status === "needs_remediation").length;
  const avgClassMastery = Math.round(
    students.reduce((acc, s) => acc + s.averageScorePct, 0) / (totalStudents || 1)
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Institutional Header without Image Logo */}
      <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link
              href="/dashboard"
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              title="Return to Student Dashboard"
            >
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <Link href="/dashboard" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 via-purple-600 to-pink-500 flex items-center justify-center text-white font-black text-xs shadow-md">
                AI
              </div>
              <div>
                <span className="text-sm font-bold tracking-tight text-white block leading-none">
                  Adani University
                </span>
                <span className="text-[10px] text-purple-400 font-medium">
                  Faculty Studio &amp; Curriculum Governance
                </span>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 transition-colors border border-slate-700/60"
            >
              Curriculum Dashboard
            </Link>

            {role === "admin" && (
              <Link
                href="/admin"
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-purple-300 bg-purple-900/40 hover:bg-purple-800/60 border border-purple-700/50 transition-colors flex items-center gap-1.5"
              >
                <Shield className="w-3.5 h-3.5" />
                Admin Console
              </Link>
            )}

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
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-purple-950/40 to-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold uppercase tracking-wider mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
              Course Instructor &amp; Content Governance Portal
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Faculty Workstation • AIDS 12605.1
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Active Instructor: <span className="text-purple-300 font-mono">{user?.email || "faculty.fet@adani.edu.in"}</span>.
              Manage curriculum structure, track cohort mastery, and maintain strict &gt;75.0% pass remediation.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-4 bg-slate-950/80 border border-slate-800 p-3 rounded-xl">
            <div className="text-center px-2">
              <span className="text-xs text-slate-400 block">Class Avg</span>
              <span className="text-base font-bold text-white">{avgClassMastery}%</span>
            </div>
            <div className="h-6 w-px bg-slate-800" />
            <div className="text-center px-2">
              <span className="text-xs text-slate-400 block">Passed (&gt;75%)</span>
              <span className="text-base font-bold text-emerald-400">{clearedStudents}</span>
            </div>
            <div className="h-6 w-px bg-slate-800" />
            <div className="text-center px-2">
              <span className="text-xs text-slate-400 block">Remediation</span>
              <span className="text-base font-bold text-amber-400">{remediationStudents}</span>
            </div>
          </div>
        </div>

        {/* Success Alert */}
        {successAlert && (
          <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-800/80 text-emerald-300 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            {successAlert}
          </div>
        )}

        {/* Primary Tabs */}
        <div className="flex border-b border-slate-800 space-x-1">
          <button
            onClick={() => setActiveTab("curriculum")}
            className={`px-4 py-2.5 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
              activeTab === "curriculum"
                ? "border-sky-500 text-sky-400 bg-sky-950/20"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Curriculum Management ({modules.length} Modules)
          </button>

          <button
            onClick={() => setActiveTab("students")}
            className={`px-4 py-2.5 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
              activeTab === "students"
                ? "border-purple-500 text-purple-400 bg-purple-950/20"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Users className="w-4 h-4" />
            Student Progress Monitor ({totalStudents} Students)
          </button>

          <button
            onClick={() => setActiveTab("visuals")}
            className={`px-4 py-2.5 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
              activeTab === "visuals"
                ? "border-emerald-500 text-emerald-400 bg-emerald-950/20"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            AI Visual &amp; Schematic Approvals
          </button>
        </div>

        {/* TAB 1: CURRICULUM MANAGEMENT (ADD / DELETE CURRICULUM) */}
        {activeTab === "curriculum" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-sky-400" />
                  Course Syllabus &amp; Module Directory
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Add new accredited modules, configure theory hours, assign NBA Course Outcomes, and delete obsolete content.
                </p>
              </div>

              <button
                onClick={() => setIsAddingModule(!isAddingModule)}
                className="px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-md shadow-sky-600/20"
              >
                <PlusCircle className="w-4 h-4" />
                {isAddingModule ? "Cancel" : "Add New Module"}
              </button>
            </div>

            {/* Add Module Inline Form */}
            {isAddingModule && (
              <form onSubmit={handleAddModule} className="bg-slate-900 border border-sky-500/30 rounded-2xl p-5 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-sky-400">
                  Provision New Curriculum Module
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Module Code
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. MODULE 07"
                      value={newModCode}
                      onChange={(e) => setNewModCode(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Module Title
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Diffusion Tensor Imaging & Tractography"
                      value={newModTitle}
                      onChange={(e) => setNewModTitle(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Theory Hours &amp; CO Target
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        min={1}
                        max={30}
                        value={newModHours}
                        onChange={(e) => setNewModHours(Number(e.target.value))}
                        className="w-16 bg-slate-950 border border-slate-700 rounded-lg px-2 py-2 text-xs text-white text-center"
                        title="Theory Hours"
                      />
                      <input
                        type="text"
                        placeholder="CO5, CO6"
                        value={newModCO}
                        onChange={(e) => setNewModCO(e.target.value)}
                        className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-2 py-2 text-xs text-white"
                        title="Course Outcome Tag"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Curriculum Description &amp; Scope
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Describe clinical topics, mathematical algorithms, and diagnostic modalities covered in this module..."
                    value={newModDesc}
                    onChange={(e) => setNewModDesc(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingModule(false)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold transition-colors"
                  >
                    Save &amp; Publish Module
                  </button>
                </div>
              </form>
            )}

            {/* Modules List */}
            <div className="space-y-4">
              {modules.map((m) => (
                <div key={m.id} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center flex-shrink-0">
                        <span className="text-[10px] font-bold text-sky-400">MOD</span>
                        <span className="text-sm font-black text-white">{m.moduleCode.replace("MODULE ", "")}</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-white">{m.title}</h3>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-sky-400">
                            {m.coTarget}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                            {m.theoryHours} Hours
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1 max-w-3xl leading-relaxed">
                          {m.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        onClick={() => setActiveModForTopic(activeModForTopic === m.id ? null : m.id)}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors flex items-center gap-1 border border-slate-700/60"
                      >
                        <PlusCircle className="w-3.5 h-3.5 text-sky-400" />
                        Add Topic
                      </button>

                      <button
                        onClick={() => handleDeleteModule(m.id, m.moduleCode)}
                        className="px-3 py-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-xs font-semibold text-red-400 transition-colors flex items-center gap-1 border border-red-800/50"
                        title="Delete this entire module"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete Module
                      </button>
                    </div>
                  </div>

                  {/* Add Topic Inline Form */}
                  {activeModForTopic === m.id && (
                    <form onSubmit={handleAddTopic} className="bg-slate-950 border border-sky-500/30 rounded-xl p-4 space-y-3">
                      <h4 className="text-xs font-bold text-sky-400">
                        Add Topic to {m.moduleCode}
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                        <div className="sm:col-span-2">
                          <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                            Topic Title
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Clinical Diffusion Anisotropy"
                            value={newTopicTitle}
                            onChange={(e) => setNewTopicTitle(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                            Read Time (mins)
                          </label>
                          <input
                            type="number"
                            min={5}
                            max={120}
                            value={newTopicTime}
                            onChange={(e) => setNewTopicTime(Number(e.target.value))}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white text-center"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                            CO Tag
                          </label>
                          <input
                            type="text"
                            placeholder="CO3"
                            value={newTopicCO}
                            onChange={(e) => setNewTopicCO(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setActiveModForTopic(null)}
                          className="px-2.5 py-1 text-xs text-slate-400 hover:text-white"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-3 py-1 bg-sky-500 text-slate-950 text-xs font-bold rounded-lg hover:bg-sky-400"
                        >
                          Add Topic
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Topics List */}
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      Enrolled Topics ({m.topics.length})
                    </span>

                    {m.topics.length === 0 ? (
                      <p className="text-xs text-slate-500 italic py-2">
                        No topics added to this module yet. Click &quot;Add Topic&quot; to author content.
                      </p>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {m.topics.map((t) => (
                          <div
                            key={t.id}
                            className="bg-slate-950/70 border border-slate-800/80 rounded-xl px-3 py-2 flex items-center justify-between group hover:border-slate-700 transition-colors"
                          >
                            <div className="flex items-center gap-2 overflow-hidden">
                              <span className="text-[10px] font-mono font-bold text-sky-400 px-1.5 py-0.5 rounded bg-sky-950/40 border border-sky-800/40">
                                {t.coTag}
                              </span>
                              <span className="text-xs text-slate-200 font-medium truncate" title={t.title}>
                                {t.title}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                              <span className="text-[10px] text-slate-500 flex items-center gap-1 font-mono">
                                <Clock className="w-3 h-3" />
                                {t.readTime}m
                              </span>
                              <button
                                onClick={() => handleDeleteTopic(m.id, t.id, t.title)}
                                className="p-1 text-slate-500 hover:text-red-400 transition-colors"
                                title="Delete topic"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: STUDENT PROGRESS MONITOR */}
        {activeTab === "students" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Users className="w-4 h-4 text-purple-400" />
                  Cohort Performance &amp; Remediation Tracker
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Monitor individual student module clearances. Strict pass rule requires &gt;75.0% on each module assessment.
                </p>
              </div>

              {/* Filters */}
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search name or roll no..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-purple-500"
                >
                  <option value="all">All Statuses</option>
                  <option value="cleared">Cleared (&gt;75%)</option>
                  <option value="needs_remediation">Needs Remediation</option>
                </select>
              </div>
            </div>

            {/* Student Directory Table */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950/80 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="px-5 py-3.5">Student</th>
                      <th className="px-5 py-3.5">Roll No</th>
                      <th className="px-5 py-3.5">Modules Cleared</th>
                      <th className="px-5 py-3.5">Average Mastery</th>
                      <th className="px-5 py-3.5">Status</th>
                      <th className="px-5 py-3.5">Last Active</th>
                      <th className="px-5 py-3.5 text-right">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredStudents.map((st) => {
                      const isExpanded = expandedStudentId === st.id;
                      return (
                        <React.Fragment key={st.id}>
                          <tr className="hover:bg-slate-800/30 transition-colors">
                            <td className="px-5 py-3.5">
                              <span className="font-bold text-white block">{st.fullName}</span>
                              <span className="text-[11px] text-slate-500 font-mono">{st.email}</span>
                            </td>
                            <td className="px-5 py-3.5 font-mono text-slate-300">
                              {st.rollNo}
                            </td>
                            <td className="px-5 py-3.5">
                              <span className="font-bold text-white">{st.clearedModules}</span>
                              <span className="text-slate-500"> / {st.totalModules}</span>
                            </td>
                            <td className="px-5 py-3.5">
                              <div className="flex items-center gap-2">
                                <span className={`font-bold font-mono ${st.averageScorePct > 75 ? "text-emerald-400" : "text-amber-400"}`}>
                                  {st.averageScorePct}%
                                </span>
                                <div className="w-16 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                  <div
                                    className={`h-full ${st.averageScorePct > 75 ? "bg-emerald-500" : "bg-amber-500"}`}
                                    style={{ width: `${Math.min(st.averageScorePct, 100)}%` }}
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="px-5 py-3.5">
                              {st.status === "cleared" ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[11px] font-semibold border border-emerald-500/20">
                                  <CheckCircle2 className="w-3 h-3" />
                                  Cleared (&gt;75%)
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 text-[11px] font-semibold border border-amber-500/20">
                                  <AlertCircle className="w-3 h-3" />
                                  Needs Remediation
                                </span>
                              )}
                            </td>
                            <td className="px-5 py-3.5 text-slate-500">
                              {st.lastActive}
                            </td>
                            <td className="px-5 py-3.5 text-right">
                              <button
                                onClick={() => setExpandedStudentId(isExpanded ? null : st.id)}
                                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors inline-flex items-center gap-1 text-xs"
                              >
                                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                              </button>
                            </td>
                          </tr>

                          {/* Expanded Module-by-Module Scores */}
                          {isExpanded && (
                            <tr className="bg-slate-950/90">
                              <td colSpan={7} className="px-5 py-4 border-b border-slate-800">
                                <div className="space-y-2">
                                  <span className="text-[11px] font-bold uppercase tracking-wider text-purple-400 block">
                                    Module Assessment Performance Breakdown
                                  </span>
                                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                                    {st.moduleBreakdown.map((mb) => (
                                      <div
                                        key={mb.moduleCode}
                                        className={`p-2.5 rounded-xl border ${
                                          mb.isPassed
                                            ? "bg-slate-900 border-emerald-500/30"
                                            : "bg-slate-900 border-amber-500/30"
                                        }`}
                                      >
                                        <span className="text-[10px] font-bold text-slate-400 block">
                                          {mb.moduleCode}
                                        </span>
                                        <div className="flex items-baseline justify-between mt-1">
                                          <span
                                            className={`text-sm font-bold font-mono ${
                                              mb.isPassed ? "text-emerald-400" : "text-amber-400"
                                            }`}
                                          >
                                            {mb.scorePct > 0 ? `${mb.scorePct}%` : "Not Taken"}
                                          </span>
                                          <span className="text-[10px] text-slate-500">
                                            {mb.attempts} att
                                          </span>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: VISUAL & SCHEMATIC APPROVALS */}
        {activeTab === "visuals" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                AI-Synthesized Clinical Schematics &amp; Approvals
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Review and approve clinical visual models generated for course theory modules. Approved assets are automatically published to the live Dual-Panel Theory workstation.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {visuals.map((vis) => (
                <div key={vis.id} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white">{vis.title}</h3>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded capitalize ${
                        vis.status === "approved"
                          ? "bg-emerald-500/10 text-emerald-400"
                          : vis.status === "rejected"
                          ? "bg-red-500/10 text-red-400"
                          : "bg-amber-500/10 text-amber-400"
                      }`}
                    >
                      {vis.status}
                    </span>
                  </div>

                  <div className="relative h-48 w-full rounded-xl overflow-hidden bg-slate-950 border border-slate-800">
                    <img
                      src={vis.storage_url}
                      alt={vis.alt_text}
                      className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity"
                    />
                  </div>

                  <div className="text-xs space-y-1 text-slate-400">
                    <p><strong className="text-slate-300">Alt Text:</strong> {vis.alt_text}</p>
                    <p><strong className="text-slate-300">License:</strong> {vis.license}</p>
                  </div>

                  <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                    <button
                      onClick={() => {
                        handleRejectVisual(vis.id);
                        showAlert(`Visual "${vis.title}" rejected.`);
                      }}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold text-red-400 hover:bg-red-950/40 border border-red-800/40"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => {
                        handleApproveVisual(vis.id);
                        showAlert(`Visual "${vis.title}" approved and published to course workstation.`);
                      }}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white"
                    >
                      Approve &amp; Publish
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
