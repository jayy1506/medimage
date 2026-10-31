"use client";

import React from "react";
import Image from "next/image";

interface BrandLogoProps {
  className?: string;
  size?: number;
}

export function BrandLogo({ className = "w-10 h-10", size = 40 }: BrandLogoProps) {
  return (
    <div className={`relative flex items-center justify-center flex-shrink-0 ${className}`}>
      <Image
        src="/assets/logo.png"
        alt="Adani University Emblem"
        width={size}
        height={size}
        className="w-full h-full object-contain"
        priority
      />
    </div>
  );
}

export default BrandLogo;
