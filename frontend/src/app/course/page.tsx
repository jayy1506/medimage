"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  BookOpen, 
  CheckCircle2, 
  Circle, 
  ChevronRight, 
  Clock, 
  Award, 
  Activity, 
  Sparkles,
  FileText,
  Calculator,
  UserCheck
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { UserNav } from "@/components/UserNav";
import { useProgress } from "@/context/ProgressContext";
import { 
  ALL_MODULES, 
  QUICK_FORMULAS, 
  STUDENT_NOTE_METADATA 
} from "@/data/curriculumData";
import { BrandLogo } from "@/components/BrandLogo";

export default function CourseDashboardPage() {
  const { user, profile } = useAuth();
  const { isTopicCompleted, completedTopicsCount, totalTopicsCount } = useProgress();
  const [activeTab, setActiveTab] = useState<"modules" | "formulas">("modules");

  const progressPct = totalTopicsCount > 0 ? Math.round((completedTopicsCount / totalTopicsCount) * 100) : 0;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Navigation Bar */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link href="/dashboard" className="flex items-center gap-2">
              <BrandLogo className="w-9 h-9" size={36} />
              <span className="text-sm font-bold tracking-tight text-adani-navy hidden sm:inline-block">
                Adani University
              </span>
            </Link>
            <div className="hidden sm:block h-5 w-px bg-slate-300" />
            <span className="hidden sm:block text-xs font-bold text-adani-navy uppercase tracking-wider">
              {STUDENT_NOTE_METADATA.course_code} • Workstation
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <UserNav />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 space-y-6">
        {/* Student Dedication & Academic Header */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-adani-navy via-slate-900 to-slate-950 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="space-y-3 max-w-2xl relative z-10">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-sky-500/20 border border-sky-400/30 text-adani-cyan text-[11px] font-bold uppercase tracking-wider">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Accredited Academic Notes • {STUDENT_NOTE_METADATA.course_code}</span>
              </span>
              <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-300 text-[10px] font-bold">
                <Sparkles className="w-3 h-3" />
                <span>Concept → Example → Application Question</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              {STUDENT_NOTE_METADATA.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Comprehensive accredited learning modules for B.Tech Semester VI. Every topic includes detailed physics, mathematical derivations, worked clinical examples, and verified application questions.
            </p>
          </div>

          {/* Progress Circular Dial */}
          <div className="flex items-center space-x-4 bg-white/10 p-5 rounded-2xl border border-white/10 flex-shrink-0 relative z-10">
            <div className="text-center">
              <div className="text-3xl font-black text-adani-cyan">{progressPct}%</div>
              <div className="text-[10px] text-slate-300 uppercase tracking-wider font-bold">Curriculum Cleared</div>
            </div>
            <div className="h-10 w-px bg-white/20" />
            <div className="text-xs space-y-1">
              <div className="text-slate-200"><span className="font-bold text-white">{completedTopicsCount}</span> of {totalTopicsCount} Topics</div>
              <div className="text-[10px] text-emerald-400 font-semibold">&gt;75% Pass Condition Active</div>
            </div>
          </div>
        </div>

        {/* View Switcher Tabs: Modules Outline vs Formula Sheet */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          <button
            onClick={() => setActiveTab("modules")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "modules"
                ? "bg-adani-cyan text-white shadow-sm"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            6 Curriculum Modules ({totalTopicsCount} Topics)
          </button>

          <button
            onClick={() => setActiveTab("formulas")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "formulas"
                ? "bg-adani-purple text-white shadow-sm"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            Quick Formula Sheet ({QUICK_FORMULAS.length} Equations)
          </button>

          <Link
            href="/course/capstone"
            className="ml-auto px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-adani-cyan via-adani-purple to-adani-magenta hover:opacity-95 shadow-sm transition-all flex items-center gap-2"
          >
            <Award className="w-3.5 h-3.5" />
            Final Capstone Assessment (40 MCQs)
          </Link>
        </div>

        {/* TAB 1: 6 CURRICULUM MODULES */}
        {activeTab === "modules" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              {ALL_MODULES.map((m) => (
                <div
                  key={m.id}
                  className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4 hover:border-adani-cyan/40 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
                    <div className="flex items-center space-x-3">
                      <span className="h-9 w-9 rounded-xl bg-gradient-to-tr from-sky-50 to-sky-100 border border-sky-200 text-adani-cyan font-black text-sm flex items-center justify-center">
                        0{m.module_number}
                      </span>
                      <div>
                        <h3 className="text-base font-bold text-slate-900">{m.title}</h3>
                        <p className="text-xs text-slate-500 mt-0.5">{m.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 flex-shrink-0">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                        {m.theory_hours}h Theory
                      </span>
                      {m.co_tags.map((co) => (
                        <span key={co} className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-50 text-adani-cyan border border-sky-200">
                          {co}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Topics in this module */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                    {m.topics.map((t) => (
                      <Link
                        key={t.id}
                        href={`/course/${m.id}/${t.slug}`}
                        className="group p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:border-adani-cyan hover:shadow-md transition-all flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-2.5 min-w-0">
                          {isTopicCompleted(t.slug) ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                          ) : (
                            <Circle className="w-4 h-4 text-slate-300 group-hover:text-adani-cyan flex-shrink-0" />
                          )}
                          <span className="text-xs font-semibold text-slate-800 group-hover:text-adani-navy truncate">
                            {t.title}
                          </span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-adani-cyan flex-shrink-0 ml-1.5 transform group-hover:translate-x-0.5 transition-transform" />
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: QUICK FORMULA SHEET */}
        {activeTab === "formulas" && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Calculator className="w-4 h-4 text-adani-purple" />
                Medical Image Processing: Quick Formula Reference Sheet
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Key mathematical laws, physical relationships, and clinical quantitative equations used across Modules I through VI.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {QUICK_FORMULAS.map((f, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 hover:bg-slate-100/60 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">{f.name}</span>
                    <span className="text-[10px] font-mono text-slate-400">EQ #{idx + 1}</span>
                  </div>
                  <div className="p-2.5 bg-white rounded-lg border border-slate-200 font-mono text-xs font-bold text-adani-navy overflow-x-auto text-center">
                    {f.formula}
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">{f.notes}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
