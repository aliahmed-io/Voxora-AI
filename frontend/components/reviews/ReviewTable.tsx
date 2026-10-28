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
    <div className="bg-white rounded-2xl border border-[#6D4AFF]/10 shadow-sm overflow-hidden flex flex-col">
      {/* Table Filters Bar */}
      <div className="p-4 border-b border-[#ECE7FF] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#FAF8FF]">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#9B94B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search reviews by keyword, phrasing, or complaint..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-[#6D4AFF]/15 bg-white text-xs text-[#161327] placeholder-[#9B94B8] focus:outline-none focus:ring-2 focus:ring-[#6D4AFF]/20 transition-all"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {/* Sentiment Filter */}
          <select
            value={sentiment}
            onChange={(e) => onSentimentChange(e.target.value as SentimentLabel | "all")}
            className="px-3 py-2 rounded-xl border border-[#6D4AFF]/15 bg-white text-xs font-semibold text-[#161327] focus:outline-none"
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
            className="px-3 py-2 rounded-xl border border-[#6D4AFF]/15 bg-white text-xs font-semibold text-[#161327] focus:outline-none max-w-[160px] truncate"
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
            <tr className="border-b border-[#ECE7FF] text-[11px] font-bold text-[#9B94B8] uppercase tracking-wider bg-white">
              <th className="py-3 px-4">Review Text</th>
              <th className="py-3 px-4 w-28">Sentiment</th>
              <th className="py-3 px-4 w-32">Confidence</th>
              <th className="py-3 px-4 w-44">Discovered Topic</th>
              <th className="py-3 px-4 w-28">Date</th>
              <th className="py-3 px-4 w-20 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#ECE7FF]/60 text-xs">
            {reviews.map((r) => {
              const isPos = r.predicted_sentiment === "positive";
              const isNeg = r.predicted_sentiment === "negative";

              return (
                <tr
                  key={r.id}
                  onClick={() => onSelectReview(r)}
                  className="hover:bg-[#F5F2FF]/60 cursor-pointer transition-colors group"
                >
                  <td className="py-3.5 px-4 max-w-md">
                    <p className="text-[#161327] font-medium line-clamp-2 leading-relaxed">
                      {r.original_text}
                    </p>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-block text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full border ${
                        isPos
                          ? "bg-[#10B981]/10 text-[#10B981] border-[#10B981]/25"
                          : isNeg
                          ? "bg-[#F43F5E]/10 text-[#F43F5E] border-[#F43F5E]/25"
                          : "bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/25"
                      }`}
                    >
                      {r.predicted_sentiment}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 rounded-full bg-[#ECE7FF] overflow-hidden">
                        <div
                          className="h-full bg-[#6D4AFF] rounded-full"
                          style={{ width: `${r.confidence_score * 100}%` }}
                        />
                      </div>
                      <span className="text-[11px] font-semibold text-[#625D7E]">
                        {(r.confidence_score * 100).toFixed(0)}%
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-xs font-semibold text-[#6D4AFF] bg-[#ECE7FF]/60 px-2.5 py-1 rounded-lg block truncate max-w-[170px]">
                      {r.topic_name}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-[#9B94B8] text-[11px] whitespace-nowrap">
                    {r.review_date || "—"}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectReview(r);
                      }}
                      className="p-1.5 rounded-lg text-[#9B94B8] hover:text-[#6D4AFF] hover:bg-[#ECE7FF] transition-colors"
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
                <td colSpan={6} className="py-12 text-center text-xs text-[#625D7E]">
                  No reviews match the selected filter criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-4 border-t border-[#ECE7FF] bg-[#FAF8FF] flex items-center justify-between text-xs text-[#625D7E]">
        <span>
          Showing <span className="font-bold text-[#161327]">{reviews.length}</span> of{" "}
          <span className="font-bold text-[#161327]">{total.toLocaleString()}</span> reviews
        </span>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onPageChange(Math.max(1, page - 1))}
            disabled={page <= 1}
            className="px-3 py-1.5 rounded-xl border border-[#6D4AFF]/15 bg-white text-xs font-semibold text-[#161327] hover:bg-[#F5F2FF] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="text-xs font-semibold text-[#161327]">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => onPageChange(Math.min(totalPages, page + 1))}
            disabled={page >= totalPages}
            className="px-3 py-1.5 rounded-xl border border-[#6D4AFF]/15 bg-white text-xs font-semibold text-[#161327] hover:bg-[#F5F2FF] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
