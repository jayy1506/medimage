import React from "react";

interface LexiLogoProps {
  size?: number;
  className?: string;
}

export const LexiLogo: React.FC<LexiLogoProps> = ({ size = 24, className = "" }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Lexi Logo"
    >
      <defs>
        <linearGradient id="lexiComponentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--lexi-primary, #0077B6)" />
          <stop offset="50%" stopColor="#662D91" />
          <stop offset="100%" stopColor="#B82662" />
        </linearGradient>
      </defs>
      <rect x="5" y="5" width="90" height="90" rx="26" fill="url(#lexiComponentGrad)" />
      <rect x="7" y="7" width="86" height="86" rx="24" fill="#0B2545" opacity="0.3" />
      <circle cx="50" cy="50" r="32" stroke="url(#lexiComponentGrad)" strokeWidth="3" strokeDasharray="6 4" opacity="0.6" />
      <path d="M38 28 V68 H62" stroke="#FFFFFF" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="66" cy="34" r="5" fill="#38BDF8" />
      <path d="M66 22 V26 M66 42 V46 M54 34 H58 M74 34 H78" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
};
