"use client";

import React from "react";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

export function Logo({ className = "", size = "md", showText = true }: LogoProps) {
  const dimensions = {
    sm: { icon: 26, text: "text-base", badge: "text-[9px] px-1.5 py-0.2" },
    md: { icon: 34, text: "text-lg", badge: "text-[10px] px-2 py-0.5" },
    lg: { icon: 44, text: "text-2xl", badge: "text-xs px-2.5 py-0.5" },
  }[size];

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Bespoke Geometric Voxora Emblem */}
      <div
        className="relative shrink-0 flex items-center justify-center transition-transform duration-200 hover:scale-105"
        style={{ width: dimensions.icon, height: dimensions.icon }}
      >
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-[0_2px_8px_rgba(109,74,255,0.25)]"
        >
          <defs>
            {/* Primary Violet Gradient */}
            <linearGradient id="voxora-grad-primary" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8B5CF6" />
              <stop offset="50%" stopColor="#6D4AFF" />
              <stop offset="100%" stopColor="#4F46E5" />
            </linearGradient>

            {/* Specular Highlight Gradient */}
            <linearGradient id="voxora-grad-light" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#C4B5FD" />
              <stop offset="100%" stopColor="#818CF8" />
            </linearGradient>

            {/* Glow Radial */}
            <radialGradient id="voxora-nucleus" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="40%" stopColor="#DDD6FE" />
              <stop offset="100%" stopColor="#6D4AFF" />
            </radialGradient>
          </defs>

          {/* Layer 1: Ambient Outer Hex Resonance Ring */}
          <circle
            cx="24"
            cy="24"
            r="21.5"
            stroke="url(#voxora-grad-primary)"
            strokeWidth="1.5"
            strokeOpacity="0.25"
            strokeDasharray="3 3"
          />

          {/* Layer 2: 6 Geometric Facets / Crystalline Petals */}
          {/* Top Petal */}
          <path
            d="M24 4 L28 17 L24 21 L20 17 Z"
            fill="url(#voxora-grad-primary)"
            opacity="0.95"
          />
          {/* Bottom Petal */}
          <path
            d="M24 44 L20 31 L24 27 L28 31 Z"
            fill="url(#voxora-grad-primary)"
            opacity="0.9"
          />
          {/* Top-Right Petal */}
          <path
            d="M41.3 14 L30 20 L27 16 L35 9 Z"
            fill="url(#voxora-grad-light)"
            opacity="0.9"
          />
          {/* Bottom-Left Petal */}
          <path
            d="M6.7 34 L18 28 L21 32 L13 39 Z"
            fill="url(#voxora-grad-primary)"
            opacity="0.85"
          />
          {/* Top-Left Petal */}
          <path
            d="M6.7 14 L13 9 L21 16 L18 20 Z"
            fill="url(#voxora-grad-primary)"
            opacity="0.9"
          />
          {/* Bottom-Right Petal */}
          <path
            d="M41.3 34 L35 39 L27 32 L30 28 Z"
            fill="url(#voxora-grad-light)"
            opacity="0.95"
          />

          {/* Layer 3: Central Aperture Core (Acoustic Wave & Intelligence Nucleus) */}
          <circle
            cx="24"
            cy="24"
            r="6.5"
            fill="#FFFFFF"
            stroke="#6D4AFF"
            strokeWidth="2.5"
          />
          <circle
            cx="24"
            cy="24"
            r="3"
            fill="url(#voxora-grad-primary)"
          />

          {/* Layer 4: Sparkling Orbital Accents */}
          <circle cx="24" cy="10" r="1.2" fill="#FFFFFF" />
          <circle cx="36" cy="17" r="1.2" fill="#FFFFFF" />
          <circle cx="36" cy="31" r="1.2" fill="#FFFFFF" />
          <circle cx="24" cy="38" r="1.2" fill="#FFFFFF" />
          <circle cx="12" cy="31" r="1.2" fill="#FFFFFF" />
          <circle cx="12" cy="17" r="1.2" fill="#FFFFFF" />
        </svg>
      </div>

      {/* Brand Typography */}
      {showText && (
        <div className="flex items-center gap-1.5 leading-none">
          <span
            className={`font-black tracking-tight text-[#161327] ${dimensions.text}`}
            style={{ fontFamily: "var(--font-plus-jakarta, 'Plus Jakarta Sans', sans-serif)" }}
          >
            Voxora
          </span>
          <span
            className={`font-extrabold uppercase rounded-full bg-[#EDE9FE] text-[#6D4AFF] border border-[#DDD6FE]/60 ${dimensions.badge}`}
          >
            AI
          </span>
        </div>
      )}
    </div>
  );
}
