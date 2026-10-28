"use client";

import React from "react";
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

interface TimeSeriesChartProps {
  data: SentimentTrendPoint[];
}

export function TimeSeriesChart({ data }: TimeSeriesChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="p-6 rounded-2xl bg-white border border-[#6D4AFF]/10 shadow-sm flex flex-col items-center justify-center h-80 text-center">
        <p className="text-sm font-semibold text-[#161327]">No timestamp data available</p>
        <p className="text-xs text-[#625D7E] mt-1">
          Upload reviews with a date/timestamp column to view trends over time.
        </p>
      </div>
    );
  }

  // Format date labels
  const formattedData = data.map((d) => ({
    ...d,
    formattedDate: d.date.slice(5), // MM-DD
  }));

  return (
    <div className="p-6 rounded-2xl bg-white border border-[#6D4AFF]/10 shadow-sm flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-sm font-bold text-[#161327] tracking-tight">
            Sentiment Over Time
          </h2>
          <p className="text-xs text-[#625D7E] mt-0.5">
            Temporal trajectory of review sentiment and feedback volume
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#6D4AFF]" />
            <span className="text-[#625D7E] font-medium">Avg Score (1-5)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#B6A4FF]" />
            <span className="text-[#625D7E] font-medium">Review Volume</span>
          </div>
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={formattedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6D4AFF" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6D4AFF" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ECE7FF" />
            <XAxis
              dataKey="formattedDate"
              stroke="#9B94B8"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              domain={[1, 5]}
              stroke="#9B94B8"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              ticks={[1, 2, 3, 4, 5]}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length > 0) {
                  const item = payload[0]?.payload as
                    | (SentimentTrendPoint & { formattedDate: string })
                    | undefined;
                  if (!item) return null;
                  return (
                    <div className="p-3 rounded-xl bg-[#161327] text-white shadow-xl text-xs space-y-1">
                      <p className="font-bold text-[#B6A4FF]">{item.date}</p>
                      <p className="font-semibold">
                        Average Score: <span className="text-white">{item.average_score} / 5.0</span>
                      </p>
                      <p className="text-[11px] text-[#9B94B8]">
                        Total Reviews: {item.total_count} ({item.positive_count} pos, {item.negative_count} neg)
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="average_score"
              stroke="#6D4AFF"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#scoreGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
