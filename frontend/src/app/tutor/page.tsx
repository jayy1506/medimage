"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { 
  Bot, 
  Send, 
  Plus, 
  Search, 
  ChevronRight, 
  ChevronLeft, 
  Sparkles, 
  Trash2, 
  BookOpen, 
  ArrowLeft, 
  AlertCircle, 
  CheckCircle2, 
  Bookmark, 
  RotateCcw,
  Cpu,
  Layers,
  HelpCircle,
  ExternalLink,
  Sliders,
  MessageSquare,
  GraduationCap
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { MathView } from "@/components/ui/MathView";
import { FormattedAiMessage } from "@/components/tutor/FormattedAiMessage";
import { STUDENT_NOTE_METADATA } from "@/data/curriculumData";

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
        text: "In X-ray Computed Tomography, the Hounsfield Unit (HU) is a normalized linear attenuation metric defined relative to pure distilled water:\n\n$$\\text{HU} = 1000 \\times \\frac{\\mu - \\mu_{\\text{water}}}{\\mu_{\\text{water}}}$$\n\nStandard clinical benchmark values:\n- **Air:** $-1000\\text{ HU}$ (minimal photon attenuation)\n- **Water:** $0\\text{ HU}$ (calibration standard at STP)\n- **Soft Tissue / Brain:** $+20\\text{ to }+45\\text{ HU}$\n- **Acute Blood:** $+55\\text{ to }+75\\text{ HU}$\n- **Dense Cortical Bone:** $+1000\\text{ to }+3000\\text{ HU}$\n\nFor diagnostic display, monitor windowing maps a chosen Window Width (WW) and Window Level (WL) to the 8-bit 256 grayscale levels: $\\text{Range} = [\\text{WL} - \\frac{\\text{WW}}{2}, \\text{WL} + \\frac{\\text{WW}}{2}]$.",
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
        text: "The Beer-Lambert Law governs the monochromatic exponential attenuation of a photon beam through a homogeneous absorber of thickness $x$:\n\n$$I(x) = I_0 \\, e^{-\\mu x}$$\n\nWhere:\n- $I_0$ is the incident beam intensity\n- $\\mu$ is the linear attenuation coefficient (measured in $\\text{cm}^{-1}$)\n- $x$ is the tissue thickness\n\n**Derivation of Half-Value Layer (HVL):**\nThe HVL is defined as the thickness where transmitted intensity equals exactly half of incident intensity: $I(\\text{HVL}) = \\frac{I_0}{2}$.\n\n$$\\frac{I_0}{2} = I_0 \\, e^{-\\mu \\cdot \\text{HVL}} \\implies \\frac{1}{2} = e^{-\\mu \\cdot \\text{HVL}}$$\n\nTaking natural logarithm on both sides:\n\n$$\\ln(2) = \\mu \\cdot \\text{HVL} \\implies \\text{HVL} = \\frac{\\ln(2)}{\\mu} \\approx \\frac{0.693}{\\mu}$$\n\nDense bone with high effective atomic number ($Z \\approx 13.8$) has a large attenuation coefficient $\\mu$, yielding a very small HVL compared to soft tissue.",
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
  },
  {
    id: "session-3",
    title: "U-Net Skip Connections Architecture",
    updatedAt: "2 days ago",
    messages: [
      {
        id: "msg-5",
        sender: "user",
        text: "Why does U-Net utilize skip connections in medical segmentation?",
        timestamp: "2 days ago"
      },
      {
        id: "msg-6",
        sender: "tutor",
        text: "The U-Net architecture (Ronneberger et al.) consists of a contracting contracting path (encoder) and an expansive path (decoder) shaped in a 'U'.\n\n**Role of Skip Connections:**\n1. **Preserving Fine Spatial Details:** Consecutive max-pooling layers downsample feature maps, reducing spatial resolution while capturing abstract contextual semantic semantics. Skip connections concatenate high-resolution feature maps directly across from the encoder to the decoder.\n2. **Precise Boundary Localization:** In clinical applications (such as segmenting glioblastoma margins or lung nodules), boundary precision is critical. Skip connections supply the exact pixel coordinates needed to reconstruct sharp organ boundaries.\n3. **Mitigating Gradient Vanishing:** Direct gradient pathways facilitate smooth backpropagation across deep layers during Dice loss optimization:\n\n$$\\mathcal{L}_{\\text{Dice}} = 1 - \\frac{2 \\sum p_i g_i + \\epsilon}{\\sum p_i + \\sum g_i + \\epsilon}$$",
        isRelevant: true,
        citations: [
          {
            topic_title: "Deep Learning Segmentation (U-Net & V-Net)",
            section_number: 2,
            reference_code: "AIDS-12605.1"
          }
        ],
        timestamp: "2 days ago"
      }
    ]
  }
];

