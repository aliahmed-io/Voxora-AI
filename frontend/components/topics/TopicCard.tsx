"use client";

import React from "react";
import { TopicSummary } from "@/lib/types";
import { Tag, Quote } from "lucide-react";

interface TopicCardProps {
  topic: TopicSummary;
}

export function TopicCard({ topic }: TopicCardProps) {
  const sDist = topic.sentiment_distribution;
  const total = topic.review_count;

  const posPct = total > 0 ? ((sDist.positive / total) * 100).toFixed(0) : "0";
  const neuPct = total > 0 ? ((sDist.neutral / total) * 100).toFixed(0) : "0";
  const negPct = total > 0 ? ((sDist.negative / total) * 100).toFixed(0) : "0";

  return (
    <div className="p-6 rounded-3xl bg-white border border-[#E7B0DE]/40 shadow-sm flex flex-col justify-between hover:border-[#E7B0DE] hover:shadow-md transition-all">
      <div>
        {/* Topic Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-[#FF5A0A] bg-[#FFF2EC] px-2.5 py-0.5 rounded-full inline-block mb-1 border border-[#FF5A0A]/20">
              Cluster #{topic.topic_id + 1}
            </span>
            <h3 className="text-base font-black text-[#400849] tracking-tight">
              {topic.name}
            </h3>
          </div>
          <div className="text-right shrink-0">
            <span className="text-xl font-black text-[#400849]">
              {topic.percentage}%
            </span>
            <span className="text-[10px] text-[#A872AF] font-bold block">
              {topic.review_count.toLocaleString()} reviews
            </span>
          </div>
        </div>

        {/* Sentiment Distribution Segmented Bar */}
        <div className="my-4">
          <div className="flex items-center justify-between text-[11px] font-bold text-[#71367B] mb-1.5">
            <span>Sentiment Breakdown</span>
            <span>
              <span className="text-[#10B981]">{posPct}% Pos</span> &bull;{" "}
              <span className="text-[#FF5A0A]">{neuPct}% Neu</span> &bull;{" "}
              <span className="text-[#400849]">{negPct}% Neg</span>
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-[#FAF0F8] overflow-hidden flex">
            <div className="bg-[#10B981] h-full" style={{ width: `${posPct}%` }} />
            <div className="bg-[#FF5A0A] h-full" style={{ width: `${neuPct}%` }} />
            <div className="bg-[#400849] h-full" style={{ width: `${negPct}%` }} />
          </div>
        </div>

        {/* Top Keywords Pill Tags */}
        <div className="my-3">
          <span className="text-[10px] font-black text-[#A872AF] uppercase tracking-wider block mb-2 flex items-center gap-1">
            <Tag className="w-3 h-3 text-[#FF5A0A]" />
            Dominant TF-IDF Keywords
          </span>
          <div className="flex flex-wrap gap-1.5">
            {topic.top_keywords.slice(0, 8).map((kw) => (
              <span
                key={kw}
                className="px-2.5 py-1 rounded-lg text-xs font-bold bg-[#FAF0F8] text-[#400849] border border-[#E7B0DE]/40"
              >
                {kw}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Representative Customer Quote */}
      {topic.representative_reviews && topic.representative_reviews.length > 0 && (
        <div className="mt-4 pt-3 border-t border-[#E7B0DE]/30">
          <span className="text-[10px] font-black text-[#A872AF] uppercase tracking-wider block mb-1 flex items-center gap-1">
            <Quote className="w-3 h-3 text-[#FF5A0A]" />
            Representative Review
          </span>
          <p className="text-xs text-[#71367B] italic line-clamp-3 leading-relaxed">
            &ldquo;{topic.representative_reviews[0]}&rdquo;
          </p>
        </div>
      )}
    </div>
  );
}
