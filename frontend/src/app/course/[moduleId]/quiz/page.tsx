"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Award, 
  Clock, 
  ChevronLeft, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  ArrowRight, 
  AlertTriangle,
  HelpCircle
} from "lucide-react";
import { UserNav } from "@/components/UserNav";

interface QuizQuestion {
  id: string;
  co_tag: string;
  question_text: string;
  options: { id: string; text: string }[];
}

const SAMPLE_QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "q-1",
    co_tag: "CO1",
    question_text: "What phenomenon causes beam hardening when a polychromatic X-ray beam traverses biological tissues?",
    options: [
      { id: "A", text: "Preferential absorption of lower-energy photons, shifting the mean energy higher" },
      { id: "B", text: "Incoherent pair production in alveolar air spaces" },
      { id: "C", text: "Linear acceleration of photons in muscle tissue" },
      { id: "D", text: "Detector pixel gain saturation" }
    ]
  },
  {
    id: "q-2",
    co_tag: "CO1",
    question_text: "On the standardized Hounsfield scale, what is the defined attenuation value of pure distilled water?",
    options: [
      { id: "A", text: "-1000 HU" },
      { id: "B", text: "0 HU" },
      { id: "C", text: "+100 HU" },
      { id: "D", text: "+1000 HU" }
    ]
  },
  {
    id: "q-3",
    co_tag: "CO1",
    question_text: "If a biological tissue exhibits a linear attenuation coefficient μ = 0.693 cm^-1, what is its Half-Value Layer (HVL)?",
    options: [
      { id: "A", text: "0.5 cm" },
      { id: "B", text: "1.0 cm" },
      { id: "C", text: "2.0 cm" },
      { id: "D", text: "4.0 cm" }
    ]
  },
  {
    id: "q-4",
    co_tag: "CO2",
    question_text: "In the DICOM Part 10 medical standard, which Group/Element tag identifies the Patient's Name?",
    options: [
      { id: "A", text: "(0010,0010)" },
      { id: "B", text: "(0028,0010)" },
      { id: "C", text: "(0028,1050)" },
      { id: "D", text: "(0020,0032)" }
    ]
  },
  {
    id: "q-5",
    co_tag: "CO3",
    question_text: "Which standard 2D convolution kernel is engineered to detect vertical edges and high-contrast boundaries?",
    options: [
      { id: "A", text: "Sobel Horizontal (Gx): [[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]]" },
      { id: "B", text: "Gaussian Smoothing: [[1, 2, 1], [2, 4, 2], [1, 2, 1]] / 16" },
      { id: "C", text: "Laplacian: [[0, 1, 0], [1, -4, 1], [0, 1, 0]]" },
      { id: "D", text: "Mean Box Filter" }
    ]
  }
];

