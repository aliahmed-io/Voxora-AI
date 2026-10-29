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
  // Semi-Circular Gauge (180 degrees)
  const radius = 88;
  const strokeWidth = 14;
  const arcLength = Math.PI * radius;
  const clampedScore = Math.min(100, Math.max(0, score));
  const strokeDashoffset = arcLength - (arcLength * clampedScore) / 100;

  return (
    <div className="p-6 rounded-3xl bg-white border border-[#E7B0DE]/40 shadow-sm flex flex-col justify-between h-full">
      {/* Card Header */}
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-xs font-black text-[#400849] tracking-tight">
          Global Overview
        </h2>
        <span className="text-[9.5px] font-black uppercase tracking-wider text-[#FF5A0A] bg-[#FFF2EC] px-2 py-0.5 rounded-full border border-[#FF5A0A]/20">
          Calibrated
        </span>
      </div>

      {/* Semi-Circular Arch Gauge */}
      <div className="relative flex flex-col items-center justify-center pt-2 pb-1">
        <svg
          viewBox="0 0 230 130"
          className="w-full max-w-[240px] overflow-visible"
        >
          <defs>
            <linearGradient id="luxeGaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#400849" />
              <stop offset="45%" stopColor="#9B1C80" />
              <stop offset="100%" stopColor="#FF5A0A" />
            </linearGradient>

            <filter id="gaugeGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#FF5A0A" floodOpacity="0.3" />
            </filter>
          </defs>

          {/* Background Track */}
          <path
            d="M 25 120 A 88 88 0 0 1 205 120"
            fill="none"
            stroke="#FAF0F8"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />

          {/* Active Gradient Arc Path */}
          <path
            d="M 25 120 A 88 88 0 0 1 205 120"
            fill="none"
            stroke="url(#luxeGaugeGrad)"
            strokeWidth={strokeWidth}
            strokeDasharray={arcLength}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
            filter="url(#gaugeGlow)"
          />

          {/* Ticks */}
          <text x="18" y="136" fill="#A872AF" fontSize="9.5" fontWeight="800" textAnchor="middle">
            0
          </text>
          <text x="115" y="142" fill="#A872AF" fontSize="9.5" fontWeight="800" textAnchor="middle">
            50
          </text>
          <text x="212" y="136" fill="#A872AF" fontSize="9.5" fontWeight="800" textAnchor="middle">
            100%
          </text>
        </svg>

        {/* Center Readout */}
        <div className="absolute top-10 flex flex-col items-center text-center">
          <div className="w-6 h-6 rounded-full bg-[#FFF2EC] text-[#FF5A0A] flex items-center justify-center mb-0.5 shadow-2xs">
            <Eye className="w-3.5 h-3.5" />
          </div>
          <span className="text-[9px] font-black tracking-widest text-[#A872AF] uppercase">
            Customer Sentiment
          </span>
          <div className="flex items-baseline justify-center gap-0.5 mt-0.5">
            <span className="text-4xl font-black text-[#400849] tracking-tight">
              {score}
            </span>
            <span className="text-xs font-black text-[#A872AF]">/100</span>
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

      {/* Non-Truncated Stacked Editorial Insight Cards */}
      <div className="space-y-2 mt-3 pt-3 border-t border-[#E7B0DE]/40">
        {/* Top Pain Point */}
        <div className="p-2.5 rounded-2xl bg-[#FAF0F8] border border-[#E7B0DE]/50 flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-xl bg-[#FFE4E6] text-[#E11D48] flex items-center justify-center shrink-0">
              <AlertCircle className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <span className="text-[9px] font-black text-[#A872AF] uppercase tracking-wider block">
                Top Pain Point
              </span>
              <span className="text-[11px] font-black text-[#400849] block leading-tight">
                Onboarding Friction
              </span>
            </div>
          </div>
          <div className="text-right shrink-0 ml-2">
            <span className="text-xs font-black text-[#400849] block">67%</span>
            <span className="text-[9px] font-black text-[#E11D48]">-8% vs last month</span>
          </div>
        </div>

        {/* Top Opportunity */}
        <div className="p-2.5 rounded-2xl bg-[#FFF9F5] border border-[#FF5A0A]/20 flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-xl bg-[#FFF2EC] text-[#FF5A0A] flex items-center justify-center shrink-0">
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <span className="text-[9px] font-black text-[#A872AF] uppercase tracking-wider block">
                Top Opportunity
              </span>
              <span className="text-[11px] font-black text-[#400849] block leading-tight">
                Speed Optimization
              </span>
            </div>
          </div>
          <div className="text-right shrink-0 ml-2">
            <span className="text-xs font-black text-[#FF5A0A] block">$420K</span>
            <span className="text-[9px] font-black text-[#10B981]">+28% revenue</span>
          </div>
        </div>
      </div>
    </div>
  );
}
