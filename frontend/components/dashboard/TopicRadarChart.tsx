"use client";

import React, { useState } from "react";
import { Info } from "lucide-react";

interface TopicRadarMetric {
  name: string;
  satisfaction: number; // 0-100
  volume: number; // 0-100
  urgency: number; // 0-100
  resolution: number; // 0-100
  polarity: number; // 0-100
  color: string;
}

const TOPICS_DATA: TopicRadarMetric[] = [
  {
    name: "Customer Support",
    satisfaction: 78,
    volume: 65,
    urgency: 42,
    resolution: 86,
    polarity: 74,
    color: "#FF5A0A",
  },
  {
    name: "Platform Stability",
    satisfaction: 46,
    volume: 92,
    urgency: 88,
    resolution: 58,
    polarity: 38,
    color: "#400849",
  },
  {
    name: "UI & Usability",
    satisfaction: 82,
    volume: 54,
    urgency: 35,
    resolution: 76,
    polarity: 80,
    color: "#E7B0DE",
  },
  {
    name: "Billing & Pricing",
    satisfaction: 58,
    volume: 40,
    urgency: 72,
    resolution: 62,
    polarity: 52,
    color: "#631A70",
  },
  {
    name: "Feature Requests",
    satisfaction: 72,
    volume: 32,
    urgency: 25,
    resolution: 80,
    polarity: 68,
    color: "#FF7A38",
  },
];

const AXES = [
  { label: "Satisfaction", key: "satisfaction" as const, angle: -90 },
  { label: "Volume Impact", key: "volume" as const, angle: -18 },
  { label: "Urgency / Churn", key: "urgency" as const, angle: 54 },
  { label: "Resolution Speed", key: "resolution" as const, angle: 126 },
  { label: "Polarity Balance", key: "polarity" as const, angle: 198 },
];

interface TopicRadarChartProps {
  onSwitchMode?: () => void;
}

