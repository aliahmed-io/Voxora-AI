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
    <div className="fixed inset-0 z-50 bg-[#400849]/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-[#E7B0DE]/40 overflow-hidden animate-scale-in"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="p-6 bg-[#FAF0F8] border-b border-[#E7B0DE]/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl border ${sentimentColor}`}>
              <SentimentIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-[#FF5A0A]">
                  Prediction Analysis
                </span>
                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${sentimentColor}`}>
                  {review.predicted_sentiment}
                </span>
              </div>
              <h3 className="text-base font-black text-[#400849] mt-0.5">
                Topic: {review.topic_name}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#A872AF] hover:text-[#400849] hover:bg-white transition-colors"
            aria-label="Close Inspection Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Full Review Text Quote */}
          <div>
            <span className="text-[11px] font-black text-[#A872AF] uppercase tracking-wider block mb-2">
              Customer Feedback Verbatim
            </span>
            <div className="p-4 rounded-2xl bg-[#FAF0F8] border border-[#E7B0DE]/50 text-sm text-[#400849] leading-relaxed italic font-serif">
              &ldquo;{review.original_text}&rdquo;
            </div>
          </div>

          {/* Model Confidence & Metrics */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3.5 rounded-2xl bg-white border border-[#E7B0DE]/50 shadow-2xs">
              <span className="text-[10px] font-bold text-[#A872AF] uppercase block">
                Model Confidence
              </span>
              <span className="text-lg font-black text-[#400849] mt-0.5 block">
                {(review.confidence_score * 100).toFixed(1)}%
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-[#E7B0DE]/50 shadow-2xs">
              <span className="text-[10px] font-bold text-[#A872AF] uppercase block">
                Polarity Index
              </span>
              <span className={`text-lg font-black mt-0.5 block ${review.polarity >= 0 ? "text-[#10B981]" : "text-[#E11D48]"}`}>
                {review.polarity > 0 ? `+${review.polarity.toFixed(2)}` : review.polarity.toFixed(2)}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-[#E7B0DE]/50 shadow-2xs">
              <span className="text-[10px] font-bold text-[#A872AF] uppercase block">
                Timestamp
              </span>
              <span className="text-xs font-bold text-[#400849] mt-1 block truncate">
                {review.review_date || "Not Provided"}
              </span>
            </div>
          </div>

          {/* Token-Level Feature Attribution */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-black text-[#A872AF] uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#FF5A0A]" />
                Influential Term Attributions
              </span>
              <span className="text-[10px] font-bold text-[#71367B]">
                Linear Coefficient Attribution
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {review.influential_terms.map((term, i) => {
                const isTermPos = term.polarity === "positive";
                return (
                  <span
                    key={i}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border ${
                      isTermPos
                        ? "bg-[#10B981]/15 text-[#10B981] border-[#10B981]/30"
                        : "bg-[#E11D48]/15 text-[#E11D48] border-[#E11D48]/30"
                    }`}
                  >
                    <span>{term.term}</span>
                    <span className="text-[10px] opacity-80 font-mono">
                      {term.weight > 0 ? `+${term.weight.toFixed(2)}` : term.weight.toFixed(2)}
                    </span>
                  </span>
                );
              })}
              {review.influential_terms.length === 0 && (
                <p className="text-xs text-[#71367B] font-medium">
                  No strong individual keyword weights isolated for this record.
                </p>
              )}
            </div>
          </div>

          {/* Explainability Methodology & Disclaimer */}
          <div className="p-3.5 rounded-2xl bg-[#FAF0F8] border border-[#E7B0DE]/50 flex items-start gap-2.5 text-xs text-[#71367B] leading-relaxed">
            <HelpCircle className="w-4 h-4 text-[#FF5A0A] shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-[#400849]">Academic Explainability Note: </span>
              Feature influence is derived from linear model coefficients multiplied by TF-IDF token weights.
              This represents statistical influence on the decision boundary and does not represent a causal guarantee.
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#FAF0F8] border-t border-[#E7B0DE]/40 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#400849] hover:bg-[#2F0536] text-white text-xs font-bold transition-all shadow-xs"
          >
            Close Inspection
          </button>
        </div>
      </div>
    </div>
  );
}
