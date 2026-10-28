"use client";

import React from "react";
import { ReviewDetail } from "@/lib/types";
import { X, Sparkles, Smile, Meh, Frown, HelpCircle } from "lucide-react";

interface ReviewDetailModalProps {
  review: ReviewDetail | null;
  onClose: () => void;
}

export function ReviewDetailModal({ review, onClose }: ReviewDetailModalProps) {
  if (!review) return null;

  const isPos = review.predicted_sentiment === "positive";
  const isNeg = review.predicted_sentiment === "negative";

  const SentimentIcon = isPos ? Smile : isNeg ? Frown : Meh;
  const sentimentColor = isPos
    ? "text-[#10B981] bg-[#10B981]/10 border-[#10B981]/20"
    : isNeg
    ? "text-[#F43F5E] bg-[#F43F5E]/10 border-[#F43F5E]/20"
    : "text-[#F59E0B] bg-[#F59E0B]/10 border-[#F59E0B]/20";

  return (
    <div className="fixed inset-0 z-50 bg-[#161327]/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-[#6D4AFF]/15 overflow-hidden animate-scale-in"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="p-6 bg-[#FAF8FF] border-b border-[#ECE7FF] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl border ${sentimentColor}`}>
              <SentimentIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#6D4AFF]">
                  Prediction Analysis
                </span>
                <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${sentimentColor}`}>
                  {review.predicted_sentiment}
                </span>
              </div>
              <h3 className="text-base font-extrabold text-[#161327] mt-0.5">
                Topic: {review.topic_name}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#9B94B8] hover:text-[#161327] hover:bg-white transition-colors"
            aria-label="Close Inspection Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Full Review Text Quote */}
          <div>
            <span className="text-[11px] font-bold text-[#9B94B8] uppercase tracking-wider block mb-2">
              Customer Feedback Verbatim
            </span>
            <div className="p-4 rounded-2xl bg-[#F5F2FF]/70 border border-[#6D4AFF]/10 text-sm text-[#161327] leading-relaxed italic font-serif">
              &ldquo;{review.original_text}&rdquo;
            </div>
          </div>

          {/* Model Confidence & Metrics */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-white border border-[#ECE7FF]">
              <span className="text-[10px] font-semibold text-[#9B94B8] uppercase block">
                Model Confidence
              </span>
              <span className="text-lg font-extrabold text-[#161327] mt-0.5 block">
                {(review.confidence_score * 100).toFixed(1)}%
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-white border border-[#ECE7FF]">
              <span className="text-[10px] font-semibold text-[#9B94B8] uppercase block">
                Polarity Index
              </span>
              <span className={`text-lg font-extrabold mt-0.5 block ${review.polarity >= 0 ? "text-[#10B981]" : "text-[#F43F5E]"}`}>
                {review.polarity > 0 ? `+${review.polarity.toFixed(2)}` : review.polarity.toFixed(2)}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-white border border-[#ECE7FF]">
              <span className="text-[10px] font-semibold text-[#9B94B8] uppercase block">
                Timestamp
              </span>
              <span className="text-xs font-semibold text-[#161327] mt-1 block truncate">
                {review.review_date || "Not Provided"}
              </span>
            </div>
          </div>

          {/* Token-Level Feature Attribution */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-[#9B94B8] uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#6D4AFF]" />
                Influential Term Attributions
              </span>
              <span className="text-[10px] text-[#625D7E]">
                Linear Coefficient Attribution
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {review.influential_terms.map((term, i) => {
                const isTermPos = term.polarity === "positive";
                return (
                  <span
                    key={i}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border ${
                      isTermPos
                        ? "bg-[#10B981]/10 text-[#10B981] border-[#10B981]/25"
                        : "bg-[#F43F5E]/10 text-[#F43F5E] border-[#F43F5E]/25"
                    }`}
                  >
                    <span>{term.term}</span>
                    <span className="text-[10px] opacity-75 font-mono">
                      {term.weight > 0 ? `+${term.weight.toFixed(2)}` : term.weight.toFixed(2)}
                    </span>
                  </span>
                );
              })}
              {review.influential_terms.length === 0 && (
                <p className="text-xs text-[#625D7E]">
                  No strong individual keyword weights isolated for this record.
                </p>
              )}
            </div>
          </div>

          {/* Explainability Methodology & Disclaimer */}
          <div className="p-3.5 rounded-xl bg-[#FAF8FF] border border-[#6D4AFF]/10 flex items-start gap-2.5 text-xs text-[#625D7E] leading-relaxed">
            <HelpCircle className="w-4 h-4 text-[#6D4AFF] shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-[#161327]">Academic Explainability Note: </span>
              Feature influence is derived from linear model coefficients multiplied by TF-IDF token weights.
              This represents statistical influence on the decision boundary and does not represent a causal guarantee.
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#FAF8FF] border-t border-[#ECE7FF] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#161327] hover:bg-[#2B234A] text-white text-xs font-semibold transition-colors"
          >
            Close Inspection
          </button>
        </div>
      </div>
    </div>
  );
}
