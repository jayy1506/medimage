"use client";

import React, { useState } from "react";
import { BookOpen, ChevronDown, ChevronRight, FileText } from "lucide-react";

interface ToolChipsProps {
  sources?: { file: string; section: string }[];
}

export const ToolChips: React.FC<ToolChipsProps> = ({ sources }) => {
  const [expanded, setExpanded] = useState(false);

  if (!sources || sources.length === 0) return null;

  return (
    <div className="mt-2 text-xs">
      <button
        onClick={() => setExpanded(!expanded)}
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[var(--lexi-surface-2)] hover:bg-[var(--lexi-surface-3)] border border-[var(--lexi-border)] text-xs font-medium text-[var(--lexi-text-muted)] hover:text-[var(--lexi-text)] transition select-none"
        aria-expanded={expanded}
        title="View cited course documents"
      >
        <BookOpen className="w-3.5 h-3.5 text-[var(--lexi-primary)]" />
        <span>Sources ({sources.length})</span>
        {expanded ? (
          <ChevronDown className="w-3 h-3 ml-0.5 text-[var(--lexi-text-muted)]" />
        ) : (
          <ChevronRight className="w-3 h-3 ml-0.5 text-[var(--lexi-text-muted)]" />
        )}
      </button>

      {expanded && (
        <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-1.5 animate-fadeIn">
          {sources.map((src, i) => (
            <div
              key={i}
              className="flex items-start gap-2 p-2 rounded-xl bg-[var(--lexi-surface-2)]/60 border border-[var(--lexi-border)]/80 text-[11px] text-[var(--lexi-text)]"
            >
              <FileText className="w-3.5 h-3.5 text-[var(--lexi-primary)] shrink-0 mt-0.5" />
              <div className="min-w-0 flex-1">
                <div className="font-semibold truncate">{src.file}</div>
                <div className="text-[10px] text-[var(--lexi-text-muted)] truncate">{src.section}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
