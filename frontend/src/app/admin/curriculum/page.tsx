"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  BookOpen, 
  HelpCircle, 
  Filter, 
  Search, 
  ArrowLeft, 
  ShieldCheck, 
  Layers, 
  FileText, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  ExternalLink,
  ChevronDown,
  ChevronRight,
  ArrowRightLeft,
  Check,
  Tag,
  Hash,
  Database
} from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";
import { UserNav } from "@/components/UserNav";
import { useAuth } from "@/context/AuthContext";
import { 
  getModuleDetails, 
  getModuleQuestions, 
  getCurriculumDecisions, 
  getCurriculumAuditLogs 
} from "@/lib/curriculumApi";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

interface Topic {
  code: string;
  module_number: number;
  title: string;
  key_terms: string[];
  coverage: "full" | "partial" | "none";
  status: "skeleton" | "needs_source" | "draft" | "approved";
  sources_str: string;
  question_count: number;
  question_ids: string[];
}

interface Question {
  id: string;
  module: number;
  topic_code: string;
  type: "BAQ" | "SAQ" | "LAQ";
  marks: number;
  bloom: number;
  distribution_level: string;
  eqb_co: number;
  eqb_row: number;
  original_text: string;
  status: string;
}

interface Decision {
  decision_number: number;
  title: string;
  description: string;
  status: "open" | "resolved";
  resolution_note?: string;
  resolved_at?: string;
}

interface AuditLog {
  id: string;
  action: string;
  actor: string;
  timestamp: string;
  details: string;
}

