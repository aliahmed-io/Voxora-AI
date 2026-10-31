"use client";

import React from "react";
import Link from "next/link";
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowRight,
} from "lucide-react";

export function LandingBenchmark() {
  const CRITERIA = [
    {
      criterion: "Decision Reproducibility",
      voxora: { text: "100% Deterministic (SVM Hyperplane)", win: true },
      llm: { text: "Variable (Temperature & Prompt Drift)", win: false },
      vader: { text: "Deterministic (Fixed Lexicon)", win: true },
    },
    {
      criterion: "Inference Latency",
      voxora: { text: "< 10 µs per record (CPU)", win: true },
      llm: { text: "800 ms – 2,400 ms (API network roundtrip)", win: false },
      vader: { text: "50 µs per record", win: true },
    },
    {
      criterion: "Data Privacy & Air-Gap",
      voxora: { text: "100% On-Premise (Zero egress)", win: true },
      llm: { text: "Exfiltrates customer PII to cloud", win: false },
      vader: { text: "100% On-Premise", win: true },
    },
    {
      criterion: "Feature Attribution",
      voxora: { text: "Exact Linear Weights per N-Gram", win: true },
      llm: { text: "Post-hoc hallucinated explanation", win: false },
      vader: { text: "Static dictionary lookup only", win: false },
    },
    {
      criterion: "Domain Context Adaptability",
      voxora: { text: "Learned from real SaaS data", win: true },
      llm: { text: "Requires large prompt engineering", win: false },
      vader: { text: "Fails on modern SaaS jargon", win: false },
    },
    {
      criterion: "Operating Cost / 100k Reviews",
      voxora: { text: "$0.00 (Standard commodity CPU)", win: true },
      llm: { text: "~$45.00 – $120.00 (API tokens)", win: false },
      vader: { text: "$0.00", win: true },
    },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto space-y-12 text-left">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-black uppercase tracking-wider text-[#400849] bg-[#FAF0F8] px-3.5 py-1.5 rounded-full border border-[#E7B0DE]/60 inline-block">
          Academic Defensibility
        </span>
        <h2 className="text-3xl sm:text-4xl font-black text-[#400849] tracking-tight">
          Why Provable Machine Learning Beats Black-Box LLMs
        </h2>
        <p className="text-sm sm:text-base text-[#71367B] leading-relaxed">
          For executive decisions and senior thesis defense, feedback intelligence must be deterministic, auditable, and mathematically defensible.
        </p>
      </div>

      {/* Comparison Matrix Table */}
      <div className="rounded-3xl bg-white border border-[#E7B0DE]/70 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FAF0F8] border-b border-[#E7B0DE]/60 text-xs text-[#400849]">
                <th className="p-5 font-black uppercase tracking-wider">Evaluation Criterion</th>
                <th className="p-5 font-black uppercase tracking-wider bg-[#400849] text-white">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FF5A0A]" />
                    <span>Voxora AI (Calibrated SVM)</span>
                  </div>
                </th>
                <th className="p-5 font-black uppercase tracking-wider text-[#71367B]">
                  Cloud LLM (e.g. GPT-4 / Claude)
                </th>
                <th className="p-5 font-black uppercase tracking-wider text-[#71367B]">
                  Lexicon Rules (VADER / TextBlob)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E7B0DE]/30 text-xs">
              {CRITERIA.map((row, i) => (
                <tr key={i} className="hover:bg-[#FAF4F9]/60 transition-colors">
                  <td className="p-5 font-bold text-[#400849]">{row.criterion}</td>
                  {/* Voxora Column */}
                  <td className="p-5 bg-[#400849]/5 font-black text-[#400849]">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
                      <span>{row.voxora.text}</span>
                    </div>
                  </td>
                  {/* Cloud LLM Column */}
                  <td className="p-5 text-[#71367B]">
                    <div className="flex items-center gap-2">
                      {row.llm.win ? (
                        <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 text-[#E11D48] shrink-0" />
                      )}
                      <span>{row.llm.text}</span>
                    </div>
                  </td>
                  {/* VADER Column */}
                  <td className="p-5 text-[#71367B]">
                    <div className="flex items-center gap-2">
                      {row.vader.win ? (
                        <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-[#FF5A0A] shrink-0" />
                      )}
                      <span>{row.vader.text}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footnote Bar */}
        <div className="p-5 bg-[#FAF0F8] border-t border-[#E7B0DE]/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <span className="text-[#71367B]">
            Benchmarked against scikit-learn 1.4 tournament on 986 SaaS reviews with stratified splits.
          </span>
          <Link
            href="/model"
            className="font-bold text-[#FF5A0A] hover:text-[#E04D05] flex items-center gap-1 shrink-0"
          >
            <span>View Full Confusion Matrix & Tournament Data</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
