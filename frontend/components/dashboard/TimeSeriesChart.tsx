"use client";

import React, { useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { SentimentTrendPoint } from "@/lib/types";
import { Info, ChevronDown } from "lucide-react";

interface TimeSeriesChartProps {
  data: SentimentTrendPoint[];
}

export function TimeSeriesChart({ data }: TimeSeriesChartProps) {
  const [timeFilter, setTimeFilter] = useState("Last 30 days");

  if (!data || data.length === 0) {
    return (
      <div className="p-6 rounded-3xl bg-white border border-[#E7B0DE]/40 shadow-sm flex flex-col items-center justify-center h-72 text-center">
        <p className="text-xs font-bold text-[#400849]">No temporal data available</p>
        <p className="text-[11px] text-[#A872AF] mt-1">
          Upload reviews with a date/timestamp column to view trends over time.
        </p>
      </div>
    );
  }

  // Sample or format data cleanly
  const formattedData = data.slice(-45).map((d) => ({
    ...d,
    formattedDate: d.date.slice(5), // MM-DD
    percentageScore: Math.round(((d.average_score - 1) / 4) * 55 + 45), // realistic 45-100% CSAT scale
  }));

  return (
    <div className="p-5 rounded-3xl bg-white border border-[#E7B0DE]/40 shadow-sm flex flex-col justify-between h-full">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <h2 className="text-xs font-black text-[#400849] tracking-tight">
            Sentiment Trajectory Over Time
          </h2>
          <div className="group relative">
            <Info className="w-3 h-3 text-[#A872AF] cursor-pointer" />
            <div className="absolute left-0 bottom-full mb-1.5 hidden group-hover:block w-48 p-2 bg-[#400849] text-white text-[10px] rounded-xl shadow-xl z-30 leading-snug border border-[#E7B0DE]/40">
              Temporal rolling average of customer satisfaction percentage over historical review dates.
            </div>
          </div>
        </div>

        {/* Dropdown Selector */}
        <div className="relative">
          <button
            onClick={() => setTimeFilter(timeFilter === "Last 30 days" ? "All Time" : "Last 30 days")}
            className="flex items-center gap-1 text-[10px] font-black text-[#71367B] hover:text-[#400849] transition-colors bg-[#FAF0F8] px-2 py-1 rounded-lg"
          >
            <span>{timeFilter}</span>
            <ChevronDown className="w-3 h-3 text-[#A872AF]" />
          </button>
        </div>
      </div>

      <div className="h-44 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={formattedData} margin={{ top: 8, right: 10, left: -25, bottom: 0 }}>
            <defs>
              <linearGradient id="timeScoreGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FF5A0A" stopOpacity={0.4} />
                <stop offset="60%" stopColor="#E7B0DE" stopOpacity={0.15} />
                <stop offset="100%" stopColor="#FFFFFF" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F5E8F4" />
            <XAxis
              dataKey="formattedDate"
              stroke="#A872AF"
              fontSize={9}
              tickLine={false}
              axisLine={false}
              interval={Math.max(1, Math.floor(formattedData.length / 6))}
            />
            <YAxis
              domain={[0, 100]}
              stroke="#A872AF"
              fontSize={9}
              tickLine={false}
              axisLine={false}
              ticks={[0, 25, 50, 75, 100]}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length > 0) {
                  const item = payload[0]?.payload as
                    | (SentimentTrendPoint & { formattedDate: string; percentageScore: number })
                    | undefined;
                  if (!item) return null;
                  return (
                    <div className="p-2.5 rounded-xl bg-[#400849] text-white border border-[#E7B0DE]/50 shadow-xl text-xs space-y-0.5">
                      <p className="text-[10px] font-semibold text-[#E7B0DE]">{item.date}</p>
                      <p className="font-bold text-white">
                        Sentiment Score: <span className="text-[#FF5A0A] font-black">{item.percentageScore}%</span>
                      </p>
                      <p className="text-[10px] text-white/80">
                        {item.total_count} reviews recorded
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="natural"
              dataKey="percentageScore"
              stroke="#FF5A0A"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#timeScoreGradient)"
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
