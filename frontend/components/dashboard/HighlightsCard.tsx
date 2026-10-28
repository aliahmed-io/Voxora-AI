"use client";

import React from "react";
import { DashboardHighlight } from "@/lib/types";

interface HighlightsCardProps {
  highlights: DashboardHighlight[];
}

export function HighlightsCard({ highlights }: HighlightsCardProps) {
  if (!highlights || highlights.length === 0) {
    return null;
  }

  return (
    <div className="p-6 rounded-2xl bg-white border border-[#6D4AFF]/10 shadow-sm flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-bold text-[#161327] tracking-tight">
          Executive Highlights
        </h2>
        <span className="text-[11px] font-semibold text-[#625D7E]">Key Discoveries</span>
      </div>

      <div className="space-y-3.5">
        {highlights.map((h, idx) => (
          <div key={h.id || idx} className="flex items-start gap-3.5 p-2 rounded-xl hover:bg-[#F5F2FF]/50 transition-colors">
            <div className="w-7 h-7 rounded-lg bg-[#6D4AFF] text-white flex items-center justify-center font-extrabold text-xs shrink-0 shadow-sm shadow-[#6D4AFF]/30">
              {idx + 1}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-xs font-bold text-[#161327] truncate">
                  {h.title}
                </span>
                <span
                  className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase ${
                    h.type === "positive"
                      ? "bg-[#10B981]/15 text-[#10B981]"
                      : h.type === "negative"
                      ? "bg-[#F43F5E]/15 text-[#F43F5E]"
                      : "bg-[#6D4AFF]/15 text-[#6D4AFF]"
                  }`}
                >
                  {h.tag}
                </span>
              </div>
              <p className="text-[11px] text-[#625D7E] leading-relaxed">
                {h.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
