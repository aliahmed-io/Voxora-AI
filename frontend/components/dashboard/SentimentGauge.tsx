"use client";

import React from "react";
import { AlertCircle, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface SentimentGaugeProps {
  score: number; // 0 to 100
  positiveCount: number;
  neutralCount: number;
  negativeCount: number;
  positivePct: number;
  neutralPct: number;
  negativePct: number;
}

export function SentimentGauge({
  score,
  positiveCount,
  neutralCount,
  negativeCount,
  positivePct,
  neutralPct,
  negativePct,
}: SentimentGaugeProps) {
  // Semi-Circular Gauge (180 degrees)
  const radius = 90;
  const strokeWidth = 14;
  const arcLength = Math.PI * radius;
  const clampedScore = Math.min(100, Math.max(0, Math.round(score)));
  const strokeDashoffset = arcLength - (arcLength * clampedScore) / 100;

  // Active tip bead coordinates
  const theta = Math.PI * (1 - clampedScore / 100);
  const beadX = 120 + radius * Math.cos(theta);
  const beadY = 125 - radius * Math.sin(theta);

  // Computed real metrics from actual dataset
  const netScore = Math.round((positivePct - negativePct) * 10) / 10;
  const formattedNetScore = netScore > 0 ? `+${netScore}%` : `${netScore}%`;

  return (
    <div className="p-6 rounded-3xl bg-white border border-[#E7B0DE]/40 shadow-sm flex flex-col justify-between h-full">
      {/* Card Header */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <h2 className="text-xs font-black text-[#400849] tracking-tight">
            Global Overview
          </h2>
          <p className="text-[10px] font-medium text-[#71367B]">
            Aggregated feedback balance
          </p>
        </div>
        <span className="text-[9.5px] font-black uppercase tracking-wider text-[#FF5A0A] bg-[#FFF2EC] px-2.5 py-0.5 rounded-full border border-[#FF5A0A]/20">
          Calibrated
        </span>
      </div>

      {/* Semi-Circular Arch Gauge with Zero Collisions */}
      <div className="relative flex flex-col items-center justify-center my-1">
        <svg
          viewBox="0 0 240 148"
          className="w-full max-w-[240px] overflow-visible"
        >
          <defs>
            <linearGradient id="luxeGaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#400849" />
              <stop offset="50%" stopColor="#9B1C80" />
              <stop offset="100%" stopColor="#FF5A0A" />
            </linearGradient>

            <filter id="gaugeGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#FF5A0A" floodOpacity="0.25" />
            </filter>
          </defs>

          {/* Background Track */}
          <path
            d="M 30 125 A 90 90 0 0 1 210 125"
            fill="none"
            stroke="#FAF0F8"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />

          {/* Active Gradient Arc Path */}
          <path
            d="M 30 125 A 90 90 0 0 1 210 125"
            fill="none"
            stroke="url(#luxeGaugeGrad)"
            strokeWidth={strokeWidth}
            strokeDasharray={arcLength}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
            filter="url(#gaugeGlow)"
          />

          {/* Glowing Indicator Bead at Arc Tip */}
          <circle
            cx={beadX}
            cy={beadY}
            r="7"
            fill="#FFFFFF"
            stroke="#FF5A0A"
            strokeWidth="3.5"
            className="transition-all duration-1000 ease-out drop-shadow-md"
          />
          <circle
            cx={beadX}
            cy={beadY}
            r="2"
            fill="#FF5A0A"
            className="transition-all duration-1000 ease-out"
          />

          {/* Baseline Tick Endpoints */}
          <text x="30" y="144" fill="#A872AF" fontSize="9.5" fontWeight="800" textAnchor="middle">
            0
          </text>
          <text x="210" y="144" fill="#A872AF" fontSize="9.5" fontWeight="800" textAnchor="middle">
            100
          </text>
        </svg>

        {/* Center Readout — Positioned cleanly in arc hollow with zero overlap */}
        <div className="absolute bottom-6 flex flex-col items-center text-center pointer-events-none">
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-4xl sm:text-5xl font-black text-[#400849] tracking-tight leading-none">
              {clampedScore}
            </span>
            <span className="text-xs sm:text-sm font-black text-[#A872AF]">/100</span>
          </div>
          <div className="mt-1 flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FAF0F8] border border-[#E7B0DE]/50">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF5A0A]" />
            <span className="text-[9px] font-black tracking-wide text-[#71367B] uppercase">
              CSAT Score
            </span>
          </div>
        </div>
      </div>

      {/* Breakdown Progress Bars */}
      <div className="space-y-2 mt-2 pt-3 border-t border-[#E7B0DE]/40">
        {/* Positive */}
        <div className="flex items-center gap-2.5 text-xs">
          <span className="text-[11px] font-bold text-[#71367B] w-14 shrink-0 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#10B981]" />
            Positive
          </span>
          <span className="text-[11px] font-black text-[#400849] w-24 shrink-0">
            {positiveCount.toLocaleString()} ({positivePct}%)
          </span>
          <div className="flex-1 h-1.5 rounded-full bg-[#FAF0F8] overflow-hidden">
            <div
              className="h-full bg-[#10B981] rounded-full transition-all duration-700"
              style={{ width: `${positivePct}%` }}
            />
          </div>
        </div>

        {/* Neutral */}
        <div className="flex items-center gap-2.5 text-xs">
          <span className="text-[11px] font-bold text-[#71367B] w-14 shrink-0 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#FF5A0A]" />
            Neutral
          </span>
          <span className="text-[11px] font-black text-[#400849] w-24 shrink-0">
            {neutralCount.toLocaleString()} ({neutralPct}%)
          </span>
          <div className="flex-1 h-1.5 rounded-full bg-[#FAF0F8] overflow-hidden">
            <div
              className="h-full bg-[#FF5A0A] rounded-full transition-all duration-700"
              style={{ width: `${neutralPct}%` }}
            />
          </div>
        </div>

        {/* Negative */}
        <div className="flex items-center gap-2.5 text-xs">
          <span className="text-[11px] font-bold text-[#71367B] w-14 shrink-0 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#400849]" />
            Negative
          </span>
          <span className="text-[11px] font-black text-[#400849] w-24 shrink-0">
            {negativeCount.toLocaleString()} ({negativePct}%)
          </span>
          <div className="flex-1 h-1.5 rounded-full bg-[#FAF0F8] overflow-hidden">
            <div
              className="h-full bg-[#400849] rounded-full transition-all duration-700"
              style={{ width: `${negativePct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Real Computed Dataset Insights — Balanced 2-Column Grid */}
      <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-[#E7B0DE]/40">
        {/* Net Sentiment */}
        <div className="p-2.5 rounded-2xl bg-[#FAF0F8] border border-[#E7B0DE]/50 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[9px] font-black text-[#A872AF] uppercase tracking-wider">
              Net Sentiment
            </span>
            <TrendingUp className="w-3.5 h-3.5 text-[#FF5A0A] shrink-0" />
          </div>
          <div>
            <span className={cn(
              "text-sm font-black block leading-tight",
              netScore >= 0 ? "text-[#10B981]" : "text-[#FF5A0A]"
            )}>
              {formattedNetScore}
            </span>
            <span className="text-[9px] font-bold text-[#71367B] block mt-0.5 truncate">
              {netScore >= 0 ? "Positive Bias" : "Friction Drag"}
            </span>
          </div>
        </div>

        {/* Negative Friction Share */}
        <div className="p-2.5 rounded-2xl bg-[#FFF9F5] border border-[#FF5A0A]/20 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[9px] font-black text-[#A872AF] uppercase tracking-wider">
              Friction Share
            </span>
            <AlertCircle className="w-3.5 h-3.5 text-[#E11D48] shrink-0" />
          </div>
          <div>
            <span className="text-sm font-black text-[#400849] block leading-tight">
              {Math.round(negativePct * 10) / 10}%
            </span>
            <span className="text-[9px] font-bold text-[#E11D48] block mt-0.5 truncate">
              {negativeCount.toLocaleString()} issues
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