export default function AdminCurriculumPage() {
  const { user, profile } = useAuth();
  
  const [activeTab, setActiveTab] = useState<"modules" | "questions" | "decisions" | "gaps" | "audit">("modules");
  const [moduleData, setModuleData] = useState<any>(null);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters for Questions tab
  const [selectedTopic, setSelectedTopic] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedMarks, setSelectedMarks] = useState<string>("all");
  const [selectedDist, setSelectedDist] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Reassignment Modal State
  const [reassignModalOpen, setReassignModalOpen] = useState(false);
  const [targetQuestion, setTargetQuestion] = useState<Question | null>(null);
  const [newTopicCode, setNewTopicCode] = useState("");
  const [rationale, setRationale] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Decision Modal State
  const [decisionModalOpen, setDecisionModalOpen] = useState(false);
  const [targetDecision, setTargetDecision] = useState<Decision | null>(null);
  const [resolutionNote, setResolutionNote] = useState("");

  useEffect(() => {
    fetchCurriculumData();
  }, []);

  const fetchCurriculumData = async () => {
    setIsLoading(true);
    try {
      const [modData, qList, decList, audList] = await Promise.all([
        getModuleDetails(1),
        getModuleQuestions(1),
        getCurriculumDecisions(),
        getCurriculumAuditLogs()
      ]);

      if (modData) {
        setModuleData(modData.module);
        setTopics(modData.topics || []);
      }
      if (qList) setQuestions(qList);
      if (decList) setDecisions(decList);
      if (audList) setAuditLogs(audList);
    } catch (e) {
      console.error("Error fetching curriculum data:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReassign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetQuestion || !newTopicCode) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/curriculum/questions/reassign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          module_number: 1,
          question_id: targetQuestion.id,
          new_topic_code: newTopicCode,
          actor_email: profile?.email || user?.email || "faculty@adani.edu.in",
          rationale: rationale || "Curriculum re-assignment by faculty"
        })
      });
      if (res.ok) {
        setReassignModalOpen(false);
        fetchCurriculumData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResolveDecision = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetDecision || !resolutionNote) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/curriculum/decisions/resolve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          decision_number: targetDecision.decision_number,
          actor_email: profile?.email || user?.email || "admin.fet@adani.edu.in",
          resolution_note: resolutionNote
        })
      });
      if (res.ok) {
        setDecisionModalOpen(false);
        fetchCurriculumData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filtered Questions
  const filteredQuestions = questions.filter((q) => {
    const matchesTopic = selectedTopic === "all" || q.topic_code === selectedTopic;
    const matchesType = selectedType === "all" || q.type === selectedType;
    const matchesMarks = selectedMarks === "all" || q.marks === parseInt(selectedMarks);
    const matchesDist = selectedDist === "all" || q.distribution_level.toUpperCase() === selectedDist.toUpperCase();
    const matchesSearch = searchQuery === "" || 
      q.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
      q.original_text.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTopic && matchesType && matchesMarks && matchesDist && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col">
      {/* Top Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BrandLogo className="w-9 h-9" size={36} />
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block leading-none">
                Faculty of Engineering &amp; Technology
              </span>
              <span className="text-sm font-extrabold text-adani-navy block mt-0.5">
                Curriculum Browser • Module 1 (Real DB)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/admin"
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Admin Console
            </Link>
            <div className="h-4 w-px bg-slate-200" />
            <UserNav />
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Banner with Status & Stats */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-sky-50 border border-sky-200 text-adani-cyan text-[11px] font-bold uppercase font-mono">
                AIDS 12605.1 • Module 01
              </span>
              <span className="text-xs font-bold text-slate-400">•</span>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Hosted DB Verified
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
              Medical Image Sources (8 Hours • CO1)
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Verified syllabus topics, source attributions, and accredited 40-question bank (15 BAQ, 15 SAQ, 10 LAQ).
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center min-w-[90px]">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Topics</span>
              <span className="text-lg font-black text-slate-900">{topics.length}</span>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center min-w-[90px]">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Questions</span>
              <span className="text-lg font-black text-adani-cyan">{questions.length}</span>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center min-w-[90px]">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Decisions</span>
              <span className="text-lg font-black text-adani-purple">{decisions.filter(d => d.status === "open").length} Open</span>
            </div>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-slate-200 space-x-1 sm:space-x-4">
          <button
            onClick={() => setActiveTab("modules")}
            className={`pb-3 px-2 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === "modules"
                ? "border-adani-cyan text-adani-cyan"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Topics &amp; Sources ({topics.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("questions")}
            className={`pb-3 px-2 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === "questions"
                ? "border-adani-cyan text-adani-cyan"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>EQB Question Bank ({questions.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("decisions")}
            className={`pb-3 px-2 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === "decisions"
                ? "border-adani-cyan text-adani-cyan"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <AlertCircle className="w-4 h-4" />
            <span>Open Decisions ({decisions.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("gaps")}
            className={`pb-3 px-2 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === "gaps"
                ? "border-adani-cyan text-adani-cyan"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Gaps &amp; Needs Source</span>
          </button>

          <button
            onClick={() => setActiveTab("audit")}
            className={`pb-3 px-2 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === "audit"
                ? "border-adani-cyan text-adani-cyan"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Audit Trail ({auditLogs.length})</span>
          </button>
        </div>

        {/* TAB 1: TOPICS & SOURCES */}
        {activeTab === "modules" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {topics.map((t) => (
                <div
                  key={t.code}
                  className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:border-adani-cyan/50 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-xs font-black px-2.5 py-0.5 rounded bg-sky-50 text-adani-cyan border border-sky-100">
                        Topic {t.code}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                            t.coverage === "full"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : t.coverage === "partial"
                              ? "bg-amber-50 text-amber-700 border border-amber-200"
                              : "bg-rose-50 text-rose-700 border border-rose-200"
                          }`}
                        >
                          Coverage: {t.coverage}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                          {t.status}
                        </span>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-bold text-slate-900 text-sm leading-snug">
                        {t.title}
                      </h3>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {t.key_terms.map((k, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] font-medium bg-slate-50 border border-slate-200 px-2 py-0.5 rounded text-slate-600"
                          >
                            {k}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                        Source Attribution &amp; Printed Pages
                      </span>
                      <p className="leading-relaxed text-[11px] text-slate-700">{t.sources_str}</p>
                    </div>
                  </div>

                  <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 font-mono">
                      {t.question_count} EQB Questions
                    </span>
                    <button
                      onClick={() => {
                        setSelectedTopic(t.code);
                        setActiveTab("questions");
                      }}
                      className="text-xs font-bold text-adani-cyan hover:underline flex items-center gap-1"
                    >
                      <span>Filter Questions</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: QUESTIONS WITH REAL-TIME FILTERS & REASSIGN ACTION */}
        {activeTab === "questions" && (
          <div className="space-y-4">
            {/* Filter Bar */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 text-xs">
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Search Text</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search question..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-8 pr-2 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                  />
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Topic</label>
                <select
                  value={selectedTopic}
                  onChange={(e) => setSelectedTopic(e.target.value)}
                  className="w-full py-1.5 px-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                >
                  <option value="all">All Topics (8)</option>
                  {topics.map((t) => (
                    <option key={t.code} value={t.code}>
                      Topic {t.code}: {t.title.slice(0, 25)}...
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Question Type</label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full py-1.5 px-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                >
                  <option value="all">All Types (BAQ, SAQ, LAQ)</option>
                  <option value="BAQ">BAQ (Brief Answer)</option>
                  <option value="SAQ">SAQ (Short Answer)</option>
                  <option value="LAQ">LAQ (Long Answer)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Marks</label>
                <select
                  value={selectedMarks}
                  onChange={(e) => setSelectedMarks(e.target.value)}
                  className="w-full py-1.5 px-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                >
                  <option value="all">All Marks</option>
                  <option value="2">2 Marks</option>
                  <option value="4">4 Marks</option>
                  <option value="10">10 Marks</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Distribution</label>
                <select
                  value={selectedDist}
                  onChange={(e) => setSelectedDist(e.target.value)}
                  className="w-full py-1.5 px-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                >
                  <option value="all">All Levels (MK/DK)</option>
                  <option value="MK">MK (Must Know)</option>
                  <option value="DK">DK (Desirable to Know)</option>
                </select>
              </div>
            </div>

            {/* Questions Table */}
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
              <div className="px-6 py-3 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700">
                  Showing {filteredQuestions.length} of {questions.length} Questions
                </span>
                <span className="text-[11px] text-slate-500">
                  Verbatim original text preserved from EQB row positions
                </span>
              </div>

              <div className="divide-y divide-slate-100">
                {filteredQuestions.map((q) => (
                  <div key={q.id} className="p-4 hover:bg-slate-50/70 transition-colors flex flex-col sm:flex-row items-start justify-between gap-4">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-black text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                          {q.id}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-50 text-adani-cyan border border-sky-100 font-mono">
                          Topic {q.topic_code}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-50 text-adani-purple border border-purple-100">
                          {q.type} • {q.marks} Marks
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                          Bloom L{q.bloom}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-100">
                          {q.distribution_level}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">
                          EQB Row #{q.eqb_row}
                        </span>
                      </div>

                      <p className="text-xs sm:text-sm font-medium text-slate-800 leading-relaxed pt-1">
                        {q.original_text}
                      </p>
                    </div>

                    <div className="flex-shrink-0 self-end sm:self-center">
                      <button
                        onClick={() => {
                          setTargetQuestion(q);
                          setNewTopicCode(q.topic_code);
                          setRationale("");
                          setReassignModalOpen(true);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-adani-cyan hover:text-white text-xs font-bold text-slate-700 transition-colors flex items-center gap-1.5 shadow-2xs"
                      >
                        <ArrowRightLeft className="w-3.5 h-3.5" />
                        <span>Reassign Topic</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: OPEN DECISIONS (SECTION 4) */}
        {activeTab === "decisions" && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-purple-50 border border-purple-200 text-xs text-purple-900 flex items-start gap-3">
              <AlertCircle className="w-4 h-4 text-adani-purple flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Accredited Decision Tracker: </span>
                Curriculum decisions recorded in Section 4 are explicitly held as open proposals until faculty formalize resolutions. All resolution actions are recorded in the hosted audit table.
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {decisions.map((d) => (
                <div
                  key={d.decision_number}
                  className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-black px-2.5 py-0.5 rounded bg-purple-100 text-adani-purple">
                        Decision #{d.decision_number}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                          d.status === "resolved"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-amber-50 text-amber-700 border border-amber-200"
                        }`}
                      >
                        {d.status}
                      </span>
                      {d.resolved_at && (
                        <span className="text-[10px] text-slate-400 font-mono">
                          Resolved {new Date(d.resolved_at).toLocaleDateString()}
                        </span>
                      )}
                    </div>

                    <h3 className="font-bold text-sm text-slate-900">
                      {d.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {d.description}
                    </p>

                    {d.resolution_note && (
                      <div className="mt-2 p-2.5 rounded-lg bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-900">
                        <span className="font-bold block text-[10px] uppercase text-emerald-700">Official Faculty Resolution:</span>
                        {d.resolution_note}
                      </div>
                    )}
                  </div>

                  {d.status === "open" && (
                    <div className="flex-shrink-0">
                      <button
                        onClick={() => {
                          setTargetDecision(d);
                          setResolutionNote("");
                          setDecisionModalOpen(true);
                        }}
                        className="px-3.5 py-2 bg-adani-purple hover:bg-purple-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Resolve Decision</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: GAPS & NEEDS SOURCE */}
        {activeTab === "gaps" && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-500" />
              <h2 className="text-base font-bold text-slate-900">
                Curriculum Source Gaps (33 Unsupported Questions Strategy)
              </h2>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              In accordance with project rules, topics with coverage `none` or partial sub-topic gaps (e.g. dithering in M4, volume regularization in M6) are flagged as <code className="text-adani-purple font-bold">needs_source</code>. Zero synthetic explanation content will be generated for them until verified textbook citations are approved.
            </p>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
              <span className="font-bold text-slate-700 block">Module 1 Status:</span>
              <p className="text-emerald-700 font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                All 8 topics in Module 1 have validated textbook sources in B1 (Birkfellner 2014) with full or partial coverage.
              </p>
            </div>
          </div>
        )}

        {/* TAB 5: AUDIT LOGS */}
        {activeTab === "audit" && (
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
            <div className="px-6 py-3 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between text-xs font-bold text-slate-700">
              <span>Hosted Curriculum Audit Trail ({auditLogs.length})</span>
              <span className="text-slate-400 font-normal">Logged on every write &amp; re-assignment</span>
            </div>

            <div className="divide-y divide-slate-100">
              {auditLogs.map((a) => (
                <div key={a.id} className="p-4 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-adani-purple bg-purple-50 px-2 py-0.5 rounded border border-purple-100">
                      {a.action}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {new Date(a.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-slate-800 font-medium pt-0.5">{a.details}</p>
                  <span className="text-[10px] text-slate-400 block font-mono">Actor: {a.actor}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* REASSIGN QUESTION MODAL */}
      {reassignModalOpen && targetQuestion && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div>
              <span className="text-xs font-bold text-adani-cyan uppercase font-mono tracking-wider">
                Reassign Proposed Topic
              </span>
              <h3 className="text-base font-black text-slate-900 mt-1">
                Question {targetQuestion.id}
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-1 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                "{targetQuestion.original_text}"
              </p>
            </div>

            <form onSubmit={handleReassign} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Assign to Topic:
                </label>
                <select
                  value={newTopicCode}
                  onChange={(e) => setNewTopicCode(e.target.value)}
                  className="w-full py-2 px-3 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                >
                  {topics.map((t) => (
                    <option key={t.code} value={t.code}>
                      Topic {t.code}: {t.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Faculty Rationale / Audit Note:
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="State pedagogical reason for topic movement..."
                  value={rationale}
                  onChange={(e) => setRationale(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setReassignModalOpen(false)}
                  className="px-3 py-2 rounded-lg text-xs font-bold text-slate-500 hover:text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-adani-cyan hover:bg-sky-600 text-white shadow-sm"
                >
                  {isSubmitting ? "Updating..." : "Confirm Reassignment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RESOLVE DECISION MODAL */}
      {decisionModalOpen && targetDecision && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div>
              <span className="text-xs font-bold text-adani-purple uppercase font-mono tracking-wider">
                Formalize Resolution
              </span>
              <h3 className="text-base font-black text-slate-900 mt-1">
                Decision #{targetDecision.decision_number}: {targetDecision.title}
              </h3>
              <p className="text-xs text-slate-600 mt-1 bg-purple-50/50 p-2.5 rounded-lg border border-purple-100">
                {targetDecision.description}
              </p>
            </div>

            <form onSubmit={handleResolveDecision} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Official Faculty Resolution Note:
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Enter official resolution (e.g. M1 mapped to CO1, M2/M3/M4 mapped to CO2)..."
                  value={resolutionNote}
                  onChange={(e) => setResolutionNote(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setDecisionModalOpen(false)}
                  className="px-3 py-2 rounded-lg text-xs font-bold text-slate-500 hover:text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-adani-purple hover:bg-purple-800 text-white shadow-sm"
                >
                  {isSubmitting ? "Saving..." : "Save Resolution to DB"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
