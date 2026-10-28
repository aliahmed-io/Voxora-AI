"use client";

import React from "react";
import { Smile, Meh, Frown } from "lucide-react";

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
  // SVG circular arc calculation
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  // Use half arc (180 deg) or 270 deg arc
  const arcLength = circumference * 0.75;
  const strokeDashoffset = arcLength - (arcLength * Math.min(100, Math.max(0, score))) / 100;

  return (
    <div className="p-6 rounded-2xl bg-white border border-[#6D4AFF]/10 shadow-sm flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-bold text-[#161327] tracking-tight">
          Customer Sentiment Score
        </h2>
        <span className="text-[11px] font-semibold text-[#6D4AFF] bg-[#ECE7FF] px-2.5 py-0.5 rounded-full">
          CSAT Index
        </span>
      </div>

      {/* Circular Gauge */}
      <div className="relative flex items-center justify-center my-3">
        <svg className="w-48 h-48 -rotate-90 transform">
          <circle
            cx="96"
            cy="96"
            r={radius}
            fill="transparent"
            stroke="#ECE7FF"
            strokeWidth="12"
            strokeDasharray={arcLength}
            strokeLinecap="round"
          />
          <circle
            cx="96"
            cy="96"
            r={radius}
            fill="transparent"
            stroke="#6D4AFF"
            strokeWidth="12"
            strokeDasharray={arcLength}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className="text-4xl font-extrabold text-[#161327] tracking-tight">
            {score}
          </span>
          <span className="text-xs font-semibold text-[#625D7E] mt-0.5">/ 100</span>
          <span className="text-[10px] text-[#9B94B8] font-medium uppercase tracking-wider mt-1">
            Global Rating
          </span>
        </div>
      </div>

      {/* Breakdown Percentages & Bars */}
      <div className="space-y-3 pt-4 border-t border-[#6D4AFF]/10">
        <div>
          <div className="flex items-center justify-between text-xs font-semibold mb-1">
            <span className="flex items-center gap-1.5 text-[#10B981]">
              <Smile className="w-3.5 h-3.5" />
              Positive
            </span>
            <span className="text-[#161327]">
              {positiveCount.toLocaleString()} ({positivePct}%)
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-[#F5F2FF] overflow-hidden">
            <div
              className="h-full bg-[#10B981] rounded-full transition-all duration-500"
              style={{ width: `${positivePct}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between text-xs font-semibold mb-1">
            <span className="flex items-center gap-1.5 text-[#F59E0B]">
              <Meh className="w-3.5 h-3.5" />
              Neutral
            </span>
            <span className="text-[#161327]">
              {neutralCount.toLocaleString()} ({neutralPct}%)
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-[#F5F2FF] overflow-hidden">
            <div
              className="h-full bg-[#F59E0B] rounded-full transition-all duration-500"
              style={{ width: `${neutralPct}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between text-xs font-semibold mb-1">
            <span className="flex items-center gap-1.5 text-[#F43F5E]">
              <Frown className="w-3.5 h-3.5" />
              Negative
            </span>
            <span className="text-[#161327]">
              {negativeCount.toLocaleString()} ({negativePct}%)
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-[#F5F2FF] overflow-hidden">
            <div
              className="h-full bg-[#F43F5E] rounded-full transition-all duration-500"
              style={{ width: `${negativePct}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
