"use client";

import React, { useState } from "react";
import { SentimentMapPoint } from "@/lib/types";
import { Info } from "lucide-react";

interface SentimentMapProps {
  points: SentimentMapPoint[];
}

export function SentimentMap({ points }: SentimentMapProps) {
  const [hoveredPoint, setHoveredPoint] = useState<SentimentMapPoint | null>(null);

  if (!points || points.length === 0) {
    return null;
  }

  return (
    <div className="p-6 rounded-2xl bg-white border border-[#6D4AFF]/10 shadow-sm flex flex-col justify-between">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-bold text-[#161327] tracking-tight">
            Customer Sentiment Map
          </h2>
          <div className="group relative">
            <Info className="w-3.5 h-3.5 text-[#9B94B8] cursor-pointer" />
            <div className="absolute left-0 bottom-full mb-1.5 hidden group-hover:block w-56 p-2 bg-[#161327] text-white text-[10px] rounded-lg shadow-xl z-30 leading-snug">
              2D projection of reviews: X-axis represents feedback elaboration, Y-axis represents model sentiment polarity (-100 to +100).
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1.5 text-[#10B981] font-semibold text-[11px]">
            <span className="w-2 h-2 rounded-full bg-[#10B981]" /> Positive
          </span>
          <span className="flex items-center gap-1.5 text-[#F59E0B] font-semibold text-[11px]">
            <span className="w-2 h-2 rounded-full bg-[#F59E0B]" /> Neutral
          </span>
          <span className="flex items-center gap-1.5 text-[#F43F5E] font-semibold text-[11px]">
            <span className="w-2 h-2 rounded-full bg-[#F43F5E]" /> Negative
          </span>
        </div>
      </div>

      {/* 2D Canvas Map */}
      <div className="relative w-full h-64 bg-[#FAF8FF] rounded-xl border border-[#ECE7FF] overflow-hidden p-3 flex items-center justify-center">
        {/* Zero Axis Guideline */}
        <div className="absolute w-full h-[1px] bg-[#6D4AFF]/15 top-1/2 left-0 pointer-events-none" />
        <span className="absolute right-2 top-1 text-[9px] text-[#9B94B8] font-bold">
          +100% (High Polarity)
        </span>
        <span className="absolute right-2 bottom-1 text-[9px] text-[#9B94B8] font-bold">
          -100% (Critical)
        </span>

        {/* Review Data Dots */}
        <div className="relative w-full h-full">
          {points.map((p) => {
            // Y: map -100..+100 to 95%..5% (top is positive)
            const topPct = 50 - p.y * 0.42;
            // X: map 0..100 to 5%..95%
            const leftPct = 5 + p.x * 0.88;

            const colorClass =
              p.sentiment === "positive"
                ? "bg-[#10B981] hover:shadow-emerald-400"
                : p.sentiment === "negative"
                ? "bg-[#F43F5E] hover:shadow-rose-400"
                : "bg-[#F59E0B] hover:shadow-amber-400";

            return (
              <button
                key={p.id}
                onMouseEnter={() => setHoveredPoint(p)}
                onMouseLeave={() => setHoveredPoint(null)}
                className={`absolute w-3 h-3 rounded-full opacity-80 hover:opacity-100 hover:scale-150 transition-all duration-150 transform -translate-x-1/2 -translate-y-1/2 ${colorClass} hover:shadow-lg hover:z-20`}
                style={{
                  top: `${topPct}%`,
                  left: `${leftPct}%`,
                }}
                aria-label={`Review dot in topic ${p.topic}`}
              />
            );
          })}
        </div>

        {/* Floating Tooltip */}
        {hoveredPoint && (
          <div className="absolute bottom-3 left-3 right-3 p-3 rounded-xl bg-[#161327] text-white shadow-2xl text-xs z-30 pointer-events-none border border-white/10 animate-fade-in flex items-center justify-between gap-4">
            <div className="truncate flex-1">
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full mr-2 uppercase ${
                  hoveredPoint.sentiment === "positive"
                    ? "bg-[#10B981]/20 text-[#10B981]"
                    : hoveredPoint.sentiment === "negative"
                    ? "bg-[#F43F5E]/20 text-[#F43F5E]"
                    : "bg-[#F59E0B]/20 text-[#F59E0B]"
                }`}
              >
                {hoveredPoint.sentiment}
              </span>
              <span className="text-[11px] text-[#B6A4FF] font-semibold mr-2">
                [{hoveredPoint.topic}]
              </span>
              <span className="text-white/90 italic">&ldquo;{hoveredPoint.preview}&rdquo;</span>
            </div>
            <div className="shrink-0 text-right">
              <span className="text-[10px] text-[#9B94B8] block">Polarity</span>
              <span className="font-extrabold text-white text-xs">{hoveredPoint.y}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