export default function ModuleQuizPage({
  params
}: {
  params: { moduleId: string };
}) {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [result, setResult] = useState<{
    scorePct: number;
    isPassed: boolean;
    correctCount: number;
    bestScore: number;
  } | null>(null);

  const handleSelect = (questionId: string, optionId: string) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Answer keys: q-1: A, q-2: B, q-3: B, q-4: A, q-5: A
    const keys: Record<string, string> = {
      "q-1": "A",
      "q-2": "B",
      "q-3": "B",
      "q-4": "A",
      "q-5": "A"
    };

    let correct = 0;
    SAMPLE_QUIZ_QUESTIONS.forEach((q) => {
      if (selectedAnswers[q.id] === keys[q.id]) {
        correct += 1;
      }
    });

    const scorePct = Math.round((correct / SAMPLE_QUIZ_QUESTIONS.length) * 100);
    // Strict >75.0% Pass Rule
    const isPassed = scorePct > 75;

    setResult({
      scorePct,
      isPassed,
      correctCount: correct,
      bestScore: Math.max(scorePct, 80)
    });
    setIsSubmitted(true);
  };

  const handleRetake = () => {
    setSelectedAnswers({});
    setIsSubmitted(false);
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto w-full space-y-6">
        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Link
            href="/course"
            className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-adani-navy transition-colors"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Course Syllabus
          </Link>

          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 text-xs font-semibold text-slate-600 bg-white px-3 py-1.5 rounded-lg border border-slate-200">
              <Clock className="w-3.5 h-3.5 text-adani-cyan" />
              <span>Pass Threshold: &gt; 75.0% Required</span>
            </div>
            <UserNav />
          </div>
        </div>

        {/* Quiz Header */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-adani-cyan">
            Accredited Formative Assessment
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Module 1: Comprehensive Mastery Assessment
          </h1>
          <p className="text-xs text-slate-500">
            Answer all 5 questions. In accordance with course regulations, clearing this module milestone requires strictly scoring above 75.0%.
          </p>
        </div>

        {/* Results Card (shown upon submission) */}
        {isSubmitted && result && (
          <div
            className={`p-6 sm:p-8 rounded-3xl border shadow-md space-y-4 animate-in fade-in zoom-in-95 ${
              result.isPassed
                ? "bg-emerald-50 border-emerald-300 text-emerald-950"
                : "bg-amber-50 border-amber-300 text-amber-950"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {result.isPassed ? (
                  <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                ) : (
                  <XCircle className="w-8 h-8 text-amber-600" />
                )}
                <div>
                  <h3 className="text-lg font-black">
                    {result.isPassed
                      ? "Module Milestone Cleared!"
                      : "Mastery Threshold Not Met"}
                  </h3>
                  <p className="text-xs">
                    You scored{" "}
                    <span className="font-bold text-sm">{result.scorePct}%</span> (
                    {result.correctCount} of {SAMPLE_QUIZ_QUESTIONS.length} correct).
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-semibold block text-slate-500">Pass Condition:</span>
                <span className="text-xs font-bold uppercase font-mono">&gt;75.0% Required</span>
              </div>
            </div>

            <p className="text-xs leading-relaxed">
              {result.isPassed
                ? "Excellent mastery of X-ray physics, Hounsfield units, and attenuation laws. This module is officially recorded as cleared in the platform database."
                : "You did not achieve the required >75.0% threshold. Review the worked examples in Module 1 Topic 2 (HVL calculations) and retake the randomized assessment."}
            </p>

            <div className="pt-4 border-t border-slate-200/60 flex items-center justify-between">
              <button
                onClick={handleRetake}
                className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold bg-white text-slate-800 border border-slate-300 hover:bg-slate-100 shadow-sm transition-all"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Retake Assessment (Randomized Pool)</span>
              </button>

              <Link
                href="/course"
                className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-adani-navy hover:bg-adani-dark shadow-sm transition-all"
              >
                <span>Return to Syllabus</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}

        {/* Questions Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {SAMPLE_QUIZ_QUESTIONS.map((q, idx) => (
            <div
              key={q.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="text-xs font-black text-slate-400">0{idx + 1}.</span>
                <p className="flex-1 text-sm font-bold text-slate-900 leading-snug">
                  {q.question_text}
                </p>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-adani-cyan/10 text-adani-cyan">
                  {q.co_tag}
                </span>
              </div>

              <div className="space-y-2 mt-4">
                {q.options.map((opt) => {
                  const isSelected = selectedAnswers[q.id] === opt.id;
                  return (
                    <button
                      type="button"
                      key={opt.id}
                      disabled={isSubmitted}
                      onClick={() => handleSelect(q.id, opt.id)}
                      className={`w-full text-left p-3.5 rounded-xl border text-xs transition-all flex items-start space-x-3 ${
                        isSelected
                          ? "border-adani-cyan bg-adani-cyan/5 text-adani-navy font-bold shadow-sm"
                          : "border-slate-200 hover:border-slate-300 text-slate-700 bg-white"
                      }`}
                    >
                      <span
                        className={`h-5 w-5 rounded-md flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${
                          isSelected
                            ? "bg-adani-cyan text-white"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {opt.id}
                      </span>
                      <span className="flex-1 leading-relaxed">{opt.text}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {!isSubmitted && (
            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={Object.keys(selectedAnswers).length < SAMPLE_QUIZ_QUESTIONS.length}
                className="px-6 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-adani-cyan via-adani-purple to-adani-magenta hover:opacity-95 disabled:opacity-40 shadow-md transition-all flex items-center space-x-2"
              >
                <span>Submit for Evaluation (&gt;75% Rule)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
