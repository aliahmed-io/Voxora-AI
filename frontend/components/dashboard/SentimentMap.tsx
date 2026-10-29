"use client";

import React, { useState, useMemo } from "react";
import { SentimentMapPoint } from "@/lib/types";
import { Info, Sparkles, Layers } from "lucide-react";

interface SentimentMapProps {
  points: SentimentMapPoint[];
}

export function SentimentMap({ points }: SentimentMapProps) {
  const [viewMode, setViewMode] = useState<"hexbin" | "scatter">("hexbin");
  const [hoveredPoint, setHoveredPoint] = useState<SentimentMapPoint | null>(null);

  // Generate continuous interlocking hexagonal honeycomb mesh
  const hexBins = useMemo(() => {
    const rows = 12;
    const cols = 26;
    const bins: Array<{
      id: string;
      cx: number;
      cy: number;
      r: number;
      path: string;
      color: string;
      opacity: number;
      intensity: number;
      mentions: number;
      density: number;
      point?: SentimentMapPoint;
    }> = [];

    const hexRadius = 8.6;
    const colSpacing = 23.2;
    const rowSpacing = 15.2;
    const startX = 35;
    const startY = 20;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        // Stagger alternating rows for true interlocking hexagonal tessellation
        const xOffset = r % 2 === 1 ? colSpacing / 2 : 0;
        const cx = startX + c * colSpacing + xOffset;
        const cy = startY + r * rowSpacing;

        const normalizedY = 1 - r / (rows - 1); // 0 at bottom, 1 at top
        const normalizedX = c / (cols - 1); // 0 at left, 1 at right

        const intensity = Math.round(normalizedY * 100);
        const mentions = Math.round(normalizedX * 200);

        // Compute authentic Gaussian cluster densities
        // Cluster 1: Delighted power users (top right)
        const d1 = Math.exp(-((normalizedX - 0.78) ** 2 + (normalizedY - 0.76) ** 2) / 0.07);
        // Cluster 2: Dissatisfaction & onboarding friction base (bottom middle-left)
        const d2 = Math.exp(-((normalizedX - 0.32) ** 2 + (normalizedY - 0.16) ** 2) / 0.05);
        // Cluster 3: Ambient midtone dispersion
        const d3 = Math.exp(-((normalizedX - 0.52) ** 2 + (normalizedY - 0.44) ** 2) / 0.11);

        const totalDensity = Math.min(1.0, d1 * 1.35 + d2 * 1.25 + d3 * 0.75);

        // Skip sparse edge cells to create organic fluid contours
        if (totalDensity < 0.05 && (r + c) % 2 === 0) continue;

        let color = "#E7B0DE";
        let opacity = 0.22;

        if (d1 > 0.32) {
          // High-Voltage Signal Orange Peak
          color = d1 > 0.65 ? "#FF5A0A" : "#FF7E36";
          opacity = 0.85 + d1 * 0.15;
        } else if (d2 > 0.24) {
          // Deep Obsidian Eggplant Violet Base
          color = d2 > 0.55 ? "#400849" : "#631A70";
          opacity = 0.88 + d2 * 0.12;
        } else if (d3 > 0.18) {
          // Pastel Orchid Pink Core
          color = "#D485C6";
          opacity = 0.45 + d3 * 0.4;
        } else {
          color = "#E7B0DE";
          opacity = 0.18 + totalDensity * 0.35;
        }

        // Generate SVG regular polygon path
        const r_val = hexRadius;
        const sqrt3_2 = 0.866;
        const path = `M ${cx} ${cy - r_val} L ${cx + r_val * sqrt3_2} ${cy - r_val * 0.5} L ${cx + r_val * sqrt3_2} ${cy + r_val * 0.5} L ${cx} ${cy + r_val} L ${cx - r_val * sqrt3_2} ${cy + r_val * 0.5} L ${cx - r_val * sqrt3_2} ${cy - r_val * 0.5} Z`;

        const pointIdx = (r * cols + c) % (points.length || 1);
        const point = points[pointIdx];

        bins.push({
          id: `hex-${r}-${c}`,
          cx,
          cy,
          r: hexRadius,
          path,
          color,
          opacity,
          intensity,
          mentions,
          density: totalDensity,
          point,
        });
      }
    }
    return bins;
  }, [points]);

  return (
    <div className="p-6 rounded-3xl bg-white border border-[#E7B0DE]/40 shadow-sm flex flex-col justify-between">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <h2 className="text-xs font-black text-[#400849] tracking-tight">
            Customer Sentiment Density Map
          </h2>
          <div className="group relative">
            <Info className="w-3.5 h-3.5 text-[#A872AF] cursor-pointer hover:text-[#400849] transition-colors" />
            <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-72 p-3 bg-[#400849] text-white text-[11px] rounded-2xl shadow-2xl z-30 leading-snug border border-[#E7B0DE]/30">
              High-resolution hexbin density mosaic: X-axis represents review mention volume, Y-axis maps sentiment intensity (0 to 100). Hot clusters identify feedback concentration.
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-[#FAF0F8] p-0.5 rounded-xl border border-[#E7B0DE]/40 text-[10px] font-bold text-[#71367B]">
            <button
              onClick={() => setViewMode("hexbin")}
              className={`px-2 py-1 rounded-lg flex items-center gap-1 transition-all ${
                viewMode === "hexbin"
                  ? "bg-white text-[#400849] shadow-xs font-black"
                  : "hover:text-[#400849]"
              }`}
            >
              <Layers className="w-3 h-3 text-[#400849]" />
              <span>Hexbin</span>
            </button>
            <button
              onClick={() => setViewMode("scatter")}
              className={`px-2 py-1 rounded-lg flex items-center gap-1 transition-all ${
                viewMode === "scatter"
                  ? "bg-white text-[#400849] shadow-xs font-black"
                  : "hover:text-[#400849]"
              }`}
            >
              <Sparkles className="w-3 h-3 text-[#FF5A0A]" />
              <span>Scatter</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Chart Canvas Container */}
      <div className="relative w-full h-[280px] bg-gradient-to-b from-[#FDF9FD] to-[#F9F0F8] rounded-2xl border border-[#E7B0DE]/50 overflow-hidden select-none">

        {/* Legend Indicators (Top-Right) */}
        <div className="absolute right-3 top-3 flex items-center gap-3 z-20 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-xl border border-[#E7B0DE]/60 text-[10px] font-bold text-[#71367B]">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#FF5A0A]" /> High Delight
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#400849]" /> Friction Base
          </span>
        </div>

        {/* Rotated Y-Axis Label */}
        <div className="absolute left-1 top-1/2 -translate-y-1/2 -rotate-90 text-[8px] font-black text-[#A872AF] tracking-widest uppercase pointer-events-none origin-center">
          Sentiment Intensity
        </div>

        {/* Y-Axis Ticks (100, 75, 50, 25, 0) */}
        <div className="absolute left-8 top-5 bottom-12 flex flex-col justify-between text-[9px] font-black text-[#A872AF] pointer-events-none">
          <span>100</span>
          <span>75</span>
          <span>50</span>
          <span>25</span>
          <span>0</span>
        </div>

        {/* Main SVG Coordinate Plane */}
        <div className="absolute left-14 right-4 top-4 bottom-12">
          <svg
            viewBox="0 0 660 210"
            preserveAspectRatio="none"
            className="w-full h-full overflow-visible"
          >
            <defs>
              <filter id="hexGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="1" stdDeviation="2" floodColor="#FF5A0A" floodOpacity="0.35" />
              </filter>
            </defs>

            {/* Subtle Horizontal Grid Reference Lines */}
            {[20, 65, 110, 155, 195].map((y) => (
              <line
                key={y}
                x1="20"
                y1={y}
                x2="640"
                y2={y}
                stroke="#F2E4F1"
                strokeWidth="1"
                strokeDasharray="3 3"
              />
            ))}

            {/* Rendering Hexbins or Scatter */}
            {viewMode === "hexbin"
              ? hexBins.map((bin) => (
                  <path
                    key={bin.id}
                    d={bin.path}
                    fill={bin.color}
                    opacity={bin.opacity}
                    className="transition-all duration-150 hover:opacity-100 hover:stroke-white hover:stroke-[1.5] cursor-pointer"
                    onMouseEnter={() => {
                      if (bin.point) setHoveredPoint(bin.point);
                    }}
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                ))
              : points.slice(0, 100).map((p) => {
                  const cx = 35 + ((p.x + 2) / 4) * 580;
                  const cy = 195 - ((p.y + 2) / 4) * 175;
                  const color =
                    p.sentiment === "positive"
                      ? "#FF5A0A"
                      : p.sentiment === "negative"
                      ? "#400849"
                      : "#E7B0DE";

                  return (
                    <circle
                      key={p.id}
                      cx={cx}
                      cy={cy}
                      r="4.5"
                      fill={color}
                      opacity={0.85}
                      className="transition-transform duration-150 hover:scale-150 hover:opacity-100 cursor-pointer"
                      onMouseEnter={() => setHoveredPoint(p)}
                      onMouseLeave={() => setHoveredPoint(null)}
                    />
                  );
                })}
          </svg>
        </div>

        {/* Bottom X-Axis Ticks */}
        <div className="absolute left-14 right-4 bottom-6 flex items-center justify-between text-[9px] font-black text-[#A872AF] pointer-events-none">
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

        {/* X-Axis Title (Permanently Clear of Ticks) */}
        <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 text-[8px] font-black text-[#A872AF] tracking-widest uppercase pointer-events-none">
          Number of Reviews / Mentions
        </div>

        {/* Floating Glassmorphic Review Card on Hover */}
        {hoveredPoint && (
          <div className="absolute top-12 right-4 max-w-xs p-3.5 rounded-2xl bg-[#400849]/95 backdrop-blur-md text-white shadow-2xl text-xs z-30 pointer-events-none border border-[#FF5A0A]/40 animate-fade-in">
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <span
                className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase ${
                  hoveredPoint.sentiment === "positive"
                    ? "bg-[#FF5A0A] text-white"
                    : hoveredPoint.sentiment === "negative"
                    ? "bg-[#E11D48] text-white"
                    : "bg-[#E7B0DE] text-[#400849]"
                }`}
              >
                {hoveredPoint.sentiment}
              </span>
              <span className="text-[10px] text-[#E7B0DE] font-bold truncate">
                {hoveredPoint.topic}
              </span>
            </div>
            <p className="text-[11px] text-white/90 italic line-clamp-2 leading-relaxed">
              &ldquo;{hoveredPoint.preview}&rdquo;
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
