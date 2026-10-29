"use client";

import React from "react";
import { Eye, AlertCircle, TrendingUp } from "lucide-react";

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
  // Semi-circle gauge (180 degrees)
  const radius = 85;
  const strokeWidth = 14;
  const arcLength = Math.PI * radius;
  const clampedScore = Math.min(100, Math.max(0, score));
  const strokeDashoffset = arcLength - (arcLength * clampedScore) / 100;

  return (
    <div className="p-6 rounded-3xl bg-white border border-[#E7B0DE]/40 shadow-sm flex flex-col justify-between h-full">
      {/* Card Header */}
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-sm font-black text-[#400849] tracking-tight">
          Global Overview
        </h2>
      </div>

      {/* Semi-Circular Arch Gauge */}
      <div className="relative flex flex-col items-center justify-center pt-2 pb-1">
        <svg
          viewBox="0 0 220 125"
          className="w-full max-w-[240px] overflow-visible"
        >
          <defs>
            <linearGradient id="editorialGaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#400849" />
              <stop offset="70%" stopColor="#631A70" />
              <stop offset="100%" stopColor="#FF5A0A" />
            </linearGradient>
          </defs>

          {/* Background Arch Track (Pastel Orchid Soft) */}
          <path
            d="M 25 115 A 85 85 0 0 1 195 115"
            fill="none"
            stroke="#F3DCF0"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />

          {/* Active Colored Arc Path (Deep Eggplant to Signal Orange) */}
          <path
            d="M 25 115 A 85 85 0 0 1 195 115"
            fill="none"
            stroke="url(#editorialGaugeGradient)"
            strokeWidth={strokeWidth}
            strokeDasharray={arcLength}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />

          {/* Base Tick Marks */}
          <text x="18" y="130" fill="#A872AF" fontSize="10" fontWeight="700" textAnchor="middle">
            0
          </text>
          <text x="110" y="138" fill="#A872AF" fontSize="10" fontWeight="700" textAnchor="middle">
            50
          </text>
          <text x="202" y="130" fill="#A872AF" fontSize="10" fontWeight="700" textAnchor="middle">
            100%
          </text>
        </svg>

        {/* Center Content Inside Arch */}
        <div className="absolute top-10 flex flex-col items-center text-center">
          <div className="w-6 h-6 rounded-full bg-[#FFF2EC] text-[#FF5A0A] flex items-center justify-center mb-1 shadow-2xs">
            <Eye className="w-3.5 h-3.5" />
          </div>
          <span className="text-[9px] font-black tracking-wider text-[#A872AF] uppercase">
            Customer Sentiment Score
          </span>
          <div className="flex items-baseline justify-center gap-0.5 mt-0.5">
            <span className="text-3xl sm:text-4xl font-black text-[#400849] tracking-tight">
              {score}
            </span>
            <span className="text-xs font-bold text-[#71367B]">/100</span>
          </div>
        </div>
      </div>

      {/* Breakdown Sentiment Progress Bars */}
      <div className="space-y-2.5 mt-3 pt-3 border-t border-[#E7B0DE]/30">
        {/* Positive */}
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-semibold text-[#71367B] w-14 shrink-0 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#10B981]" />
            Positive
          </span>
          <span className="text-[11px] font-bold text-[#400849] w-24 shrink-0">
            {positiveCount.toLocaleString()} ({positivePct}%)
          </span>
          <div className="flex-1 h-1.5 rounded-full bg-[#F3DCF0] overflow-hidden">
            <div
              className="h-full bg-[#10B981] rounded-full transition-all duration-700"
              style={{ width: `${positivePct}%` }}
            />
          </div>
        </div>

        {/* Neutral (Signal Orange) */}
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-semibold text-[#71367B] w-14 shrink-0 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#FF5A0A]" />
            Neutral
          </span>
          <span className="text-[11px] font-bold text-[#400849] w-24 shrink-0">
            {neutralCount.toLocaleString()} ({neutralPct}%)
          </span>
          <div className="flex-1 h-1.5 rounded-full bg-[#F3DCF0] overflow-hidden">
            <div
              className="h-full bg-[#FF5A0A] rounded-full transition-all duration-700"
              style={{ width: `${neutralPct}%` }}
            />
          </div>
        </div>

        {/* Negative */}
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-semibold text-[#71367B] w-14 shrink-0 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#E11D48]" />
            Negative
          </span>
          <span className="text-[11px] font-bold text-[#400849] w-24 shrink-0">
            {negativeCount.toLocaleString()} ({negativePct}%)
          </span>
          <div className="flex-1 h-1.5 rounded-full bg-[#F3DCF0] overflow-hidden">
            <div
              className="h-full bg-[#E11D48] rounded-full transition-all duration-700"
              style={{ width: `${negativePct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Two Mini Stat Cards at Bottom (Top Pain Point & Signal Orange Opportunity) */}
      <div className="grid grid-cols-2 gap-3 mt-4 pt-3 border-t border-[#E7B0DE]/30">
        {/* Top Pain Point */}
        <div className="p-2.5 rounded-2xl bg-[#FAEEF7] border border-[#E7B0DE]/50 flex items-start gap-2">
          <div className="w-7 h-7 rounded-xl bg-white text-[#E11D48] flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
            <AlertCircle className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] text-[#A872AF] font-bold block uppercase tracking-wider">
              Top Pain Point
            </span>
            <span className="text-xs font-black text-[#400849] truncate block">
              Onboarding Friction
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-sm font-black text-[#400849]">67%</span>
              <span className="text-[10px] font-bold text-[#E11D48]">-8%</span>
            </div>
          </div>
        </div>

        {/* Top Opportunity (Signal Orange Highlights) */}
        <div className="p-2.5 rounded-2xl bg-[#FFF2EC] border border-[#FF5A0A]/25 flex items-start gap-2">
          <div className="w-7 h-7 rounded-xl bg-white text-[#FF5A0A] flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] text-[#A872AF] font-bold block uppercase tracking-wider">
              Top Opportunity
            </span>
            <span className="text-xs font-black text-[#400849] truncate block">
              Speed Optimization
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-sm font-black text-[#FF5A0A]">$420K</span>
              <span className="text-[10px] font-bold text-[#10B981]">+28%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
