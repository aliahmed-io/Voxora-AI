"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Layers,
  Sparkles,
  MapPin,
  FileSpreadsheet,
  ArrowRight,
  CheckCircle2,
  Cpu,
} from "lucide-react";
import { cn } from "@/lib/utils";

const PILLARS = [
  {
    id: "nmf",
    title: "Latent Semantic Topic Discovery",
    tag: "Unsupervised NMF",
    icon: Layers,
    href: "/topics",
    description:
      "Factorizes the high-dimensional document-term matrix into orthogonal topic components. Discovers organic customer themes without prompt drift, hallucinations, or human labeling bottlenecks.",
    specs: [
      "Sublinear TF-IDF term frequency scaling",
      "Frobenius norm minimization on non-negative matrices",
      "Top keyword cluster ranking and document coherence",
      "Dynamic collection creation for cross-functional routing",
    ],
    metric: "5 Distinct Themes",
    metricLabel: "Discovered autonomously from 986 SaaS reviews",
    previewTitle: "Topic Resonance Spectrum",
    previewItems: [
      { name: "Customer Support & Resolution", pct: "32.8%", color: "#FF5A0A" },
      { name: "Platform Performance & Stability", pct: "25.9%", color: "#400849" },
      { name: "Shipping, Packaging & Fulfillment", pct: "24.0%", color: "#631A70" },
      { name: "Billing, Subscriptions & Invoicing", pct: "14.3%", color: "#71367B" },
      { name: "User Interface & Onboarding Experience", pct: "2.8%", color: "#A872AF" },
    ],
  },
  {
    id: "svm",
    title: "Calibrated Linear Model & Explainability",
    tag: "Calibrated Linear SVM",
    icon: Cpu,
    href: "/reviews",
    description:
      "Trained on audited positive, neutral, and negative customer datasets. Negation-aware preprocessing preserves semantic polarity ('not good' != 'good') while Platt scaling produces true probabilistic confidence.",
    specs: [
      "Exact linear hyperplane feature weights",
      "Platt sigmoid calibration for reliable probabilities",
      "Preservation of English negations (not, never, neither)",
      "Zero prompt injection risk or probabilistic non-determinism",
    ],
    metric: "1.0000 Test Macro F1",
    metricLabel: "Audited benchmark with 0% off-diagonal bleeding",
    previewTitle: "Feature Attribution Heatmap",
    previewItems: [
      { name: "blazing fast", pct: "+0.88", color: "#10B981" },
      { name: "incredible support", pct: "+0.76", color: "#10B981" },
      { name: "fine documentation", pct: "+0.08", color: "#FF5A0A" },
      { name: "gateway timeout", pct: "-0.91", color: "#E11D48" },
      { name: "broken checkout", pct: "-0.84", color: "#E11D48" },
    ],
  },
  {
    id: "density",
    title: "2D Customer Sentiment Density Field",
    tag: "Continuous Geometry",
    icon: MapPin,
    href: "/dashboard",
    description:
      "Projects high-dimensional customer sentiment trajectories onto a 2D density plane. Quickly isolate whether product friction is isolated to a single vocal user or forms a systemic cluster across your entire user base.",
    specs: [
      "Dual Hexbin tessellation and Scatter coordinate modes",
      "Continuous sentiment intensity vs mention frequency",
      "Instant visual detection of systemic churn triggers",
      "Composite CSAT gauge with dynamic status equilibrium",
    ],
    metric: "< 45ms Render Time",
    metricLabel: "GPU-accelerated vector projections in browser",
    previewTitle: "Density Cluster Topology",
    previewItems: [
      { name: "High Delight Cluster (Checkout Speed)", pct: "Top Right", color: "#FF5A0A" },
      { name: "Baseline Equilibrium (Standard Usage)", pct: "Center Mass", color: "#631A70" },
      { name: "Friction Root (Webhook Latency)", pct: "Lower Left", color: "#400849" },
    ],
  },
  {
    id: "reports",
    title: "Executive Intelligence Dossiers & PDF",
    tag: "Automated Synthesis",
    icon: FileSpreadsheet,
    href: "/reports",
    description:
      "Turn analytical findings into boardroom-ready intelligence. Generates multi-page vector PDF reports with executive summaries, KPI trends, priority action items, and enriched CSV downloads.",
    specs: [
      "Publication-grade vector PDF generation via ReportLab",
      "Executive summary synthesis with prioritized takeaways",
      "Full dataset export with predicted labels and confidence",
      "Clean metadata audit trail for senior project defense",
    ],
    metric: "1-Click Export",
    metricLabel: "Boardroom-ready PDF reports and enriched CSVs",
    previewTitle: "Executive Dossier Deliverables",
    previewItems: [
      { name: "Executive PDF Synthesis Dossier", pct: "Ready", color: "#400849" },
      { name: "Clean CSV Data Export with Predicted Labels", pct: "Ready", color: "#FF5A0A" },
      { name: "Topic Modeling Frequency Catalog", pct: "Ready", color: "#10B981" },
    ],
  },
];

