"use client";

import React, { useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import katex from "katex";
import { CodeBlock } from "./CodeBlock";

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  // Pre-process math tokens ($...$ and $$...$$) into KaTeX HTML spans
  const processedContent = useMemo(() => {
    if (!content) return "";

    // Replace display math $$...$$
    let text = content.replace(/\$\$([\s\S]+?)\$\$/g, (_, math) => {
      try {
        return `<div class="my-2 overflow-x-auto text-center">${katex.renderToString(math.trim(), {
          displayMode: true,
          throwOnError: false,
        })}</div>`;
      } catch {
        return `$$${math}$$`;
      }
    });

    // Replace inline math $...$ (avoiding currency $100)
    text = text.replace(/(?<!\\)\$([^\$\n\r]+?)\$/g, (_, math) => {
      if (/^\d+(\.\d+)?$/.test(math.trim())) {
        return `$${math}$`;
      }
      try {
        return katex.renderToString(math.trim(), {
          displayMode: false,
          throwOnError: false,
        });
      } catch {
        return `$${math}$`;
      }
    });

    return text;
  }, [content]);

  return (
    <div className="prose prose-sm max-w-none text-[var(--lexi-text)] leading-relaxed break-words">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ node, inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || "");
            const stringContent = String(children).replace(/\n$/, "");

            if (!inline && (match || stringContent.includes("\n"))) {
              return (
                <CodeBlock language={match ? match[1] : undefined}>
                  {stringContent}
                </CodeBlock>
              );
            }

            return (
              <code
                className="px-1.5 py-0.5 rounded text-xs font-mono bg-[var(--lexi-border)]/60 text-[var(--lexi-text)] font-semibold"
                {...props}
              >
                {children}
              </code>
            );
          },
          table({ children }) {
            return (
              <div className="my-3 overflow-x-auto rounded-lg border border-[var(--lexi-border)]">
                <table className="min-w-full divide-y divide-[var(--lexi-border)] text-xs text-left">
                  {children}
                </table>
              </div>
            );
          },
          th({ children }) {
            return (
              <th className="px-3 py-2 bg-[var(--lexi-surface-2)] font-semibold text-[var(--lexi-text)]">
                {children}
              </th>
            );
          },
          td({ children }) {
            return (
              <td className="px-3 py-2 border-t border-[var(--lexi-border)]/50 text-[var(--lexi-text)]">
                {children}
              </td>
            );
          },
          a({ href, children }) {
            return (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--lexi-primary)] hover:underline font-medium"
              >
                {children}
              </a>
            );
          },
          p({ children }) {
            return <p className="mb-2.5 last:mb-0">{children}</p>;
          },
          ul({ children }) {
            return <ul className="list-disc pl-5 my-2 space-y-1">{children}</ul>;
          },
          ol({ children }) {
            return <ol className="list-decimal pl-5 my-2 space-y-1">{children}</ol>;
          },
        }}
      >
        {processedContent}
      </ReactMarkdown>
    </div>
  );
};
