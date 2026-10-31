"use client";

import React from "react";
import { UploadCloud, Layers, LineChart } from "lucide-react";

interface Step {
  step: string;
  title: string;
  description: string;
  tag: string;
  icon: React.ReactNode;
}

const STEPS: Step[] = [
  {
    step: "01",
    title: "Observe.",
    description:
      "Start with what your customers say. Ingest CSVs, Zendesk tickets, or app store feedback. We normalize text, generate (1,2) n-grams, and compute sparse TF-IDF matrices in memory with zero cloud egress.",
    tag: "CSV + IN-MEMORY TF-IDF MATRIX",
    icon: <UploadCloud className="w-5 h-5 text-[#FF5A0A]" />,
  },
  {
    step: "02",
    title: "Decompose.",
    description:
      "Let the mathematics connect the signals. Unsupervised Non-Negative Matrix Factorization (NMF) isolates latent theme clusters without manual labeling, while a Platt-calibrated Linear SVM yields exact hyperplane coefficients.",
    tag: "UNSUPERVISED NMF (W × H) + LINEAR SVM",
    icon: <Layers className="w-5 h-5 text-[#FF5A0A]" />,
  },
  {
    step: "03",
    title: "Anticipate.",
    description:
      "Focus executive attention on what moves the business. Project every review onto a continuous 2D friction/delight plane, isolate high-risk accounts before churn cascades, and export audit-ready boardroom dossiers.",
    tag: "2D DENSITY MAPPING + EXECUTIVE DOSSIERS",
    icon: <LineChart className="w-5 h-5 text-[#FF5A0A]" />,
  },
];

export function LandingMethod() {
  return (
    <section id="method" className="scroll-mt-28 py-24 sm:py-32 px-6 sm:px-12 lg:px-16 max-w-[1600px] mx-auto border-b border-[#400849]/10">
      {/* Top Header Row with Asymmetric Editorial Balance */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-16">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#9E64A5] mb-4">
            The Voxora Method
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-[#26052B] leading-[1.08] max-w-2xl">
            From raw customer noise{" "}
            <span className="font-serif-luxury italic font-medium text-[#FF5A0A]">
              to a clearer direction.
            </span>
          </h2>
        </div>

        <div className="text-sm font-medium text-[#6B3075] lg:text-right max-w-xs space-y-1">
          <div>Three considered mathematical phases.</div>
          <div>One connected on-premise workflow.</div>
        </div>
      </div>

      {/* 3 Generous Horizontal Steps (Matching Mechora Reference) */}
      <div className="border-t border-[#400849]/15 divide-y divide-[#400849]/10">
        {STEPS.map((step) => (
          <div
            key={step.step}
            className="py-12 sm:py-16 grid grid-cols-1 md:grid-cols-12 gap-8 items-center group transition-colors hover:bg-white/40"
          >
            {/* Step Number */}
            <div className="md:col-span-1 text-sm font-serif-luxury italic text-[#9E64A5] group-hover:text-[#FF5A0A] transition-colors">
              {step.step}
            </div>

            {/* Step Verb Title */}
            <div className="md:col-span-3 text-3xl sm:text-4xl font-normal tracking-tight text-[#26052B]">
              {step.title}
            </div>

            {/* Step Narrative Description */}
            <div className="md:col-span-5 text-sm sm:text-base text-[#6B3075] font-normal leading-relaxed pr-0 md:pr-8">
              {step.description}
            </div>

            {/* Right Schematic Visual Card */}
            <div className="md:col-span-3 flex justify-start md:justify-end">
              <div className="w-full sm:w-64 p-5 rounded-2xl bg-[#F3EBF2]/80 border border-[#400849]/10 group-hover:border-[#FF5A0A]/30 group-hover:bg-white group-hover:shadow-md transition-all space-y-3">
                <div className="w-9 h-9 rounded-xl bg-white border border-[#400849]/10 flex items-center justify-center shadow-2xs">
                  {step.icon}
                </div>
                <div className="text-[10px] font-mono tracking-wider uppercase text-[#6B3075] font-semibold">
                  {step.tag}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
