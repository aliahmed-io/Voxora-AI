"use client";

import React, { useState, useMemo } from "react";
import { SentimentMapPoint } from "@/lib/types";
import { Info, Plus, Minus, Crosshair, Filter } from "lucide-react";

interface SentimentMapProps {
  points: SentimentMapPoint[];
}

export function SentimentMap({ points }: SentimentMapProps) {
  const [activeRange, setActiveRange] = useState<"1W" | "1M" | "3M" | "1Y" | "ALL">("3M");
  const [hoveredPoint, setHoveredPoint] = useState<SentimentMapPoint | null>(null);

  // Generate density grid cells adhering to 60-30-10 palette
  const hexCells = useMemo(() => {
    const rows = 14;
    const cols = 26;
    const cells: Array<{
      id: string;
      row: number;
      col: number;
      xPct: number;
      yPct: number;
      mentions: number;
      intensity: number;
      color: string;
      point?: SentimentMapPoint;
    }> = [];

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const offset = r % 2 === 1 ? 1.8 : 0;
        const xPct = (c / (cols - 1)) * 94 + 3 + offset;
        const yPct = (r / (rows - 1)) * 88 + 6;

        const normalizedY = 1 - r / (rows - 1); // 0 at bottom, 1 at top
        const normalizedX = c / (cols - 1); // 0 at left, 1 at right

        const intensity = Math.round(normalizedY * 100);
        const mentions = Math.round(normalizedX * 200);

        // 60-30-10 Density Gradient:
        // Top right peak: 10% Signal Orange (#FF5A0A) & hot crimson
        // Mid density: 60% Pastel Orchid Pink (#E7B0DE) & soft violet
        // Bottom dense base: 30% Deep Eggplant Violet (#400849)
        let color = "#F3DCF0"; // Default soft orchid

        if (normalizedY > 0.65 && normalizedX > 0.55) {
          // Top-right peak: Electric Signal Orange
          color = normalizedX > 0.8 ? "#FF5A0A" : "#FF7A38";
        } else if (normalizedY < 0.28) {
          // Bottom area: Deep Eggplant Violet cluster
          color = normalizedX > 0.3 && normalizedX < 0.85 ? "#400849" : "#631A70";
        } else if (normalizedY < 0.45 && normalizedX > 0.4) {
          // Lower middle: Orchid-Eggplant blend
          color = "#994D9E";
        } else if (normalizedY > 0.6 && normalizedX > 0.3) {
          // Upper mid: Pastel Orchid Pink
          color = "#E7B0DE";
        } else {
          // Ambient fill
          color = (r + c) % 3 === 0 ? "#F3DCF0" : "#FAEEF7";
        }

        const pointIdx = (r * cols + c) % (points.length || 1);
        const point = points[pointIdx];

        cells.push({
          id: `hex-${r}-${c}`,
          row: r,
          col: c,
          xPct,
          yPct,
          mentions,
          intensity,
          color,
          point,
        });
      }
    }
    return cells;
  }, [points]);

  return (
    <div className="p-6 rounded-3xl bg-white border border-[#E7B0DE]/40 shadow-sm flex flex-col justify-between">
      {/* Header with Title and Range Selectors */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-black text-[#400849] tracking-tight">
            Customer Sentiment Map
          </h2>
          <div className="group relative">
            <Info className="w-3.5 h-3.5 text-[#A872AF] cursor-pointer" />
            <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-64 p-2.5 bg-[#400849] text-white text-[10px] rounded-xl shadow-xl z-30 leading-snug border border-[#E7B0DE]/40">
              2D Density projection: X-axis represents volume of mentions, Y-axis represents sentiment intensity (0-100).
            </div>
          </div>
        </div>

        {/* Time Selector Pills (Active: Signal Orange) */}
        <div className="flex items-center bg-[#FBF3F9] p-1 rounded-xl border border-[#E7B0DE]/50 text-[11px] font-bold text-[#71367B]">
          {(["1W", "1M", "3M", "1Y", "ALL"] as const).map((range) => (
            <button
              key={range}
              onClick={() => setActiveRange(range)}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                activeRange === range
                  ? "bg-[#FF5A0A] text-white shadow-xs"
                  : "hover:text-[#400849]"
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Main Hexagonal Density Canvas */}
      <div className="relative w-full h-[280px] bg-[#FBF3F9] rounded-2xl border border-[#E7B0DE]/50 overflow-hidden p-4 select-none">
        {/* Floating Zoom & Crosshair Controls (Left vertical pill) */}
        <div className="absolute left-3 top-3 flex flex-col gap-1 z-20 bg-white/95 backdrop-blur-sm p-1 rounded-xl border border-[#E7B0DE]/60 shadow-xs text-[#71367B]">
          <button
            className="p-1.5 hover:bg-[#FAF0F8] hover:text-[#400849] rounded-lg transition-colors"
            title="Zoom In"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
          <button
            className="p-1.5 hover:bg-[#FAF0F8] hover:text-[#400849] rounded-lg transition-colors"
            title="Zoom Out"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <button
            className="p-1.5 hover:bg-[#FAF0F8] hover:text-[#400849] rounded-lg transition-colors"
            title="Recenter Map"
          >
            <Crosshair className="w-3.5 h-3.5" />
          </button>
          <button
            className="p-1.5 hover:bg-[#FAF0F8] hover:text-[#400849] rounded-lg transition-colors"
            title="Filter Clusters"
          >
            <Filter className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Rotated Y-Axis Label */}
        <div className="absolute left-2 top-1/2 -translate-y-1/2 -rotate-90 text-[8px] font-black text-[#A872AF] tracking-widest uppercase pointer-events-none origin-center">
          Intensity of Sentiment
        </div>

        {/* Y-Axis Ticks (0, 25, 50, 75, 100) */}
        <div className="absolute left-10 top-4 bottom-8 flex flex-col justify-between text-[9px] font-bold text-[#A872AF] pointer-events-none">
          <span>100</span>
          <span>75</span>
          <span>50</span>
          <span>25</span>
          <span>0</span>
        </div>

        {/* Hexagonal Density Mosaic Surface */}
        <div className="absolute left-16 right-4 top-4 bottom-8">
          <svg className="w-full h-full overflow-visible">
            {hexCells.map((cell) => (
              <circle
                key={cell.id}
                cx={`${cell.xPct}%`}
                cy={`${cell.yPct}%`}
                r="4.5"
                fill={cell.color}
                opacity={0.92}
                className="transition-all duration-150 hover:opacity-100 hover:scale-150 hover:stroke-2 hover:stroke-white cursor-pointer origin-center"
                onMouseEnter={() => {
                  if (cell.point) setHoveredPoint(cell.point);
                }}
                onMouseLeave={() => setHoveredPoint(null)}
              />
            ))}
          </svg>
        </div>

        {/* X-Axis Ticks & Label at Bottom */}
        <div className="absolute left-16 right-4 bottom-1 flex items-center justify-between text-[9px] font-bold text-[#A872AF]">
          <span>0</span>
          <span>25</span>
          <span>50</span>
          <span>75</span>
          <span>100</span>
          <span>125</span>
          <span>150</span>
          <span>175</span>
          <span>200</span>
        </div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-[8px] font-black text-[#A872AF] tracking-widest uppercase pointer-events-none">
          Number of Mentions
        </div>

        {/* Floating Tooltip (Deep Eggplant with Signal Orange accent) */}
        {hoveredPoint && (
          <div className="absolute top-3 right-3 max-w-xs p-3 rounded-2xl bg-[#400849]/95 backdrop-blur-md text-white shadow-2xl text-xs z-30 pointer-events-none border border-[#FF5A0A]/40 animate-fade-in">
            <div className="flex items-center justify-between gap-2 mb-1">
              <span
                className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase ${
                  hoveredPoint.sentiment === "positive"
                    ? "bg-[#10B981]/25 text-[#10B981]"
                    : hoveredPoint.sentiment === "negative"
                    ? "bg-[#E11D48]/25 text-[#FF5A0A]"
                    : "bg-[#FF5A0A]/25 text-[#FF5A0A]"
                }`}
              >
                {hoveredPoint.sentiment}
              </span>
              <span className="text-[10px] text-[#E7B0DE] font-bold truncate">
                {hoveredPoint.topic}
              </span>
            </div>
            <p className="text-[11px] text-white/95 italic line-clamp-2 leading-relaxed">
              &ldquo;{hoveredPoint.preview}&rdquo;
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
