"use client";

import React, { useState } from "react";
import { CheckCircle2, XCircle, HelpCircle } from "lucide-react";

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
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});

  const handleSelect = (questionId: string, optionId: string) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionId }));
    setRevealed((prev) => ({ ...prev, [questionId]: true }));
  };

  if (!questions || questions.length === 0) return null;

  return (
    <div className="my-8 p-6 bg-slate-50/80 rounded-2xl border border-slate-200">
      <div className="flex items-center space-x-2 mb-4">
        <HelpCircle className="w-5 h-5 text-adani-cyan" />
        <h3 className="text-base font-bold text-slate-900">
          Formative Quick Check (Concept Reinforcement)
        </h3>
      </div>

      <div className="space-y-6">
        {questions.map((q, qIdx) => {
          const userChoice = selectedAnswers[q.id];
          const isAnswered = revealed[q.id];
          const isCorrect = userChoice === q.correct_option_id;

          return (
            <div key={q.id} className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-start justify-between gap-3 mb-3">
                <span className="text-xs font-bold text-slate-400">Q{qIdx + 1}.</span>
                <p className="flex-1 text-sm font-semibold text-slate-800 leading-snug">
                  {q.question_text}
                </p>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-adani-cyan/10 text-adani-cyan">
                  {q.co_tag}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
                {q.options.map((opt) => {
                  let btnStyle = "border-slate-200 hover:border-adani-cyan/50 hover:bg-slate-50 text-slate-700";
                  if (isAnswered) {
                    if (opt.id === q.correct_option_id) {
                      btnStyle = "border-emerald-500 bg-emerald-50 text-emerald-900 font-bold";
                    } else if (opt.id === userChoice) {
                      btnStyle = "border-red-400 bg-red-50 text-red-900 line-through";
                    } else {
                      btnStyle = "border-slate-100 text-slate-400 opacity-60";
                    }
                  }

                  return (
                    <button
                      key={opt.id}
                      disabled={isAnswered}
                      onClick={() => handleSelect(q.id, opt.id)}
                      className={`text-left p-3 rounded-lg border text-xs transition-all flex items-start space-x-2 ${btnStyle}`}
                    >
                      <span className="font-bold flex-shrink-0">{opt.id}.</span>
                      <span className="flex-1">{opt.text}</span>
                    </button>
                  );
                })}
              </div>

              {isAnswered && (
                <div
                  className={`mt-4 p-3 rounded-lg text-xs leading-relaxed flex items-start space-x-2 ${
                    isCorrect
                      ? "bg-emerald-50 border border-emerald-200 text-emerald-900"
                      : "bg-amber-50 border border-amber-200 text-amber-900"
                  }`}
                >
                  {isCorrect ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  )}
                  <div>
                    <span className="font-bold">{isCorrect ? "Correct! " : "Review Concept: "}</span>
                    {q.explanation}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
