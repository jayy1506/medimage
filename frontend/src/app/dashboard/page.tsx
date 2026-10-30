"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { UserNav } from "@/components/UserNav";
import { useProgress } from "@/context/ProgressContext";
import { ALL_MODULES } from "@/data/curriculumData";
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

interface CurriculumModuleItem {
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
  const { user, profile, role, signOut } = useAuth();
  const {
    completedTopics,
    moduleScores,
    attempts,
    clearedModules,
    isTopicCompleted,
    totalTopicsCount,
    completedTopicsCount,
    clearedModulesCount,
    completionPct,
    coAttainments,
    resetProgress
  } = useProgress();

  const [mounted, setMounted] = useState(false);
  const [expandedModule, setExpandedModule] = useState<string>("mod-1");

  useEffect(() => {
    setMounted(true);
  }, []);

  // Dynamically map all 6 accredited curriculum modules from live progress
  const modules: CurriculumModuleItem[] = useMemo(() => {
    return ALL_MODULES.map((m) => {
      const score = moduleScores[m.id] || 0.0;
      const attemptCount = attempts[m.id] || 0;
      const isPassed = clearedModules.includes(m.id) || score > 75.0;
      const status: "cleared" | "needs_remediation" | "not_started" = isPassed
        ? "cleared"
        : attemptCount > 0
        ? "needs_remediation"
        : "not_started";

      return {
        id: m.id,
        moduleCode: `MODULE 0${m.module_number}`,
        title: m.title,
        description: m.description,
        theoryHours: m.theory_hours,
        coTarget: (m.co_tags || []).join(", "),
        bestScorePct: score,
        latestScorePct: score,
        attemptsCount: attemptCount,
        isPassed,
        status,
        topics: m.topics.map((t) => ({
          id: t.id,
          slug: t.slug,
          title: t.title,
          readTime: t.read_time_minutes,
          coTag: (t.co_tags || []).join(", "),
          isCompleted: isTopicCompleted(t.slug)
        }))
      };
    });
  }, [moduleScores, attempts, clearedModules, isTopicCompleted]);

  if (!mounted) return null;

  const totalModules = modules.length;
  const candidateEmail = profile?.email || user?.email || "student@adani.edu.in";

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
            <UserNav />
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Banner with Progress Dial (White Theme) */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-adani-cyan text-xs font-bold uppercase tracking-wider">
                  <Activity className="w-3.5 h-3.5" />
                  B.Tech Semester VI • Comprehensive Course Dashboard
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-adani-purple text-xs font-bold">
                  <Sparkles className="w-3.5 h-3.5" />
                  Accredited Study Notes • AIDS 12605.1
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Medical Text and Image Processing
              </h1>
              <p className="text-slate-600 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
                Candidate: <span className="text-adani-cyan font-mono font-bold">{candidateEmail}</span>.
                Concept → Example → Application question methodology active across all 6 foundational modules with strict &gt;75.0% pass rule.
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
                  {clearedModulesCount} of {totalModules} Modules Cleared
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
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-600 font-mono">
                Completed Topics: <strong className="text-adani-cyan font-bold">{completedTopicsCount}</strong> / {totalTopicsCount}
              </span>
              {completedTopicsCount > 0 && (
                <button
                  onClick={async () => {
                    if (confirm("Reset all topic completions and test scores for your account?")) {
                      await resetProgress();
                    }
                  }}
                  className="px-2 py-1 rounded-md text-[11px] font-semibold text-slate-500 hover:text-rose-600 bg-slate-100 hover:bg-rose-50 border border-slate-200 transition-colors flex items-center gap-1"
                  title="Reset your learning progress to 0"
                >
                  <RotateCcw className="w-3 h-3" /> Reset
                </button>
              )}
            </div>
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
                      <div className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
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

          {/* FINAL GRAND CAPSTONE EXAMINATION (40 MCQS ACROSS ALL MODULES) */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-adani-navy via-slate-900 to-slate-950 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden mt-6">
            <div className="space-y-2 max-w-2xl relative z-10">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/20 border border-sky-400/30 text-adani-cyan text-[11px] font-bold uppercase tracking-wider">
                  <Award className="w-3.5 h-3.5" />
                  Course Completion Milestone
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-300 text-[10px] font-bold">
                  <Sparkles className="w-3 h-3" />
                  Comprehensive Capstone • 40 MCQs
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Final Course Mastery Assessment (All 6 Modules)
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Comprehensive 40-question exit examination evaluating all accredited Course Outcomes (CO1-CO5). Strict &gt;75.0% pass criteria applies for institutional clearance.
              </p>
            </div>

            <div className="flex items-center gap-3 relative z-10">
              <Link
                href="/course/capstone"
                className="px-6 py-3 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-adani-cyan via-adani-purple to-adani-magenta hover:opacity-95 shadow-md transition-all flex items-center gap-2"
              >
                <Award className="w-4 h-4" />
                Launch 40-MCQ Final Assessment
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
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
