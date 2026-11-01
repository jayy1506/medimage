"use client";

import React from "react";

interface MedAiIconProps {
  className?: string;
  size?: number;
  glow?: boolean;
}

/**
 * MedAiIcon - Unique Clinical & Neural Bioimaging AI Emblem
 * Combines medical imaging aperture optics, neural connectivity, and diagnostic intelligence.
 */
export function MedAiIcon({ className = "w-6 h-6", size = 24, glow = true }: MedAiIconProps) {
  return (
    <div className={`relative inline-flex items-center justify-center flex-shrink-0 ${className}`}>
      {glow && (
        <span className="absolute inset-0 rounded-full bg-gradient-to-tr from-sky-400 via-indigo-500 to-cyan-300 blur-[6px] opacity-40 animate-pulse pointer-events-none" />
      )}
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10 w-full h-full drop-shadow-sm transition-transform duration-300 group-hover:scale-105"
      >
        <defs>
          {/* Outer Lens Gradient */}
          <linearGradient id="medai-gantry-grad" x1="2" y1="2" x2="30" y2="30" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0284C7" />
            <stop offset="50%" stopColor="#6366F1" />
            <stop offset="100%" stopColor="#06B6D4" />
          </linearGradient>

          {/* Core Star Gradient */}
          <linearGradient id="medai-core-grad" x1="16" y1="8" x2="16" y2="24" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#E0F2FE" />
          </linearGradient>

          {/* Accent Glow */}
          <radialGradient id="medai-radial" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#6366F1" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Circular Outer Gantry Ring with Optical Aperture Notches */}
        <circle
          cx="16"
          cy="16"
          r="13"
          stroke="url(#medai-gantry-grad)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="14 3.5 14 3.5"
          className="animate-[spin_24s_linear_infinite]"
        />

        {/* Subtle Ambient Radial Glow */}
        <circle cx="16" cy="16" r="10" fill="url(#medai-radial)" opacity="0.35" />

        {/* 4 Clinical Focus Reticle Ticks (Imaging Modality Crosshairs) */}
        <path d="M16 3.5V6" stroke="#38BDF8" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M16 26V28.5" stroke="#38BDF8" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M3.5 16H6" stroke="#38BDF8" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M26 16H28.5" stroke="#38BDF8" strokeWidth="1.5" strokeLinecap="round" />

        {/* Dynamic Diamond Star AI Core (MedAI Neural Core) */}
        <path
          d="M16 8C16 12.4 12.4 16 8 16C12.4 16 16 19.6 16 24C16 19.6 19.6 16 24 16C19.6 16 16 12.4 16 8Z"
          fill="url(#medai-core-grad)"
        />

        {/* Central Luminous Diagnostic Spark */}
        <circle cx="16" cy="16" r="2" fill="#0284C7" />
        <circle cx="16" cy="16" r="1" fill="#FFFFFF" />

        {/* Top-Right Secondary Satellite AI Sparkle */}
        <path
          d="M23 7C23 8.3 21.7 9 21 9C21.7 9 23 9.7 23 11C23 9.7 24.3 9 25 9C24.3 9 23 8.3 23 7Z"
          fill="#38BDF8"
        />
      </svg>
    </div>
  );
}

export default MedAiIcon;
