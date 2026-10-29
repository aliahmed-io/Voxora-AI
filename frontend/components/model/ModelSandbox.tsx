"use client";

import React, { useState } from "react";
import { api } from "@/lib/api";
import { Sparkles, Terminal } from "lucide-react";
import { SentimentLabel } from "@/lib/types";

interface PredictionResult {
  text: string;
  clean_text: string;
  predicted_sentiment: SentimentLabel;
  confidence: number;
  polarity: number;
  probabilities: { positive: number; neutral: number; negative: number };
  topic_id: number;
  topic_name: string;
  influential_terms: Array<{ term: string; weight: number; polarity: "positive" | "negative" }>;
}

export function ModelSandbox() {
  const [inputText, setInputText] = useState(
    "The application is blazing fast, beautiful modern design, and support was incredible!"
  );
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>({
    text: "The application is blazing fast, beautiful modern design, and support was incredible!",
    clean_text: "application blazing fast beautiful modern design support incredible",
    predicted_sentiment: "positive",
    confidence: 0.9984,
    polarity: 0.9984,
    probabilities: { positive: 0.9984, neutral: 0.0012, negative: 0.0004 },
    topic_id: 0,
    topic_name: "Customer Support & Resolution",
    influential_terms: [
      { term: "incredible", weight: 2.14, polarity: "positive" },
      { term: "fast", weight: 1.82, polarity: "positive" },
      { term: "support", weight: 1.15, polarity: "positive" },
      { term: "beautiful", weight: 0.94, polarity: "positive" },
    ],
  });

  const presetSamples = [
    {
      label: "High Delight",
      text: "Blazing fast speeds, exceptionally clean interface, and customer support was wonderful!",
    },
    {
      label: "Friction & Churn",
      text: "Repeated server crashes during checkout, lost customer transactions, and unhelpful canned responses.",
    },
    {
      label: "Negation Challenge",
      text: "I would never recommend this platform, not worth the expensive subscription price.",
    },
    {
      label: "Neutral / Balanced",
      text: "The tool is average, does what was advertised, standard performance and decent documentation.",
    },
  ];

  const handlePredict = async (textToTest?: string) => {
    const text = (textToTest ?? inputText).trim();
    if (!text) return;
    setLoading(true);
    try {
      const res = await api.predictReview(text);
      setResult(res);
    } catch {
      // In case of error, leave existing state
    } finally {
      setLoading(false);
    }
  };

  const sentimentColor =
    result?.predicted_sentiment === "positive"
      ? "text-[#10B981] bg-[#10B981]/10 border-[#10B981]/30"
      : result?.predicted_sentiment === "negative"
      ? "text-[#E11D48] bg-[#E11D48]/10 border-[#E11D48]/30"
      : "text-[#FF5A0A] bg-[#FFF2EC] border-[#FF5A0A]/30";

  return (
    <div className="p-6 rounded-3xl bg-white border border-[#E7B0DE]/40 shadow-sm space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E7B0DE]/30">
        <div>
          <div className="flex items-center gap-2 text-xs font-black text-[#400849]">
            <Terminal className="w-4 h-4 text-[#FF5A0A]" />
            <span>Interactive Sentiment Inference & Decision Boundary Sandbox</span>
          </div>
          <p className="text-[11px] text-[#A872AF] mt-0.5">
            Test arbitrary customer feedback against the calibrated Linear SVM classifier in real-time.
          </p>
        </div>
        <span className="text-[10px] font-black text-[#FF5A0A] bg-[#FFF2EC] px-3 py-1 rounded-full border border-[#FF5A0A]/20 self-start sm:self-auto">
          Live Model Inference
        </span>
      </div>

      {/* Preset Quick Chips */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[11px] font-bold text-[#A872AF]">Sample Benchmarks:</span>
        {presetSamples.map((sample) => (
          <button
            key={sample.label}
            type="button"
            onClick={() => {
              setInputText(sample.text);
              handlePredict(sample.text);
            }}
            className="px-2.5 py-1 rounded-xl text-[11px] font-bold bg-[#FAF0F8] hover:bg-[#F3DCF0] text-[#400849] border border-[#E7B0DE]/40 transition-colors"
          >
            {sample.label}
          </button>
        ))}
      </div>

      {/* Input Box and Test Button */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handlePredict();
          }}
          placeholder="Type any customer feedback sentence (e.g. 'not bad at all', 'service was terrible')..."
          className="flex-1 px-4 py-2.5 rounded-2xl bg-[#FAF0F8] border border-[#E7B0DE]/60 text-xs text-[#400849] placeholder-[#A872AF] font-medium focus:outline-none focus:border-[#400849] focus:bg-white transition-all"
        />
        <button
          type="button"
          onClick={() => handlePredict()}
          disabled={loading || !inputText.trim()}
          className="px-5 py-2.5 rounded-2xl bg-[#FF5A0A] hover:bg-[#E04D05] disabled:opacity-50 text-white text-xs font-black shadow-md shadow-[#FF5A0A]/20 transition-all flex items-center justify-center gap-2 shrink-0"
        >
          <Sparkles className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>{loading ? "Evaluating..." : "Run Inference"}</span>
        </button>
      </div>

      {/* Real-Time Prediction Output */}
      {result && (
        <div className="space-y-4 pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Predicted Sentiment */}
            <div className="p-4 rounded-2xl bg-[#FAF0F8] border border-[#E7B0DE]/40">
              <span className="text-[10px] font-black uppercase text-[#A872AF] block mb-1">
                Predicted Sentiment
              </span>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-black uppercase px-2.5 py-1 rounded-lg border ${sentimentColor}`}>
                  {result.predicted_sentiment}
                </span>
                <span className="text-xs font-bold text-[#400849]">
                  {(result.confidence * 100).toFixed(1)}% confidence
                </span>
              </div>
            </div>

            {/* Inferred Topic */}
            <div className="p-4 rounded-2xl bg-[#FAF0F8] border border-[#E7B0DE]/40">
              <span className="text-[10px] font-black uppercase text-[#A872AF] block mb-1">
                Associated Topic Cluster
              </span>
              <span className="text-xs font-black text-[#400849] block truncate">
                {result.topic_name}
              </span>
              <span className="text-[10px] text-[#71367B]">NMF Cluster #{result.topic_id + 1}</span>
            </div>

            {/* Decision Boundary Polarity */}
            <div className="p-4 rounded-2xl bg-[#FAF0F8] border border-[#E7B0DE]/40">
              <span className="text-[10px] font-black uppercase text-[#A872AF] block mb-1">
                Decision Boundary Polarity
              </span>
              <span className="text-base font-black text-[#400849]">
                {result.polarity > 0 ? `+${result.polarity.toFixed(3)}` : result.polarity.toFixed(3)}
              </span>
              <span className="text-[10px] text-[#A872AF] block">Range: [-1.000 to +1.000]</span>
            </div>
          </div>

          {/* Platt Calibrated Class Probabilities */}
          <div className="p-4 rounded-2xl bg-[#FAF0F8] border border-[#E7B0DE]/40 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-[#71367B]">
              <span>Platt-Calibrated Class Probabilities</span>
              <span>
                <span className="text-[#10B981]">
                  {(result.probabilities.positive * 100).toFixed(1)}% Pos
                </span>{" "}
                &bull;{" "}
                <span className="text-[#FF5A0A]">
                  {(result.probabilities.neutral * 100).toFixed(1)}% Neu
                </span>{" "}
                &bull;{" "}
                <span className="text-[#E11D48]">
                  {(result.probabilities.negative * 100).toFixed(1)}% Neg
                </span>
              </span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-white overflow-hidden flex border border-[#E7B0DE]/40">
              <div
                className="bg-[#10B981] h-full transition-all duration-300"
                style={{ width: `${result.probabilities.positive * 100}%` }}
              />
              <div
                className="bg-[#FF5A0A] h-full transition-all duration-300"
                style={{ width: `${result.probabilities.neutral * 100}%` }}
              />
              <div
                className="bg-[#E11D48] h-full transition-all duration-300"
                style={{ width: `${result.probabilities.negative * 100}%` }}
              />
            </div>
          </div>

          {/* Token-Level Linear Coefficient Explainability */}
          <div>
            <span className="text-[10px] font-black uppercase text-[#A872AF] block mb-2">
              Isolated Influential TF-IDF Terms (Linear Decision Hyperplane Weights)
            </span>
            <div className="flex flex-wrap gap-2">
              {result.influential_terms.map((term, i) => {
                const isPos = term.polarity === "positive";
                return (
                  <span
                    key={i}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border ${
                      isPos
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
              {result.influential_terms.length === 0 && (
                <p className="text-xs text-[#71367B] italic">
                  No individual terms crossed the linear coefficient significance threshold.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