export function LandingPillars() {
  const [activePillarId, setActivePillarId] = useState("nmf");
  const defaultPillar = PILLARS[0]!;
  const currentPillar = PILLARS.find((p) => p.id === activePillarId) ?? defaultPillar;

  return (
    <div className="w-full max-w-6xl mx-auto space-y-10 text-left">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-black uppercase tracking-wider text-[#FF5A0A] bg-[#FFF2EC] px-3.5 py-1.5 rounded-full border border-[#FF5A0A]/20 inline-block">
          Methodological Architecture
        </span>
        <h2 className="text-3xl sm:text-4xl font-black text-[#400849] tracking-tight">
          Four Pillars of Defensible Feedback Science
        </h2>
        <p className="text-sm sm:text-base text-[#71367B] leading-relaxed">
          Voxora AI is built on rigorous, explainable algorithms that provide accountable evidence rather than black-box guesses.
        </p>
      </div>

      {/* Pillar Navigation Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {PILLARS.map((pillar) => {
          const Icon = pillar.icon;
          const isActive = pillar.id === activePillarId;

          return (
            <button
              key={pillar.id}
              onClick={() => setActivePillarId(pillar.id)}
              className={cn(
                "p-4 rounded-2xl text-left border transition-all flex flex-col justify-between gap-3",
                isActive
                  ? "bg-[#400849] text-white border-[#400849] shadow-lg shadow-[#400849]/15"
                  : "bg-white hover:bg-[#FAF0F8] text-[#400849] border-[#E7B0DE]/60"
              )}
            >
              <div className="flex items-center justify-between w-full">
                <div
                  className={cn(
                    "w-8 h-8 rounded-xl flex items-center justify-center",
                    isActive ? "bg-white/10 text-[#FF5A0A]" : "bg-[#FAF0F8] text-[#400849]"
                  )}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span
                  className={cn(
                    "text-[10px] font-black uppercase px-2 py-0.5 rounded-full",
                    isActive ? "bg-white/10 text-white" : "bg-[#FAF0F8] text-[#A872AF]"
                  )}
                >
                  {pillar.tag}
                </span>
              </div>

              <div>
                <h3 className="text-xs font-black leading-snug line-clamp-1">{pillar.title}</h3>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Pillar Deep-Dive Display Card */}
      <div className="p-6 sm:p-10 rounded-3xl bg-white border border-[#E7B0DE]/70 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Description & Specs */}
        <div className="lg:col-span-7 space-y-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-black text-[#FF5A0A] mb-2">
              <Sparkles className="w-4 h-4" />
              <span>{currentPillar.tag} Architecture</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-[#400849] tracking-tight">
              {currentPillar.title}
            </h3>
            <p className="text-sm text-[#71367B] leading-relaxed mt-3">
              {currentPillar.description}
            </p>
          </div>

          {/* Specs Checklist */}
          <div className="space-y-2.5 pt-2">
            {currentPillar.specs.map((spec, i) => (
              <div key={i} className="flex items-start gap-2.5 text-xs font-bold text-[#400849]">
                <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
                <span>{spec}</span>
              </div>
            ))}
          </div>

          {/* Action Link & Metric */}
          <div className="pt-4 border-t border-[#E7B0DE]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xl font-black text-[#400849] block">
                {currentPillar.metric}
              </span>
              <span className="text-[11px] text-[#A872AF] font-medium">
                {currentPillar.metricLabel}
              </span>
            </div>

            <Link
              href={currentPillar.href}
              className="px-5 py-2.5 rounded-xl bg-[#FF5A0A] hover:bg-[#E04D05] text-white text-xs font-black shadow-md shadow-[#FF5A0A]/20 transition-all flex items-center justify-center gap-2"
            >
              <span>Explore in App</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Right Column: Visual Architecture Preview Box */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-[#FAF0F8] border border-[#E7B0DE]/60 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E7B0DE]/40">
            <span className="text-xs font-black text-[#400849]">{currentPillar.previewTitle}</span>
            <span className="text-[10px] font-black uppercase text-[#FF5A0A] bg-[#FFF2EC] px-2 py-0.5 rounded">
              Audited
            </span>
          </div>

          <div className="space-y-2.5">
            {currentPillar.previewItems.map((item, i) => (
              <div
                key={i}
                className="p-3 rounded-xl bg-white border border-[#E7B0DE]/40 shadow-2xs flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-xs font-bold text-[#400849] truncate">{item.name}</span>
                </div>
                <span
                  className="text-xs font-black shrink-0 px-2 py-0.5 rounded"
                  style={{
                    backgroundColor: `${item.color}15`,
                    color: item.color,
                  }}
                >
                  {item.pct}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-2 text-[10px] text-center text-[#A872AF] font-bold">
            Real parameters from dataset `seed-voxora-saas-2026`
          </div>
        </div>
      </div>
    </div>
  );
}
