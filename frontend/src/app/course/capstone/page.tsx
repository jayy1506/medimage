"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Award, 
  Clock, 
  ChevronLeft, 
  ChevronRight,
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  ArrowRight, 
  Sparkles,
  ShieldCheck,
  BookOpen,
  TrendingUp,
  FileText
} from "lucide-react";
import { UserNav } from "@/components/UserNav";
import { BrandLogo } from "@/components/BrandLogo";
import { useProgress } from "@/context/ProgressContext";
import { GRAND_CAPSTONE_40_QUESTIONS, QuizQuestionItem } from "@/data/quizDatabase";

export default function GrandCapstoneExamPage() {
  const { recordAssessmentScore, moduleScores } = useProgress();
  const questions: QuizQuestionItem[] = GRAND_CAPSTONE_40_QUESTIONS;

  const [currentQIndex, setCurrentQIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [result, setResult] = useState<{
    scorePct: number;
    isPassed: boolean;
    correctCount: number;
  } | null>(null);

  const handleSelect = (questionId: string, optionId: string) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  const handlePrev = () => {
    if (currentQIndex > 0) {
      setCurrentQIndex((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex((prev) => prev + 1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let correct = 0;
    questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correct_option_id) {
        correct += 1;
      }
    });

    const scorePct = Math.round((correct / questions.length) * 100);
    // Strict >75.0% Pass Rule
    const isPassed = scorePct > 75;

    // Record high score across all modules if passed
    if (isPassed) {
      ["mod-1", "mod-2", "mod-3", "mod-4", "mod-5", "mod-6"].forEach((mId) => {
        recordAssessmentScore(mId, Math.max(scorePct, moduleScores[mId] || 0));
      });
    }

    setResult({
      scorePct,
      isPassed,
      correctCount: correct
    });
    setIsSubmitted(true);
  };

  const handleRetake = () => {
    setSelectedAnswers({});
    setIsSubmitted(false);
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto w-full space-y-6">
        {/* Navigation Bar */}
        <div className="flex items-center justify-between">
          <Link
            href="/dashboard"
            className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-adani-navy transition-colors gap-2"
          >
            <BrandLogo className="w-7 h-7" size={28} />
            <div className="flex items-center">
              <ChevronLeft className="w-4 h-4 mr-0.5" />
              <span>Back to Course Dashboard</span>
            </div>
          </Link>

          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 text-xs font-semibold text-slate-600 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">
              <Clock className="w-3.5 h-3.5 text-adani-cyan" />
              <span>40 Questions • CO1-CO5</span>
            </div>
            <UserNav />
          </div>
        </div>

        {/* Grand Assessment Header */}
        <div className="bg-gradient-to-r from-adani-navy via-slate-900 to-slate-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl space-y-3 relative overflow-hidden">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/20 border border-sky-400/30 text-adani-cyan text-[11px] font-bold uppercase tracking-wider">
              <Award className="w-3.5 h-3.5" />
              Comprehensive Capstone Examination
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-300 text-[10px] font-bold">
              <Sparkles className="w-3 h-3" />
              Accredited AIDS 12605.1 • 40 MCQs
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Grand Course Mastery Assessment (All 6 Modules)
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Final synthesis evaluation covering Physics &amp; Modalities (CO1), PACS &amp; Quality (CO2), Filtering &amp; Transforms (CO3), Segmentation &amp; 3D Volume Rendering (CO4), and Clinical Diagnostics (CO5).
          </p>

          <div className="pt-2 flex items-center gap-4 text-xs text-slate-300">
            <span className="flex items-center gap-1 text-emerald-400 font-semibold">
              <ShieldCheck className="w-4 h-4" /> Strict &gt;75.0% Pass Condition (31 / 40 correct)
            </span>
          </div>
        </div>

        {/* Result Card */}
        {isSubmitted && result && (
          <div
            className={`p-6 sm:p-8 rounded-3xl border shadow-lg space-y-4 animate-in fade-in zoom-in-95 ${
              result.isPassed
                ? "bg-emerald-50 border-emerald-300 text-emerald-950"
                : "bg-amber-50 border-amber-300 text-amber-950"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {result.isPassed ? (
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 flex-shrink-0" />
                ) : (
                  <XCircle className="w-8 h-8 text-amber-600 flex-shrink-0" />
                )}
                <div>
                  <h3 className="text-lg font-black">
                    {result.isPassed
                      ? "Course Mastery Clearance Achieved!"
                      : "Mastery Threshold Not Met"}
                  </h3>
                  <p className="text-xs">
                    You scored <span className="font-bold text-sm">{result.scorePct}%</span> (
                    {result.correctCount} of {questions.length} correct).
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
                ? "Congratulations! You have demonstrated comprehensive mastery across all 6 foundational modules of Medical Text and Image Processing. Your credential clearance is officially recorded."
                : `You achieved ${result.scorePct}%. Review the theory and practice questions across the individual module study units, then retake this grand capstone assessment.`}
            </p>

            <div className="pt-4 border-t border-slate-200/60 flex flex-wrap items-center justify-between gap-2">
              <button
                onClick={handleRetake}
                className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold bg-white text-slate-800 border border-slate-300 hover:bg-slate-100 shadow-sm transition-all"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Retake Assessment</span>
              </button>

              <Link
                href="/dashboard"
                className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-adani-cyan to-adani-purple hover:opacity-95 shadow-sm transition-all"
              >
                <span>Return to Course Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}

        {/* Question Stepper / Jump Navigation Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto py-1 max-w-full">
            {questions.map((item, idx) => {
              const isAnswered = !!selectedAnswers[item.id];
              const isCurrent = idx === currentQIndex;
              return (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => setCurrentQIndex(idx)}
                  className={`w-7 h-7 rounded-lg text-[11px] font-bold transition-all flex items-center justify-center ${
                    isCurrent
                      ? "bg-adani-cyan text-white shadow-sm ring-2 ring-sky-300"
                      : isAnswered
                      ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200"
                  }`}
                  title={`Go to Question ${idx + 1}`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          <div className="text-xs font-semibold text-slate-600 flex-shrink-0">
            Answered: <strong className="text-adani-cyan font-bold">{Object.keys(selectedAnswers).length}</strong> of {questions.length} MCQs
          </div>
        </div>

        {/* ONE QUESTION ASKED AT A TIME */}
        {(() => {
          const q = questions[currentQIndex] || questions[0];
          const isSelected = selectedAnswers[q.id];

          return (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-5">
                <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 font-mono">
                      Question {currentQIndex + 1 < 10 ? `0${currentQIndex + 1}` : currentQIndex + 1} of {questions.length}
                    </span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-sky-50 text-adani-cyan border border-sky-100">
                      {q.co_tag}
                    </span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-purple-50 text-adani-purple border border-purple-100">
                      {q.moduleId.toUpperCase()}
                    </span>
                  </div>

                  {selectedAnswers[q.id] && !isSubmitted && (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      Option {selectedAnswers[q.id]} Selected
                    </span>
                  )}
                </div>

                <p className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                  {q.question_text}
                </p>

                <div className="space-y-2.5 mt-4">
                  {q.options.map((opt) => {
                    const isOptSelected = selectedAnswers[q.id] === opt.id;
                    const isCorrect = isSubmitted && opt.id === q.correct_option_id;
                    const isWrongSelected = isSubmitted && isOptSelected && opt.id !== q.correct_option_id;

                    return (
                      <button
                        type="button"
                        key={opt.id}
                        disabled={isSubmitted}
                        onClick={() => handleSelect(q.id, opt.id)}
                        className={`w-full text-left p-4 rounded-2xl border text-xs sm:text-sm transition-all flex items-start space-x-3 cursor-pointer disabled:cursor-default ${
                          isCorrect
                            ? "border-emerald-500 bg-emerald-50/90 text-emerald-950 font-bold shadow-sm"
                            : isWrongSelected
                            ? "border-red-400 bg-red-50 text-red-950 font-medium"
                            : isOptSelected
                            ? "border-adani-cyan bg-sky-50/70 text-adani-navy font-bold shadow-sm ring-1 ring-adani-cyan/50"
                            : "border-slate-200 hover:border-slate-300 text-slate-700 bg-white hover:bg-slate-50"
                        }`}
                      >
                        <span
                          className={`h-5 w-5 rounded-md flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${
                            isCorrect
                              ? "bg-emerald-600 text-white"
                              : isWrongSelected
                              ? "bg-red-600 text-white"
                              : isOptSelected
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

                {/* Explanation upon submission */}
                {isSubmitted && q.explanation && (
                  <div className="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-800">Verified Answer: Option {q.correct_option_id}</span>
                      <p className="mt-0.5 text-slate-600 text-xs leading-relaxed">{q.explanation}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* PREVIOUS AND NEXT BUTTONS: LEFT AND RIGHT SIDES RESPECTIVELY */}
              <div className="flex items-center justify-between pt-2">
                {/* Left Side: Previous Button */}
                <button
                  type="button"
                  onClick={handlePrev}
                  disabled={currentQIndex === 0}
                  className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                    currentQIndex === 0
                      ? "bg-slate-100 text-slate-300 border border-slate-200 cursor-not-allowed opacity-60"
                      : "bg-white text-slate-700 hover:text-adani-navy hover:bg-slate-100 border border-slate-200 shadow-2xs active:scale-95 cursor-pointer"
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous Question</span>
                </button>

                {/* Middle: Progress label */}
                <span className="text-xs font-semibold text-slate-500 hidden sm:inline">
                  Question {currentQIndex + 1} of {questions.length}
                </span>

                {/* Right Side: Next Button OR Submit Button */}
                {currentQIndex < questions.length - 1 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-adani-cyan hover:bg-sky-600 shadow-sm transition-all transform hover:translate-x-0.5 active:scale-95 cursor-pointer"
                  >
                    <span>Next Question</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : !isSubmitted ? (
                  <button
                    type="submit"
                    disabled={Object.keys(selectedAnswers).length < questions.length}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-adani-cyan via-adani-purple to-adani-magenta hover:opacity-95 shadow-md disabled:opacity-40 transition-all cursor-pointer"
                  >
                    <span>Submit 40-MCQ Final Assessment</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleRetake}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-slate-700 bg-white border border-slate-200 shadow-2xs hover:bg-slate-100 cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Retake Exam</span>
                  </button>
                )}
              </div>
            </form>
          );
        })()}
      </div>
    </div>
  );
}
