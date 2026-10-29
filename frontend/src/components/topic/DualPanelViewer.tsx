"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  CheckCircle2, 
  Circle, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  BookOpen, 
  Sparkles, 
  Layers, 
  FileCheck,
  AlertCircle
} from "lucide-react";
import MermaidDiagram from "@/components/diagrams/MermaidDiagram";
import QuickCheckQuiz, { QuickCheckQuestion } from "@/components/topic/QuickCheckQuiz";
import TopicAiTutor from "@/components/tutor/TopicAiTutor";

export interface SectionData {
  id: string;
  section_number: number;
  section_type: string;
  title: string;
  content_markdown: string;
  formula_latex?: string | null;
  linked_diagram_id?: string | null;
}

export interface DiagramData {
  id: string;
  title: string;
  diagram_type: string;
  code_or_markup: string;
  interactive_node_map?: Record<string, string>;
}

export interface VisualAssetData {
  id: string;
  title: string;
  storage_url: string;
  alt_text: string;
  license: string;
  attribution?: string;
  status: string;
}

export interface TopicPayload {
  id: string;
  slug: string;
  title: string;
  order_index: number;
  co_tags: string[];
  read_time_minutes: number;
  is_completed: boolean;
  module: {
    id: string;
    module_number: number;
    title: string;
  };
  sections: SectionData[];
  diagrams: DiagramData[];
  visual_assets: VisualAssetData[];
  quick_checks?: QuickCheckQuestion[];
  previous_topic_slug?: string | null;
  next_topic_slug?: string | null;
}

interface DualPanelViewerProps {
  topic: TopicPayload;
}

