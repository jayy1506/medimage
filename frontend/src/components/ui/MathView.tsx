"use client";

import React, { useMemo } from "react";
import katex from "katex";

interface MathViewProps {
  math: string;
  displayMode?: boolean;
  className?: string;
}

/**
 * Clean fallback helper that converts raw LaTeX symbols into readable Unicode symbols
 * if KaTeX rendering fails or for pure text fallbacks.
 */
function cleanLatexFallback(raw: string): string {
  return raw
    .replace(/\$\$/g, "")
    .replace(/\$/g, "")
    .replace(/\\text\{([^}]+)\}/g, "$1")
    .replace(/\\mathrm\{([^}]+)\}/g, "$1")
    .replace(/\\mathbf\{([^}]+)\}/g, "$1")
    .replace(/\\qquad/g, "   ")
    .replace(/\\quad/g, "  ")
    .replace(/\\,/g, " ")
    .replace(/\\;/g, " ")
    .replace(/\\!/g, "")
    .replace(/\\approx/g, "≈")
    .replace(/\\le/g, "≤")
    .replace(/\\ge/g, "≥")
    .replace(/\\times/g, "×")
    .replace(/\\cdot/g, "·")
    .replace(/\\pm/g, "±")
    .replace(/\\neq/g, "≠")
    .replace(/\\infty/g, "∞")
    .replace(/\\lambda/g, "λ")
    .replace(/\\Delta/g, "Δ")
    .replace(/\\theta/g, "θ")
    .replace(/\\sigma/g, "σ")
    .replace(/\\pi/g, "π")
    .replace(/\\mu/g, "μ")
    .replace(/\\alpha/g, "α")
    .replace(/\\beta/g, "β")
    .replace(/\\gamma/g, "γ")
    .replace(/\\nabla/g, "∇")
    .replace(/\\sum/g, "∑")
    .replace(/\\sqrt\{([^}]+)\}/g, "√($1)")
    .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, "($1) / ($2)")
    .trim();
}

export function MathView({ math, displayMode = false, className = "" }: MathViewProps) {
  const renderedHtml = useMemo(() => {
    if (!math) return "";
    
    // Strip external $ or $$ if provided
    let clean = math.trim();
    if (clean.startsWith("$$") && clean.endsWith("$$")) {
      clean = clean.slice(2, -2).trim();
    } else if (clean.startsWith("$") && clean.endsWith("$")) {
      clean = clean.slice(1, -1).trim();
    }

    try {
      return katex.renderToString(clean, {
        displayMode,
        throwOnError: false,
        output: "htmlAndMathml",
      });
    } catch {
      return null;
    }
  }, [math, displayMode]);

  if (!renderedHtml) {
    // Graceful fallback without raw dollar signs or LaTeX commands
    return (
      <span className={`font-mono text-slate-900 ${className}`}>
        {cleanLatexFallback(math)}
      </span>
    );
  }

  return (
    <span
      className={`inline-block text-slate-900 ${displayMode ? "w-full overflow-x-auto py-1 text-center" : ""} ${className}`}
      dangerouslySetInnerHTML={{ __html: renderedHtml }}
    />
  );
}

/**
 * Standard Academic Equation Card (White Background, Black Text, Clean Border)
 */
interface EquationCardProps {
  formula: string;
  equationNumber?: string;
  className?: string;
}

export function EquationCard({ formula, equationNumber, className = "" }: EquationCardProps) {
  if (!formula) return null;

  return (
    <div
      className={`my-5 p-4 rounded-xl bg-white text-slate-900 shadow-sm border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${className}`}
    >
      <div className="overflow-x-auto py-1 flex-1 flex items-center justify-center sm:justify-start">
        <MathView math={formula} displayMode={true} />
      </div>

      {equationNumber && (
        <span className="text-[11px] font-bold text-slate-600 bg-slate-100 border border-slate-200 px-3 py-1 rounded-md self-end sm:self-center flex-shrink-0 tracking-wide uppercase">
          {equationNumber}
        </span>
      )}
    </div>
  );
}
