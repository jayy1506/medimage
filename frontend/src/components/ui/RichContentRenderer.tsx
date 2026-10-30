"use client";

import React from "react";
import { 
  Sparkles, 
  HelpCircle, 
  CheckCircle2, 
  AlertTriangle, 
  Stethoscope, 
  Activity, 
  BookOpen, 
  Lightbulb,
  Sigma
} from "lucide-react";
import { MathView, EquationCard } from "./MathView";

interface RichContentRendererProps {
  content: string;
  className?: string;
}

export function RichContentRenderer({ content, className = "" }: RichContentRendererProps) {
  if (!content) return null;

  // Split content into blocks by double newlines or table boundary
  const lines = content.split("\n");
  const blocks: { type: "paragraph" | "table" | "list" | "equation"; raw: string[]; meta?: any }[] = [];

  let currentBlockType: "paragraph" | "table" | "list" | "equation" | null = null;
  let currentLines: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Check if line is part of a markdown table
    if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
      if (currentBlockType !== "table") {
        if (currentLines.length > 0 && currentBlockType) {
          blocks.push({ type: currentBlockType, raw: [...currentLines] });
          currentLines = [];
        }
        currentBlockType = "table";
      }
      currentLines.push(trimmed);
      continue;
    }

    // Check if line is a standalone block equation ($$...$$ or pure LaTeX formula)
    if (
      (trimmed.startsWith("$$") && trimmed.endsWith("$$")) ||
      (trimmed.startsWith("\\[") && trimmed.endsWith("\\]")) ||
      (/^(\\text\{|E\s*=\s*hf|\\lambda\s*=|\\mu\s*=|\\Delta|f\(x|g\(x|I_\{|\{\\text\{)/.test(trimmed) && trimmed.length > 8 && !trimmed.startsWith("**"))
    ) {
      if (currentLines.length > 0 && currentBlockType) {
        blocks.push({ type: currentBlockType, raw: [...currentLines] });
        currentLines = [];
      }
      blocks.push({ type: "equation", raw: [trimmed] });
      currentBlockType = null;
      continue;
    }

    // Check if line is a bullet or numbered list
    if (/^[-*]\s+/.test(trimmed) || /^\d+\.\s+/.test(trimmed)) {
      if (currentBlockType !== "list") {
        if (currentLines.length > 0 && currentBlockType) {
          blocks.push({ type: currentBlockType, raw: [...currentLines] });
          currentLines = [];
        }
        currentBlockType = "list";
      }
      currentLines.push(trimmed);
      continue;
    }

    // Check for empty line separating paragraphs
    if (trimmed === "") {
      if (currentLines.length > 0 && currentBlockType) {
        blocks.push({ type: currentBlockType, raw: [...currentLines] });
        currentLines = [];
        currentBlockType = null;
      }
      continue;
    }

    // Default to paragraph
    if (currentBlockType !== "paragraph") {
      if (currentLines.length > 0 && currentBlockType) {
        blocks.push({ type: currentBlockType, raw: [...currentLines] });
        currentLines = [];
      }
      currentBlockType = "paragraph";
    }
    currentLines.push(trimmed);
  }

  if (currentLines.length > 0 && currentBlockType) {
    blocks.push({ type: currentBlockType, raw: [...currentLines] });
  }

  // Format inline bold, code, math ($...$ or $$...$$), and links
  const formatInline = (text: string): React.ReactNode => {
    if (!text) return "";

    const parts: React.ReactNode[] = [];
    let remaining = text;
    let keyIdx = 0;

    // Tokenize: display math ($$...$$), inline math ($...$), bold (**...**), code (`...`)
    const tokenRegex = /(\$\$[^\$]+\$\$|\$[^\$]+\$|\*\*[^*]+\*\*|`[^`]+`)/g;
    let match: RegExpExecArray | null;
    let lastIndex = 0;

    const processPlainChunk = (chunk: string): React.ReactNode => {
      // If chunk has raw LaTeX commands like \frac, \text{, \lambda, \approx, etc., render cleanly with KaTeX
      if (/\\(text|frac|lambda|Delta|theta|approx|le|ge|cdot|mu|nabla|sigma|sum|sqrt)\b/.test(chunk)) {
        return <MathView key={`math-plain-${keyIdx++}`} math={chunk} displayMode={false} />;
      }
      return chunk;
    };

    while ((match = tokenRegex.exec(remaining)) !== null) {
      if (match.index > lastIndex) {
        const textBefore = remaining.substring(lastIndex, match.index);
        parts.push(processPlainChunk(textBefore));
      }

      const matchedStr = match[0];
      if (matchedStr.startsWith("$$") && matchedStr.endsWith("$$")) {
        const mathContent = matchedStr.slice(2, -2);
        parts.push(
          <span key={`dm-${keyIdx++}`} className="inline-block mx-1">
            <MathView math={mathContent} displayMode={false} />
          </span>
        );
      } else if (matchedStr.startsWith("$") && matchedStr.endsWith("$")) {
        const mathContent = matchedStr.slice(1, -1);
        parts.push(
          <MathView key={`im-${keyIdx++}`} math={mathContent} displayMode={false} />
        );
      } else if (matchedStr.startsWith("**") && matchedStr.endsWith("**")) {
        const boldText = matchedStr.slice(2, -2);
        parts.push(
          <strong key={`b-${keyIdx++}`} className="font-bold text-slate-900">
            {formatInline(boldText)}
          </strong>
        );
      } else if (matchedStr.startsWith("`") && matchedStr.endsWith("`")) {
        const codeText = matchedStr.slice(1, -1);
        parts.push(
          <code
            key={`c-${keyIdx++}`}
            className="px-1.5 py-0.5 mx-0.5 rounded bg-slate-100 text-slate-800 font-mono text-xs font-semibold border border-slate-200"
          >
            {codeText}
          </code>
        );
      }
      lastIndex = tokenRegex.lastIndex;
    }

    if (lastIndex < remaining.length) {
      const textAfter = remaining.substring(lastIndex);
      parts.push(processPlainChunk(textAfter));
    }

    return parts.length > 0 ? parts : text;
  };

  return (
    <div className={`space-y-4 text-slate-700 text-sm leading-relaxed ${className}`}>
      {blocks.map((block, bIdx) => {
        // 1. Markdown Table Renderer
        if (block.type === "table") {
          const rawRows = block.raw.filter((r) => !r.includes("---")); // Remove markdown separator |:---|
          if (rawRows.length === 0) return null;

          const headerRow = rawRows[0]
            .split("|")
            .filter((c, idx, arr) => idx > 0 && idx < arr.length - 1)
            .map((c) => c.trim());

          const bodyRows = rawRows.slice(1).map((r) =>
            r
              .split("|")
              .filter((c, idx, arr) => idx > 0 && idx < arr.length - 1)
              .map((c) => c.trim())
          );

          return (
            <div
              key={`table-${bIdx}`}
              className="my-5 overflow-x-auto rounded-2xl border border-slate-200 shadow-sm bg-white"
            >
              <table className="min-w-full divide-y divide-slate-200 text-left text-xs sm:text-sm">
                <thead className="bg-slate-100/80">
                  <tr>
                    {headerRow.map((h, hIdx) => (
                      <th
                        key={hIdx}
                        className="px-4 py-3 font-bold text-slate-800 text-[11px] sm:text-xs uppercase tracking-wider border-b border-slate-200 whitespace-nowrap"
                      >
                        {formatInline(h)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {bodyRows.map((row, rIdx) => (
                    <tr
                      key={rIdx}
                      className={rIdx % 2 === 0 ? "bg-white hover:bg-sky-50/40 transition-colors" : "bg-slate-50/50 hover:bg-sky-50/40 transition-colors"}
                    >
                      {row.map((cell, cIdx) => (
                        <td
                          key={cIdx}
                          className="px-4 py-3 text-slate-700 text-xs sm:text-sm leading-relaxed align-top"
                        >
                          {formatInline(cell)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }

        // 2. List Renderer (Bullet or Numbered)
        if (block.type === "list") {
          return (
            <ul key={`list-${bIdx}`} className="space-y-2 my-3 pl-1">
              {block.raw.map((item, lIdx) => {
                const cleaned = item.replace(/^[-*]\s+/, "").replace(/^\d+\.\s+/, "");
                return (
                  <li key={lIdx} className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-adani-cyan mt-2 flex-shrink-0" />
                    <span className="flex-1 text-slate-700 leading-relaxed text-xs sm:text-sm">
                      {formatInline(cleaned)}
                    </span>
                  </li>
                );
              })}
            </ul>
          );
        }

        // 3. Standalone Equation Block
        if (block.type === "equation") {
          return (
            <div key={`eq-${bIdx}`} className="my-3">
              <EquationCard formula={block.raw[0]} />
            </div>
          );
        }

        // 4. Paragraph & Callout Detection
        const fullParagraph = block.raw.join(" ");

        // Check for Exam Point Callout
        if (fullParagraph.includes("**Exam Point:**")) {
          const contentAfter = fullParagraph.replace("**Exam Point:**", "").trim();
          return (
            <div
              key={`callout-exam-${bIdx}`}
              className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 text-amber-950 flex items-start gap-3 my-4 shadow-sm"
            >
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-xs uppercase tracking-wider text-amber-800 block mb-1">
                  High-Yield Exam Point
                </span>
                <p className="text-xs sm:text-sm leading-relaxed">{formatInline(contentAfter)}</p>
              </div>
            </div>
          );
        }

        // Check for Clinical Scenario / Clinical Example
        if (
          fullParagraph.startsWith("**Clinical Scenario:**") ||
          fullParagraph.startsWith("**Clinical Example:**") ||
          fullParagraph.startsWith("**Clinical Case:**")
        ) {
          const headerTitle = fullParagraph.includes("Scenario")
            ? "Clinical Scenario"
            : fullParagraph.includes("Case")
            ? "Clinical Case"
            : "Clinical Example";

          const bodyContent = fullParagraph
            .replace("**Clinical Scenario:**", "")
            .replace("**Clinical Example:**", "")
            .replace("**Clinical Case:**", "")
            .trim();

          return (
            <div
              key={`callout-clinical-${bIdx}`}
              className="p-4 rounded-xl bg-sky-50/80 border border-sky-200 text-slate-800 flex items-start gap-3 my-4 shadow-sm"
            >
              <Stethoscope className="w-5 h-5 text-adani-cyan flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-xs uppercase tracking-wider text-adani-navy block mb-1">
                  {headerTitle}
                </span>
                <p className="text-xs sm:text-sm leading-relaxed">{formatInline(bodyContent)}</p>
              </div>
            </div>
          );
        }

        // Check for Application Question & Answer
        if (fullParagraph.startsWith("**Question:**") || fullParagraph.includes("**Answer:**")) {
          const parts = fullParagraph.split("**Answer:**");
          const questionText = parts[0].replace("**Question:**", "").trim();
          const answerText = parts[1] ? parts[1].trim() : "";

          return (
            <div
              key={`callout-qa-${bIdx}`}
              className="p-4 rounded-xl bg-purple-50/70 border border-purple-200 text-slate-800 space-y-3 my-4 shadow-sm"
            >
              <div className="flex items-start gap-3">
                <HelpCircle className="w-5 h-5 text-adani-purple flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-xs uppercase tracking-wider text-adani-purple block mb-1">
                    Application Question
                  </span>
                  <p className="text-xs sm:text-sm font-semibold text-slate-900 leading-relaxed">
                    {formatInline(questionText)}
                  </p>
                </div>
              </div>

              {answerText && (
                <div className="pt-3 border-t border-purple-200/60 flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-xs uppercase tracking-wider text-emerald-800 block mb-1">
                      Verified Clinical Solution
                    </span>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                      {formatInline(answerText)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        }

        // Standard Paragraph
        return (
          <p key={`p-${bIdx}`} className="text-slate-700 text-xs sm:text-sm leading-relaxed">
            {formatInline(fullParagraph)}
          </p>
        );
      })}
    </div>
  );
}
