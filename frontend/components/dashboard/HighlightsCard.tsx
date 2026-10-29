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
    <div className="p-6 rounded-3xl bg-white border border-[#E7B0DE]/40 shadow-sm flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xs font-black text-[#400849] tracking-tight">
          Executive Highlights
        </h2>
        <span className="text-[11px] font-bold text-[#A872AF]">Key Discoveries</span>
      </div>

      <div className="space-y-3">
        {highlights.map((h, idx) => (
          <div key={h.id || idx} className="flex items-start gap-3 p-2.5 rounded-2xl hover:bg-[#FAF0F8] transition-colors">
            <div className="w-7 h-7 rounded-xl bg-[#400849] text-[#FF5A0A] flex items-center justify-center font-black text-xs shrink-0 shadow-2xs">
              {idx + 1}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-xs font-bold text-[#400849] truncate">
                  {h.title}
                </span>
                <span
                  className={`text-[9px] font-black px-1.5 py-0.5 rounded uppercase ${
                    h.type === "positive"
                      ? "bg-[#10B981]/15 text-[#10B981]"
                      : h.type === "negative"
                      ? "bg-[#E11D48]/15 text-[#E11D48]"
                      : "bg-[#FFF2EC] text-[#FF5A0A]"
                  }`}
                >
                  {h.tag}
                </span>
              </div>
              <p className="text-[11px] text-[#71367B] leading-relaxed">
                {h.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
