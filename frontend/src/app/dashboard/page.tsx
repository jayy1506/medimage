"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { UserNav } from "@/components/UserNav";
import { useProgress } from "@/context/ProgressContext";
import { ALL_MODULES, STUDENT_NOTE_METADATA } from "@/data/curriculumData";
import { BrandLogo } from "@/components/BrandLogo";
import PlaygroundNavModal from "@/components/playground/PlaygroundNavModal";
import {
  Award,
  CheckCircle2,
  Circle,
  AlertTriangle,
  RotateCcw,
  BookOpen,
  ArrowRight,
  ArrowDown,
  TrendingUp,
  Activity,
  BarChart3,
  Sparkles,
  Layers,
  Clock,
  Code,
  Sliders,
  Shield,
  ShieldCheck,
  FileText,
  HelpCircle,
  Bot,
  GraduationCap
} from "lucide-react";

export default function UnifiedCurriculumDashboard() {
  const { user, profile } = useAuth();
  const {
    completedTopics,
    moduleScores,
    attempts,
    clearedModules,
    totalTopicsCount,
    completedTopicsCount,
    clearedModulesCount,
    completionPct,
    coAttainments,
    resetProgress
  } = useProgress();

  const [mounted, setMounted] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);
  const [isResetting, setIsResetting] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Dynamic time-of-day greeting (must be called before any early return)
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  }, []);

  const totalModules = ALL_MODULES.length;
  const candidateName =
    (typeof window !== "undefined" ? sessionStorage.getItem("gyaanlab_username") : null) ||
    (profile?.username ? profile.username : null) ||
    (profile?.full_name && profile.full_name.toLowerCase() !== "student" ? profile.full_name : null) ||
    (user?.displayName && user.displayName.toLowerCase() !== "student" ? user.displayName : null) ||
    "Scholar";

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col selection:bg-sky-100 selection:text-sky-900">
      {/* INSTITUTIONAL NAVBAR: ADANI BRANDING (LEFT) | PG ICON, RESET ICON, ACCOUNT ICON (RIGHT) */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* LEFT SIDE: ADANI UNIVERSITY BRANDING ONLY */}
          <div className="flex items-center gap-3">
            <BrandLogo className="w-9 h-9" size={38} />
            <div>
              <span className="text-sm font-bold tracking-tight text-adani-navy block">
                Adani Institute of Higher Education and Research
              </span>
              <span className="text-[11px] text-adani-cyan font-semibold">
                Faculty of Engineering &amp; Technology
              </span>
            </div>
          </div>

          {/* RIGHT SIDE: PG ICON BUTTON + CIRCULAR RESET BUTTON + USER INITIALS AVATAR */}
          <div className="flex items-center gap-2.5">
            {/* 1. Interactive Playgrounds (PG) Icon Button with Floating 3-Game Modal */}
            <PlaygroundNavModal />

            {/* 2. Circular Reset Progress Button with Hover Tooltip */}
            <button
              onClick={() => setShowResetConfirm(true)}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-rose-50 hover:text-rose-600 border border-slate-200 flex items-center justify-center text-slate-500 transition-all shadow-2xs transform hover:scale-105 active:scale-95 touch-manipulation cursor-pointer"
              title="Reset Progress"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            {/* 3. Circular Account Avatar with User Initials (No outer text, opens details on click) */}
            <UserNav />
          </div>
        </div>
      </header>

      {/* MAIN DASHBOARD CONTENT */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* STUDENT ACADEMIC OVERVIEW HERO */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            {/* Left Column: University Emblem & Greeting */}
            <div className="flex flex-col sm:flex-row items-start gap-5 max-w-2xl">
              <div className="w-14 h-14 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center p-2.5 flex-shrink-0">
                <BrandLogo className="w-9 h-9" size={38} />
              </div>

              <div className="space-y-2">
                <div>
                  <div className="text-xs font-medium text-slate-500">
                    {greeting}, Scholar
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-0.5">
                    Welcome back, {candidateName}
                  </h1>
                  <p className="text-xs sm:text-sm font-medium text-slate-600 mt-1">
                    B.Tech Artificial Intelligence &amp; Data Science • Semester VI • Adani University
                  </p>
                </div>

                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed pt-1">
                  Select an enrolled course from the curriculum directory below to inspect syllabus topics, run laboratory simulators, or take module evaluations.
                </p>

                {/* Action Buttons */}
                <div className="pt-3 flex flex-wrap items-center gap-3">
                  <a
                    href="#curriculum-directory"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-adani-navy hover:bg-slate-800 text-white text-xs sm:text-sm font-medium transition-colors shadow-2xs cursor-pointer"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Curriculum Directory</span>
                    <ArrowDown className="w-3.5 h-3.5" />
                  </a>

                  <Link
                    href="/tutor"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs sm:text-sm font-medium transition-colors shadow-2xs"
                  >
                    <Bot className="w-4 h-4 text-adani-purple" />
                    <span>Ask MedAI Tutor</span>
                  </Link>

                  <Link
                    href="/help"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs sm:text-sm font-medium transition-colors shadow-2xs"
                  >
                    <HelpCircle className="w-4 h-4 text-slate-400" />
                    <span>Docs &amp; FAQs</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Right Column: Clean Academic Status Summary */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 min-w-[260px] sm:min-w-[280px] space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200/80 pb-2.5">
                <span className="text-xs font-semibold text-slate-600">Academic Standing</span>
                <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Active Term
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-600">
                  <span className="text-slate-500">Degree Program</span>
                  <span className="font-medium text-slate-800">B.Tech AI &amp; DS</span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span className="text-slate-500">Enrolled Subjects</span>
                  <span className="font-medium text-slate-800">1 Course (3 Credits)</span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span className="text-slate-500">Evaluation Rule</span>
                  <span className="font-medium text-slate-800">&gt; 75.0% Mastery</span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span className="text-slate-500">Accreditation</span>
                  <span className="font-medium text-slate-800">NBA Tier-1</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ENROLLED ACADEMIC COURSES & SUBJECTS DIRECTORY (SCALABLE MULTI-COURSE ARCHITECTURE) */}
        <section id="curriculum-directory" className="scroll-mt-24 bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md bg-sky-50 border border-sky-200 text-adani-cyan text-[11px] font-bold uppercase">
                  Curriculum Directory
                </span>
                <span className="text-xs font-semibold text-slate-400">•</span>
                <span className="text-xs font-bold text-slate-600">Enrolled Subjects</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight mt-1 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-adani-cyan" />
                Academic Courses &amp; Subjects
              </h2>
              <p className="text-xs text-slate-500 mt-0.5 max-w-3xl">
                Open any enrolled subject to view its complete syllabus, track outcome attainment, and launch continuous evaluation workstations.
              </p>
            </div>
          </div>

          {/* SCALABLE COURSE CARDS GRID (PREVENTS COLLAPSE WHEN MORE SUBJECTS ARE ADDED) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Primary Enrolled Course: Medical Text and Image Processing */}
            <div className="group relative rounded-3xl bg-gradient-to-b from-white via-slate-50/30 to-slate-50/80 border-2 border-adani-cyan/30 hover:border-adani-cyan hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between p-6 overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-adani-cyan via-adani-purple to-adani-magenta" />

              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-black px-2.5 py-1 rounded-lg bg-sky-50 border border-sky-200 text-adani-cyan font-mono shadow-2xs">
                    AIDS 12605.1
                  </span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1 shadow-2xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Active Course
                  </span>
                </div>

                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-adani-cyan transition-colors leading-snug">
                    Medical Text and Image Processing
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    B.Tech Semester VI • 3 Credits • Faculty of Eng &amp; Tech
                  </p>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                  Comprehensive biomedical radiology physics, DICOM Part 10 architecture, 2D convolution and Fourier transforms, Radon tomographic reconstruction, U-Net deep learning segmentation, and clinical NLP.
                </p>

                <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-slate-500">
                  <span className="bg-slate-100 px-2.5 py-1 rounded-md font-semibold text-slate-700">
                    6 Modules
                  </span>
                  <span className="bg-slate-100 px-2.5 py-1 rounded-md font-semibold text-slate-700">
                    36 Topics
                  </span>
                  <span className="bg-slate-100 px-2.5 py-1 rounded-md font-semibold text-slate-700">
                    Capstone Exam
                  </span>
                </div>
              </div>

              <div className="pt-6 mt-4 border-t border-slate-200/80">
                <Link
                  href="/course"
                  className="w-full py-3 px-4 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-adani-cyan via-adani-purple to-adani-magenta hover:opacity-95 shadow-md transition-all flex items-center justify-center gap-2 group-hover:shadow-lg transform active:scale-98"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Enter Course Workstation</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Upcoming Course Placeholder 1: Deep Learning for Clinical Diagnostics */}
            <div className="rounded-3xl bg-slate-50/50 border border-slate-200/80 flex flex-col justify-between p-6 opacity-75 hover:opacity-90 transition-opacity">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-500">
                    AIDS 12701.1
                  </span>
                  <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                    Semester VII • Upcoming
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-700">
                    Deep Learning for Clinical Diagnostics
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    B.Tech Semester VII • 4.0 Credits
                  </p>
                </div>

                <p className="text-xs text-slate-500 leading-relaxed">
                  Advanced multi-modal transformer architectures, vision-language clinical models, and automated diagnostic report generation for healthcare systems.
                </p>

                <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-slate-400">
                  <span className="bg-slate-100 px-2.5 py-1 rounded-md">Curriculum in Review</span>
                  <span className="bg-slate-100 px-2.5 py-1 rounded-md">NBA Tier-1</span>
                </div>
              </div>

              <div className="pt-6 mt-4 border-t border-slate-200/60">
                <button
                  disabled
                  className="w-full py-2.5 px-4 rounded-xl font-semibold text-xs text-slate-400 bg-slate-100 border border-slate-200 cursor-not-allowed text-center"
                >
                  Opens Next Semester
                </button>
              </div>
            </div>

            {/* Upcoming Course Placeholder 2: Healthcare Robotics & Surgical Automation */}
            <div className="rounded-3xl bg-slate-50/50 border border-slate-200/80 flex flex-col justify-between p-6 opacity-75 hover:opacity-90 transition-opacity">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-500">
                    AIDS 12702.1
                  </span>
                  <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                    Semester VII • Upcoming
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-700">
                    Healthcare Robotics &amp; Surgical AI
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    B.Tech Semester VII • 4.0 Credits
                  </p>
                </div>

                <p className="text-xs text-slate-500 leading-relaxed">
                  Computer vision tracking for robotic laparoscopy, kinematic state estimation, and tele-robotic surgical safety interlocks.
                </p>

                <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-slate-400">
                  <span className="bg-slate-100 px-2.5 py-1 rounded-md">Curriculum in Review</span>
                  <span className="bg-slate-100 px-2.5 py-1 rounded-md">Adani AI Lab</span>
                </div>
              </div>

              <div className="pt-6 mt-4 border-t border-slate-200/60">
                <button
                  disabled
                  className="w-full py-2.5 px-4 rounded-xl font-semibold text-xs text-slate-400 bg-slate-100 border border-slate-200 cursor-not-allowed text-center"
                >
                  Opens Next Semester
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* COMPACT PLATFORM CAPABILITIES OVERVIEW - PERFECTLY ALIGNED & PROPERLY PADDED */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: MedAI Clinical Tutor */}
          <Link
            href="/tutor"
            className="group relative bg-white border border-slate-200/90 hover:border-purple-300 rounded-3xl p-6 shadow-xs hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between cursor-pointer"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-purple-50 text-adani-purple flex items-center justify-center font-bold text-sm border border-purple-100/80 shadow-2xs group-hover:scale-105 transition-transform">
                  <Bot className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200/60 font-mono">
                  Gemini 3.5 AI
                </span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-adani-purple transition-colors">
                  MedAI Clinical Tutor
                </h3>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                  Curriculum-grounded artificial intelligence. Instant mathematical derivations, LaTeX formulas, and strict course scope guardrails.
                </p>
              </div>
            </div>
            <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-adani-purple">
              <span>Launch Tutor</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 2: Interactive Simulation Lab */}
          <div
            className="group relative bg-white border border-slate-200/90 hover:border-sky-300 rounded-3xl p-6 shadow-xs hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-sky-50 text-adani-cyan flex items-center justify-center font-bold text-sm border border-sky-100/80 shadow-2xs group-hover:scale-105 transition-transform">
                  <Sliders className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-200/60 font-mono">
                  60 FPS WebGL
                </span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-adani-cyan transition-colors">
                  Interactive Simulation Lab
                </h3>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                  Real-time CT windowing (WW/WL), 2D spatial convolution kernel filtering, and DICOM Part 10 tag inspection accessible via top PG icon.
                </p>
              </div>
            </div>
            <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-adani-cyan">
              <span>Playground Modal Active</span>
              <Sliders className="w-3.5 h-3.5 group-hover:rotate-45 transition-transform" />
            </div>
          </div>

          {/* Card 3: Mastery Accreditation */}
          <Link
            href="/course/capstone"
            className="group relative bg-white border border-slate-200/90 hover:border-emerald-300 rounded-3xl p-6 shadow-xs hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between cursor-pointer"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm border border-emerald-100/80 shadow-2xs group-hover:scale-105 transition-transform">
                  <Award className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60 font-mono">
                  NBA Tier-1
                </span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                  Mastery Accreditation
                </h3>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                  Accredited evaluation target with modular 15-question assessments and a 40-question comprehensive Capstone examination (&gt; 75% pass rule).
                </p>
              </div>
            </div>
            <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-emerald-600">
              <span>View Capstone Exam</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </main>

      {/* RESET CONFIRMATION MODAL */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 max-w-sm w-full shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900">Reset Learning Progress?</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                This will reset your completed syllabus topics and quiz scores back to 0%. This action cannot be undone.
              </p>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  setIsResetting(true);
                  await resetProgress();
                  setIsResetting(false);
                  setShowResetConfirm(false);
                }}
                disabled={isResetting}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 transition-colors disabled:opacity-50"
              >
                {isResetting ? "Resetting..." : "Yes, Reset Progress"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
