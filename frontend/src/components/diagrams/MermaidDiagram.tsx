"use client";

import React, { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";
import { ZoomIn, ZoomOut, RotateCcw, Play, SkipBack, SkipForward } from "lucide-react";

interface MermaidDiagramProps {
  id: string;
  code: string;
  title?: string;
  interactiveNodeMap?: Record<string, string>;
  onNodeClick?: (nodeId: string) => void;
  activeNodeId?: string;
}

export default function MermaidDiagram({
  id,
  code,
  title,
  interactiveNodeMap = {},
  onNodeClick,
  activeNodeId
}: MermaidDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgContent, setSvgContent] = useState<string>("");
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [tooltip, setTooltip] = useState<{ text: string; x: number; y: number } | null>(null);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: "neutral",
      securityLevel: "loose",
      fontFamily: "Inter, sans-serif",
      themeVariables: {
        primaryColor: "#0077B6",
        primaryTextColor: "#FFFFFF",
        primaryBorderColor: "#0B2545",
        lineColor: "#662D91",
        secondaryColor: "#F8FAFC",
        tertiaryColor: "#FFFFFF"
      }
    });

    let isMounted = true;
    const renderDiagram = async () => {
      try {
        const uniqueId = `mermaid-${id.replace(/[^a-zA-Z0-9_-]/g, "")}-${Date.now()}`;
        const { svg } = await mermaid.render(uniqueId, code);
        if (isMounted) {
          setSvgContent(svg);
        }
      } catch (err) {
        console.error("Mermaid render error:", err);
        if (isMounted) {
          setSvgContent(`<div class="p-4 text-xs text-red-500 font-mono">Failed to render diagram markup.</div>`);
        }
      }
    };

    renderDiagram();
    return () => {
      isMounted = false;
    };
  }, [id, code]);

  // Wire click and hover handlers on rendered SVG nodes
  useEffect(() => {
    if (!containerRef.current) return;

    const nodes = containerRef.current.querySelectorAll(".node");
    nodes.forEach((node) => {
      const nodeId = node.id || node.getAttribute("id") || "";
      (node as HTMLElement).style.cursor = "pointer";

      const clickHandler = () => {
        if (onNodeClick) onNodeClick(nodeId);
      };

      const mouseEnterHandler = (e: MouseEvent) => {
        const text = interactiveNodeMap[nodeId] || node.textContent?.trim() || "";
        if (text) {
          setTooltip({
            text,
            x: e.clientX,
            y: e.clientY - 40
          });
        }
      };

      const mouseLeaveHandler = () => {
        setTooltip(null);
      };

      node.addEventListener("click", clickHandler);
      node.addEventListener("mouseenter", mouseEnterHandler as EventListener);
      node.addEventListener("mouseleave", mouseLeaveHandler);
    });
  }, [svgContent, interactiveNodeMap, onNodeClick]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const resetView = () => {
    setZoomLevel(1);
    setPan({ x: 0, y: 0 });
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden select-none">
      {/* Top Diagram Toolbar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50 border-b border-slate-200">
        <span className="text-xs font-bold text-slate-800 truncate">
          {title || "Process Flowchart / Architecture"}
        </span>

        <div className="flex items-center space-x-1.5">
          <button
            onClick={() => setZoomLevel((z) => Math.min(z + 0.2, 2.5))}
            title="Zoom In"
            className="p-1.5 text-slate-500 hover:text-adani-navy hover:bg-slate-200 rounded-md transition-colors"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoomLevel((z) => Math.max(z - 0.2, 0.4))}
            title="Zoom Out"
            className="p-1.5 text-slate-500 hover:text-adani-navy hover:bg-slate-200 rounded-md transition-colors"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={resetView}
            title="Reset View"
            className="p-1.5 text-slate-500 hover:text-adani-navy hover:bg-slate-200 rounded-md transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* SVG Canvas Area */}
      <div
        className="relative flex-1 overflow-hidden cursor-grab active:cursor-grabbing p-6 flex items-center justify-center min-h-[360px]"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div
          ref={containerRef}
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoomLevel})`,
            transformOrigin: "center center",
            transition: isDragging ? "none" : "transform 0.15s ease-out"
          }}
          className="w-full flex justify-center [&>svg]:max-w-full [&>svg]:h-auto"
          dangerouslySetInnerHTML={{ __html: svgContent }}
        />

        {/* Hover Tooltip */}
        {tooltip && (
          <div
            style={{ top: `${tooltip.y}px`, left: `${tooltip.x}px` }}
            className="fixed z-50 pointer-events-none -translate-x-1/2 -translate-y-full px-2.5 py-1.5 rounded-lg bg-slate-900 text-white text-[11px] font-medium shadow-xl border border-slate-700 max-w-xs text-center"
          >
            {tooltip.text}
          </div>
        )}
      </div>

      {/* Diagram Footer with Interactivity Tip */}
      <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
        <span>Click any node to link to its mathematical derivation</span>
        <span className="font-mono">{Math.round(zoomLevel * 100)}%</span>
      </div>
    </div>
  );
}
