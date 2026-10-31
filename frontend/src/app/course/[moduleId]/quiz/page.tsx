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
import { BrandLogo } from "@/components/BrandLogo";
import { useProgress } from "@/context/ProgressContext";
import { MODULE_QUIZ_REGISTRY, QuizQuestionItem } from "@/data/quizDatabase";
import { ALL_MODULES } from "@/data/curriculumData";

export default function ModuleQuizPage({
  params
}: {
  params: { moduleId: string };
}) {
  const { recordAssessmentScore, moduleScores } = useProgress();
  const currentQuestions: QuizQuestionItem[] = MODULE_QUIZ_REGISTRY[params.moduleId] || MODULE_QUIZ_REGISTRY["mod-1"];
  const currentModule = ALL_MODULES.find((m) => m.id === params.moduleId) || ALL_MODULES[0];

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

    let correct = 0;
    currentQuestions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correct_option_id) {
        correct += 1;
      }
    });

    const scorePct = Math.round((correct / currentQuestions.length) * 100);
    // Strict >75.0% Pass Rule
    const isPassed = scorePct > 75;

    // Record score dynamically
    recordAssessmentScore(params.moduleId, scorePct);

    const prevBest = moduleScores[params.moduleId] || 0;
    setResult({
      scorePct,
      isPassed,
      correctCount: correct,
      bestScore: Math.max(scorePct, prevBest)
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
            className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-adani-navy transition-colors gap-2"
          >
            <BrandLogo className="w-7 h-7" size={28} />
            <div className="flex items-center">
              <ChevronLeft className="w-4 h-4 mr-0.5" />
              <span>Back to Course Syllabus</span>
            </div>
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
            Accredited Formative Assessment • Module 0{currentModule.module_number}
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {currentModule.title}: Comprehensive Mastery Assessment
          </h1>
          <p className="text-xs text-slate-500">
            Answer all {currentQuestions.length} clinical MCQs. In accordance with course regulations, clearing this module milestone requires strictly scoring above 75.0% (at least {Math.ceil(currentQuestions.length * 0.75)} of {currentQuestions.length} correct).
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
                      ? `Module 0${currentModule.module_number} Cleared!`
                      : "Mastery Threshold Not Met"}
                  </h3>
                  <p className="text-xs">
                    You scored{" "}
                    <span className="font-bold text-sm">{result.scorePct}%</span> (
                    {result.correctCount} of {currentQuestions.length} correct).
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
                ? `Excellent performance on ${currentModule.title}. Your mastery clearance (>75% rule) has been recorded in the platform database.`
                : `You scored ${result.scorePct}%. Review the worked clinical examples and theory sections in this module, then retake the assessment to clear this module milestone.`}
            </p>

            <div className="pt-4 border-t border-slate-200/60 flex flex-wrap items-center justify-between gap-2">
              <button
                onClick={handleRetake}
                className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold bg-white text-slate-800 border border-slate-300 hover:bg-slate-100 shadow-sm transition-all"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Retake Assessment</span>
              </button>

              <div className="flex items-center gap-2">
                <Link
                  href="/course"
                  className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 shadow-sm transition-all"
                >
                  <span>Syllabus</span>
                </Link>

                <Link
                  href="/dashboard"
                  className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-adani-cyan to-adani-purple hover:opacity-95 shadow-sm transition-all"
                >
                  <span>View Updated Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* 15 Questions Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {currentQuestions.map((q, idx) => (
            <div
              key={q.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="text-xs font-black text-slate-400">
                  {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}.
                </span>
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
                  const isCorrect = isSubmitted && opt.id === q.correct_option_id;
                  const isWrongSelected = isSubmitted && isSelected && opt.id !== q.correct_option_id;

                  return (
                    <button
                      type="button"
                      key={opt.id}
                      disabled={isSubmitted}
                      onClick={() => handleSelect(q.id, opt.id)}
                      className={`w-full text-left p-3.5 rounded-xl border text-xs transition-all flex items-start space-x-3 ${
                        isCorrect
                          ? "border-emerald-500 bg-emerald-50/80 text-emerald-950 font-bold shadow-sm"
                          : isWrongSelected
                          ? "border-red-400 bg-red-50 text-red-950 font-medium"
                          : isSelected
                          ? "border-adani-cyan bg-adani-cyan/5 text-adani-navy font-bold shadow-sm"
                          : "border-slate-200 hover:border-slate-300 text-slate-700 bg-white"
                      }`}
                    >
                      <span
                        className={`h-5 w-5 rounded-md flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${
                          isCorrect
                            ? "bg-emerald-600 text-white"
                            : isWrongSelected
                            ? "bg-red-600 text-white"
                            : isSelected
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

              {/* Verified Explanation upon submission */}
              {isSubmitted && q.explanation && (
                <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-800">Verified Answer: Option {q.correct_option_id}</span>
                    <p className="mt-0.5 text-slate-600 text-[11px] leading-relaxed">{q.explanation}</p>
                  </div>
                </div>
              )}
            </div>
          ))}

          {!isSubmitted && (
            <div className="flex items-center justify-between pt-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm sticky bottom-4 z-20">
              <span className="text-xs text-slate-500 font-medium">
                Answered: <strong className="text-adani-cyan font-bold">{Object.keys(selectedAnswers).length}</strong> of {currentQuestions.length} Questions
              </span>

              <button
                type="submit"
                disabled={Object.keys(selectedAnswers).length < currentQuestions.length}
                className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-adani-cyan via-adani-purple to-adani-magenta hover:opacity-95 disabled:opacity-40 shadow-md transition-all flex items-center space-x-2"
              >
                <span>Submit Evaluation (&gt;75% Rule)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
