"use client";

import React from "react";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

export function Logo({ className = "", size = "md", showText = true }: LogoProps) {
  const dimensions = {
    sm: {
      tile: "w-7 h-7 rounded-lg",
      svg: 18,
      text: "text-base",
      badge: "text-[9px] px-1.5 py-0.5",
    },
    md: {
      tile: "w-9 h-9 rounded-xl",
      svg: 22,
      text: "text-lg",
      badge: "text-[9.5px] px-1.5 py-0.5",
    },
    lg: {
      tile: "w-11 h-11 rounded-2xl",
      svg: 28,
      text: "text-2xl",
      badge: "text-xs px-2 py-0.5",
    },
  }[size];

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Pristine Brand Icon Squircle Tile */}
      <div
        className={`${dimensions.tile} bg-gradient-to-br from-[#2D0637] via-[#24042C] to-[#17021C] border border-[#E7B0DE]/25 flex items-center justify-center shrink-0 shadow-[0_4px_16px_rgba(40,8,73,0.18)] transition-transform duration-200 hover:scale-105`}
      >
        <svg
          viewBox="0 0 28 28"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: dimensions.svg, height: dimensions.svg }}
          className="overflow-visible"
        >
          <defs>
            {/* Luminous Acoustic Vector Gradient (Orchid -> Signal Orange) */}
            <linearGradient id="vx-wave-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E7B0DE" />
              <stop offset="45%" stopColor="#C968B8" />
              <stop offset="75%" stopColor="#FF5A0A" />
              <stop offset="100%" stopColor="#FFA153" />
            </linearGradient>

            {/* Specular Apex Glow */}
            <filter id="vx-apex-glow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="1" stdDeviation="2" floodColor="#FF5A0A" floodOpacity="0.5" />
            </filter>
          </defs>

          {/* Background Ambient Radial Pulse */}
          <circle cx="14" cy="14" r="10" fill="#FF5A0A" opacity="0.12" />

          {/* Primary Precision Letterform "V" (Continuous Silk Stroke) */}
          <path
            d="M 6.5 8 L 14 21.5 L 21.5 8"
            stroke="url(#vx-wave-grad)"
            strokeWidth="3.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#vx-apex-glow)"
          />

          {/* Concentric Acoustic Resonance Core (Voice Frequency Arc) */}
          <path
            d="M 10 10.5 L 14 17.5 L 18 10.5"
            stroke="#FFFFFF"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.85"
          />

          {/* Focal Intelligence Spark Node */}
          <circle cx="14" cy="14" r="1.4" fill="#FF5A0A" />
        </svg>
      </div>

      {/* Brand Wordmark & Electric AI Badge */}
      {showText && (
        <div className="flex items-center gap-1.5 leading-none">
          <span
            className={`font-black tracking-[-0.04em] text-[#280730] ${dimensions.text}`}
            style={{ fontFamily: "var(--font-plus-jakarta, 'Plus Jakarta Sans', sans-serif)" }}
          >
            Voxora
          </span>
          <span
            className={`font-black tracking-wider uppercase rounded-md bg-[#FF5A0A] text-white shadow-xs ${dimensions.badge}`}
          >
            AI
          </span>
        </div>
      )}
    </div>
  );
}
