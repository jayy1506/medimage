"use client";

import React, { useState, useMemo } from "react";
import {
  Plus,
  Search,
  MessageSquare,
  Pin,
  Trash2,
  Edit2,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
} from "lucide-react";
import { useLexiChat } from "@/context/LexiChatContext";
import { ChatSession } from "@/lib/lexi/storage";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  isMobileDrawer?: boolean;
}

function groupSessions(sessions: ChatSession[]) {
  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;

  const pinned: ChatSession[] = [];
  const today: ChatSession[] = [];
  const yesterday: ChatSession[] = [];
  const previous7Days: ChatSession[] = [];
  const older: ChatSession[] = [];

  for (const s of sessions) {
    if (s.pinned) {
      pinned.push(s);
      continue;
    }
    const diffDays = Math.floor((now - s.updatedAt) / dayMs);
    if (diffDays === 0) {
      today.push(s);
    } else if (diffDays === 1) {
      yesterday.push(s);
    } else if (diffDays < 7) {
      previous7Days.push(s);
    } else {
      older.push(s);
    }
  }

  return { pinned, today, yesterday, previous7Days, older };
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onToggle,
  isMobileDrawer = false,
}) => {
  const {
    sessions,
    activeSessionId,
    selectSession,
    createNewSession,
    deleteSession,
    renameSession,
    pinSession,
  } = useLexiChat();

  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const filteredSessions = useMemo(() => {
    if (!searchTerm.trim()) return sessions;
    const term = searchTerm.toLowerCase();
    return sessions.filter((s) => s.title.toLowerCase().includes(term));
  }, [sessions, searchTerm]);

  const groups = useMemo(() => groupSessions(filteredSessions), [filteredSessions]);

  const handleStartRename = (session: ChatSession, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(session.id);
    setEditTitle(session.title);
  };

  const handleSaveRename = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (editTitle.trim()) {
      renameSession(id, editTitle.trim());
    }
    setEditingId(null);
  };

  const handleCancelRename = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(null);
  };

  const renderGroup = (title: string, list: ChatSession[]) => {
    if (list.length === 0) return null;
    return (
      <div className="mb-4">
        <div className="px-3 py-1 text-[11px] font-semibold text-[var(--lexi-text-muted)] uppercase tracking-wider">
          {title}
        </div>
        <div className="space-y-0.5 mt-1">
          {list.map((s) => {
            const isActive = s.id === activeSessionId;
            const isEditing = editingId === s.id;
            const isConfirmingDelete = confirmDeleteId === s.id;

            return (
              <div
                key={s.id}
                onClick={() => selectSession(s.id)}
                className={`group relative flex items-center justify-between px-3 py-2 rounded-lg text-xs cursor-pointer transition ${
                  isActive
                    ? "bg-[var(--lexi-surface-2)] text-[var(--lexi-text)] font-semibold border-l-2 border-[var(--lexi-primary)]"
                    : "text-[var(--lexi-text-muted)] hover:bg-[var(--lexi-surface-2)]/60 hover:text-[var(--lexi-text)]"
                }`}
              >
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <MessageSquare className="w-3.5 h-3.5 shrink-0" />
                  {isEditing ? (
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSaveRename(s.id, e as any);
                        if (e.key === "Escape") handleCancelRename(e as any);
                      }}
                      autoFocus
                      className="w-full bg-[var(--lexi-surface)] border border-[var(--lexi-border)] px-1.5 py-0.5 rounded text-xs text-[var(--lexi-text)] outline-none"
                    />
                  ) : (
                    <span className="truncate">{s.title || "Untitled Chat"}</span>
                  )}
                </div>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition shrink-0 ml-1">
                  {isEditing ? (
                    <>
                      <button
                        onClick={(e) => handleSaveRename(s.id, e)}
                        className="p-1 hover:text-emerald-600 rounded"
                        title="Save"
                      >
                        <Check className="w-3 h-3" />
                      </button>
                      <button
                        onClick={handleCancelRename}
                        className="p-1 hover:text-rose-600 rounded"
                        title="Cancel"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </>
                  ) : isConfirmingDelete ? (
                    <div className="flex items-center gap-1 bg-[var(--lexi-surface)] px-1.5 py-0.5 rounded border border-rose-400">
                      <span className="text-[10px] text-rose-600 font-bold">Delete?</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteSession(s.id);
                          setConfirmDeleteId(null);
                        }}
                        className="p-0.5 text-rose-600 hover:text-rose-700"
                        title="Confirm"
                      >
                        <Check className="w-3 h-3" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setConfirmDeleteId(null);
                        }}
                        className="p-0.5 text-slate-400 hover:text-slate-600"
                        title="Cancel"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          pinSession(s.id, !s.pinned);
                        }}
                        className={`p-1 rounded hover:text-[var(--lexi-text)] ${
                          s.pinned ? "text-[var(--lexi-primary)]" : ""
                        }`}
                        title={s.pinned ? "Unpin" : "Pin to top"}
                      >
                        <Pin className="w-3 h-3" />
                      </button>
                      <button
                        onClick={(e) => handleStartRename(s, e)}
                        className="p-1 rounded hover:text-[var(--lexi-text)]"
                        title="Rename"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setConfirmDeleteId(s.id);
                        }}
                        className="p-1 rounded hover:text-rose-600"
                        title="Delete chat"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  if (!isOpen && !isMobileDrawer) {
    return (
      <div className="hidden sm:flex flex-col items-center py-3 px-1 border-r border-[var(--lexi-border)] bg-[var(--lexi-surface)] shrink-0 w-12">
        <button
          onClick={onToggle}
          className="p-2 rounded-lg text-[var(--lexi-text-muted)] hover:text-[var(--lexi-text)] hover:bg-[var(--lexi-surface-2)] transition"
          title="Expand sidebar"
          aria-label="Expand sidebar"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
        <button
          onClick={createNewSession}
          className="mt-3 p-2 rounded-lg bg-[var(--lexi-primary-light)] text-[var(--lexi-primary)] hover:opacity-90 transition"
          title="New conversation"
          aria-label="New conversation"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <aside
      className={`${
        isMobileDrawer
          ? "fixed inset-y-0 left-0 z-50 w-72 shadow-2xl"
          : "relative w-64 shrink-0"
      } flex flex-col h-full border-r border-[var(--lexi-border)] bg-[var(--lexi-surface)] lexi-transition`}
      aria-label="Chat history sidebar"
    >
      {/* Top Header */}
      <div className="flex items-center justify-between p-3 border-b border-[var(--lexi-border)]/60">
        <button
          onClick={createNewSession}
          className="flex-1 flex items-center justify-center gap-2 py-1.5 px-3 rounded-lg bg-[var(--lexi-primary)] text-white text-xs font-semibold hover:opacity-95 shadow-sm transition"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Chat</span>
        </button>
        <button
          onClick={onToggle}
          className="p-1.5 ml-2 rounded-lg text-[var(--lexi-text-muted)] hover:text-[var(--lexi-text)] hover:bg-[var(--lexi-surface-2)] transition"
          title="Collapse sidebar"
          aria-label="Collapse sidebar"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      {/* Search Input */}
      <div className="p-3 pb-1">
        <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-[var(--lexi-border)] bg-[var(--lexi-surface-2)] text-xs text-[var(--lexi-text)] focus-within:border-[var(--lexi-primary)]/50 transition">
          <Search className="w-3.5 h-3.5 text-[var(--lexi-text-muted)]" />
          <input
            type="text"
            placeholder="Search past conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent outline-none placeholder-[var(--lexi-text-muted)] text-xs"
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm("")} className="text-[var(--lexi-text-muted)] hover:text-[var(--lexi-text)]">
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Grouped Chat List */}
      <div className="flex-1 overflow-y-auto p-2 scrollbar-thin">
        {renderGroup("Pinned", groups.pinned)}
        {renderGroup("Today", groups.today)}
        {renderGroup("Yesterday", groups.yesterday)}
        {renderGroup("Previous 7 Days", groups.previous7Days)}
        {renderGroup("Older", groups.older)}
        {filteredSessions.length === 0 && (
          <div className="text-center py-8 text-xs text-[var(--lexi-text-muted)]">
            No conversations found
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="p-3 border-t border-[var(--lexi-border)]/60 text-[11px] text-[var(--lexi-text-muted)] flex items-center justify-between">
        <span>Chats saved locally</span>
        <span>{sessions.length} total</span>
      </div>
    </aside>
  );
};
