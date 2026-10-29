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

  // Generate density grid cells for the hexagonal scatter matrix
  const hexCells = useMemo(() => {
    // Generate an authentic dense grid mimicking the reference image
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

    // Map existing points to the grid
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        // Offset alternating rows for hex lattice
        const offset = r % 2 === 1 ? 1.8 : 0;
        const xPct = (c / (cols - 1)) * 94 + 3 + offset;
        const yPct = (r / (rows - 1)) * 88 + 6;

        // In reference image:
        // Top right has intense red/magenta hexagons (high mentions, high intensity)
        // Bottom has dark blue/violet hexagons (low intensity)
        // Middle has light lavender hexagons
        const normalizedY = 1 - r / (rows - 1); // 0 at bottom, 1 at top
        const normalizedX = c / (cols - 1); // 0 at left, 1 at right

        // Compute density weight
        let color = "#EDE9FE"; // Default soft lavender
        const intensity = Math.round(normalizedY * 100);
        const mentions = Math.round(normalizedX * 200);

        if (normalizedY > 0.65 && normalizedX > 0.55) {
          // Top right cluster: bright crimson / magenta
          color = normalizedX > 0.8 ? "#EF4444" : "#F43F5E";
        } else if (normalizedY < 0.28) {
          // Bottom area: deep blue/indigo cluster
          color = normalizedX > 0.3 && normalizedX < 0.85 ? "#4F46E5" : "#6366F1";
        } else if (normalizedY < 0.45 && normalizedX > 0.4) {
          // Lower middle: soft violet
          color = "#818CF8";
        } else if (normalizedY > 0.6 && normalizedX > 0.3) {
          // Upper mid: pink/rose
          color = "#FB7185";
        } else {
          // Background ambient fill
          color = (r + c) % 3 === 0 ? "#DDD6FE" : "#EDE9FE";
        }

        // Attach corresponding real review point if available
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
    <div className="p-6 rounded-3xl bg-white border border-[#ECE8F8] shadow-sm flex flex-col justify-between">
      {/* Header with Title and Range Selectors */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-bold text-[#161327] tracking-tight">
            Customer Sentiment Map
          </h2>
          <div className="group relative">
            <Info className="w-3.5 h-3.5 text-[#9B94B8] cursor-pointer" />
            <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-64 p-2.5 bg-[#161327] text-white text-[10px] rounded-xl shadow-xl z-30 leading-snug">
              2D Density projection: X-axis represents volume of mentions, Y-axis represents sentiment intensity (0-100).
            </div>
          </div>
        </div>

        {/* Time Selector Pills: 1W, 1M, 3M, 1Y, ALL */}
        <div className="flex items-center bg-[#F8F9FE] p-1 rounded-xl border border-[#ECE8F8] text-[11px] font-semibold text-[#625D7E]">
          {(["1W", "1M", "3M", "1Y", "ALL"] as const).map((range) => (
            <button
              key={range}
              onClick={() => setActiveRange(range)}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                activeRange === range
                  ? "bg-[#6D4AFF] text-white shadow-sm"
                  : "hover:text-[#161327]"
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Main Hexagonal Density Canvas */}
      <div className="relative w-full h-[280px] bg-[#FAF8FF] rounded-2xl border border-[#ECE8F8] overflow-hidden p-4 select-none">
        {/* Floating Zoom & Crosshair Controls (Left vertical pill) */}
        <div className="absolute left-3 top-3 flex flex-col gap-1 z-20 bg-white/95 backdrop-blur-sm p-1 rounded-xl border border-[#ECE8F8] shadow-sm text-[#625D7E]">
          <button
            className="p-1.5 hover:bg-[#F3F0FF] hover:text-[#6D4AFF] rounded-lg transition-colors"
            title="Zoom In"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
          <button
            className="p-1.5 hover:bg-[#F3F0FF] hover:text-[#6D4AFF] rounded-lg transition-colors"
            title="Zoom Out"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <button
            className="p-1.5 hover:bg-[#F3F0FF] hover:text-[#6D4AFF] rounded-lg transition-colors"
            title="Recenter Map"
          >
            <Crosshair className="w-3.5 h-3.5" />
          </button>
          <button
            className="p-1.5 hover:bg-[#F3F0FF] hover:text-[#6D4AFF] rounded-lg transition-colors"
            title="Filter Clusters"
          >
            <Filter className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Rotated Y-Axis Label */}
        <div className="absolute left-2 top-1/2 -translate-y-1/2 -rotate-90 text-[8px] font-bold text-[#9B94B8] tracking-widest uppercase pointer-events-none origin-center">
          Intensity of Sentiment
        </div>

        {/* Y-Axis Ticks (0, 25, 50, 75, 100) */}
        <div className="absolute left-10 top-4 bottom-8 flex flex-col justify-between text-[9px] font-semibold text-[#9B94B8] pointer-events-none">
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
                opacity={0.88}
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
        <div className="absolute left-16 right-4 bottom-1 flex items-center justify-between text-[9px] font-semibold text-[#9B94B8]">
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
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-[8px] font-bold text-[#9B94B8] tracking-widest uppercase pointer-events-none">
          Number of Mentions
        </div>

        {/* Floating Tooltip */}
        {hoveredPoint && (
          <div className="absolute top-3 right-3 max-w-xs p-3 rounded-2xl bg-[#161327]/95 backdrop-blur-md text-white shadow-2xl text-xs z-30 pointer-events-none border border-white/10 animate-fade-in">
            <div className="flex items-center justify-between gap-2 mb-1">
              <span
                className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${
                  hoveredPoint.sentiment === "positive"
                    ? "bg-[#10B981]/20 text-[#10B981]"
                    : hoveredPoint.sentiment === "negative"
                    ? "bg-[#EF4444]/20 text-[#EF4444]"
                    : "bg-[#F59E0B]/20 text-[#F59E0B]"
                }`}
              >
                {hoveredPoint.sentiment}
              </span>
              <span className="text-[10px] text-[#B6A4FF] font-semibold truncate">
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
