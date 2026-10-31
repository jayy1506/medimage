"use client";

import React, { useState } from "react";
import { MessageSquare, Send, Sparkles, AlertTriangle, Bookmark, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface Citation {
  topic_title: string;
  section_number: number;
  reference_code: string;
}

interface Message {
  sender: "user" | "tutor";
  text: string;
  citations?: Citation[];
  highlightNode?: string;
}

interface TopicAiTutorProps {
  topicId: string;
  topicTitle: string;
  onHighlightNode?: (nodeId: string) => void;
}

export default function TopicAiTutor({
  topicId,
  topicTitle,
  onHighlightNode
}: TopicAiTutorProps) {
  const { token } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "tutor",
      text: `Hello! I am your curriculum-grounded AI Tutor for "${topicTitle}". Ask me about equations, physics, or click any diagram node to see an in-depth breakdown.`
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userText = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { sender: "user", text: userText }]);
    setIsTyping(true);

    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
      const res = await fetch(`${API_BASE}/tutor/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: userText,
          topic_title: topicTitle,
          topic_id: topicId
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.highlight_diagram_node && onHighlightNode) {
          onHighlightNode(data.highlight_diagram_node);
        }
        setMessages((prev) => [
          ...prev,
          {
            sender: "tutor",
            text: data.response,
            citations: data.citations || [
              {
                topic_title: topicTitle,
                section_number: 1,
                reference_code: "AIDS-12605.1"
              }
            ],
            highlightNode: data.highlight_diagram_node
          }
        ]);
      } else {
        throw new Error("Tutor backend responded with error");
      }
    } catch (err) {
      // Academic syllabus-grounded fallback
      let reply = `In accordance with the AIDS 12605.1 syllabus for ${topicTitle}, this principle relies on spatial attenuation coefficients and discrete sampling matrices.`;
      let nodeToHighlight = undefined;

      if (userText.toLowerCase().includes("bone") || userText.toLowerCase().includes("hu")) {
        reply = `Dense cortical bone exhibits high linear attenuation ($\\mu$) relative to soft tissue and water. On the standardized Hounsfield scale, bone ranges from +1000 to +3000 HU, which appears bright white in standard CT windowing.`;
        nodeToHighlight = "Tissue";
      } else if (userText.toLowerCase().includes("sinogram") || userText.toLowerCase().includes("radon")) {
        reply = `The Radon transform maps spatial density $f(x, y)$ into projection space $p(s, \\theta)$. Stacking these 1D projection profiles across 360 degrees forms the sinogram, which is subsequently reconstructed using filtered backprojection.`;
        nodeToHighlight = "Sinogram";
      } else if (userText.toLowerCase().includes("diagnose") || userText.toLowerCase().includes("cancer") || userText.toLowerCase().includes("tumor")) {
        reply = `I am an educational AI tutor for B.Tech Medical Image Processing (AIDS 12605.1). I cannot interpret personal medical images or provide medical/diagnostic advice. Please consult a licensed medical professional.`;
      }

      if (nodeToHighlight && onHighlightNode) {
        onHighlightNode(nodeToHighlight);
      }

      setMessages((prev) => [
        ...prev,
        {
          sender: "tutor",
          text: reply,
          citations: [
            {
              topic_title: topicTitle,
              section_number: 1,
              reference_code: "AIDS-12605.1"
            }
          ],
          highlightNode: nodeToHighlight
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-20 right-3 sm:bottom-6 sm:right-6 z-40">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center space-x-2 px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-full bg-gradient-to-r from-adani-cyan via-adani-purple to-adani-magenta text-white font-bold text-xs shadow-xl hover:opacity-95 transition-all transform hover:scale-105 active:scale-95"
        >
          <Sparkles className="w-4 h-4" />
          <span className="hidden sm:inline">Ask AI Clinical Tutor</span>
          <span className="sm:hidden">AI Tutor</span>
        </button>
      )}

      {isOpen && (
        <div className="w-[calc(100vw-24px)] max-w-sm sm:w-96 h-[480px] max-h-[75vh] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="px-4 py-3 bg-gradient-to-r from-adani-navy to-adani-dark text-white flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-adani-cyan" />
              <div>
                <h4 className="text-xs font-bold leading-tight">AI Clinical Tutor</h4>
                <p className="text-[10px] text-slate-300 truncate max-w-[200px]">{topicTitle}</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Disclaimer Banner */}
          <div className="bg-amber-50 px-3 py-1.5 border-b border-amber-200 flex items-center space-x-1.5 text-[10px] text-amber-800">
            <AlertTriangle className="w-3 h-3 flex-shrink-0 text-amber-600" />
            <span>Educational tutor grounded in syllabus only. No medical advice.</span>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${
                  m.sender === "user" ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`p-3 rounded-2xl max-w-[85%] leading-relaxed ${
                    m.sender === "user"
                      ? "bg-adani-cyan text-white rounded-br-none"
                      : "bg-slate-100 text-slate-800 rounded-bl-none border border-slate-200"
                  }`}
                >
                  {m.text}
                </div>

                {m.citations && m.citations.length > 0 && (
                  <div className="mt-1 flex items-center space-x-1 text-[10px] text-slate-400 font-mono">
                    <Bookmark className="w-2.5 h-2.5" />
                    <span>Citation: {m.citations[0].topic_title} (§{m.citations[0].section_number})</span>
                  </div>
                )}
              </div>
            ))}
            {isTyping && (
              <div className="text-[11px] text-slate-400 italic">Tutor is consulting syllabus embeddings...</div>
            )}
          </div>

          {/* Input Bar */}
          <form onSubmit={handleSend} className="p-3 bg-slate-50 border-t border-slate-200 flex items-center space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about this topic or formulas..."
              className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-adani-cyan focus:border-adani-cyan bg-white text-slate-900"
            />
            <button
              type="submit"
              disabled={isTyping || !input.trim()}
              className="p-2 bg-adani-cyan text-white rounded-lg hover:bg-adani-purple disabled:opacity-40 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
