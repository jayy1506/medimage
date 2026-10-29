"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  Image as ImageIcon, 
  FileText, 
  BarChart3, 
  ChevronLeft, 
  ShieldCheck, 
  AlertCircle,
  PlusCircle,
  Send
} from "lucide-react";

interface DraftVisual {
  id: string;
  title: string;
  storage_url: string;
  alt_text: string;
  license: string;
  prompt: string;
  status: "draft" | "approved" | "rejected";
}

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
  const [activeTab, setActiveTab] = useState<"visuals" | "authoring" | "analytics">("visuals");
  const [visuals, setVisuals] = useState<DraftVisual[]>(INITIAL_VISUALS);

  // Authoring Form State
  const [topicTitle, setTopicTitle] = useState("");
  const [topicSlug, setTopicSlug] = useState("");
  const [overviewText, setOverviewText] = useState("");
  const [diagramCode, setDiagramCode] = useState("graph TD\n  Start[Input Scan] --> Filter[Gaussian Filter]\n  Filter --> Edge[Sobel Edge]");
  const [authorSuccess, setAuthorSuccess] = useState(false);

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

  const handleCreateTopic = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthorSuccess(true);
    setTimeout(() => {
      setAuthorSuccess(false);
      setTopicTitle("");
      setTopicSlug("");
      setOverviewText("");
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link href="/course" className="p-2 text-slate-500 hover:text-adani-navy hover:bg-slate-100 rounded-lg transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <div className="relative h-10 w-44">
              <Image
                src="/assets/logo.png"
                alt="Adani University"
                fill
                priority
                className="object-contain object-left"
              />
            </div>
            <div className="hidden sm:block h-5 w-px bg-slate-300" />
            <span className="hidden sm:block text-xs font-bold text-adani-navy uppercase tracking-wider">
              Faculty Studio &amp; Editorial Governance
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-adani-purple/10 text-adani-purple text-xs font-bold">
              Course Instructor Portal
            </span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 space-y-6">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 p-1.5 bg-slate-200/70 rounded-2xl max-w-lg text-xs font-bold text-slate-600">
          <button
            onClick={() => setActiveTab("visuals")}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl transition-all ${
              activeTab === "visuals"
                ? "bg-white text-adani-cyan shadow-sm"
                : "hover:text-slate-900"
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Visual Approvals ({visuals.filter((v) => v.status === "draft").length})</span>
          </button>

          <button
            onClick={() => setActiveTab("authoring")}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl transition-all ${
              activeTab === "authoring"
                ? "bg-white text-adani-purple shadow-sm"
                : "hover:text-slate-900"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Topic Authoring</span>
          </button>

          <button
            onClick={() => setActiveTab("analytics")}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl transition-all ${
              activeTab === "analytics"
                ? "bg-white text-adani-magenta shadow-sm"
                : "hover:text-slate-900"
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Class Analytics</span>
          </button>
        </div>

        {/* Tab 1: Visual Asset Approval Queue */}
        {activeTab === "visuals" && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex items-start space-x-4">
              <ShieldCheck className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Strict Clinical Editorial Rule: Visual Asset Governance
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  AI-generated medical diagrams and illustrative scans can contain anatomical inaccuracies or hallucinations. Per course regulations, all generated visuals start as <code className="font-bold text-amber-700">draft</code> and remain completely hidden from students until an authorized faculty member clicks "Approve".
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {visuals.map((vis) => (
                <div
                  key={vis.id}
                  className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">{vis.title}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                          vis.status === "approved"
                            ? "bg-emerald-100 text-emerald-800"
                            : vis.status === "rejected"
                            ? "bg-red-100 text-red-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {vis.status}
                      </span>
                    </div>

                    <div className="relative h-48 w-full rounded-xl overflow-hidden bg-slate-950 border border-slate-800">
                      <Image
                        src={vis.storage_url}
                        alt={vis.alt_text}
                        fill
                        className="object-cover opacity-90 hover:opacity-100 transition-opacity"
                      />
                    </div>

                    <div className="text-xs space-y-1 text-slate-600">
                      <p><span className="font-bold text-slate-700">Alt Text:</span> {vis.alt_text}</p>
                      <p><span className="font-bold text-slate-700">Prompt:</span> <span className="font-mono text-[11px]">{vis.prompt}</span></p>
                      <p><span className="font-bold text-slate-700">License:</span> {vis.license}</p>
                    </div>
                  </div>

                  {vis.status === "draft" && (
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                      <button
                        onClick={() => handleRejectVisual(vis.id)}
                        className="flex-1 py-2 px-3 rounded-lg text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 transition-colors flex items-center justify-center space-x-1"
                      >
                        <XCircle className="w-4 h-4 mr-1" />
                        <span>Reject</span>
                      </button>

                      <button
                        onClick={() => handleApproveVisual(vis.id)}
                        className="flex-1 py-2 px-3 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm transition-colors flex items-center justify-center space-x-1"
                      >
                        <CheckCircle2 className="w-4 h-4 mr-1" />
                        <span>Approve for Students</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Topic Authoring Studio */}
        {activeTab === "authoring" && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 space-y-6">
            <div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight">
                AI-Assisted Topic Authoring &amp; Publishing
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Draft a new syllabus topic with synchronized sections, mathematical formulations, and interactive Mermaid diagrams.
              </p>
            </div>

            {authorSuccess && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 font-bold flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Topic draft successfully created and submitted to course repository!</span>
              </div>
            )}

            <form onSubmit={handleCreateTopic} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Topic Title:</label>
                  <input
                    type="text"
                    required
                    value={topicTitle}
                    onChange={(e) => setTopicTitle(e.target.value)}
                    placeholder="e.g., Fourier Slice Theorem and Parallel Reconstruction"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-adani-purple focus:border-adani-purple"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">URL Slug:</label>
                  <input
                    type="text"
                    required
                    value={topicSlug}
                    onChange={(e) => setTopicSlug(e.target.value)}
                    placeholder="e.g., fourier-slice-theorem"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-adani-purple focus:border-adani-purple font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Pedagogical Overview &amp; Math Derivation:</label>
                <textarea
                  rows={4}
                  required
                  value={overviewText}
                  onChange={(e) => setOverviewText(e.target.value)}
                  placeholder="Explain the physical foundations, worked example, and clinical application..."
                  className="w-full p-3 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-adani-purple focus:border-adani-purple"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mermaid Workflow Diagram Code:</label>
                <textarea
                  rows={4}
                  value={diagramCode}
                  onChange={(e) => setDiagramCode(e.target.value)}
                  className="w-full p-3 text-xs font-mono bg-slate-900 text-emerald-400 rounded-lg border border-slate-800"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-adani-cyan via-adani-purple to-adani-magenta hover:opacity-95 shadow-md transition-all flex items-center space-x-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Publish Topic Draft</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tab 3: Class Analytics */}
        {activeTab === "analytics" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
                <span className="text-xs font-semibold text-slate-500">Active Enrolled Students</span>
                <div className="text-3xl font-black text-slate-900">72</div>
                <span className="text-[10px] text-emerald-600 font-bold">100% Verified Adani Accounts</span>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
                <span className="text-xs font-semibold text-slate-500">Class Pass Rate (&gt;75% Rule)</span>
                <div className="text-3xl font-black text-adani-cyan">84.2%</div>
                <span className="text-[10px] text-slate-400 font-medium">First &amp; Second Retakes Included</span>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
                <span className="text-xs font-semibold text-slate-500">Total Quiz Attempts Logged</span>
                <div className="text-3xl font-black text-adani-purple">186</div>
                <span className="text-[10px] text-slate-400 font-medium">Recorded in Hosted PostgreSQL</span>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
              <h4 className="text-sm font-bold text-slate-900">Course Outcome (CO) Attainment Summary</h4>
              <div className="space-y-3">
                {[
                  { name: "CO1: Medical Image Sources & Physics", rate: "86.4%", width: "86.4%" },
                  { name: "CO2: Image Representation & DICOM Standards", rate: "82.1%", width: "82.1%" },
                  { name: "CO3: Filtering, Fourier & Segmentation", rate: "78.5%", width: "78.5%" },
                  { name: "CO4: 3D Spatial Transforms & Rendering", rate: "80.2%", width: "80.2%" }
                ].map((co) => (
                  <div key={co.name} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold text-slate-700">
                      <span>{co.name}</span>
                      <span className="font-mono text-adani-navy font-bold">{co.rate}</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div style={{ width: co.width }} className="h-full bg-gradient-to-r from-adani-cyan to-adani-purple rounded-full" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
