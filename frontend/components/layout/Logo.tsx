"use client";

import React from "react";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

export function Logo({ className = "", size = "md", showText = true }: LogoProps) {
  const dimensions = {
    sm: { icon: 28, text: "text-base", badge: "text-[9px] px-1.5 py-0.2" },
    md: { icon: 36, text: "text-lg", badge: "text-[10px] px-2 py-0.5" },
    lg: { icon: 46, text: "text-2xl", badge: "text-xs px-2.5 py-0.5" },
  }[size];

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Bespoke Geometric Voxora Trademark Emblem (60-30-10 Palette) */}
      <div
        className="relative shrink-0 flex items-center justify-center transition-transform duration-200 hover:scale-105"
        style={{ width: dimensions.icon, height: dimensions.icon }}
      >
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-[0_2px_10px_rgba(64,8,73,0.20)]"
        >
          <defs>
            {/* Deep Eggplant Violet Gradient */}
            <linearGradient id="voxora-eggplant-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#631A70" />
              <stop offset="60%" stopColor="#400849" />
              <stop offset="100%" stopColor="#25032B" />
            </linearGradient>

            {/* Pastel Orchid Pink Specular Gradient */}
            <linearGradient id="voxora-orchid-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#F5DCF1" />
              <stop offset="100%" stopColor="#E7B0DE" />
            </linearGradient>

            {/* Signal Orange Electric Gradient */}
            <linearGradient id="voxora-signal-orange" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF7A38" />
              <stop offset="100%" stopColor="#FF5A0A" />
            </linearGradient>
          </defs>

          {/* Layer 1: Ambient Outer Resonance Ring (Pastel Orchid) */}
          <circle
            cx="24"
            cy="24"
            r="21.5"
            stroke="#E7B0DE"
            strokeWidth="1.5"
            strokeOpacity="0.65"
            strokeDasharray="3 3"
          />

          {/* Layer 2: 6 Deep Eggplant & Orchid Crystal Petals */}
          {/* Top Petal (Deep Eggplant) */}
          <path
            d="M24 4 L28 17 L24 21 L20 17 Z"
            fill="url(#voxora-eggplant-grad)"
          />
          {/* Bottom Petal (Deep Eggplant) */}
          <path
            d="M24 44 L20 31 L24 27 L28 31 Z"
            fill="url(#voxora-eggplant-grad)"
          />
          {/* Top-Right Petal (Pastel Orchid) */}
          <path
            d="M41.3 14 L30 20 L27 16 L35 9 Z"
            fill="url(#voxora-orchid-grad)"
          />
          {/* Bottom-Left Petal (Deep Eggplant) */}
          <path
            d="M6.7 34 L18 28 L21 32 L13 39 Z"
            fill="url(#voxora-eggplant-grad)"
          />
          {/* Top-Left Petal (Pastel Orchid) */}
          <path
            d="M6.7 14 L13 9 L21 16 L18 20 Z"
            fill="url(#voxora-orchid-grad)"
          />
          {/* Bottom-Right Petal (Deep Eggplant) */}
          <path
            d="M41.3 34 L35 39 L27 32 L30 28 Z"
            fill="url(#voxora-eggplant-grad)"
          />

          {/* Layer 3: Central Electric Aperture (Signal Orange Nucleus) */}
          <circle
            cx="24"
            cy="24"
            r="6.5"
            fill="#FFFFFF"
            stroke="#400849"
            strokeWidth="2.5"
          />
          <circle
            cx="24"
            cy="24"
            r="3.5"
            fill="url(#voxora-signal-orange)"
          />

          {/* Layer 4: Orbital Spark Dots */}
          <circle cx="24" cy="10" r="1.3" fill="#FF5A0A" />
          <circle cx="36" cy="17" r="1.3" fill="#E7B0DE" />
          <circle cx="36" cy="31" r="1.3" fill="#FF5A0A" />
          <circle cx="24" cy="38" r="1.3" fill="#E7B0DE" />
          <circle cx="12" cy="31" r="1.3" fill="#FF5A0A" />
          <circle cx="12" cy="17" r="1.3" fill="#E7B0DE" />
        </svg>
      </div>

      {/* Brand Typography */}
      {showText && (
        <div className="flex items-center gap-1.5 leading-none">
          <span
            className={`font-black tracking-tight text-[#400849] ${dimensions.text}`}
            style={{ fontFamily: "var(--font-plus-jakarta, 'Plus Jakarta Sans', sans-serif)" }}
          >
            Voxora
          </span>
          <span
            className={`font-black uppercase rounded-full bg-[#FF5A0A] text-white shadow-xs ${dimensions.badge}`}
          >
            AI
          </span>
        </div>
      )}
    </div>
  );
}
