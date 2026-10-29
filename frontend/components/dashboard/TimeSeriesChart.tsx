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
      <div className="p-6 rounded-3xl bg-white border border-[#ECE8F8] shadow-sm flex flex-col items-center justify-center h-72 text-center">
        <p className="text-xs font-semibold text-[#161327]">No temporal data available</p>
        <p className="text-[11px] text-[#9B94B8] mt-1">
          Upload reviews with a date/timestamp column to view trends over time.
        </p>
      </div>
    );
  }

  // Format date labels
  const formattedData = data.map((d) => ({
    ...d,
    formattedDate: d.date.slice(5), // MM-DD
    percentageScore: Math.round(((d.average_score - 1) / 4) * 60 + 40), // map 1-5 to 40-100%
  }));

  return (
    <div className="p-5 rounded-3xl bg-white border border-[#ECE8F8] shadow-sm flex flex-col justify-between h-full">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5">
          <h2 className="text-xs font-bold text-[#161327] tracking-tight">
            Sentiment Over Time
          </h2>
          <div className="group relative">
            <Info className="w-3 h-3 text-[#9B94B8] cursor-pointer" />
            <div className="absolute left-0 bottom-full mb-1.5 hidden group-hover:block w-48 p-2 bg-[#161327] text-white text-[10px] rounded-xl shadow-xl z-30 leading-snug">
              Tracks the day-over-day sentiment trajectory.
            </div>
          </div>
        </div>

        {/* Dropdown Selector */}
        <div className="relative">
          <button
            onClick={() => setTimeFilter(timeFilter === "Last 30 days" ? "All Time" : "Last 30 days")}
            className="flex items-center gap-1 text-[11px] font-semibold text-[#625D7E] hover:text-[#161327] transition-colors"
          >
            <span>{timeFilter}</span>
            <ChevronDown className="w-3 h-3 text-[#9B94B8]" />
          </button>
        </div>
      </div>

      <div className="h-44 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={formattedData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
            <defs>
              <linearGradient id="timeScoreGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6D4AFF" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#6D4AFF" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0EDFB" />
            <XAxis
              dataKey="formattedDate"
              stroke="#9B94B8"
              fontSize={10}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              domain={[0, 100]}
              stroke="#9B94B8"
              fontSize={10}
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
                    <div className="p-2.5 rounded-xl bg-white border border-[#ECE8F8] shadow-lg text-xs space-y-0.5">
                      <p className="text-[10px] font-semibold text-[#9B94B8]">{item.date}</p>
                      <p className="font-bold text-[#6D4AFF]">
                        Sentiment Score: <span className="text-[#161327]">{item.percentageScore}%</span>
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="percentageScore"
              stroke="#6D4AFF"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#timeScoreGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
