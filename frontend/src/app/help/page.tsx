"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  BookOpen, 
  HelpCircle, 
  Sparkles, 
  Search, 
  ChevronRight, 
  ChevronDown, 
  ArrowLeft, 
  Layers, 
  Activity, 
  Award, 
  Bot, 
  FileText, 
  CheckCircle2, 
  ShieldCheck, 
  Mail, 
  ExternalLink,
  Cpu,
  Bookmark
} from "lucide-react";
import { QUICK_FORMULAS, STUDENT_NOTE_METADATA } from "@/data/curriculumData";
import { BrandLogo } from "@/components/BrandLogo";
import { UserNav } from "@/components/UserNav";

interface FaqItem {
  question: string;
  answer: string;
  category: "curriculum" | "workstation" | "quizzes" | "tutor";
}

const FAQ_DATA: FaqItem[] = [
  {
    category: "curriculum",
    question: "What is the B.Tech AIDS 12605.1 Medical Image Processing course?",
    answer: "It is an accredited engineering curriculum at the Faculty of Engineering and Technology, Adani University. It bridges physical medical imaging physics (X-ray, CT, MRI, Ultrasound, PET) with modern computational algorithms, including DICOM parsing, 2D spatial convolution, Radon transform, deep learning segmentation (U-Net), and clinical NLP."
  },
  {
    category: "workstation",
    question: "How does the Dual-Panel Workstation function?",
    answer: "The Dual-Panel workstation provides synchronized learning. The left pane provides structured study notes following the Concept → Worked Example → Application Question methodology. The right pane provides interactive SVG/Mermaid workflow diagrams, KaTeX formula representations, and the embedded AI Tutor."
  },
  {
    category: "quizzes",
    question: "What is the Mastery Assessment >75.0% Pass Rule?",
    answer: "Each module ends with a rigorous 15-question Mastery Assessment mapped to specific Course Outcomes (CO1 to CO5). To achieve clearance, candidates must score greater than 75.0%. If the score is 75.0% or below, the system marks the module as 'Needs Remediation', allowing students to review theory and retake the assessment."
  },
  {
    category: "quizzes",
    question: "What is the Final Grand Capstone Examination?",
    answer: "The Final Capstone is a comprehensive 40-question exit evaluation spanning all 6 modules. It synthesizes cross-domain clinical problem-solving (e.g. choosing between CT windowing and MRI T2 sequences, analyzing beam hardening, computing Dice overlap coefficients)."
  },
  {
    category: "tutor",
    question: "How does the MedAI Clinical Tutor work?",
    answer: "The AI Tutor is grounded in the official course syllabus. It answers physics, math, and algorithmic questions with KaTeX formulas and topic citations. To maintain academic and clinical safety, questions outside the medical imaging domain are flagged as 'Not Relevant', and requests for personal medical diagnosis are strictly refused."
  },
  {
    category: "workstation",
    question: "Are my progress and quiz attempts saved automatically?",
    answer: "Yes! Every topic completion, quiz attempt, and best score is instantly saved in your authenticated cloud session and cached locally for rapid rendering. You can track your CO Attainment meters on the main dashboard."
  }
];

