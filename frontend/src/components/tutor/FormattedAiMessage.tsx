"use client";

import React from "react";
import { MathView } from "@/components/ui/MathView";

interface FormattedAiMessageProps {
  content: string;
  theme?: "light" | "dark";
}

/**
 * Parses inline string into text, inline math ($...$), bold (**...**), and inline code (`...`)
 */
function renderInlineContent(text: string, theme: "light" | "dark"): React.ReactNode[] {
  // Regex matches:
  // 1. Inline math: \$([^$]+)\$
  // 2. Bold text: \*\*([^*]+)\*\*
  // 3. Inline code: `([^`]+)`
  const regex = /(\$[^$]+\$|\*\*[^*]+\*\*|`[^`]+`)/g;
  const parts = text.split(regex);

  return parts.map((part, index) => {
    if (!part) return null;

    // 1. Inline Math
    if (part.startsWith("$") && part.endsWith("$") && part.length > 2) {
      const rawMath = part.slice(1, -1);
      return (
        <span key={index} className="inline-block mx-0.5 align-baseline font-serif">
          <MathView math={rawMath} displayMode={false} />
        </span>
      );
    }

    // 2. Bold Markdown
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
      const boldText = part.slice(2, -2);
      return (
        <strong
          key={index}
          className={`font-bold ${theme === "dark" ? "text-zinc-100" : "text-slate-900"}`}
        >
          {boldText}
        </strong>
      );
    }

    // 3. Inline Code
    if (part.startsWith("`") && part.endsWith("`") && part.length > 2) {
      const codeText = part.slice(1, -1);
      return (
        <code
          key={index}
          className={`px-1.5 py-0.5 mx-0.5 rounded text-[11px] font-mono ${
            theme === "dark"
              ? "bg-zinc-800 text-amber-300 border border-zinc-700"
              : "bg-slate-100 text-adani-navy border border-slate-200"
          }`}
        >
          {codeText}
        </code>
      );
    }

    // Regular plain text
    return <span key={index}>{part}</span>;
  });
}

export function FormattedAiMessage({ content, theme = "light" }: FormattedAiMessageProps) {
  if (!content) return null;

  // Normalize Windows newlines
  const normalized = content.replace(/\r\n/g, "\n");

  // Split into raw blocks by double newlines or display math delimiters
  // We want to extract $$...$$ blocks cleanly even if attached to newlines
  const mathBlockRegex = /(\$\$[\s\S]*?\$\$)/g;
  const rawSections = normalized.split(mathBlockRegex);

  return (
    <div
      className={`text-xs sm:text-sm leading-relaxed space-y-3 font-sans ${
        theme === "dark" ? "text-zinc-200" : "text-slate-800"
      }`}
    >
      {rawSections.map((section, sIdx) => {
        const trimmed = section.trim();
        if (!trimmed) return null;

        // 1. DISPLAY BLOCK MATH ($$...$$)
        if (trimmed.startsWith("$$") && trimmed.endsWith("$$")) {
          const formula = trimmed.slice(2, -2).trim();
          return (
            <div
              key={sIdx}
              className={`my-3 p-3 sm:p-4 rounded-xl text-center overflow-x-auto shadow-xs border transition-colors ${
                theme === "dark"
                  ? "bg-zinc-950/70 border-zinc-800 text-zinc-100"
                  : "bg-white border-slate-200 text-slate-900"
              }`}
            >
              <MathView math={formula} displayMode={true} />
            </div>
          );
        }

        // 2. PARAGRAPH OR LIST OF ITEMS
        const lines = section.split("\n");
        const renderedElements: React.ReactNode[] = [];
        let currentListItems: string[] = [];

        const flushList = (listKey: string) => {
          if (currentListItems.length > 0) {
            renderedElements.push(
              <ul
                key={listKey}
                className={`my-2 space-y-1.5 pl-4 sm:pl-5 list-disc ${
                  theme === "dark" ? "marker:text-amber-400" : "marker:text-adani-cyan"
                }`}
              >
                {currentListItems.map((itemText, lIdx) => (
                  <li key={lIdx} className="leading-relaxed">
                    {renderInlineContent(itemText, theme)}
                  </li>
                ))}
              </ul>
            );
            currentListItems = [];
          }
        };

        lines.forEach((line, lineIdx) => {
          const trimmedLine = line.trim();
          if (!trimmedLine) {
            flushList(`list-${sIdx}-${lineIdx}`);
            return;
          }

          // Unordered list item: starts with "- " or "* "
          if (/^[-*]\s+/.test(trimmedLine)) {
            const itemContent = trimmedLine.replace(/^[-*]\s+/, "");
            currentListItems.push(itemContent);
            return;
          }

          // Numbered list item: starts with "1. ", "2. ", etc.
          if (/^\d+\.\s+/.test(trimmedLine)) {
            flushList(`list-before-${sIdx}-${lineIdx}`);
            const itemContent = trimmedLine.replace(/^\d+\.\s+/, "");
            renderedElements.push(
              <div key={`ol-${sIdx}-${lineIdx}`} className="flex items-start gap-2 my-1">
                <span
                  className={`font-mono text-xs font-bold ${
                    theme === "dark" ? "text-amber-400" : "text-adani-cyan"
                  }`}
                >
                  {trimmedLine.match(/^\d+\./)?.[0]}
                </span>
                <span className="flex-1 leading-relaxed">
                  {renderInlineContent(itemContent, theme)}
                </span>
              </div>
            );
            return;
          }

          // Regular paragraph line
          flushList(`list-end-${sIdx}-${lineIdx}`);
          renderedElements.push(
            <p key={`p-${sIdx}-${lineIdx}`} className="leading-relaxed">
              {renderInlineContent(trimmedLine, theme)}
            </p>
          );
        });

        flushList(`list-final-${sIdx}`);

        return (
          <div key={sIdx} className="space-y-2">
            {renderedElements}
          </div>
        );
      })}
    </div>
  );
}
