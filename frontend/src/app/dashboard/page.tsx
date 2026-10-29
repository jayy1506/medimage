"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import {
  Award,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  BookOpen,
  ArrowRight,
  TrendingUp,
  Activity,
  BarChart3,
  LogOut,
  Sparkles,
  Layers
} from "lucide-react";

interface ModuleAttemptRecord {
  moduleId: string;
  moduleCode: string;
  moduleTitle: string;
  coTarget: string;
  bestScorePct: number;
  latestScorePct: number;
  attemptsCount: number;
  isPassed: boolean;
  status: "cleared" | "needs_remediation" | "not_started";
}

export default function StudentDashboardPage() {
  const { user, logout } = useAuth();
  const [mounted, setMounted] = useState(false);

  // Student module progression data following strict >75.0% pass criteria
  const [moduleRecords, setModuleRecords] = useState<ModuleAttemptRecord[]>([
    {
      moduleId: "mod-1",
      moduleCode: "MOD 01",
      moduleTitle: "Clinical Foundations & Mathematical Preliminaries",
      coTarget: "CO1, CO2",
      bestScorePct: 84.5,
      latestScorePct: 84.5,
      attemptsCount: 2,
      isPassed: true,
      status: "cleared"
    },
    {
      moduleId: "mod-2",
      moduleCode: "MOD 02",
      moduleTitle: "Digital Image Fundamentals & DICOM Standards",
      coTarget: "CO2",
      bestScorePct: 78.0,
      latestScorePct: 78.0,
      attemptsCount: 1,
      isPassed: true,
      status: "cleared"
    },
    {
      moduleId: "mod-3",
      moduleCode: "MOD 03",
      moduleTitle: "Image Enhancement & 2D Filtering",
      coTarget: "CO3",
      bestScorePct: 72.0,
      latestScorePct: 72.0,
      attemptsCount: 1,
      isPassed: false,
      status: "needs_remediation"
    },
    {
      moduleId: "mod-4",
      moduleCode: "MOD 04",
      moduleTitle: "Radon Transform & CT Tomographic Reconstruction",
      coTarget: "CO3, CO4",
      bestScorePct: 0.0,
      latestScorePct: 0.0,
      attemptsCount: 0,
      isPassed: false,
      status: "not_started"
    },
    {
      moduleId: "mod-5",
      moduleCode: "MOD 05",
      moduleTitle: "Medical Image Segmentation & Feature Extraction",
      coTarget: "CO4",
      bestScorePct: 0.0,
      latestScorePct: 0.0,
      attemptsCount: 0,
      isPassed: false,
      status: "not_started"
    },
    {
      moduleId: "mod-6",
      moduleCode: "MOD 06",
      moduleTitle: "Clinical NLP & Multimodal Medical AI",
      coTarget: "CO5",
      bestScorePct: 0.0,
      latestScorePct: 0.0,
      attemptsCount: 0,
      isPassed: false,
      status: "not_started"
    }
  ]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Aggregated calculations
  const totalModules = moduleRecords.length;
  const clearedModules = moduleRecords.filter((m) => m.isPassed).length;
  const completionPct = Math.round((clearedModules / totalModules) * 100);

  const coAttainments = [
    { code: "CO1", title: "Medical Image Sources & Physics", score: 84.5, target: 75.0, status: "Met" },
    { code: "CO2", title: "DICOM Standards & Protocols", score: 81.2, target: 75.0, status: "Met" },
    { code: "CO3", title: "2D Filtering & Transforms", score: 72.0, target: 75.0, status: "In Progress" },
    { code: "CO4", title: "3D Reconstruction & Segmentation", score: 0.0, target: 75.0, status: "Pending" },
    { code: "CO5", title: "Clinical NLP & Diagnostics", score: 0.0, target: 75.0, status: "Pending" }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col">
      {/* Institutional Top Navbar */}
      <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-slate-700 bg-white p-1">
              <Image
                src="/assets/logo.png"
                alt="Adani Institute of Higher Education and Research"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div>
              <span className="text-sm font-semibold tracking-wide text-white block">
                Adani Institute of Higher Education and Research
              </span>
              <span className="text-xs text-sky-400 font-medium">
                AIDS 12605.1 • Student Performance Portal
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/course"
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 transition-colors flex items-center gap-1.5 border border-slate-700/60"
            >
              <BookOpen className="w-3.5 h-3.5 text-sky-400" />
              Syllabus
            </Link>
            <Link
              href="/playground"
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 transition-colors flex items-center gap-1.5 border border-slate-700/60"
            >
              <Layers className="w-3.5 h-3.5 text-purple-400" />
              Playgrounds
            </Link>
            {user?.role && ["faculty", "admin"].includes(user.role) && (
              <Link
                href="/faculty"
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-purple-300 bg-purple-950/60 hover:bg-purple-900/60 border border-purple-800/50 transition-colors flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Faculty Studio
              </Link>
            )}
            <div className="h-4 w-px bg-slate-800" />
            <button
              onClick={() => logout()}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-red-400 hover:bg-red-950/30 transition-colors flex items-center gap-1"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Welcome Banner */}
        <section className="bg-gradient-to-r from-slate-900 via-slate-900 to-sky-950/40 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial-gradient from-sky-500/10 to-transparent pointer-events-none" />
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-semibold uppercase tracking-wider mb-2">
                <Activity className="w-3.5 h-3.5" />
                Semester VI • Academic Progression
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Welcome, {user?.email?.split("@")[0] || "Student Candidate"}
              </h1>
              <p className="text-slate-400 text-sm mt-1 max-w-2xl leading-relaxed">
                Faculty of Engineering and Technology • Department of Artificial Intelligence & Data Science.
                Complete all 6 module masteries with a score strictly exceeding 75.0% to be eligible for End-Sem Exam recommendation.
              </p>
            </div>

            {/* Quick Metrics */}
            <div className="flex items-center gap-4 bg-slate-950/60 border border-slate-800 p-4 rounded-xl">
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
              <div>
                <span className="text-xs text-slate-400 font-medium block">Course Attainment</span>
                <span className="text-sm font-semibold text-white">
                  {clearedModules} / {totalModules} Cleared
                </span>
                <span className="text-[11px] text-amber-400 flex items-center gap-1 mt-0.5">
                  <TrendingUp className="w-3 h-3" /> Rule: &gt; 75.0% pass
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* 2-Column Grid: Course Outcomes & Mastery Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Course Outcomes (CO) Attainment (1 Col) */}
          <section className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-sky-400" />
                  Course Outcome (CO) Metrics
                </h2>
                <span className="text-[11px] font-medium text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                  NBA Tier-1
                </span>
              </div>
              <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                Adani Institute criteria require sustained demonstrable competence across each target outcome.
              </p>

              <div className="space-y-4">
                {coAttainments.map((co) => (
                  <div key={co.code} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-200">
                        {co.code}: <span className="font-normal text-slate-400">{co.title}</span>
                      </span>
                      <span
                        className={`font-mono text-xs font-medium ${
                          co.score > co.target
                            ? "text-emerald-400"
                            : co.score > 0
                            ? "text-amber-400"
                            : "text-slate-500"
                        }`}
                      >
                        {co.score > 0 ? `${co.score}%` : "Not attempted"}
                      </span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          co.score > co.target ? "bg-emerald-500" : co.score > 0 ? "bg-amber-500" : "bg-slate-700"
                        }`}
                        style={{ width: `${Math.min(co.score, 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-800 text-xs text-slate-500">
              Target minimum score for accreditation mastery is strictly &gt; 75.0%.
            </div>
          </section>

          {/* Right Column: Module Assessment Mastery Table (2 Cols) */}
          <section className="lg:col-span-2 bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Award className="w-4 h-4 text-purple-400" />
                  Module Mastery & Assessment Clearance
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Enforces strict &gt;75.0% pass criteria. Scores at or below 75.0% mandate targeted remediation retake.
                </p>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-3">Module</th>
                    <th className="py-3 px-3">Target CO</th>
                    <th className="py-3 px-3 text-center">Attempts</th>
                    <th className="py-3 px-3 text-center">Best Score</th>
                    <th className="py-3 px-3 text-center">Status</th>
                    <th className="py-3 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {moduleRecords.map((m) => (
                    <tr key={m.moduleId} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3.5 px-3">
                        <span className="text-[10px] font-bold text-sky-400 block tracking-wider">
                          {m.moduleCode}
                        </span>
                        <span className="font-medium text-slate-200 block text-xs">
                          {m.moduleTitle}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 font-mono text-slate-400">{m.coTarget}</td>
                      <td className="py-3.5 px-3 text-center font-mono text-slate-300">
                        {m.attemptsCount}
                      </td>
                      <td className="py-3.5 px-3 text-center font-mono">
                        {m.attemptsCount > 0 ? (
                          <span
                            className={
                              m.bestScorePct > 75.0
                                ? "text-emerald-400 font-semibold"
                                : "text-amber-400 font-semibold"
                            }
                          >
                            {m.bestScorePct}%
                          </span>
                        ) : (
                          <span className="text-slate-600">—</span>
                        )}
                      </td>
                      <td className="py-3.5 px-3 text-center">
                        {m.status === "cleared" && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            <CheckCircle2 className="w-3 h-3" /> Cleared
                          </span>
                        )}
                        {m.status === "needs_remediation" && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            <AlertTriangle className="w-3 h-3" /> Retake (&le;75%)
                          </span>
                        )}
                        {m.status === "not_started" && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-800 text-slate-400">
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-3 text-right">
                        {m.status === "cleared" && (
                          <Link
                            href={`/course/${m.moduleId}/quiz`}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
                          >
                            Review
                          </Link>
                        )}
                        {m.status === "needs_remediation" && (
                          <Link
                            href={`/course/${m.moduleId}/quiz`}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold text-amber-300 hover:text-white bg-amber-950/80 hover:bg-amber-900 border border-amber-700/50 transition-colors"
                          >
                            <RotateCcw className="w-3 h-3" /> Retake
                          </Link>
                        )}
                        {m.status === "not_started" && (
                          <Link
                            href={`/course/${m.moduleId}/topic-1`}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium text-sky-400 hover:text-sky-300 bg-sky-950/60 hover:bg-sky-900/60 border border-sky-800/40 transition-colors"
                          >
                            Start <ArrowRight className="w-3 h-3" />
                          </Link>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* Clinical Disclaimer Footer */}
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