export function TopicRadarChart({ onSwitchMode }: TopicRadarChartProps = {}) {
  const [selectedTopicIdx, setSelectedTopicIdx] = useState(1); // default Platform Stability
  const selectedTopic: TopicRadarMetric =
    TOPICS_DATA[selectedTopicIdx] ??
    TOPICS_DATA[0] ?? {
      name: "Platform Stability",
      satisfaction: 50,
      volume: 50,
      urgency: 50,
      resolution: 50,
      polarity: 50,
      color: "#400849",
    };

  const cx = 130;
  const cy = 125;
  const maxR = 85;

  // Compute point coordinates on polygon
  const getCoordinates = (value: number, angleDeg: number) => {
    const angleRad = (angleDeg * Math.PI) / 180;
    const r = (value / 100) * maxR;
    return {
      x: cx + r * Math.cos(angleRad),
      y: cy + r * Math.sin(angleRad),
    };
  };

  // Concentric pentagonal rings (20%, 40%, 60%, 80%, 100%)
  const rings = [20, 40, 60, 80, 100];

  // Selected topic polygon points
  const topicPoints = AXES.map((axis) =>
    getCoordinates(selectedTopic[axis.key], axis.angle)
  );
  const topicPolygonPath =
    topicPoints.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ") +
    " Z";

  // Enterprise baseline polygon (average)
  const baselinePoints = AXES.map((axis) => {
    const avg =
      TOPICS_DATA.reduce((acc, t) => acc + t[axis.key], 0) / TOPICS_DATA.length;
    return getCoordinates(avg, axis.angle);
  });
  const baselinePolygonPath =
    baselinePoints
      .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
      .join(" ") + " Z";

  return (
    <div className="p-5 rounded-3xl bg-white border border-[#E7B0DE]/40 shadow-sm flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5 min-w-0">
          <h2 className="text-xs font-black text-[#400849] tracking-tight whitespace-nowrap">
            Topic Resonance Vector
          </h2>
          <div className="group relative shrink-0">
            <Info className="w-3 h-3 text-[#A872AF] cursor-pointer" />
            <div className="absolute left-0 bottom-full mb-1.5 hidden group-hover:block w-52 p-2 bg-[#400849] text-white text-[10px] rounded-xl shadow-xl z-30 leading-snug border border-[#E7B0DE]/40">
              5-dimensional radar mapping feedback intensity, sentiment polarity, and churn vulnerability across topics.
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 shrink-0">
          {onSwitchMode && (
            <button
              onClick={onSwitchMode}
              className="px-2.5 py-1 rounded-lg bg-[#FAF0F8] hover:bg-[#F3DCF0] border border-[#E7B0DE]/40 text-[9.5px] font-black text-[#71367B] transition-colors whitespace-nowrap"
              title="Switch to Category Progress Bars"
            >
              Show Bars
            </button>
          )}
        </div>
      </div>

      {/* Radar SVG Visual */}
      <div className="relative flex items-center justify-center my-1">
        <svg
          viewBox="0 0 260 250"
          className="w-full max-w-[260px] overflow-visible"
        >
          <defs>
            {/* Selected Topic Gradient */}
            <linearGradient id="radarOrangeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF5A0A" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#FFA153" stopOpacity="0.15" />
            </linearGradient>

            {/* Baseline Gradient */}
            <linearGradient id="radarBaseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#400849" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#E7B0DE" stopOpacity="0.05" />
            </linearGradient>
          </defs>

          {/* Concentric Pentagonal Grid Rings */}
          {rings.map((ring) => {
            const ringPoints = AXES.map((axis) => getCoordinates(ring, axis.angle));
            const ringPath =
              ringPoints
                .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
                .join(" ") + " Z";
            return (
              <path
                key={ring}
                d={ringPath}
                fill="none"
                stroke="#F2E6F2"
                strokeWidth="1"
                strokeDasharray={ring === 100 ? "none" : "2 2"}
              />
            );
          })}

          {/* Radial Spokes */}
          {AXES.map((axis) => {
            const edge = getCoordinates(100, axis.angle);
            return (
              <line
                key={axis.label}
                x1={cx}
                y1={cy}
                x2={edge.x}
                y2={edge.y}
                stroke="#EADAE9"
                strokeWidth="1"
              />
            );
          })}

          {/* Baseline Polygon (All Topics Average) */}
          <path
            d={baselinePolygonPath}
            fill="url(#radarBaseGrad)"
            stroke="#C7A5C9"
            strokeWidth="1.2"
            strokeDasharray="3 2"
          />

          {/* Selected Topic Polygon */}
          <path
            d={topicPolygonPath}
            fill="url(#radarOrangeGrad)"
            stroke="#FF5A0A"
            strokeWidth="2.2"
            className="transition-all duration-500 ease-out"
          />

          {/* Vertex Node Points */}
          {topicPoints.map((p, idx) => (
            <circle
              key={idx}
              cx={p.x}
              cy={p.y}
              r="3.5"
              fill="#FFFFFF"
              stroke="#FF5A0A"
              strokeWidth="2"
              className="transition-all duration-500"
            />
          ))}

          {/* Axis Labels */}
          {AXES.map((axis) => {
            const labelCoord = getCoordinates(118, axis.angle);
            return (
              <text
                key={axis.label}
                x={labelCoord.x}
                y={labelCoord.y + 3}
                fill="#71367B"
                fontSize="8.5"
                fontWeight="800"
                textAnchor="middle"
                className="select-none"
              >
                {axis.label}
              </text>
            );
          })}
        </svg>
      </div>

      {/* Interactive Topic Pill Switcher */}
      <div className="flex flex-wrap items-center justify-center gap-1.5 mt-2 pt-2 border-t border-[#E7B0DE]/30">
        {TOPICS_DATA.map((t, idx) => {
          const isSelected = idx === selectedTopicIdx;
          return (
            <button
              key={t.name}
              onClick={() => setSelectedTopicIdx(idx)}
              className={`px-2.5 py-1 rounded-xl text-[10px] font-black transition-all flex items-center gap-1.5 ${
                isSelected
                  ? "bg-[#400849] text-white shadow-xs"
                  : "bg-[#FAF0F8] text-[#71367B] hover:bg-[#F3DCF0] hover:text-[#400849]"
              }`}
              title={t.name}
            >
              <span
                className="w-1.5 h-1.5 rounded-full shrink-0"
                style={{ backgroundColor: isSelected ? "#FF5A0A" : t.color }}
              />
              <span>{t.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