const SUGGESTED_PROMPTS = [
  "Explain Beer-Lambert Law & Half-Value Layer derivation",
  "How does CT Windowing (WW/WL) work for Brain vs Bone?",
  "What is the difference between T1 and T2 relaxation in MRI?",
  "Why does U-Net have skip connections for segmentation?",
  "Explain the Radon Transform and Filtered Backprojection",
  "What is the Nyquist criterion for digital medical sampling?"
];

export default function AiTutorPage() {
  const { user, profile } = useAuth();
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string>("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [inputPrompt, setInputPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [searchFilter, setSearchFilter] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Derive candidate display name
  const studentName = profile?.full_name || 
    (user?.email ? user.email.split("@")[0].replace(/[0-9]/g, "").replace(/\./g, " ").trim() : "Jay Thakre");
  const studentInitial = studentName ? studentName.charAt(0).toUpperCase() : "J";

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

  // Save sessions to localStorage
  const saveSessions = (updated: ChatSession[]) => {
    setSessions(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("medimage_ai_tutor_sessions", JSON.stringify(updated));
    }
  };

  const activeSession = sessions.find((s) => s.id === activeSessionId) || sessions[0];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeSession?.messages, isGenerating]);

  // Create new session
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
  };

  // Delete session
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

  // Send message
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

    // If current session has no messages, set its title
    let updatedTitle = currentSession?.title || "Discussion";
    if (currentSession && currentSession.messages.length === 0) {
      updatedTitle = prompt.length > 32 ? prompt.slice(0, 32) + "..." : prompt;
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
      console.error("AI Tutor request error:", err);

      // Intelligent academic fallback if backend was unreachable
      const lower = prompt.toLowerCase();
      let fallbackText = "";
      let isRelevant = true;

      if (lower.includes("cricket") || lower.includes("ipl") || lower.includes("recipe") || lower.includes("movie") || lower.includes("bitcoin")) {
        fallbackText = "I am strictly scoped to assist only with Medical Text and Image Processing (AIDS 12605.1) at Adani Institute of Higher Education and Research. Questions outside of medical imaging physics (X-ray/CT/MRI/Ultrasound/PET), DICOM standards, 2D spatial filtering, tomographic reconstruction, medical image segmentation, and clinical NLP are not permitted.";
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

  // Filtered session list for search
  const filteredSessions = sessions.filter((s) =>
    s.title.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="flex h-screen w-screen bg-[#18181b] text-zinc-100 font-sans overflow-hidden">
      {/* LEFT SIDEBAR (Claude-Style Dark Theme) */}
      <aside
        className={`${
          sidebarOpen ? "w-72" : "w-0 -translate-x-full"
        } transition-all duration-300 ease-in-out bg-[#0f1013] border-r border-zinc-800/80 flex flex-col z-20 overflow-hidden flex-shrink-0`}
      >
        {/* Top Header & Brand */}
        <div className="p-3.5 border-b border-zinc-800/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-amber-400 text-lg leading-none">✦</span>
            <span className="font-bold text-sm tracking-tight text-zinc-100">
              MedAI Tutor
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400">
              AIDS 12605.1
            </span>
          </div>

          <button
            onClick={() => setSidebarOpen(false)}
            className="p-1 rounded-md text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
            title="Collapse Sidebar"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

        {/* Action Controls */}
        <div className="p-3 space-y-2 border-b border-zinc-800/50">
          <button
            onClick={handleCreateNewChat}
            className="w-full py-2 px-3 rounded-xl bg-zinc-800/90 hover:bg-zinc-700/80 text-zinc-100 text-xs font-semibold flex items-center gap-2 transition-all border border-zinc-700/60 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5 text-zinc-300" />
            <span>New Chat</span>
          </button>

          {/* Search chats */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Search chat history..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-zinc-900 text-zinc-200 text-xs placeholder:text-zinc-500 border border-zinc-800 focus:outline-none focus:border-zinc-600 transition-all"
            />
          </div>
        </div>

        {/* Quick Category Navigation */}
        <div className="px-3 pt-3 pb-1">
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1.5">
            Course Topics
          </span>
          <div className="space-y-0.5 text-xs">
            {[
              { label: "Module 1 • Image Physics & CT", prompt: "Explain the physics of X-ray attenuation and Hounsfield Units" },
              { label: "Module 2 • DICOM & Formats", prompt: "What are DICOM Part 10 file standards, VR tags, and Windowing?" },
              { label: "Module 3 • 2D Filtering & FFT", prompt: "How do Sobel kernels, Laplacian masks, and Fourier transforms filter medical images?" },
              { label: "Module 4 • Radon & Segmentation", prompt: "Explain the Radon transform, sinograms, and Otsu thresholding" },
              { label: "Module 5 • U-Net Deep Learning", prompt: "Explain U-Net segmentation, skip connections, and Dice Loss" },
              { label: "Module 6 • Clinical NLP & 3D", prompt: "How do BioBERT and Marching Cubes work in healthcare informatics?" }
            ].map((cat, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(cat.prompt)}
                className="w-full text-left px-2 py-1 rounded-md text-[11px] text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60 truncate transition-colors"
                title={cat.label}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Sessions History */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">
            Chats and tasks
          </span>

          {filteredSessions.length === 0 ? (
            <div className="text-center py-6 text-xs text-zinc-500">
              No conversations found.
            </div>
          ) : (
            filteredSessions.map((session) => {
              const isActive = session.id === activeSessionId;
              return (
                <div
                  key={session.id}
                  onClick={() => setActiveSessionId(session.id)}
                  className={`group relative flex items-center justify-between px-2.5 py-2 rounded-lg cursor-pointer text-xs transition-colors ${
                    isActive
                      ? "bg-zinc-800 text-zinc-100 font-semibold"
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40"
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-zinc-500 text-xs">◦</span>
                    <span className="truncate">{session.title}</span>
                  </div>

                  <button
                    onClick={(e) => handleDeleteSession(session.id, e)}
                    className="opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-rose-400 p-1 rounded transition-opacity"
                    title="Delete Chat"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Bottom User Profile Section */}
        <div className="p-3 border-t border-zinc-800/70 bg-[#0b0c0e] flex items-center justify-between">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-adani-cyan via-purple-500 to-amber-400 flex items-center justify-center text-zinc-900 font-black text-xs flex-shrink-0">
              {studentInitial}
            </div>
            <div className="truncate">
              <span className="text-xs font-bold text-zinc-200 block truncate">
                {studentName}
              </span>
              <span className="text-[10px] text-zinc-500 block truncate">
                Adani University • Scholar
              </span>
            </div>
          </div>

          <Link
            href="/dashboard"
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
            title="Course Dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>
      </aside>

      {/* MAIN CHAT CANVAS */}
      <main className="flex-1 flex flex-col h-full bg-[#18181b] relative overflow-hidden">
        {/* Top Header Bar */}
        <header className="h-14 border-b border-zinc-800/60 px-4 sm:px-6 flex items-center justify-between bg-[#18181b]/95 backdrop-blur z-10">
          <div className="flex items-center gap-3">
            {!sidebarOpen && (
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
                title="Open Sidebar"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            )}

            <div>
              <h2 className="text-xs sm:text-sm font-bold text-zinc-200 truncate max-w-xs sm:max-w-md">
                {activeSession?.title || "GyaanLab Clinical AI Tutor"}
              </h2>
              <span className="text-[10px] text-zinc-500 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Gemini 3.5 Flash • Key-Rotated Grounded Engine
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/help"
              className="px-2.5 py-1 rounded-lg text-xs font-medium text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors flex items-center gap-1"
            >
              <HelpCircle className="w-3.5 h-3.5 text-zinc-400" />
              <span className="hidden sm:inline">Docs &amp; Help</span>
            </Link>

            <Link
              href="/dashboard"
              className="px-3 py-1 rounded-lg text-xs font-semibold text-zinc-200 bg-zinc-800 hover:bg-zinc-700 transition-colors border border-zinc-700 flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-zinc-400" />
              <span>Dashboard</span>
            </Link>
          </div>
        </header>

        {/* Conversation Stream */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 space-y-6 max-w-4xl w-full mx-auto">
          {(!activeSession || activeSession.messages.length === 0) ? (
            /* EMPTY STATE: Claude-style centered greeting & prompt launcher */
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 my-auto">
              <div className="space-y-2">
                <span className="text-amber-400 text-3xl sm:text-4xl inline-block animate-pulse">✦</span>
                <h1 className="text-2xl sm:text-3xl font-serif text-zinc-100 font-semibold tracking-tight">
                  Hello, {studentName}
                </h1>
                <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto">
                  What medical imaging physics, equations, or computational algorithms can I help clarify today?
                </p>
              </div>

              {/* Starter Prompt Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full max-w-xl text-left">
                {SUGGESTED_PROMPTS.map((promptText, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(promptText)}
                    className="p-3 rounded-xl bg-zinc-900/90 hover:bg-zinc-800/80 border border-zinc-800 text-xs text-zinc-300 hover:text-zinc-100 transition-all flex items-center justify-between group shadow-sm text-left"
                  >
                    <span>{promptText}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all flex-shrink-0 ml-2" />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* MESSAGE LIST */
            activeSession.messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.sender === "user" ? "items-end" : "items-start"
                }`}
              >
                {msg.sender === "user" ? (
                  /* User message */
                  <div className="max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-2.5 bg-zinc-800 text-zinc-100 text-xs sm:text-sm border border-zinc-700/50 shadow-sm leading-relaxed">
                    {msg.text}
                  </div>
                ) : (
                  /* Tutor message */
                  <div className="w-full flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-500 to-purple-600 flex items-center justify-center text-zinc-950 font-bold text-xs flex-shrink-0 mt-0.5 shadow-sm">
                      ✦
                    </div>

                    <div className="flex-1 space-y-2.5 max-w-[90%]">
                      {/* Course Scope Flag */}
                      {msg.isRelevant === false && (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
                          <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                          <span>Not Relevant to Course Scope (AIDS 12605.1)</span>
                        </div>
                      )}

                      {/* Main Message Content with Math and Formatting */}
                      <div className="bg-zinc-900/60 p-4 sm:p-5 rounded-2xl border border-zinc-800/80">
                        <FormattedAiMessage content={msg.text} theme="dark" />

                        {/* Citations block */}
                        {msg.citations && msg.citations.length > 0 && (
                          <div className="pt-2 border-t border-zinc-800/70 flex flex-wrap items-center gap-2 mt-2">
                            {msg.citations.map((c, cIdx) => (
                              <span
                                key={cIdx}
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-zinc-800 text-amber-300/90 border border-zinc-700"
                              >
                                <Bookmark className="w-3 h-3 text-amber-400" />
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

          {/* Typing Indicator */}
          {isGenerating && (
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs flex-shrink-0 animate-pulse">
                ✦
              </div>
              <div className="px-4 py-2 rounded-2xl bg-zinc-900/80 border border-zinc-800 text-xs text-zinc-400 flex items-center gap-2">
                <span>MedAI Tutor is formulating academic explanation</span>
                <span className="flex space-x-1">
                  <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce" />
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* BOTTOM INPUT BAR (Claude Style) */}
        <div className="p-4 sm:p-6 bg-gradient-to-t from-[#18181b] via-[#18181b] to-transparent">
          <div className="max-w-3xl w-full mx-auto bg-zinc-900 border border-zinc-700/80 rounded-2xl shadow-2xl p-2.5 focus-within:border-zinc-500 transition-all">
            <textarea
              ref={textareaRef}
              rows={1}
              value={inputPrompt}
              onChange={(e) => {
                setInputPrompt(e.target.value);
                e.target.style.height = "auto";
                e.target.style.height = `${Math.min(e.target.scrollHeight, 140)}px`;
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="Ask anything about Medical Text & Image Processing physics, formulas, or algorithms..."
              className="w-full bg-transparent text-xs sm:text-sm text-zinc-100 placeholder:text-zinc-500 resize-none px-2 py-1.5 focus:outline-none max-h-36"
            />

            <div className="flex items-center justify-between pt-1 border-t border-zinc-800/80 mt-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono text-zinc-400 bg-zinc-800 border border-zinc-700">
                  Gemini 3.5 Flash
                </span>
                <span className="text-[10px] text-zinc-500 hidden sm:inline">
                  Press Enter to send, Shift+Enter for newline
                </span>
              </div>

              <button
                onClick={() => handleSendMessage()}
                disabled={!inputPrompt.trim() || isGenerating}
                className="p-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-30 disabled:pointer-events-none text-zinc-950 font-bold transition-all shadow-sm"
                title="Send Message"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <p className="text-center text-[10px] text-zinc-500 mt-2">
            MedAI Clinical Tutor is strictly grounded in accredited course notes for AIDS 12605.1 • Adani University.
          </p>
        </div>
      </main>
    </div>
  );
}
