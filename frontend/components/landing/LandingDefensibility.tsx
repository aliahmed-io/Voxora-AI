"use client";

import React from "react";
import Link from "next/link";
import { Check, X, Minus, ArrowUpRight } from "lucide-react";

interface Criterion {
  dimension: string;
  voxora: { title: string; detail: string; status: "success" };
  cloudLlm: { title: string; detail: string; status: "failure" };
  lexicon: { title: string; detail: string; status: "warning" | "success" };
}

const CRITERIA: Criterion[] = [
  {
    dimension: "Decision Reproducibility",
    voxora: {
      title: "100% Deterministic Hyperplane",
      detail: "Identical input produces identical mathematical score every single execution.",
      status: "success",
    },
    cloudLlm: {
      title: "Stochastic & Variable Drift",
      detail: "Subject to prompt drift, model updates, and non-deterministic temperature seeds.",
      status: "failure",
    },
    lexicon: {
      title: "Deterministic (Dictionary Rules)",
      detail: "Static dictionary matching without contextual weight adaptation.",
      status: "success",
    },
  },
  {
    dimension: "Inference Latency",
    voxora: {
      title: "< 0.12 ms on Commodity CPU",
      detail: "Instantaneous vector dot product without GPU infrastructure or network queues.",
      status: "success",
    },
    cloudLlm: {
      title: "800 ms – 2,400 ms Network Lag",
      detail: "Multi-second roundtrips blocking synchronous user workflows.",
      status: "failure",
    },
    lexicon: {
      title: "~0.05 ms",
      detail: "Fast string matching but lacks multi-word n-gram context.",
      status: "success",
    },
  },
  {
    dimension: "Data Privacy & Air-Gap",
    voxora: {
      title: "100% On-Premise (Zero Egress)",
      detail: "Customer PII, billing complaints, and internal telemetry never leave your perimeter.",
      status: "success",
    },
    cloudLlm: {
      title: "Exfiltrates PII to 3rd-Party Cloud",
      detail: "Requires vendor DPAs, risk assessments, and cross-border data transfer scrutiny.",
      status: "failure",
    },
    lexicon: {
      title: "Local Execution",
      detail: "Runs on-premise without external network communication.",
      status: "success",
    },
  },
  {
    dimension: "Feature Attribution",
    voxora: {
      title: "Exact Linear Weights (w_i)",
      detail: "Mathematically provable coefficients directly from the SVM decision hyperplane.",
      status: "success",
    },
    cloudLlm: {
      title: "Hallucinated Post-Hoc Text",
      detail: "Plausible-sounding verbal rationale with zero verifiable mathematical grounding.",
      status: "failure",
    },
    lexicon: {
      title: "Hardcoded Word Lookup",
      detail: "Fixed pre-assigned weights ignorant of domain-specific jargon.",
      status: "warning",
    },
  },
  {
    dimension: "Cost per 100k Records",
    voxora: {
      title: "$0.00 Incurred Token Fees",
      detail: "Runs on existing servers with zero marginal inference billing.",
      status: "success",
    },
    cloudLlm: {
      title: "$60.00 – $140.00 per Run",
      detail: "Explosive token consumption scaling linearly with customer volume.",
      status: "failure",
    },
    lexicon: {
      title: "$0.00 Incurred Fees",
      detail: "No token billing but severely impaired classification accuracy.",
      status: "success",
    },
  },
];

export function LandingDefensibility() {
  return (
    <section id="defensibility" className="scroll-mt-28 py-24 sm:py-32 px-6 sm:px-12 lg:px-16 max-w-[1600px] mx-auto border-b border-[#400849]/10">
      {/* Top Editorial Row */}
      <div className="pb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#9E64A5] mb-4">
            04 / Defensibility Matrix
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-[#26052B] leading-[1.08] max-w-2xl">
            Why provable machine learning{" "}
            <span className="font-serif-luxury italic font-medium text-[#FF5A0A]">
              beats black-box LLMs.
            </span>
          </h2>
        </div>
        <p className="text-sm font-medium text-[#6B3075] max-w-md">
          Executive teams, auditors, and data scientists require deterministic reproducibility, exact mathematical attribution, and strict data sovereignty.
        </p>
      </div>

      {/* Luxury Editorial Matrix Table */}
      <div className="rounded-3xl bg-white border border-[#400849]/15 shadow-xl shadow-[#400849]/5 overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-12 bg-[#FBF8FA] border-b border-[#400849]/15 py-5 px-6 sm:px-8 text-xs font-bold uppercase tracking-wider text-[#9E64A5]">
          <div className="col-span-12 sm:col-span-3">Evaluation Dimension</div>
          <div className="col-span-12 sm:col-span-4 text-[#400849] font-black">
            Voxora AI &bull; Calibrated Linear SVM
          </div>
          <div className="col-span-12 sm:col-span-3">Cloud LLMs (GPT-4 / Claude)</div>
          <div className="col-span-12 sm:col-span-2">Lexicon Rules (VADER)</div>
        </div>

        {/* Table Rows */}
        <div className="divide-y divide-[#400849]/10">
          {CRITERIA.map((criterion) => (
            <div
              key={criterion.dimension}
              className="grid grid-cols-12 py-6 px-6 sm:px-8 items-start hover:bg-[#FDFBFE] transition-colors gap-4 sm:gap-0"
            >
              {/* Dimension Name */}
              <div className="col-span-12 sm:col-span-3 pr-4">
                <div className="text-sm font-bold text-[#26052B]">{criterion.dimension}</div>
              </div>

              {/* Voxora AI Column (Highlighted) */}
              <div className="col-span-12 sm:col-span-4 pr-6">
                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-[#10B981]/15 text-[#10B981] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-[#26052B]">
                      {criterion.voxora.title}
                    </div>
                    <div className="text-xs text-[#6B3075] mt-1 leading-relaxed">
                      {criterion.voxora.detail}
                    </div>
                  </div>
                </div>
              </div>

              {/* Cloud LLM Column */}
              <div className="col-span-12 sm:col-span-3 pr-6">
                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-[#E11D48]/15 text-[#E11D48] flex items-center justify-center shrink-0 mt-0.5">
                    <X className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-[#6B3075]">
                      {criterion.cloudLlm.title}
                    </div>
                    <div className="text-[11px] text-[#9E64A5] mt-1 leading-relaxed">
                      {criterion.cloudLlm.detail}
                    </div>
                  </div>
                </div>
              </div>

              {/* Lexicon Rules Column */}
              <div className="col-span-12 sm:col-span-2">
                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center shrink-0 mt-0.5">
                    {criterion.lexicon.status === "success" ? (
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                    ) : (
                      <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
                    )}
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-[#6B3075]">
                      {criterion.lexicon.title}
                    </div>
                    <div className="text-[11px] text-[#9E64A5] mt-1 leading-relaxed">
                      {criterion.lexicon.detail}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Bar */}
        <div className="bg-[#FBF8FA] border-t border-[#400849]/15 p-6 sm:px-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="text-xs text-[#6B3075] font-medium">
            Benchmarked across 986 SaaS enterprise reviews with stratified 80/20 train/test split.
          </div>
          <Link
            href="/model"
            className="text-xs font-bold text-[#FF5A0A] hover:underline flex items-center gap-1.5"
          >
            <span>Explore full confusion matrix & tournament scores</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