export default function DualPanelViewer({ topic }: DualPanelViewerProps) {
  const [activeSectionId, setActiveSectionId] = useState<string>(
    topic.sections[0]?.id || ""
  );
  const [isCompleted, setIsCompleted] = useState<boolean>(topic.is_completed);
  const [highlightedNode, setHighlightedNode] = useState<string | undefined>(undefined);
  const [visualTab, setVisualTab] = useState<"diagram" | "scan" | "interactive">("diagram");

  // IntersectionObserver for scroll-synchronization
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSectionId(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-20% 0px -60% 0px",
        threshold: 0
      }
    );

    topic.sections.forEach((s) => {
      const el = document.getElementById(`section-${s.id}`);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [topic.sections]);

  // Determine active visual according to current active section
  const currentSection = topic.sections.find((s) => s.id === activeSectionId) || topic.sections[0];
  const linkedDiagram = topic.diagrams.find((d) => d.id === currentSection?.linked_diagram_id) || topic.diagrams[0];
  const activeAsset = topic.visual_assets[0];

  const handleNodeClick = (nodeId: string) => {
    setHighlightedNode(nodeId);
    // Find section with matching concept or scroll to derivation
    const targetSection = topic.sections.find(
      (s) => s.content_markdown.toLowerCase().includes(nodeId.toLowerCase()) || s.title.toLowerCase().includes(nodeId.toLowerCase())
    );
    if (targetSection) {
      const el = document.getElementById(`section-${targetSection.id}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  const toggleComplete = async () => {
    const nextState = !isCompleted;
    setIsCompleted(nextState);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
      await fetch(`${apiUrl}/course/topics/${topic.id}/progress`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_completed: nextState, time_spent_seconds: 60 })
      });
    } catch (e) {
      console.error("Failed to update progress:", e);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Sticky Header */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link
              href="/course"
              className="text-xs font-semibold text-slate-500 hover:text-adani-navy flex items-center"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              <span>Module {topic.module.module_number}</span>
            </Link>
            <span className="text-slate-300">/</span>
            <span className="text-xs font-bold text-slate-900 truncate max-w-[200px] sm:max-w-md">
              {topic.title}
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-2 text-xs text-slate-500 font-medium">
              <Clock className="w-3.5 h-3.5" />
              <span>{topic.read_time_minutes} min read</span>
            </div>

            <button
              onClick={toggleComplete}
              className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                isCompleted
                  ? "bg-emerald-50 text-emerald-800 border border-emerald-300"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
              }`}
            >
              {isCompleted ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Topic Cleared</span>
                </>
              ) : (
                <>
                  <Circle className="w-4 h-4 text-slate-400" />
                  <span>Mark Complete</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Dual-Panel Workspace */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Panel: Scrollable Conceptual & Mathematical Column (col-span-7) */}
          <div className="lg:col-span-7 space-y-12 pb-24">
            {/* Topic Header & Outcome Tags */}
            <div className="border-b border-slate-200 pb-6">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-adani-cyan">
                  Module {topic.module.module_number}: {topic.module.title}
                </span>
                <span className="text-slate-300">•</span>
                <div className="flex space-x-1">
                  {topic.co_tags.map((co) => (
                    <span
                      key={co}
                      className="text-[10px] font-bold px-2 py-0.5 rounded bg-adani-cyan/10 text-adani-cyan"
                    >
                      {co}
                    </span>
                  ))}
                </div>
              </div>

              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                {topic.title}
              </h1>
            </div>

            {/* Structured Topic Sections */}
            {topic.sections.map((sec, idx) => {
              const isActive = sec.id === activeSectionId;

              return (
                <section
                  key={sec.id}
                  id={`section-${sec.id}`}
                  className={`scroll-mt-24 p-6 rounded-2xl transition-all duration-200 ${
                    isActive
                      ? "bg-white shadow-md border-l-4 border-l-adani-cyan border-slate-200"
                      : "bg-transparent border-l-4 border-l-transparent hover:bg-white/60"
                  }`}
                >
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="text-xs font-black text-adani-cyan font-mono">
                      0{sec.section_number}
                    </span>
                    <h2 className="text-xl font-bold text-slate-900">
                      {sec.title}
                    </h2>
                  </div>

                  {/* Text Content */}
                  <div className="prose prose-slate max-w-none text-sm text-slate-700 leading-relaxed space-y-4">
                    {sec.content_markdown.split("\n\n").map((para, pIdx) => (
                      <p key={pIdx}>{para}</p>
                    ))}
                  </div>

                  {/* Mathematical Formulation (KaTeX / Formula Box) */}
                  {sec.formula_latex && (
                    <div className="my-5 p-4 rounded-xl bg-slate-900 text-white font-mono text-sm shadow-inner border border-slate-800 flex items-center justify-between">
                      <div className="overflow-x-auto py-1">
                        <code>{sec.formula_latex}</code>
                      </div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 ml-4 flex-shrink-0">
                        Equation {sec.section_number}.1
                      </span>
                    </div>
                  )}

                  {/* Inline visual on Mobile devices */}
                  <div className="lg:hidden mt-6">
                    {linkedDiagram && (
                      <MermaidDiagram
                        id={`mobile-${linkedDiagram.id}`}
                        code={linkedDiagram.code_or_markup}
                        title={linkedDiagram.title}
                      />
                    )}
                  </div>
                </section>
              );
            })}

            {/* Quick Check Formative Quiz */}
            {topic.quick_checks && topic.quick_checks.length > 0 && (
              <QuickCheckQuiz questions={topic.quick_checks} />
            )}

            {/* Navigation Bar (Previous / Next Topic) */}
            <div className="pt-8 border-t border-slate-200 flex items-center justify-between">
              {topic.previous_topic_slug ? (
                <Link
                  href={`/course/${topic.module.id}/${topic.previous_topic_slug}`}
                  className="inline-flex items-center px-4 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Previous Topic
                </Link>
              ) : <div />}

              {topic.next_topic_slug ? (
                <Link
                  href={`/course/${topic.module.id}/${topic.next_topic_slug}`}
                  className="inline-flex items-center px-4 py-2 text-xs font-bold text-white bg-adani-navy hover:bg-adani-dark rounded-lg shadow-sm transition-colors"
                >
                  Next Topic
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              ) : (
                <Link
                  href={`/course/${topic.module.id}/quiz`}
                  className="inline-flex items-center px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-adani-cyan to-adani-purple hover:opacity-95 rounded-lg shadow-sm transition-all"
                >
                  Take Module Quiz (&gt;75% Rule)
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              )}
            </div>
          </div>

          {/* Right Panel: Sticky Visual Workstation (col-span-5) */}
          <div className="hidden lg:block lg:col-span-5 sticky top-24 space-y-4">
            {/* Visual Tab Selector */}
            <div className="flex rounded-xl bg-slate-200/70 p-1 space-x-1 text-xs font-bold text-slate-600">
              <button
                onClick={() => setVisualTab("diagram")}
                className={`flex-1 py-1.5 rounded-lg transition-all ${
                  visualTab === "diagram"
                    ? "bg-white text-adani-navy shadow-sm"
                    : "hover:text-slate-900"
                }`}
              >
                Pipeline Diagram
              </button>
              {activeAsset && (
                <button
                  onClick={() => setVisualTab("scan")}
                  className={`flex-1 py-1.5 rounded-lg transition-all ${
                    visualTab === "scan"
                      ? "bg-white text-adani-navy shadow-sm"
                      : "hover:text-slate-900"
                  }`}
                >
                  Clinical Scan
                </button>
              )}
            </div>

            {/* Visual Workstation Area */}
            <div className="h-[520px]">
              {visualTab === "diagram" && linkedDiagram ? (
                <MermaidDiagram
                  id={linkedDiagram.id}
                  code={linkedDiagram.code_or_markup}
                  title={linkedDiagram.title}
                  interactiveNodeMap={linkedDiagram.interactive_node_map}
                  onNodeClick={handleNodeClick}
                  activeNodeId={highlightedNode}
                />
              ) : visualTab === "scan" && activeAsset ? (
                <div className="h-full bg-black rounded-2xl border border-slate-800 p-4 flex flex-col justify-between text-white overflow-hidden">
                  <div className="relative flex-1 w-full">
                    <Image
                      src={activeAsset.storage_url}
                      alt={activeAsset.alt_text}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div className="mt-2 pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                    <span className="font-semibold text-white">{activeAsset.title}: </span>
                    {activeAsset.alt_text}
                    {activeAsset.attribution && (
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        Source: {activeAsset.attribution} ({activeAsset.license})
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="h-full bg-white rounded-2xl border border-slate-200 p-6 flex flex-col items-center justify-center text-center text-slate-400 text-xs">
                  <Layers className="w-8 h-8 mb-2 text-slate-300" />
                  <span>Interactive visual workstation synchronizing with left content...</span>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Embedded Topic AI Tutor Assistant */}
      <TopicAiTutor
        topicId={topic.id}
        topicTitle={topic.title}
        onHighlightNode={(node) => setHighlightedNode(node)}
      />
    </div>
  );
}
