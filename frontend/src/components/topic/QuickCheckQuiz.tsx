"use client";

import React, { useState } from "react";
import { CheckCircle2, XCircle, HelpCircle, ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";

export interface QuickCheckQuestion {
  id: string;
  question_text: string;
  co_tag: string;
  options: { id: string; text: string }[];
  correct_option_id: string;
  explanation: string;
}

interface QuickCheckQuizProps {
  questions: QuickCheckQuestion[];
}

export default function QuickCheckQuiz({ questions }: QuickCheckQuizProps) {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});

  if (!questions || questions.length === 0) return null;

  const total = questions.length;
  const currentQ = questions[currentIndex] || questions[0];
  const userChoice = selectedAnswers[currentQ.id];
  const isAnswered = revealed[currentQ.id];
  const isCorrect = userChoice === currentQ.correct_option_id;

  const handleSelect = (questionId: string, optionId: string) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionId }));
    setRevealed((prev) => ({ ...prev, [questionId]: true }));
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < total - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const answeredCount = Object.keys(selectedAnswers).length;

  return (
    <div className="my-8 p-6 bg-slate-50/90 rounded-3xl border border-slate-200/90 shadow-xs space-y-5">
      {/* Quiz Header & Stepper */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3.5">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-sky-50 text-adani-cyan flex items-center justify-center font-bold border border-sky-100">
            <HelpCircle className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Formative Quick Check (Concept Reinforcement)
            </h3>
            <p className="text-[11px] text-slate-500">
              Interactive clinical MCQ checkpoint • Step through each question
            </p>
          </div>
        </div>

        {/* Question Counter Badge & Progress Indicator */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="flex items-center gap-1">
            {questions.map((q, idx) => {
              const isQAnswered = !!selectedAnswers[q.id];
              const isCurrent = idx === currentIndex;
              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-6 h-6 rounded-md text-[10px] font-bold transition-all ${
                    isCurrent
                      ? "bg-adani-cyan text-white shadow-2xs scale-105"
                      : isQAnswered
                      ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                      : "bg-white text-slate-500 border border-slate-200 hover:bg-slate-100"
                  }`}
                  title={`Question ${idx + 1}`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
          <span className="text-[11px] font-semibold text-slate-500 pl-1">
            {answeredCount}/{total} Answered
          </span>
        </div>
      </div>

      {/* SINGLE CURRENT QUESTION CARD */}
      <div className="p-5 sm:p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
        {/* Question metadata row */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 font-mono">
              Question {currentIndex + 1} of {total}
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-sky-50 text-adani-cyan border border-sky-200">
              {currentQ.co_tag}
            </span>
          </div>

          {isAnswered && (
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
              isCorrect ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-red-50 text-red-700 border border-red-200"
            }`}>
              {isCorrect ? <CheckCircle2 className="w-3 h-3 text-emerald-600" /> : <XCircle className="w-3 h-3 text-red-600" />}
              {isCorrect ? "Correct" : "Incorrect"}
            </span>
          )}
        </div>

        {/* Question Text */}
        <p className="text-sm sm:text-base font-semibold text-slate-900 leading-relaxed">
          {currentQ.question_text}
        </p>

        {/* Options Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
          {currentQ.options.map((opt) => {
            let btnStyle = "border-slate-200 hover:border-adani-cyan/60 hover:bg-slate-50 text-slate-700 bg-white";
            if (isAnswered) {
              if (opt.id === currentQ.correct_option_id) {
                btnStyle = "border-emerald-500 bg-emerald-50/90 text-emerald-950 font-bold shadow-2xs";
              } else if (opt.id === userChoice) {
                btnStyle = "border-red-400 bg-red-50 text-red-950 line-through font-medium";
              } else {
                btnStyle = "border-slate-100 text-slate-400 opacity-60 bg-slate-50";
              }
            }

            return (
              <button
                key={opt.id}
                disabled={isAnswered}
                onClick={() => handleSelect(currentQ.id, opt.id)}
                className={`text-left p-3.5 rounded-xl border text-xs sm:text-sm transition-all flex items-start space-x-2.5 cursor-pointer disabled:cursor-default ${btnStyle}`}
              >
                <span className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${
                  isAnswered && opt.id === currentQ.correct_option_id
                    ? "bg-emerald-600 text-white"
                    : isAnswered && opt.id === userChoice
                    ? "bg-red-600 text-white"
                    : "bg-slate-100 text-slate-700"
                }`}>
                  {opt.id}
                </span>
                <span className="flex-1 leading-snug">{opt.text}</span>
              </button>
            );
          })}
        </div>

        {/* Explanation & Concept Reinforcement */}
        {isAnswered && (
          <div
            className={`mt-4 p-4 rounded-xl text-xs leading-relaxed flex items-start space-x-2.5 border animate-in fade-in duration-200 ${
              isCorrect
                ? "bg-emerald-50/70 border-emerald-200 text-emerald-950"
                : "bg-amber-50/70 border-amber-200 text-amber-950"
            }`}
          >
            {isCorrect ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            ) : (
              <XCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            )}
            <div>
              <span className="font-bold">{isCorrect ? "Correct! " : "Concept Insight: "}</span>
              {currentQ.explanation}
            </div>
          </div>
        )}
      </div>

      {/* PREVIOUS AND NEXT NAVIGATION BUTTONS: LEFT AND RIGHT SIDES RESPECTIVELY */}
      <div className="flex items-center justify-between pt-2">
        {/* Left Side: Previous Button */}
        <button
          type="button"
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            currentIndex === 0
              ? "bg-slate-100 text-slate-300 border border-slate-200 cursor-not-allowed opacity-60"
              : "bg-white text-slate-700 hover:text-adani-navy hover:bg-slate-100 border border-slate-200 shadow-2xs active:scale-95 cursor-pointer"
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous Question</span>
        </button>

        <span className="text-xs font-bold text-slate-500">
          Question {currentIndex + 1} of {total}
        </span>

        {/* Right Side: Next Button */}
        {currentIndex < total - 1 ? (
          <button
            type="button"
            onClick={handleNext}
            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold text-white bg-adani-cyan hover:bg-sky-600 shadow-sm transition-all transform hover:translate-x-0.5 active:scale-95 cursor-pointer"
          >
            <span>Next Question</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <div className="inline-flex items-center gap-1 px-4 py-2 rounded-xl text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 shadow-2xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>All Questions Reviewed</span>
          </div>
        )}
      </div>
    </div>
  );
}
