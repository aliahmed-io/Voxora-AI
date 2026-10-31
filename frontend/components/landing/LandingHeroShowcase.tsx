"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Activity,
  Layers,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  Flame,
} from "lucide-react";
import { cn } from "@/lib/utils";

type ShowcaseTab = "pulse" | "forensics" | "radar";

export function LandingHeroShowcase() {
  const [activeTab, setActiveTab] = useState<ShowcaseTab>("pulse");
  const [mapMode, setMapMode] = useState<"hexbin" | "scatter">("hexbin");
  const [hoveredToken, setHoveredToken] = useState<string | null>(null);

  // Sample real data from the 986 SaaS reviews dataset
  const tokenBreakdown = [
    { word: "Initial impressions:", weight: 0.05, polarity: "neutral" },
    { word: "Blazing fast", weight: 0.88, polarity: "positive" },
    { word: "search query latency", weight: 0.42, polarity: "positive" },
    { word: "even when scanning", weight: 0.08, polarity: "neutral" },
    { word: "500,000 rows.", weight: 0.35, polarity: "positive" },
    { word: "However,", weight: -0.12, polarity: "neutral" },
    { word: "webhook timeout errors", weight: -0.91, polarity: "negative" },
    { word: "during midnight batch sync", weight: -0.45, polarity: "negative" },
    { word: "caused delays.", weight: -0.38, polarity: "negative" },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto rounded-3xl bg-white border border-[#E7B0DE]/70 shadow-2xl shadow-[#400849]/10 overflow-hidden text-left transition-all">
      {/* Browser Chrome Header */}
      <div className="bg-[#FAF0F8] px-5 py-3.5 border-b border-[#E7B0DE]/50 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E]" />
          <div className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]" />
          <div className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29]" />
          <span className="ml-3 text-xs font-bold text-[#71367B] hidden sm:inline-block">
            voxora.ai/workspace/saas-enterprise
          </span>
        </div>

        {/* Showcase Mode Switcher Tabs */}
        <div className="flex items-center bg-white/80 p-1 rounded-xl border border-[#E7B0DE]/60 text-xs font-bold">
          <button
            onClick={() => setActiveTab("pulse")}
            className={cn(
              "px-3 py-1 rounded-lg transition-all flex items-center gap-1.5",
              activeTab === "pulse"
                ? "bg-[#400849] text-white shadow-xs"
                : "text-[#71367B] hover:text-[#400849]"
            )}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Executive Pulse</span>
          </button>
          <button
            onClick={() => setActiveTab("forensics")}
            className={cn(
              "px-3 py-1 rounded-lg transition-all flex items-center gap-1.5",
              activeTab === "forensics"
                ? "bg-[#400849] text-white shadow-xs"
                : "text-[#71367B] hover:text-[#400849]"
            )}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#FF5A0A]" />
            <span>Token Heatmap</span>
          </button>
          <button
            onClick={() => setActiveTab("radar")}
            className={cn(
              "px-3 py-1 rounded-lg transition-all flex items-center gap-1.5",
              activeTab === "radar"
                ? "bg-[#400849] text-white shadow-xs"
                : "text-[#71367B] hover:text-[#400849]"
            )}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Topic Resonance</span>
          </button>
        </div>

        <Link
          href="/dashboard"
          className="text-xs font-bold text-[#FF5A0A] hover:text-[#E04D05] flex items-center gap-1 shrink-0"
        >
          <span className="hidden md:inline">Open Live App</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Main Interactive Showcase Body */}
      <div className="p-6 sm:p-8 bg-gradient-to-b from-[#FAF4F9]/60 to-white min-h-[440px]">
        {/* TAB 1: EXECUTIVE PULSE */}
        {activeTab === "pulse" && (
          <div className="space-y-6">
            {/* Top KPI Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              <div className="p-4 rounded-2xl bg-white border border-[#E7B0DE]/50 shadow-xs">
                <span className="text-[11px] font-bold text-[#71367B] block">Audited Records</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-black text-[#400849]">986</span>
                  <span className="text-[10px] font-black text-[#10B981]">+18% MoM</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-[#E7B0DE]/50 shadow-xs">
                <span className="text-[11px] font-bold text-[#71367B] block">Positive Delight</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-black text-[#10B981]">379</span>
                  <span className="text-[10px] font-bold text-[#71367B]">(38.4%)</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-[#E7B0DE]/50 shadow-xs">
                <span className="text-[11px] font-bold text-[#71367B] block">Neutral Baseline</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-black text-[#FF5A0A]">296</span>
                  <span className="text-[10px] font-bold text-[#71367B]">(30.0%)</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-[#E7B0DE]/50 shadow-xs">
                <span className="text-[11px] font-bold text-[#71367B] block">Friction Issues</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-black text-[#E11D48]">311</span>
                  <span className="text-[10px] font-bold text-[#71367B]">(31.5%)</span>
                </div>
              </div>
            </div>

            {/* Split Visual Analytics: CSAT Gauge + Sentiment Density Map */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
              {/* CSAT Gauge Card */}
              <div className="lg:col-span-4 p-5 rounded-2xl bg-white border border-[#E7B0DE]/50 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-[#400849]">Composite CSAT</span>
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-[#FAEEF7] text-[#FF5A0A] border border-[#FF5A0A]/20">
                      Calibrated
                    </span>
                  </div>
                  <p className="text-[11px] text-[#71367B] mt-0.5">
                    Continuous polarity integration over 986 reviews
                  </p>
                </div>

                <div className="py-4 flex flex-col items-center justify-center relative">
                  {/* Gauge Arc SVG */}
                  <svg className="w-48 h-28" viewBox="0 0 200 110">
                    <path
                      d="M 20 100 A 80 80 0 0 1 180 100"
                      fill="none"
                      stroke="#FAF0F8"
                      strokeWidth="20"
                      strokeLinecap="round"
                    />
                    <path
                      d="M 20 100 A 80 80 0 0 1 180 100"
                      fill="none"
                      stroke="url(#pulseGaugeGradient)"
                      strokeWidth="20"
                      strokeDasharray="251"
                      strokeDashoffset="118"
                      strokeLinecap="round"
                    />
                    <defs>
                      <linearGradient id="pulseGaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#400849" />
                        <stop offset="60%" stopColor="#631A70" />
                        <stop offset="100%" stopColor="#FF5A0A" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="text-center -mt-8">
                    <span className="text-4xl font-black text-[#400849] tracking-tight">53</span>
                    <span className="text-xs font-bold text-[#A872AF]"> / 100</span>
                    <span className="block text-[11px] font-bold text-[#71367B] mt-0.5">
                      Healthy Enterprise Equilibrium
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#E7B0DE]/30 flex items-center justify-between text-[11px] text-[#71367B]">
                  <span>Threshold: 50.0</span>
                  <span className="font-bold text-[#10B981]">+7.2% vs previous run</span>
                </div>
              </div>

              {/* 2D Sentiment Density Map Card */}
              <div className="lg:col-span-8 p-5 rounded-2xl bg-white border border-[#E7B0DE]/50 shadow-xs flex flex-col justify-between">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="text-xs font-black text-[#400849]">
                      2D Customer Sentiment Density Map
                    </span>
                    <p className="text-[11px] text-[#71367B]">
                      Projected document sentiment score against customer intensity
                    </p>
                  </div>
                  <div className="flex items-center gap-1 bg-[#FAF0F8] p-1 rounded-lg text-[10px] font-bold text-[#71367B]">
                    <button
                      onClick={() => setMapMode("hexbin")}
                      className={cn(
                        "px-2 py-0.5 rounded",
                        mapMode === "hexbin" ? "bg-white text-[#400849] shadow-2xs" : ""
                      )}
                    >
                      Hexbin
                    </button>
                    <button
                      onClick={() => setMapMode("scatter")}
                      className={cn(
                        "px-2 py-0.5 rounded",
                        mapMode === "scatter" ? "bg-white text-[#400849] shadow-2xs" : ""
                      )}
                    >
                      Scatter
                    </button>
                  </div>
                </div>

                {/* Density Visual Representation */}
                <div className="h-44 w-full bg-[#FAF4F9]/70 rounded-xl border border-[#E7B0DE]/40 p-4 relative flex items-center justify-center overflow-hidden">
                  <svg className="w-full h-full" viewBox="0 0 600 160">
                    {/* Grid lines */}
                    <line x1="40" y1="20" x2="580" y2="20" stroke="#E7B0DE" strokeOpacity="0.3" strokeDasharray="4 4" />
                    <line x1="40" y1="80" x2="580" y2="80" stroke="#E7B0DE" strokeOpacity="0.3" strokeDasharray="4 4" />
                    <line x1="40" y1="140" x2="580" y2="140" stroke="#E7B0DE" strokeOpacity="0.5" />

                    {/* High Delight Cluster (Orange) */}
                    <g transform="translate(380, 20)">
                      <circle cx="20" cy="20" r="14" fill="#FF5A0A" fillOpacity="0.3" />
                      <circle cx="45" cy="25" r="18" fill="#FF5A0A" fillOpacity="0.4" />
                      <circle cx="70" cy="15" r="12" fill="#FF5A0A" fillOpacity="0.35" />
                      <circle cx="95" cy="30" r="15" fill="#FF5A0A" fillOpacity="0.45" />
                      <circle cx="120" cy="22" r="10" fill="#FF5A0A" fillOpacity="0.3" />
                      <text x="30" y="55" fill="#FF5A0A" fontSize="10" fontWeight="bold">
                        High Delight Cluster
                      </text>
                    </g>

                    {/* Neutral Central Mass (Purple) */}
                    <g transform="translate(180, 60)">
                      <ellipse cx="60" cy="20" rx="70" ry="25" fill="#631A70" fillOpacity="0.25" />
                      <circle cx="35" cy="18" r="8" fill="#400849" fillOpacity="0.4" />
                      <circle cx="75" cy="22" r="10" fill="#400849" fillOpacity="0.5" />
                      <circle cx="55" cy="25" r="7" fill="#400849" fillOpacity="0.4" />
                      <text x="25" y="40" fill="#631A70" fontSize="10" fontWeight="bold">
                        Equilibrium Density
                      </text>
                    </g>

                    {/* Friction Base (Eggplant Dark) */}
                    <g transform="translate(60, 90)">
                      <ellipse cx="60" cy="30" rx="50" ry="18" fill="#400849" fillOpacity="0.35" />
                      <circle cx="40" cy="28" r="12" fill="#400849" fillOpacity="0.6" />
                      <circle cx="70" cy="32" r="10" fill="#400849" fillOpacity="0.55" />
                      <text x="20" y="45" fill="#400849" fontSize="10" fontWeight="bold">
                        Friction & Latency Root
                      </text>
                    </g>
                  </svg>
                </div>

                <div className="pt-2 flex items-center justify-between text-[11px] text-[#71367B]">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-[#FF5A0A]" /> High Delight
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-[#631A70]" /> Baseline Equilibrium
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-[#400849]" /> Latent Friction
                    </span>
                  </div>
                  <span className="font-bold text-[#400849]">Sublinear TF-IDF Projection</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: TOKEN FORENSIC MICROSCOPE */}
        {activeTab === "forensics" && (
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-[#400849]">
                    Linear Feature Attribution & Token Significance
                  </h3>
                  <p className="text-xs text-[#71367B] mt-0.5">
                    Hover over tokens to inspect calibrated SVM hyperplane weight vectors.
                  </p>
                </div>
                <span className="text-xs font-black text-[#10B981] bg-[#10B981]/10 px-3 py-1 rounded-full border border-[#10B981]/20">
                  Calibrated Confidence: 99.4%
                </span>
              </div>
            </div>

            {/* Interactive Sentence Heatmap Container */}
            <div className="p-6 rounded-2xl bg-white border border-[#E7B0DE]/60 shadow-xs">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#A872AF] block mb-3">
                Customer Record ID: REV-986-SaaS-Enterprise
              </span>

              <div className="text-base sm:text-lg font-medium leading-relaxed flex flex-wrap gap-2 items-center">
                {tokenBreakdown.map((t, i) => {
                  const isHovered = hoveredToken === t.word;
                  const isPositive = t.polarity === "positive";
                  const isNegative = t.polarity === "negative";

                  return (
                    <span
                      key={i}
                      onMouseEnter={() => setHoveredToken(t.word)}
                      onMouseLeave={() => setHoveredToken(null)}
                      className={cn(
                        "px-2.5 py-1 rounded-lg transition-all cursor-pointer border",
                        isPositive &&
                          "bg-[#10B981]/10 border-[#10B981]/30 text-[#047857] hover:bg-[#10B981]/20",
                        isNegative &&
                          "bg-[#E11D48]/10 border-[#E11D48]/30 text-[#BE123C] hover:bg-[#E11D48]/20",
                        !isPositive &&
                          !isNegative &&
                          "bg-[#FAF0F8] border-[#E7B0DE]/40 text-[#400849] hover:bg-[#F3DCF0]",
                        isHovered && "ring-2 ring-[#FF5A0A] scale-105"
                      )}
                    >
                      {t.word}
                      <span
                        className={cn(
                          "ml-1.5 text-[10px] font-black px-1.5 py-0.5 rounded",
                          isPositive && "bg-[#10B981]/20 text-[#065F46]",
                          isNegative && "bg-[#E11D48]/20 text-[#9F1239]",
                          !isPositive && !isNegative && "bg-white text-[#71367B]"
                        )}
                      >
                        {t.weight > 0 ? `+${t.weight.toFixed(2)}` : t.weight.toFixed(2)}
                      </span>
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Token Inspector Detail Bar */}
            <div className="p-4 rounded-xl bg-[#FAF0F8] border border-[#E7B0DE]/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-[#FF5A0A]" />
                <span className="font-bold text-[#400849]">
                  {hoveredToken ? `Inspecting token "${hoveredToken}"` : "Hover any token above to isolate linear weight"}
                </span>
              </div>
              <div className="flex items-center gap-4 text-[#71367B]">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded bg-[#10B981]" /> Positive Driver
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded bg-[#E11D48]" /> Friction Driver
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded bg-[#FAF0F8] border border-[#E7B0DE]" /> Neutral N-Gram
                </span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: TOPIC RESONANCE RADAR */}
        {activeTab === "radar" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black text-[#400849]">
                  Latent Topic Resonance Vector (NMF Factorization)
                </h3>
                <p className="text-xs text-[#71367B] mt-0.5">
                  Unsupervised decomposition into 5 orthogonal customer themes across 986 SaaS reviews.
                </p>
              </div>
              <span className="text-xs font-bold text-[#400849] bg-white px-3 py-1 rounded-full border border-[#E7B0DE]/60">
                5 Discovered Themes
              </span>
            </div>

            {/* 5 Topic Clusters Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
              {[
                { name: "Customer Support & Resolution", count: 324, pct: 32.8, color: "#FF5A0A" },
                { name: "Platform Performance & Stability", count: 256, pct: 25.9, color: "#400849" },
                { name: "Shipping, Packaging & Fulfillment", count: 237, pct: 24.0, color: "#631A70" },
                { name: "Billing, Subscriptions & Invoicing", count: 141, pct: 14.3, color: "#71367B" },
                { name: "User Interface & Onboarding", count: 28, pct: 2.8, color: "#A872AF" },
              ].map((topic, i) => (
                <div
                  key={i}
                  className="p-4 rounded-2xl bg-white border border-[#E7B0DE]/50 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <span className="text-[10px] font-black uppercase text-[#A872AF] block">
                      Cluster 0{i + 1}
                    </span>
                    <h4 className="text-xs font-black text-[#400849] mt-1 leading-snug line-clamp-2">
                      {topic.name}
                    </h4>
                  </div>
                  <div className="mt-4 pt-3 border-t border-[#E7B0DE]/30 flex items-baseline justify-between">
                    <span className="text-lg font-black text-[#400849]">{topic.count}</span>
                    <span className="text-xs font-black" style={{ color: topic.color }}>
                      {topic.pct}%
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-xl bg-white border border-[#E7B0DE]/60 flex items-center justify-between text-xs">
              <span className="text-[#71367B]">
                Discovering conversation themes without black-box hallucination or prompt drift.
              </span>
              <Link
                href="/topics"
                className="font-bold text-[#FF5A0A] hover:text-[#E04D05] flex items-center gap-1"
              >
                <span>Deep-dive topic matrix</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Footer Banner */}
      <div className="px-6 py-3.5 bg-[#FAF0F8] border-t border-[#E7B0DE]/50 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 text-[#71367B]">
          <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
          <span>Active Dataset: <strong>Voxora Enterprise SaaS Feedback (986 records)</strong></span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/reviews?topic=Customer%20Support%20%26%20Resolution"
            className="font-bold text-[#400849] hover:text-[#FF5A0A] transition-colors"
          >
            Filter Support (324)
          </Link>
          <span className="text-[#E7B0DE]">&bull;</span>
          <Link
            href="/reviews?topic=Platform%20Performance%20%26%20System%20Stability"
            className="font-bold text-[#400849] hover:text-[#FF5A0A] transition-colors"
          >
            Filter Performance (256)
          </Link>
        </div>
      </div>
    </div>
  );
}
