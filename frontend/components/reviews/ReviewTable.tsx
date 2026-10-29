"use client";

import React from "react";
import { ReviewDetail, SentimentLabel } from "@/lib/types";
import { Search, Eye } from "lucide-react";

interface ReviewTableProps {
  reviews: ReviewDetail[];
  total: number;
  page: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
  onSelectReview: (review: ReviewDetail) => void;
  // Filter state
  search: string;
  onSearchChange: (val: string) => void;
  sentiment: SentimentLabel | "all";
  onSentimentChange: (val: SentimentLabel | "all") => void;
  topic: string;
  onTopicChange: (val: string) => void;
  topicsList: string[];
}

export function ReviewTable({
  reviews,
  total,
  page,
  totalPages,
  onPageChange,
  onSelectReview,
  search,
  onSearchChange,
  sentiment,
  onSentimentChange,
  topic,
  onTopicChange,
  topicsList,
}: ReviewTableProps) {
  return (
    <div className="bg-white rounded-3xl border border-[#E7B0DE]/40 shadow-sm overflow-hidden flex flex-col">
      {/* Table Filters Bar */}
      <div className="p-4 border-b border-[#E7B0DE]/40 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#FAF0F8]">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#A872AF] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search reviews by keyword, phrasing, or complaint..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-[#E7B0DE]/60 bg-white text-xs text-[#400849] placeholder-[#A872AF] focus:outline-none focus:ring-2 focus:ring-[#FF5A0A]/20 transition-all font-medium"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {/* Sentiment Filter */}
          <select
            value={sentiment}
            onChange={(e) => onSentimentChange(e.target.value as SentimentLabel | "all")}
            className="px-3 py-2 rounded-xl border border-[#E7B0DE]/60 bg-white text-xs font-bold text-[#400849] focus:outline-none"
          >
            <option value="all">All Sentiments</option>
            <option value="positive">Positive</option>
            <option value="neutral">Neutral</option>
            <option value="negative">Negative</option>
          </select>

          {/* Topic Filter */}
          <select
            value={topic}
            onChange={(e) => onTopicChange(e.target.value)}
            className="px-3 py-2 rounded-xl border border-[#E7B0DE]/60 bg-white text-xs font-bold text-[#400849] focus:outline-none max-w-[200px]"
          >
            <option value="">All Topics</option>
            {topicsList.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#E7B0DE]/40 text-[10px] font-black text-[#A872AF] uppercase tracking-wider bg-[#FAF0F8]">
              <th className="py-3 px-4">Review Text</th>
              <th className="py-3 px-4 w-28">Sentiment</th>
              <th className="py-3 px-4 w-32">Confidence</th>
              <th className="py-3 px-4 w-48">Discovered Topic</th>
              <th className="py-3 px-4 w-28">Date</th>
              <th className="py-3 px-4 w-20 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E7B0DE]/30 text-xs font-medium">
            {reviews.map((r) => {
              const isPos = r.predicted_sentiment === "positive";
              const isNeg = r.predicted_sentiment === "negative";

              return (
                <tr
                  key={r.id}
                  onClick={() => onSelectReview(r)}
                  className="hover:bg-[#FAF0F8] cursor-pointer transition-colors group"
                >
                  <td className="py-3.5 px-4 max-w-md">
                    <p className="text-[#400849] font-medium line-clamp-2 leading-relaxed">
                      {r.original_text}
                    </p>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-block text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border ${
                        isPos
                          ? "bg-[#10B981]/15 text-[#10B981] border-[#10B981]/30"
                          : isNeg
                          ? "bg-[#E11D48]/15 text-[#E11D48] border-[#E11D48]/30"
                          : "bg-[#FFF2EC] text-[#FF5A0A] border-[#FF5A0A]/30"
                      }`}
                    >
                      {r.predicted_sentiment}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 rounded-full bg-[#FAF0F8] overflow-hidden">
                        <div
                          className="h-full bg-[#FF5A0A] rounded-full"
                          style={{ width: `${r.confidence_score * 100}%` }}
                        />
                      </div>
                      <span className="text-[11px] font-bold text-[#71367B]">
                        {(r.confidence_score * 100).toFixed(0)}%
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className="text-xs font-bold text-[#400849] bg-[#FAF0F8] border border-[#E7B0DE]/50 px-2.5 py-1 rounded-lg block truncate max-w-[190px]"
                      title={r.topic_name}
                    >
                      {r.topic_name}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-[#A872AF] text-[11px] font-medium whitespace-nowrap">
                    {r.review_date || "—"}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectReview(r);
                      }}
                      className="p-1.5 rounded-lg text-[#A872AF] hover:text-[#FF5A0A] hover:bg-[#FAF0F8] transition-colors"
                      title="Inspect Model Predictions"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}

            {reviews.length === 0 && (
              <tr>
                <td colSpan={6} className="py-12 text-center text-xs text-[#71367B] font-bold">
                  No reviews match the selected filter criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-4 border-t border-[#E7B0DE]/40 bg-[#FAF0F8] flex items-center justify-between text-xs text-[#71367B]">
        <span>
          Showing <span className="font-bold text-[#400849]">{reviews.length}</span> of{" "}
          <span className="font-bold text-[#400849]">{total.toLocaleString()}</span> reviews
        </span>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onPageChange(Math.max(1, page - 1))}
            disabled={page <= 1}
            className="px-3 py-1.5 rounded-xl border border-[#E7B0DE]/60 bg-white text-xs font-bold text-[#400849] hover:bg-[#FAF0F8] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          <span className="text-xs font-bold text-[#400849]">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => onPageChange(Math.min(totalPages, page + 1))}
            disabled={page >= totalPages}
            className="px-3 py-1.5 rounded-xl border border-[#E7B0DE]/60 bg-white text-xs font-bold text-[#400849] hover:bg-[#FAF0F8] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
