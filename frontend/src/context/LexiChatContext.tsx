"use client";

import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";
import {
  ChatSession,
  ChatMessage,
  DisplayMode,
  chatStorage,
} from "@/lib/lexi/storage";

interface LexiChatContextType {
  isOpen: boolean;
  mode: DisplayMode;
  setMode: (mode: DisplayMode) => void;
  toggleOpen: () => void;
  openChat: () => void;
  closeChat: () => void;
  sessions: ChatSession[];
  activeSession: ChatSession | null;
  activeSessionId: string;
  isStreaming: boolean;
  statusText: string;
  sendMessage: (content: string) => Promise<void>;
  stopStreaming: () => void;
  createNewSession: () => void;
  selectSession: (id: string) => void;
  deleteSession: (id: string) => void;
  renameSession: (id: string, newTitle: string) => void;
  pinSession: (id: string, pinned: boolean) => void;
  regenerateMessage: (messageId: string) => Promise<void>;
  editAndResend: (messageId: string, newContent: string) => Promise<void>;
  composerRef: React.RefObject<HTMLTextAreaElement>;
  launcherRef: React.RefObject<HTMLButtonElement>;
}

const LexiChatContext = createContext<LexiChatContextType | undefined>(undefined);

export const LexiChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setModeState] = useState<DisplayMode>("normal");
  const [previousMode, setPreviousMode] = useState<DisplayMode>("normal");
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string>("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [statusText, setStatusText] = useState("");

  const abortControllerRef = useRef<AbortController | null>(null);
  const composerRef = useRef<HTMLTextAreaElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);

  // Restore stored preferences and chat sessions on initial mount
  useEffect(() => {
    const prefs = chatStorage.getPreferences();
    setModeState(prefs.mode || "normal");
    setPreviousMode(prefs.mode || "normal");
    setIsOpen(prefs.isOpen || false);

    const loadedSessions = chatStorage.getSessions();
    setSessions(loadedSessions);
    if (loadedSessions.length > 0) {
      setActiveSessionId(loadedSessions[0].id);
    }
  }, []);

  const setMode = useCallback((newMode: DisplayMode) => {
    setModeState((current) => {
      if (current !== newMode) {
        setPreviousMode(current);
      }
      return newMode;
    });
    chatStorage.savePreferences({ mode: newMode });
  }, []);

  const toggleOpen = useCallback(() => {
    setIsOpen((prev) => {
      const next = !prev;
      chatStorage.savePreferences({ isOpen: next });
      if (next) {
        setTimeout(() => composerRef.current?.focus(), 150);
      } else {
        setTimeout(() => launcherRef.current?.focus(), 100);
      }
      return next;
    });
  }, []);

  const openChat = useCallback(() => {
    setIsOpen(true);
    chatStorage.savePreferences({ isOpen: true });
    setTimeout(() => composerRef.current?.focus(), 150);
  }, []);

  const closeChat = useCallback(() => {
    setIsOpen(false);
    chatStorage.savePreferences({ isOpen: false });
    setTimeout(() => launcherRef.current?.focus(), 100);
  }, []);

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isCmdOrCtrl = e.metaKey || e.ctrlKey;

      // Ctrl/Cmd + J: Toggle open/close
      if (isCmdOrCtrl && (e.key === "j" || e.key === "J")) {
        e.preventDefault();
        toggleOpen();
        return;
      }

      // Ctrl/Cmd + Shift + 1/2/3: Layout modes
      if (isCmdOrCtrl && e.shiftKey) {
        if (e.key === "1" || e.key === "!") {
          e.preventDefault();
          setMode("normal");
          if (!isOpen) openChat();
          return;
        }
        if (e.key === "2" || e.key === "@") {
          e.preventDefault();
          setMode("half");
          if (!isOpen) openChat();
          return;
        }
        if (e.key === "3" || e.key === "#") {
          e.preventDefault();
          setMode("full");
          if (!isOpen) openChat();
          return;
        }
      }

      // Escape: Close or exit full
      if (e.key === "Escape" && isOpen) {
        e.preventDefault();
        if (mode === "full") {
          setMode(previousMode !== "full" ? previousMode : "normal");
        } else {
          closeChat();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, mode, previousMode, toggleOpen, setMode, openChat, closeChat]);

  const activeSession = sessions.find((s) => s.id === activeSessionId) || null;

  const createNewSession = useCallback(() => {
    const newSession: ChatSession = {
      id: "session-" + Date.now(),
      title: "New Conversation",
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setSessions((prev) => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
    chatStorage.saveSession(newSession);
    setTimeout(() => composerRef.current?.focus(), 100);
  }, []);

  const selectSession = useCallback((id: string) => {
    setActiveSessionId(id);
    setTimeout(() => composerRef.current?.focus(), 100);
  }, []);

  const deleteSession = useCallback((id: string) => {
    chatStorage.deleteSession(id);
    setSessions((prev) => {
      const filtered = prev.filter((s) => s.id !== id);
      if (activeSessionId === id) {
        setActiveSessionId(filtered.length > 0 ? filtered[0].id : "");
      }
      return filtered;
    });
  }, [activeSessionId]);

  const renameSession = useCallback((id: string, newTitle: string) => {
    chatStorage.renameSession(id, newTitle);
    setSessions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, title: newTitle, updatedAt: Date.now() } : s))
    );
  }, []);

  const pinSession = useCallback((id: string, pinned: boolean) => {
    chatStorage.pinSession(id, pinned);
    setSessions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, pinned, updatedAt: Date.now() } : s))
    );
  }, []);

  const stopStreaming = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsStreaming(false);
    setStatusText("");
  }, []);

  const sendMessage = useCallback(
    async (content: string) => {
      const trimmed = content.trim();
      if (!trimmed || isStreaming) return;

      let currentSession = activeSession;
      if (!currentSession) {
        const newSession: ChatSession = {
          id: "session-" + Date.now(),
          title: trimmed.slice(0, 32) + (trimmed.length > 32 ? "..." : ""),
          messages: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        currentSession = newSession;
        setSessions((prev) => [newSession, ...prev]);
        setActiveSessionId(newSession.id);
      }

      const userMessage: ChatMessage = {
        id: "msg-" + Date.now() + "-u",
        role: "user",
        content: trimmed,
        timestamp: Date.now(),
      };

      const assistantMessageId = "msg-" + (Date.now() + 1) + "-a";
      const assistantMessage: ChatMessage = {
        id: assistantMessageId,
        role: "assistant",
        content: "",
        timestamp: Date.now() + 1,
      };

      const updatedMessages = [...currentSession.messages, userMessage, assistantMessage];
      const updatedSession: ChatSession = {
        ...currentSession,
        title:
          currentSession.messages.length === 0
            ? trimmed.slice(0, 36) + (trimmed.length > 36 ? "..." : "")
            : currentSession.title,
        messages: updatedMessages,
        updatedAt: Date.now(),
      };

      setSessions((prev) =>
        prev.map((s) => (s.id === updatedSession.id ? updatedSession : s))
      );
      chatStorage.saveSession(updatedSession);

      setIsStreaming(true);
      setStatusText("Lexi is thinking...");

      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      try {
        const payloadMessages = updatedSession.messages
          .filter((m) => m.id !== assistantMessageId)
          .map((m) => ({ role: m.role, content: m.content }));

        const resp = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: payloadMessages }),
          signal: abortController.signal,
        });

        if (!resp.ok) {
          throw new Error(`Server returned ${resp.status}`);
        }

        const reader = resp.body?.getReader();
        if (!reader) throw new Error("No response body stream");

        const decoder = new TextDecoder();
        let accumulatedText = "";
        let sources: { file: string; section: string }[] = [];

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              try {
                const event = JSON.parse(line.slice(6));
                if (event.type === "token") {
                  setStatusText("");
                  accumulatedText += event.text;

                  setSessions((prev) =>
                    prev.map((s) => {
                      if (s.id !== updatedSession.id) return s;
                      return {
                        ...s,
                        messages: s.messages.map((m) =>
                          m.id === assistantMessageId
                            ? {
                                ...m,
                                content: accumulatedText,
                                isCallout:
                                  accumulatedText.startsWith("I couldn't find that") ||
                                  accumulatedText.startsWith("I can only help with questions"),
                              }
                            : m
                        ),
                      };
                    })
                  );
                } else if (event.type === "sources" && Array.isArray(event.items)) {
                  sources = event.items;
                  setSessions((prev) =>
                    prev.map((s) => {
                      if (s.id !== updatedSession.id) return s;
                      return {
                        ...s,
                        messages: s.messages.map((m) =>
                          m.id === assistantMessageId ? { ...m, sources } : m
                        ),
                      };
                    })
                  );
                }
              } catch {
                // ignore non-json
              }
            }
          }
        }

        // Final save to localStorage
        setSessions((prev) => {
          const finalSession = prev.find((s) => s.id === updatedSession.id);
          if (finalSession) {
            chatStorage.saveSession(finalSession);
          }
          return prev;
        });
      } catch (err: any) {
        if (err.name !== "AbortError") {
          console.error("Streaming error:", err);
          const errorMessage =
            "Sorry, I encountered an issue generating a response. Please try asking again.";
          setSessions((prev) =>
            prev.map((s) => {
              if (s.id !== updatedSession.id) return s;
              return {
                ...s,
                messages: s.messages.map((m) =>
                  m.id === assistantMessageId
                    ? { ...m, content: errorMessage, isCallout: true }
                    : m
                ),
              };
            })
          );
        }
      } finally {
        setIsStreaming(false);
        setStatusText("");
        abortControllerRef.current = null;
      }
    },
    [activeSession, isStreaming]
  );

  const regenerateMessage = useCallback(
    async (messageId: string) => {
      if (!activeSession || isStreaming) return;
      const msgIndex = activeSession.messages.findIndex((m) => m.id === messageId);
      if (msgIndex <= 0) return;

      const previousUserMessage = activeSession.messages[msgIndex - 1];
      if (previousUserMessage.role !== "user") return;

      // Slice messages up to the user message
      const prunedMessages = activeSession.messages.slice(0, msgIndex);
      const prunedSession = { ...activeSession, messages: prunedMessages };
      setSessions((prev) =>
        prev.map((s) => (s.id === prunedSession.id ? prunedSession : s))
      );

      await sendMessage(previousUserMessage.content);
    },
    [activeSession, isStreaming, sendMessage]
  );

  const editAndResend = useCallback(
    async (messageId: string, newContent: string) => {
      if (!activeSession || isStreaming) return;
      const msgIndex = activeSession.messages.findIndex((m) => m.id === messageId);
      if (msgIndex < 0) return;

      // Slice messages before the edited user message
      const prunedMessages = activeSession.messages.slice(0, msgIndex);
      const prunedSession = { ...activeSession, messages: prunedMessages };
      setSessions((prev) =>
        prev.map((s) => (s.id === prunedSession.id ? prunedSession : s))
      );

      await sendMessage(newContent);
    },
    [activeSession, isStreaming, sendMessage]
  );

  return (
    <LexiChatContext.Provider
      value={{
        isOpen,
        mode,
        setMode,
        toggleOpen,
        openChat,
        closeChat,
        sessions,
        activeSession,
        activeSessionId,
        isStreaming,
        statusText,
        sendMessage,
        stopStreaming,
        createNewSession,
        selectSession,
        deleteSession,
        renameSession,
        pinSession,
        regenerateMessage,
        editAndResend,
        composerRef,
        launcherRef,
      }}
    >
      {children}
    </LexiChatContext.Provider>
  );
};

export const useLexiChat = () => {
  const context = useContext(LexiChatContext);
  if (!context) {
    throw new Error("useLexiChat must be used within a LexiChatProvider");
  }
  return context;
};
