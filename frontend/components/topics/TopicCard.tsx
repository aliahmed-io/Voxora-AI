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
    <div className="p-6 rounded-2xl bg-white border border-[#6D4AFF]/10 shadow-sm flex flex-col justify-between voxora-card-hover">
      <div>
        {/* Topic Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#6D4AFF] bg-[#ECE7FF] px-2.5 py-0.5 rounded-full inline-block mb-1">
              Cluster #{topic.topic_id + 1}
            </span>
            <h3 className="text-base font-extrabold text-[#161327] tracking-tight">
              {topic.name}
            </h3>
          </div>
          <div className="text-right shrink-0">
            <span className="text-xl font-extrabold text-[#161327]">
              {topic.percentage}%
            </span>
            <span className="text-[10px] text-[#9B94B8] block">
              {topic.review_count.toLocaleString()} reviews
            </span>
          </div>
        </div>

        {/* Sentiment Distribution Segmented Bar */}
        <div className="my-4">
          <div className="flex items-center justify-between text-[11px] font-semibold text-[#625D7E] mb-1.5">
            <span>Sentiment Breakdown</span>
            <span>
              <span className="text-[#10B981]">{posPct}% Pos</span> &bull;{" "}
              <span className="text-[#F59E0B]">{neuPct}% Neu</span> &bull;{" "}
              <span className="text-[#F43F5E]">{negPct}% Neg</span>
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-[#F5F2FF] overflow-hidden flex">
            <div className="bg-[#10B981] h-full" style={{ width: `${posPct}%` }} />
            <div className="bg-[#F59E0B] h-full" style={{ width: `${neuPct}%` }} />
            <div className="bg-[#F43F5E] h-full" style={{ width: `${negPct}%` }} />
          </div>
        </div>

        {/* Top Keywords Pill Tags */}
        <div className="my-3">
          <span className="text-[11px] font-bold text-[#9B94B8] uppercase tracking-wider flex items-center gap-1.5 mb-2">
            <Tag className="w-3.5 h-3.5 text-[#6D4AFF]" />
            Prominent Terms (NMF Weights)
          </span>
          <div className="flex flex-wrap gap-1.5">
            {topic.top_keywords.map((kw, i) => (
              <span
                key={i}
                className="px-2.5 py-1 rounded-lg bg-[#FAF8FF] border border-[#ECE7FF] text-xs font-medium text-[#161327] hover:border-[#6D4AFF]/30 transition-colors"
              >
                {kw}
              </span>
            ))}
          </div>
        </div>

        {/* Representative Quotes */}
        {topic.representative_reviews && topic.representative_reviews.length > 0 && (
          <div className="pt-3 border-t border-[#ECE7FF]">
            <span className="text-[11px] font-bold text-[#9B94B8] uppercase tracking-wider flex items-center gap-1.5 mb-2">
              <Quote className="w-3.5 h-3.5 text-[#6D4AFF]" />
              Sample Feedback
            </span>
            <p className="text-xs text-[#625D7E] italic leading-relaxed line-clamp-2">
              &ldquo;{topic.representative_reviews[0]}&rdquo;
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
