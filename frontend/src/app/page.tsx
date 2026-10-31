"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { UserNav } from "@/components/UserNav";
import { BrandLogo } from "@/components/BrandLogo";
import { 
  BookOpen, 
  ShieldCheck, 
  Cpu, 
  Layers, 
  Binary, 
  FileCode2, 
  ChevronRight, 
  Activity, 
  ArrowRight,
  Database
} from "lucide-react";


export default function HomePage() {
  const { user, profile } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center gap-3">
              <BrandLogo className="w-10 h-10" size={40} />
              <div>
                <span className="text-base font-extrabold tracking-tight text-adani-navy block leading-none">
                  Adani University
                </span>
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mt-1">
                  Institute of Higher Education & Research
                </span>
              </div>
            </Link>
            <div className="hidden md:block h-6 w-px bg-slate-300" />
            <div className="hidden md:flex flex-col">
              <span className="text-xs font-semibold uppercase tracking-wider text-adani-navy">
                Faculty of Engineering &amp; Technology
              </span>
              <span className="text-sm font-bold text-adani-cyan">
                GyaanLab
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              href="/dashboard"
              className="hidden sm:inline-flex items-center text-xs font-bold text-slate-700 hover:text-adani-navy px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
            >
              Curriculum Dashboard
            </Link>
            {user || profile ? (
              <UserNav />
            ) : (
              <Link
                href="/login"
                className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-adani-cyan via-adani-purple to-adani-magenta hover:opacity-95 rounded-lg shadow-sm transition-all"
              >
                Sign In (Invite-Only)
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-slate-50 to-slate-100 py-16 sm:py-24 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-adani-cyan/10 border border-adani-cyan/20 text-adani-cyan text-xs font-bold uppercase tracking-wider">
                <Activity className="w-3.5 h-3.5" />
                <span>B.Tech Semester VI • Accredited Curriculum</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
                Interactive Medical <br />
                <span className="bg-gradient-to-r from-adani-cyan via-adani-purple to-adani-magenta bg-clip-text text-transparent">
                  Image &amp; Text Processing
                </span>
              </h1>

              <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
                A purpose-built clinical learning workstation. Master radiology physics, CT/MRI reconstruction, DICOM metadata structures, Fourier filtering, and in-browser Python algorithms with real-time synchronized visual workstations.
              </p>

              <div className="flex flex-wrap gap-4 pt-2">
                <Link
                  href="/login"
                  className="px-6 py-3 text-base font-bold text-white bg-adani-navy hover:bg-adani-dark rounded-xl shadow-md transition-all flex items-center"
                >
                  Enter Course Portal
                  <ChevronRight className="ml-2 w-5 h-5" />
                </Link>

                <div className="inline-flex items-center px-4 py-3 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-600">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 mr-2 flex-shrink-0" />
                  <span>Strict Invite-Only • Zero Student Data Retained Locally</span>
                </div>
              </div>
            </div>

            {/* Interactive Feature Badge Grid */}
            <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <Layers className="w-8 h-8 text-adani-cyan mb-3" />
                <h3 className="font-bold text-slate-900 text-sm">Dual-Panel Sync</h3>
                <p className="text-xs text-slate-500 mt-1">Textual derivations dynamically trigger sticky Mermaid &amp; SVG workstations on scroll.</p>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <Binary className="w-8 h-8 text-adani-purple mb-3" />
                <h3 className="font-bold text-slate-900 text-sm">Client Playground</h3>
                <p className="text-xs text-slate-500 mt-1">Live CT windowing sliders (WW/WL), histogram equalization, and 2D FFT convolution.</p>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <FileCode2 className="w-8 h-8 text-adani-magenta mb-3" />
                <h3 className="font-bold text-slate-900 text-sm">Pyodide Sandbox</h3>
                <p className="text-xs text-slate-500 mt-1">Client-side Python execution (NumPy, OpenCV, pydicom) with zero server compute bills.</p>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <Cpu className="w-8 h-8 text-amber-600 mb-3" />
                <h3 className="font-bold text-slate-900 text-sm">&gt;75% Pass Rule</h3>
                <p className="text-xs text-slate-500 mt-1">Rigorous formative quizzes with randomized pools, tracking best and latest attempts.</p>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Institutional Footer */}
      <footer className="bg-adani-dark text-slate-400 text-xs py-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <BrandLogo className="w-7 h-7" size={28} />
            <span className="font-semibold text-slate-300">Adani University</span>
            <span>• Faculty of Engineering and Technology</span>
          </div>
          <div>
            <span>Accredited Academic Workstation</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