export default function HelpDocumentationPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const filteredFaqs = FAQ_DATA.filter((faq) => {
    const matchesCategory = selectedCategory === "all" || faq.category === selectedCategory;
    const matchesQuery = 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-sky-100 selection:text-sky-900">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors border border-slate-200"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </Link>
            <div className="h-4 w-px bg-slate-200" />
            <BrandLogo />
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/tutor"
              className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-gradient-to-r from-adani-cyan via-adani-purple to-adani-magenta shadow-sm hover:opacity-95 transition-all flex items-center gap-1.5"
            >
              <Bot className="w-3.5 h-3.5" />
              <span>Open AI Tutor</span>
            </Link>
            <UserNav />
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Hero Header */}
        <div className="bg-gradient-to-r from-adani-navy via-slate-900 to-slate-950 text-white rounded-3xl p-8 sm:p-10 shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial-gradient from-adani-cyan/15 via-transparent to-transparent pointer-events-none" />
          <div className="relative z-10 max-w-2xl space-y-3">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-sky-500/20 text-adani-cyan border border-sky-400/30">
                Help Center &amp; Documentation
              </span>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-purple-500/20 text-purple-300 border border-purple-400/30">
                {STUDENT_NOTE_METADATA.course_code}
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
              Platform Knowledge Base &amp; Study Guide
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Find complete instructions on syllabus navigation, dual-panel study workflows, formula references, and institutional accreditation criteria.
            </p>

            {/* Quick Search */}
            <div className="pt-2 max-w-md relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
              <input
                type="text"
                placeholder="Search guide, formulas, topics, or FAQs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/90 text-white text-xs placeholder:text-slate-400 border border-slate-700 focus:outline-none focus:border-adani-cyan transition-all"
              />
            </div>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3 hover:border-adani-cyan transition-all">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-adani-cyan flex items-center justify-center font-bold">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Concept → Example → Question</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every topic is structured according to certified pedagogical methodology: theoretical foundations, worked clinical calculations, and real-world diagnostic applications.
            </p>
            <Link href="/dashboard" className="text-xs font-bold text-adani-cyan hover:underline inline-flex items-center gap-1">
              Explore Course Directory <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3 hover:border-adani-purple transition-all">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-adani-purple flex items-center justify-center font-bold">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Strict &gt;75% Clearance Rule</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Mastery assessments evaluate Course Outcomes (CO1-CO5). Scoring &gt;75% clears the module; otherwise, remediation is activated to ensure continuous learning.
            </p>
            <Link href="/course/capstone" className="text-xs font-bold text-adani-purple hover:underline inline-flex items-center gap-1">
              View Capstone Rules <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3 hover:border-emerald-500 transition-all">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Bot className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Claude-Style AI Clinical Tutor</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Powered by high-speed Gemini AI with key rotation. Ask mathematical equations, CT numbers, or MRI physics with KaTeX rendering and session history.
            </p>
            <Link href="/tutor" className="text-xs font-bold text-emerald-600 hover:underline inline-flex items-center gap-1">
              Start Tutor Chat <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Quick Reference Mathematical Formulas */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-adani-cyan" />
                Accredited Medical Imaging Formula Sheet
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Standard physical laws and mathematical algorithms required for exams and clinical workstations.
              </p>
            </div>
            <span className="text-[11px] font-mono font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
              {QUICK_FORMULAS.length} Core Laws
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {QUICK_FORMULAS.map((item, idx) => (
              <div
                key={idx}
                className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 hover:border-adani-cyan transition-all space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">{item.name}</span>
                  <span className="text-[10px] font-mono text-slate-400">EQ-{idx + 1}</span>
                </div>
                <div className="p-2 rounded bg-white border border-slate-200/60 font-mono text-xs text-adani-navy overflow-x-auto">
                  {item.formula}
                </div>
                <p className="text-[11px] text-slate-600 leading-tight">
                  {item.notes}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive FAQ Section */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-adani-purple" />
                Frequently Asked Questions (FAQ)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Quick answers regarding academic grading, workstation usage, and study tracking.
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { id: "all", label: "All Topics" },
                { id: "curriculum", label: "Curriculum" },
                { id: "workstation", label: "Workstation" },
                { id: "quizzes", label: "Quizzes & Scores" },
                { id: "tutor", label: "AI Tutor" }
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors ${
                    selectedCategory === cat.id
                      ? "bg-adani-cyan text-white shadow-sm"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* FAQ Accordion List */}
          <div className="space-y-2.5">
            {filteredFaqs.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-400">
                No matching questions found for &quot;{searchQuery}&quot;.
              </div>
            ) : (
              filteredFaqs.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div
                    key={idx}
                    className="border border-slate-200 rounded-xl overflow-hidden transition-all bg-white"
                  >
                    <button
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      className="w-full text-left p-4 flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors"
                    >
                      <span className="text-xs sm:text-sm font-bold text-slate-800">
                        {faq.question}
                      </span>
                      <div className="w-6 h-6 rounded-md bg-slate-100 flex items-center justify-center flex-shrink-0 text-slate-500">
                        {isOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                      </div>
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Contact and Support Section */}
        <div className="bg-slate-100 rounded-2xl p-6 border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-adani-navy shadow-sm">
              <Mail className="w-5 h-5 text-adani-cyan" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">
                Need Academic Assistance or Faculty Clarification?
              </h4>
              <p className="text-[11px] text-slate-500">
                Adani Institute of Higher Education and Research • Faculty of Engineering &amp; Technology
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/tutor"
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition-colors shadow-sm flex items-center gap-1.5"
            >
              <Bot className="w-3.5 h-3.5 text-adani-cyan" />
              Ask AI Tutor Now
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
