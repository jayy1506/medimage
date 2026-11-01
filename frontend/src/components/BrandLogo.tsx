"use client";

import React, { useState } from "react";
import Image from "next/image";

interface BrandLogoProps {
  className?: string;
  size?: number;
}

export function BrandLogo({ className = "w-10 h-10", size = 40 }: BrandLogoProps) {
  const [hasError, setHasError] = useState(false);

  return (
    <div className={`relative flex items-center justify-center flex-shrink-0 ${className}`}>
      {!hasError ? (
        <Image
          src="/assets/logo.png"
          alt="Adani University"
          width={size}
          height={size}
          className="w-full h-full object-contain"
          priority
          onError={() => setHasError(true)}
        />
      ) : (
        <div 
          className="w-full h-full rounded-xl bg-gradient-to-tr from-adani-navy via-slate-800 to-adani-cyan flex items-center justify-center text-white font-black shadow-sm ring-1 ring-slate-200 select-none"
          style={{ fontSize: Math.max(11, Math.floor(size * 0.4)) }}
          title="Adani University"
        >
          AU
        </div>
      )}
    </div>
  );
}

export default BrandLogo;
