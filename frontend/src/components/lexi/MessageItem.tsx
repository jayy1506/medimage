"use client";

import React, { useState } from "react";
import {
  Copy,
  Check,
  RotateCcw,
  ThumbsUp,
  ThumbsDown,
  Edit2,
  Info,
  Sparkles,
} from "lucide-react";
import { ChatMessage } from "@/lib/lexi/storage";
import { MarkdownRenderer } from "./MarkdownRenderer";
import { ToolChips } from "./ToolChips";
import { useLexiChat } from "@/context/LexiChatContext";

interface MessageItemProps {
  message: ChatMessage;
}

export const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
  const { regenerateMessage, editAndResend, isStreaming } = useLexiChat();

  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState<"up" | "down" | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(message.content);

  const isUser = message.role === "user";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error("Copy failed:", e);
    }
  };

  const handleSaveEdit = () => {
    if (editText.trim() && editText !== message.content) {
      editAndResend(message.id, editText.trim());
    }
    setIsEditing(false);
  };

  // Claude-Style Right-Aligned User Speech Bubble
  if (isUser) {
    return (
      <div className="group relative flex justify-end w-full px-4 sm:px-6 py-2.5">
        <div className="relative max-w-[85%] sm:max-w-[75%] rounded-2xl rounded-tr-xs px-4 py-3 bg-[var(--lexi-user-bubble)] border border-[var(--lexi-user-bubble-border)] text-[var(--lexi-text)] shadow-xs leading-relaxed text-sm">
          {isEditing ? (
            <div className="space-y-2">
              <textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                rows={3}
                className="w-full p-2.5 text-sm text-[var(--lexi-text)] bg-[var(--lexi-surface)] border border-[var(--lexi-border)] rounded-xl outline-none focus:border-[var(--lexi-primary)] leading-relaxed resize-none"
                autoFocus
              />
              <div className="flex items-center justify-end gap-2">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-1.5 text-xs text-[var(--lexi-text-muted)] hover:text-[var(--lexi-text)] transition rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="px-3.5 py-1.5 text-xs font-semibold bg-[var(--lexi-primary)] text-white rounded-lg hover:opacity-90 shadow-xs transition"
                >
                  Save & Resend
                </button>
              </div>
            </div>
          ) : (
            <div className="whitespace-pre-wrap">{message.content}</div>
          )}

          {/* Quick Edit Pencil on Hover */}
          {!isEditing && !isStreaming && (
            <button
              onClick={() => setIsEditing(true)}
              className="absolute -left-8 top-3 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-[var(--lexi-surface-2)] text-[var(--lexi-text-muted)] hover:text-[var(--lexi-text)] transition shadow-xs"
              title="Edit message"
              aria-label="Edit message"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    );
  }

  // Claude-Style Open Assistant Editorial Response
  return (
    <div className="group relative flex gap-3.5 w-full px-4 sm:px-6 py-3.5 transition animate-fadeIn">
      {/* Claude Starburst / Spark Avatar */}
      <div className="shrink-0 mt-0.5">
        <div className="w-6 h-6 rounded-lg bg-[var(--lexi-primary-light)] text-[var(--lexi-primary)] flex items-center justify-center shadow-xs">
          <Sparkles className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* Response Content & Actions */}
      <div className="flex-1 min-w-0 space-y-2">
        {message.isCallout ? (
          /* Claude-Style Editorial Soft Note */
          <div className="p-3.5 rounded-xl border border-[var(--lexi-border)] bg-[var(--lexi-surface-2)]/60 text-[var(--lexi-text)] text-xs sm:text-sm flex items-start gap-2.5 shadow-xs leading-relaxed">
            <Info className="w-4 h-4 text-[var(--lexi-primary)] shrink-0 mt-0.5" />
            <div className="leading-relaxed font-normal">{message.content}</div>
          </div>
        ) : (
          <div className="text-[15px] leading-relaxed text-[var(--lexi-text)]">
            <MarkdownRenderer content={message.content} />
          </div>
        )}

        {/* Source Citations */}
        {message.sources && message.sources.length > 0 && (
          <ToolChips sources={message.sources} />
        )}

        {/* Bottom Actions Toolbar (Claude Style) */}
        {!isEditing && message.content && (
          <div className="flex items-center gap-1 pt-1.5 opacity-0 group-hover:opacity-100 transition-opacity text-[var(--lexi-text-muted)] text-xs">
            <button
              onClick={handleCopy}
              className="p-1.5 rounded-lg hover:bg-[var(--lexi-surface-2)] hover:text-[var(--lexi-text)] transition flex items-center gap-1"
              title="Copy response"
              aria-label="Copy response"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-[11px] text-emerald-600">Copied</span>
                </>
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>

            <button
              onClick={() => regenerateMessage(message.id)}
              disabled={isStreaming}
              className="p-1.5 rounded-lg hover:bg-[var(--lexi-surface-2)] hover:text-[var(--lexi-text)] transition disabled:opacity-30"
              title="Retry response"
              aria-label="Retry response"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            <div className="w-[1px] h-3.5 bg-[var(--lexi-border)] mx-1" />

            <button
              onClick={() => setFeedback(feedback === "up" ? null : "up")}
              className={`p-1.5 rounded-lg hover:bg-[var(--lexi-surface-2)] transition ${
                feedback === "up" ? "text-emerald-600 font-bold" : "hover:text-[var(--lexi-text)]"
              }`}
              title="Good response"
              aria-label="Good response"
            >
              <ThumbsUp className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setFeedback(feedback === "down" ? null : "down")}
              className={`p-1.5 rounded-lg hover:bg-[var(--lexi-surface-2)] transition ${
                feedback === "down" ? "text-rose-600 font-bold" : "hover:text-[var(--lexi-text)]"
              }`}
              title="Bad response"
              aria-label="Bad response"
            >
              <ThumbsDown className="w-3.5 h-3.5" />
            </button>

            <span className="ml-auto text-[11px] text-[var(--lexi-text-muted)] font-mono">
              {new Date(message.timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
