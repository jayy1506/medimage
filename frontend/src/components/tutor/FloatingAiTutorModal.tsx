"use client";

import React, { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { 
  Bot, 
  Send, 
  Plus, 
  X, 
  Maximize2, 
  Minimize2, 
  Columns, 
  Square, 
  RotateCcw, 
  Sparkles, 
  AlertCircle, 
  Bookmark, 
  ChevronDown, 
  ChevronRight, 
  Trash2, 
  Clock, 
  MessageSquare,
  HelpCircle,
  ExternalLink
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { MathView } from "@/components/ui/MathView";
import { FormattedAiMessage } from "@/components/tutor/FormattedAiMessage";
import { MedAiIcon } from "@/components/ui/MedAiIcon";

interface Citation {
  topic_title: string;
  section_number: number;
  reference_code: string;
}

interface ChatMessage {
  id: string;
  sender: "user" | "tutor";
  text: string;
  isRelevant?: boolean;
  citations?: Citation[];
  timestamp: string;
}

interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  updatedAt: string;
}

const DEFAULT_SESSIONS: ChatSession[] = [
  {
    id: "session-1",
    title: "CT Hounsfield Units & Windowing",
    updatedAt: "Just now",
    messages: [
      {
        id: "msg-1",
        sender: "user",
        text: "What are the physical Hounsfield Unit values for air, water, and bone?",
        timestamp: "10:30 AM"
      },
      {
        id: "msg-2",
        sender: "tutor",
        text: "In X-ray Computed Tomography, the Hounsfield Unit (HU) is a normalized linear attenuation metric defined relative to pure distilled water:\n\n$$\\text{HU} = 1000 \\times \\frac{\\mu - \\mu_{\\text{water}}}{\\mu_{\\text{water}}}$$\n\nStandard clinical benchmark values:\n- **Air:** $-1000\\text{ HU}$ (minimal attenuation)\n- **Water:** $0\\text{ HU}$ (calibration standard at STP)\n- **Soft Tissue / Brain:** $+20\\text{ to }+45\\text{ HU}$\n- **Acute Blood:** $+55\\text{ to }+75\\text{ HU}$\n- **Dense Cortical Bone:** $+1000\\text{ to }+3000\\text{ HU}$\n\nFor diagnostic display, monitor windowing maps a chosen Window Width (WW) and Window Level (WL) to the 8-bit 256 grayscale levels: $\\text{Range} = [\\text{WL} - \\frac{\\text{WW}}{2}, \\text{WL} + \\frac{\\text{WW}}{2}]$.",
        isRelevant: true,
        citations: [
          {
            topic_title: "Computed Tomography & Sinograms",
            section_number: 2,
            reference_code: "AIDS-12605.1"
          }
        ],
        timestamp: "10:31 AM"
      }
    ]
  },
  {
    id: "session-2",
    title: "Beer-Lambert Law & Half-Value Layer",
    updatedAt: "Yesterday",
    messages: [
      {
        id: "msg-3",
        sender: "user",
        text: "Explain the Beer-Lambert law and how HVL is derived.",
        timestamp: "Yesterday"
      },
      {
        id: "msg-4",
        sender: "tutor",
        text: "The Beer-Lambert Law governs the monochromatic exponential attenuation of a photon beam through a homogeneous absorber of thickness $x$:\n\n$$I(x) = I_0 \\, e^{-\\mu x}$$\n\n**Half-Value Layer (HVL) Derivation:**\nThe HVL is defined as the thickness where transmitted intensity equals half of incident intensity: $I(\\text{HVL}) = \\frac{I_0}{2}$.\n\n$$\\frac{I_0}{2} = I_0 \\, e^{-\\mu \\cdot \\text{HVL}} \\implies \\text{HVL} = \\frac{\\ln(2)}{\\mu} \\approx \\frac{0.693}{\\mu}$$\n\nDense cortical bone with high effective atomic number ($Z \\approx 13.8$) has a large attenuation coefficient $\\mu$, yielding a very small HVL compared to soft tissue.",
        isRelevant: true,
        citations: [
          {
            topic_title: "Attenuation & Exponential Imaging Laws",
            section_number: 3,
            reference_code: "AIDS-12605.1"
          }
        ],
        timestamp: "Yesterday"
      }
    ]
  }
];

const SUGGESTED_PROMPTS = [
  "Explain Beer-Lambert Law & HVL",
  "How does CT Windowing (WW/WL) work?",
  "Difference between T1 and T2 MRI relaxation",
  "Why does U-Net have skip connections?",
  "Explain Radon Transform and Sinograms",
  "What is the Nyquist sampling criterion?"
];

type WindowSize = "small" | "half" | "full";

export default function FloatingAiTutorModal() {
  const pathname = usePathname();
  const { user, profile } = useAuth();
  
  const [isOpen, setIsOpen] = useState(false);
  const [windowSize, setWindowSize] = useState<WindowSize>("small");
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string>("");
  const [showHistoryDrawer, setShowHistoryDrawer] = useState(false);
  const [inputPrompt, setInputPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Derive candidate student name
  const candidateName =
    (typeof window !== "undefined" ? sessionStorage.getItem("gyaanlab_username") : null) ||
    profile?.username ||
    profile?.full_name || 
    (user?.displayName) || 
    (user?.email ? user.email.split("@")[0].replace(/[0-9]/g, "").replace(/\./g, " ").trim().split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ") : "Scholar") || "Scholar";


  // Load chat history from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("medimage_ai_tutor_sessions");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setSessions(parsed);
            setActiveSessionId(parsed[0].id);
            return;
          }
        } catch (e) {}
      }
      setSessions(DEFAULT_SESSIONS);
      setActiveSessionId(DEFAULT_SESSIONS[0].id);
    }
  }, []);

  const saveSessions = (updated: ChatSession[]) => {
    setSessions(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("medimage_ai_tutor_sessions", JSON.stringify(updated));
    }
  };

  const activeSession = sessions.find((s) => s.id === activeSessionId) || sessions[0];

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [activeSession?.messages, isGenerating, isOpen]);

  const handleCreateNewChat = () => {
    const newSession: ChatSession = {
      id: `session-${Date.now()}`,
      title: "New Discussion",
      messages: [],
      updatedAt: "Just now"
    };
    const updated = [newSession, ...sessions];
    saveSessions(updated);
    setActiveSessionId(newSession.id);
    setShowHistoryDrawer(false);
  };

  const handleDeleteSession = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = sessions.filter((s) => s.id !== id);
    if (updated.length === 0) {
      handleCreateNewChat();
    } else {
      saveSessions(updated);
      if (activeSessionId === id) {
        setActiveSessionId(updated[0].id);
      }
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const prompt = (textToSend || inputPrompt).trim();
    if (!prompt || isGenerating) return;

    setInputPrompt("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: prompt,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    let targetSessionId = activeSessionId;
    let currentSession = sessions.find((s) => s.id === targetSessionId);

    let updatedTitle = currentSession?.title || "Discussion";
    if (currentSession && currentSession.messages.length === 0) {
      updatedTitle = prompt.length > 28 ? prompt.slice(0, 28) + "..." : prompt;
    }

    const updatedSessions = sessions.map((s) => {
      if (s.id === targetSessionId) {
        return {
          ...s,
          title: updatedTitle,
          messages: [...s.messages, userMsg],
          updatedAt: "Just now"
        };
      }
      return s;
    });

    saveSessions(updatedSessions);
    setIsGenerating(true);

    try {
      const API_BASE = typeof window !== "undefined" ? "/api/v1" : (process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1");
      const res = await fetch(`${API_BASE}/tutor/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: prompt,
          topic_title: "Medical Text & Image Processing (AIDS 12605.1)"
        })
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const data = await res.json();

      const tutorMsg: ChatMessage = {
        id: `tutor-${Date.now()}`,
        sender: "tutor",
        text: data.response || "No response received.",
        isRelevant: data.is_relevant !== undefined ? data.is_relevant : true,
        citations: data.citations || [],
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };

      const finalSessions = sessions.map((s) => {
        if (s.id === targetSessionId) {
          return {
            ...s,
            title: updatedTitle,
            messages: [...s.messages, userMsg, tutorMsg],
            updatedAt: "Just now"
          };
        }
        return s;
      });
      saveSessions(finalSessions);
    } catch (err) {
      console.error("AI Tutor floating modal request error:", err);

      const lower = prompt.toLowerCase();
      let fallbackText = "";
      let isRelevant = true;

      if (lower.includes("cricket") || lower.includes("ipl") || lower.includes("recipe") || lower.includes("movie") || lower.includes("bitcoin")) {
        fallbackText = "I am strictly scoped to assist only with Medical Text and Image Processing (AIDS 12605.1) at Adani Institute of Higher Education and Research. Questions outside of medical imaging physics, DICOM standards, 2D filtering, tomographic reconstruction, and clinical NLP are not permitted.";
        isRelevant = false;
      } else if (lower.includes("beer") || lower.includes("hvl") || lower.includes("attenuation")) {
        fallbackText = "The Beer-Lambert Law states that $I(x) = I_0 \\, e^{-\\mu x}$. Half-Value Layer is $\\text{HVL} = \\frac{\\ln(2)}{\\mu} \\approx \\frac{0.693}{\\mu}$. High-atomic number absorbers like cortical bone have higher $\\mu$ and smaller HVL.";
      } else {
        fallbackText = `In accordance with the AIDS 12605.1 curriculum for Medical Image Processing, diagnostic accuracy depends on spatial attenuation coefficients, discrete matrix sampling, and preserving contrast-to-noise ratio (CNR) without introducing irreversible aliasing artifacts.`;
      }

      const fallbackMsg: ChatMessage = {
        id: `tutor-${Date.now()}`,
        sender: "tutor",
        text: fallbackText,
        isRelevant: isRelevant,
        citations: isRelevant ? [{ topic_title: "Medical Image Processing", section_number: 1, reference_code: "AIDS-12605.1" }] : [],
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };

      const finalSessions = sessions.map((s) => {
        if (s.id === targetSessionId) {
          return {
            ...s,
            title: updatedTitle,
            messages: [...s.messages, userMsg, fallbackMsg],
            updatedAt: "Just now"
          };
        }
        return s;
      });
      saveSessions(finalSessions);
    } finally {
      setIsGenerating(false);
    }
  };

  // Window styling based on windowSize
  const getContainerClasses = () => {
    switch (windowSize) {
      case "full":
        return "fixed inset-2 sm:inset-4 z-50 rounded-2xl shadow-2xl border border-slate-200 bg-white flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200";
      case "half":
        return "fixed top-3 right-3 bottom-3 z-50 w-[95vw] sm:w-[640px] md:w-[50vw] rounded-2xl shadow-2xl border border-slate-200 bg-white flex flex-col overflow-hidden animate-in fade-in slide-in-from-right duration-200";
      case "small":
      default:
        return "fixed bottom-5 right-5 z-50 w-[94vw] sm:w-[420px] h-[580px] max-h-[85vh] rounded-2xl shadow-2xl border border-slate-200 bg-white flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150";
    }
  };

  // Only display clinical AI tutor when user is logged in
  if (!user && !profile) {
    return null;
  }

  // Hide on login or dedicated tutor page
  if (pathname === "/login" || pathname === "/tutor") {
    return null;
  }

  return (
    <>
      {/* FLOATING TRIGGER ICON IN BOTTOM-RIGHT CORNER */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-20 right-3 sm:bottom-6 sm:right-6 z-50 flex items-center justify-center w-12 h-12 rounded-full bg-white hover:bg-slate-50 text-[#B82662] border-2 border-[#B82662] shadow-[0_4px_16px_rgba(184,38,98,0.25)] hover:shadow-[0_6px_20px_rgba(184,38,98,0.4)] transition-all transform hover:scale-110 active:scale-95 touch-manipulation cursor-pointer group select-none"
          title="Open Lexi AI Tutor"
        >
          <span className="font-extrabold text-xs sm:text-sm tracking-tight text-[#B82662]">
            lexi
          </span>
        </button>
      )}

      {/* FLOATING WHITE MODAL WINDOW */}
      {isOpen && (
        <div className={getContainerClasses()}>
          {/* WINDOW HEADER (Pure Adani White Theme with Controls) */}
          <header className="px-4 py-3 border-b border-slate-200 bg-white flex items-center justify-between flex-shrink-0 select-none">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-white border border-adani-pink/30 flex items-center justify-center text-adani-pink font-black text-xs flex-shrink-0 shadow-xs">
                Lexi
              </div>
              <div className="truncate">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-slate-900 truncate">
                    {activeSession?.title || "Lexi • Clinical AI Tutor"}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200 hidden sm:inline">
                    Online
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 block truncate">
                  AIDS 12605.1 • Adani University
                </span>
              </div>
            </div>

            {/* Window Action & Size Toggle Controls */}
            <div className="flex items-center gap-1">
              {/* History Drawer Toggle */}
              <button
                onClick={() => setShowHistoryDrawer(!showHistoryDrawer)}
                className={`p-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  showHistoryDrawer
                    ? "bg-sky-50 text-adani-cyan"
                    : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                }`}
                title="Chat History Sessions"
              >
                <Clock className="w-3.5 h-3.5" />
              </button>

              {/* New Chat */}
              <button
                onClick={handleCreateNewChat}
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                title="Start New Chat"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>

              <div className="h-3.5 w-px bg-slate-200 mx-0.5" />

              {/* Small Window Mode */}
              <button
                onClick={() => setWindowSize("small")}
                className={`p-1.5 rounded-lg transition-colors ${
                  windowSize === "small"
                    ? "bg-slate-200 text-slate-900 font-bold"
                    : "text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                }`}
                title="Small Floating Popup"
              >
                <Square className="w-3.5 h-3.5" />
              </button>

              {/* Half-Page Split Mode */}
              <button
                onClick={() => setWindowSize("half")}
                className={`p-1.5 rounded-lg transition-colors ${
                  windowSize === "half"
                    ? "bg-slate-200 text-slate-900 font-bold"
                    : "text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                }`}
                title="Half-Page Split Mode"
              >
                <Columns className="w-3.5 h-3.5" />
              </button>

              {/* Full-Page Maximize Mode */}
              <button
                onClick={() => setWindowSize("full")}
                className={`p-1.5 rounded-lg transition-colors ${
                  windowSize === "full"
                    ? "bg-slate-200 text-slate-900 font-bold"
                    : "text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                }`}
                title="Full Page Maximized"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>

              <div className="h-3.5 w-px bg-slate-200 mx-0.5" />

              {/* Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                title="Close AI Tutor"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </header>

          {/* MAIN BODY AREA WITH OPTIONAL HISTORY DRAWER */}
          <div className="flex-1 flex overflow-hidden relative bg-white">
            {/* Slide-in History Drawer */}
            {showHistoryDrawer && (
              <div className="w-64 border-r border-slate-200 bg-slate-50/90 flex flex-col z-20 overflow-hidden flex-shrink-0 animate-in slide-in-from-left duration-150">
                <div className="p-2.5 border-b border-slate-200 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">Chat Sessions</span>
                  <button
                    onClick={handleCreateNewChat}
                    className="px-2 py-1 rounded-md text-[11px] font-bold text-adani-cyan bg-sky-50 hover:bg-sky-100 border border-sky-100 flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> New
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-2 space-y-1">
                  {sessions.map((s) => {
                    const isActive = s.id === activeSessionId;
                    return (
                      <div
                        key={s.id}
                        onClick={() => {
                          setActiveSessionId(s.id);
                          setShowHistoryDrawer(false);
                        }}
                        className={`group p-2 rounded-xl text-xs flex items-center justify-between cursor-pointer transition-all ${
                          isActive
                            ? "bg-white border border-slate-200 shadow-xs font-bold text-slate-900"
                            : "text-slate-600 hover:bg-white/70"
                        }`}
                      >
                        <span className="truncate pr-1 text-[11px]">{s.title}</span>
                        <button
                          onClick={(e) => handleDeleteSession(s.id, e)}
                          className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-500 p-0.5 rounded transition-opacity"
                          title="Delete Chat"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    );
                  })}
                </div>

                <div className="p-2 border-t border-slate-200 text-[10px] text-slate-400 text-center">
                  Saved locally in browser
                </div>
              </div>
            )}

            {/* CHAT MESSAGES CANVAS */}
            <div className="flex-1 flex flex-col h-full overflow-hidden bg-white">
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {(!activeSession || activeSession.messages.length === 0) ? (
                  /* EMPTY STATE - ADANI WHITE THEME */
                  <div className="flex flex-col items-center justify-center min-h-[70%] text-center space-y-4 my-auto p-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-50 via-purple-50 to-pink-50 border border-slate-200 flex items-center justify-center text-adani-cyan shadow-sm">
                      <Sparkles className="w-6 h-6 text-adani-cyan" />
                    </div>

                    <div className="space-y-1">
                      <h3 className="text-sm sm:text-base font-black text-slate-900">
                        Hello, {candidateName}
                      </h3>
                      <p className="text-xs text-slate-500 max-w-sm mx-auto">
                        Ask any question regarding medical imaging physics, CT/MRI math, DICOM, or segmentation algorithms.
                      </p>
                    </div>

                    {/* Quick Suggestion Chips */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-md pt-2 text-left">
                      {SUGGESTED_PROMPTS.map((promptText, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSendMessage(promptText)}
                          className="p-2.5 rounded-xl bg-slate-50 hover:bg-sky-50/60 border border-slate-200/90 text-[11px] font-semibold text-slate-700 hover:text-adani-navy hover:border-adani-cyan/60 transition-all text-left flex items-center justify-between group"
                        >
                          <span className="truncate">{promptText}</span>
                          <ChevronRight className="w-3 h-3 text-slate-400 group-hover:text-adani-cyan group-hover:translate-x-0.5 transition-all flex-shrink-0 ml-1" />
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  /* MESSAGE BUBBLES */
                  activeSession.messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${
                        msg.sender === "user" ? "items-end" : "items-start"
                      }`}
                    >
                      {msg.sender === "user" ? (
                        /* User message bubble */
                        <div className="max-w-[85%] rounded-2xl px-3.5 py-2.5 bg-gradient-to-r from-adani-cyan to-adani-purple text-white text-xs sm:text-sm font-medium shadow-sm leading-relaxed">
                          {msg.text}
                        </div>
                      ) : (
                        /* Tutor message bubble */
                        <div className="w-full flex items-start gap-2.5">
                          <div className="w-6 h-6 rounded-lg bg-sky-50 border border-sky-100 flex items-center justify-center text-adani-cyan font-bold text-xs flex-shrink-0 mt-0.5 shadow-xs">
                            ✦
                          </div>

                          <div className="flex-1 space-y-2 max-w-[92%]">
                            {/* Off-course scope alert */}
                            {msg.isRelevant === false && (
                              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-bold">
                                <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                                <span>Not Relevant to Course Scope (AIDS 12605.1)</span>
                              </div>
                            )}

                            {/* Response content */}
                            <div className="bg-slate-50/80 p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-xs">
                              <FormattedAiMessage content={msg.text} theme="light" />

                              {/* Citations badge */}
                              {msg.citations && msg.citations.length > 0 && (
                                <div className="pt-2 border-t border-slate-200/80 flex flex-wrap items-center gap-1.5 mt-2">
                                  {msg.citations.map((c, cIdx) => (
                                    <span
                                      key={cIdx}
                                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-white text-adani-navy border border-slate-200 shadow-2xs"
                                    >
                                      <Bookmark className="w-3 h-3 text-adani-cyan" />
                                      {c.topic_title} • Sec {c.section_number}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}

                {/* Generating animated indicator */}
                {isGenerating && (
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-lg bg-sky-50 border border-sky-100 text-adani-cyan flex items-center justify-center font-bold text-xs flex-shrink-0 animate-pulse">
                      ✦
                    </div>
                    <div className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500 flex items-center gap-2">
                      <span>Formulating response</span>
                      <span className="flex space-x-1">
                        <span className="w-1.5 h-1.5 bg-adani-cyan rounded-full animate-bounce [animation-delay:-0.3s]" />
                        <span className="w-1.5 h-1.5 bg-adani-cyan rounded-full animate-bounce [animation-delay:-0.15s]" />
                        <span className="w-1.5 h-1.5 bg-adani-cyan rounded-full animate-bounce" />
                      </span>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* BOTTOM INPUT BAR - PURE ADANI WHITE PALETTE */}
              <div className="p-3 border-t border-slate-200 bg-white">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-1.5 focus-within:border-adani-cyan focus-within:bg-white transition-all shadow-xs">
                  <textarea
                    ref={textareaRef}
                    rows={1}
                    value={inputPrompt}
                    onChange={(e) => {
                      setInputPrompt(e.target.value);
                      e.target.style.height = "auto";
                      e.target.style.height = `${Math.min(e.target.scrollHeight, 100)}px`;
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    placeholder="Ask about X-rays, CT HU values, MRI sequences, U-Net..."
                    className="w-full bg-transparent text-xs text-slate-900 placeholder:text-slate-400 resize-none px-2 py-1 focus:outline-none max-h-28"
                  />

                  <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 mt-1">
                    <span className="text-[10px] text-slate-400 font-medium pl-1">
                      Gemini 3.5 Flash • Press Enter
                    </span>

                    <button
                      onClick={() => handleSendMessage()}
                      disabled={!inputPrompt.trim() || isGenerating}
                      className="p-1.5 rounded-lg bg-gradient-to-r from-adani-cyan to-adani-purple hover:opacity-95 disabled:opacity-30 disabled:pointer-events-none text-white font-bold transition-all shadow-xs"
                      title="Send Question"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
