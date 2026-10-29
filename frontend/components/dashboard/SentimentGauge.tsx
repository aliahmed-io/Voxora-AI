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
  // Radius = 85. Arc length for 180 deg = PI * radius ~ 267.0
  const radius = 85;
  const strokeWidth = 14;
  const arcLength = Math.PI * radius;
  const clampedScore = Math.min(100, Math.max(0, score));
  const strokeDashoffset = arcLength - (arcLength * clampedScore) / 100;

  return (
    <div className="p-6 rounded-3xl bg-white border border-[#ECE8F8] shadow-sm flex flex-col justify-between h-full">
      {/* Card Header */}
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-sm font-bold text-[#161327] tracking-tight">
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
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#4F46E5" />
              <stop offset="50%" stopColor="#6D4AFF" />
              <stop offset="100%" stopColor="#8B5CF6" />
            </linearGradient>
          </defs>

          {/* Background Arch Path (from 180 to 0 deg) */}
          <path
            d="M 25 115 A 85 85 0 0 1 195 115"
            fill="none"
            stroke="#F0EDFB"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />

          {/* Active Colored Arc Path */}
          <path
            d="M 25 115 A 85 85 0 0 1 195 115"
            fill="none"
            stroke="url(#gaugeGradient)"
            strokeWidth={strokeWidth}
            strokeDasharray={arcLength}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />

          {/* Base Tick Marks */}
          <text x="18" y="130" fill="#9B94B8" fontSize="10" fontWeight="600" textAnchor="middle">
            0
          </text>
          <text x="110" y="138" fill="#9B94B8" fontSize="10" fontWeight="600" textAnchor="middle">
            50
          </text>
          <text x="202" y="130" fill="#9B94B8" fontSize="10" fontWeight="600" textAnchor="middle">
            100%
          </text>
        </svg>

        {/* Center Content Inside Arch */}
        <div className="absolute top-10 flex flex-col items-center text-center">
          <div className="w-6 h-6 rounded-full bg-[#EDE9FE] text-[#6D4AFF] flex items-center justify-center mb-1">
            <Eye className="w-3.5 h-3.5" />
          </div>
          <span className="text-[9px] font-bold tracking-wider text-[#9B94B8] uppercase">
            Customer Sentiment Score
          </span>
          <div className="flex items-baseline justify-center gap-0.5 mt-0.5">
            <span className="text-3xl sm:text-4xl font-black text-[#161327] tracking-tight">
              {score}
            </span>
            <span className="text-xs font-semibold text-[#625D7E]">/100</span>
          </div>
        </div>
      </div>

      {/* Breakdown Sentiment Progress Bars (Matching reference image) */}
      <div className="space-y-2.5 mt-3 pt-3 border-t border-[#ECE8F8]">
        {/* Positive */}
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-medium text-[#625D7E] w-14 shrink-0 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#6D4AFF]" />
            Positive
          </span>
          <span className="text-[11px] font-bold text-[#161327] w-24 shrink-0">
            {positiveCount.toLocaleString()} ({positivePct}%)
          </span>
          <div className="flex-1 h-1.5 rounded-full bg-[#F3F0FF] overflow-hidden">
            <div
              className="h-full bg-[#6D4AFF] rounded-full transition-all duration-700"
              style={{ width: `${positivePct}%` }}
            />
          </div>
        </div>

        {/* Neutral */}
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-medium text-[#625D7E] w-14 shrink-0 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
            Neutral
          </span>
          <span className="text-[11px] font-bold text-[#161327] w-24 shrink-0">
            {neutralCount.toLocaleString()} ({neutralPct}%)
          </span>
          <div className="flex-1 h-1.5 rounded-full bg-[#F3F0FF] overflow-hidden">
            <div
              className="h-full bg-[#F59E0B] rounded-full transition-all duration-700"
              style={{ width: `${neutralPct}%` }}
            />
          </div>
        </div>

        {/* Negative */}
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-medium text-[#625D7E] w-14 shrink-0 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#EF4444]" />
            Negative
          </span>
          <span className="text-[11px] font-bold text-[#161327] w-24 shrink-0">
            {negativeCount.toLocaleString()} ({negativePct}%)
          </span>
          <div className="flex-1 h-1.5 rounded-full bg-[#F3F0FF] overflow-hidden">
            <div
              className="h-full bg-[#EF4444] rounded-full transition-all duration-700"
              style={{ width: `${negativePct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Two Mini Stat Cards at Bottom (Matching reference image) */}
      <div className="grid grid-cols-2 gap-3 mt-4 pt-3 border-t border-[#ECE8F8]">
        {/* Top Pain Point */}
        <div className="p-2.5 rounded-2xl bg-[#FAF8FF] border border-[#ECE8F8] flex items-start gap-2">
          <div className="w-7 h-7 rounded-xl bg-[#EDE9FE] text-[#6D4AFF] flex items-center justify-center shrink-0 mt-0.5">
            <AlertCircle className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] text-[#9B94B8] font-semibold block uppercase">
              Top Pain Point
            </span>
            <span className="text-xs font-bold text-[#161327] truncate block">
              Onboarding Friction
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-sm font-extrabold text-[#161327]">67%</span>
              <span className="text-[10px] font-bold text-[#EF4444]">-8%</span>
            </div>
          </div>
        </div>

        {/* Top Opportunity */}
        <div className="p-2.5 rounded-2xl bg-[#FAF8FF] border border-[#ECE8F8] flex items-start gap-2">
          <div className="w-7 h-7 rounded-xl bg-[#EDE9FE] text-[#6D4AFF] flex items-center justify-center shrink-0 mt-0.5">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] text-[#9B94B8] font-semibold block uppercase">
              Top Opportunity
            </span>
            <span className="text-xs font-bold text-[#161327] truncate block">
              Speed Optimization
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-sm font-extrabold text-[#6D4AFF]">$420K</span>
              <span className="text-[10px] font-bold text-[#10B981]">+28%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
