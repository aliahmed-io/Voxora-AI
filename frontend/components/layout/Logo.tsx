"use client";

import React from "react";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

export function Logo({ className = "", size = "md", showText = true }: LogoProps) {
  const dimensions = {
    sm: { icon: 28, text: "text-base", badge: "text-[9px] px-1.5 py-0.5" },
    md: { icon: 36, text: "text-xl", badge: "text-[10px] px-2 py-0.5" },
    lg: { icon: 46, text: "text-2xl", badge: "text-xs px-2.5 py-0.5" },
  }[size];

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Precision Vector Acoustic V-Prism Brandmark */}
      <div
        className="relative shrink-0 flex items-center justify-center transition-transform duration-300 hover:scale-105"
        style={{ width: dimensions.icon, height: dimensions.icon }}
      >
        <svg
          viewBox="0 0 44 44"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-[0_4px_12px_rgba(64,8,73,0.15)]"
        >
          <defs>
            {/* Deep Eggplant Structural Vector Gradient */}
            <linearGradient id="vx-eggplant" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#25032D" />
              <stop offset="60%" stopColor="#400849" />
              <stop offset="100%" stopColor="#5E126B" />
            </linearGradient>

            {/* Signal Orange Luminous Blade Gradient */}
            <linearGradient id="vx-orange" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#E04000" />
              <stop offset="60%" stopColor="#FF5A0A" />
              <stop offset="100%" stopColor="#FFA153" />
            </linearGradient>

            {/* Pastel Orchid Acoustic Nexus Gradient */}
            <linearGradient id="vx-orchid" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#5E126B" />
              <stop offset="50%" stopColor="#E7B0DE" />
              <stop offset="100%" stopColor="#FFA153" />
            </linearGradient>

            {/* Ambient Backing Glow */}
            <radialGradient id="vx-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FF5A0A" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#400849" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Ambient Glow Aura */}
          <circle cx="22" cy="22" r="20" fill="url(#vx-glow)" />

          {/* Left Facet: Deep Obsidian Eggplant Column (Leaning forward at 24 deg) */}
          <path
            d="M 9 9 C 9 6.79 10.79 5 13 5 L 15.5 5 C 17.15 5 18.6 6.01 19.16 7.56 L 24.2 21.5 L 18.4 24.8 L 10.16 11.24 C 9.42 10.59 9 9.8 9 9 Z"
            fill="url(#vx-eggplant)"
          />

          {/* Right Facet: High-Voltage Signal Orange Blade */}
          <path
            d="M 35 9 C 35 6.79 33.21 5 31 5 L 28.5 5 C 26.85 5 25.4 6.01 24.84 7.56 L 19.8 21.5 L 25.6 24.8 L 33.84 11.24 C 34.58 10.59 35 9.8 35 9 Z"
            fill="url(#vx-orange)"
          />

          {/* Base Apex Harmonic Keystones: Interlocking Acoustic V-Point */}
          <path
            d="M 14.5 22.5 L 22 37 C 22.5 37.9 23.8 37.9 24.3 37 L 31.8 22.5 L 27.2 19.8 L 22 30 L 16.8 19.8 Z"
            fill="url(#vx-eggplant)"
          />

          {/* Floating High-Voltage Signal Core (Acoustic Resonance Focal Point) */}
          <path
            d="M 18.5 20 L 22 30 L 25.5 20 L 22 17 Z"
            fill="url(#vx-orange)"
          />

          {/* Specular Orchid Reflection Highlight */}
          <circle cx="22" cy="21" r="2.5" fill="#FFFFFF" opacity="0.9" />
          <circle cx="22" cy="21" r="1.2" fill="#FF5A0A" />
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
