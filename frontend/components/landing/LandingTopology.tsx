"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Server, Headphones, Layout, CreditCard, ShieldCheck, ArrowRight } from "lucide-react";

interface LatentCluster {
  id: string;
  name: string;
  volume: number;
  percentage: number;
  sentimentRatio: { positive: number; neutral: number; negative: number };
  icon: React.ReactNode;
  summary: string;
  topTerms: string[];
  representativeQuote: string;
  actionItem: string;
}

const CLUSTERS: LatentCluster[] = [
  {
    id: "stability",
    name: "Platform Stability & Infrastructure",
    volume: 311,
    percentage: 31.5,
    sentimentRatio: { positive: 0.12, neutral: 0.1, negative: 0.78 },
    icon: <Server className="w-5 h-5 text-[#E11D48]" />,
    summary:
      "Gateway timeouts, webhook drops during checkout spikes, and API throttling errors causing lost customer revenue.",
    topTerms: ["504 gateway", "webhook payload", "database timeout", "api throttle", "lost cart"],
    representativeQuote:
      "Frequent 504 timeouts and dropped webhooks during Black Friday traffic. We lost thousands in pending checkout carts.",
    actionItem: "High-priority engineering sprint on auto-scaling and connection pooling.",
  },
  {
    id: "support",
    name: "Support Resolution & SLA Speed",
    volume: 324,
    percentage: 32.9,
    sentimentRatio: { positive: 0.28, neutral: 0.2, negative: 0.52 },
    icon: <Headphones className="w-5 h-5 text-[#FF5A0A]" />,
    summary:
      "Extended ticket turnaround times and lack of senior technical escalation for mission-critical enterprise incidents.",
    topTerms: ["ticket waiting", "unresponsive", "bot deflection", "sla breach", "escalation"],
    representativeQuote:
      "Waiting 72 hours for a response on an audit-blocking billing issue. Bot loops without connecting to a human agent.",
    actionItem: "Implement intelligent tier-3 routing for high-LTV accounts.",
  },
  {
    id: "usability",
    name: "Product Usability & Speed",
    volume: 189,
    percentage: 19.2,
    sentimentRatio: { positive: 0.84, neutral: 0.1, negative: 0.06 },
    icon: <Layout className="w-5 h-5 text-[#10B981]" />,
    summary:
      "High delight regarding the sub-second dashboard rendering speed, clean typography, and fast filtering controls.",
    topTerms: ["sub-second", "intuitive navigation", "delightful ui", "fast filters", "clean layout"],
    representativeQuote:
      "The query responsiveness on large datasets is astonishing. Executive teams get immediate insights without lag.",
    actionItem: "Amplify dashboard speed benchmarks in growth marketing.",
  },
  {
    id: "billing",
    name: "Subscription Invoicing & Clarity",
    volume: 98,
    percentage: 9.9,
    sentimentRatio: { positive: 0.15, neutral: 0.22, negative: 0.63 },
    icon: <CreditCard className="w-5 h-5 text-amber-500" />,
    summary:
      "Confusion around prorated seat additions, unclear VAT breakdowns on PDFs, and delayed credit card receipts.",
    topTerms: ["seat prorating", "unexpected charge", "vat breakdown", "receipt delay", "credit card"],
    representativeQuote:
      "Billed for seats that were removed last month. The invoice receipt doesn't explain the prorated charge breakdown.",
    actionItem: "Redesign monthly billing itemization modal.",
  },
  {
    id: "security",
    name: "Enterprise Security & SAML SSO",
    volume: 64,
    percentage: 6.5,
    sentimentRatio: { positive: 0.91, neutral: 0.06, negative: 0.03 },
    icon: <ShieldCheck className="w-5 h-5 text-[#10B981]" />,
    summary:
      "Unanimous praise for Okta/Azure AD integration velocity, granular role permissions, and immutable audit logs.",
    topTerms: ["saml sso", "okta integration", "audit logs", "rbac permissions", "soc2 compliance"],
    representativeQuote:
      "Rolled out SSO to 500 engineers in under 20 minutes. The audit logging meets our strict infosec compliance.",
    actionItem: "Expand self-serve enterprise security posture features.",
  },
];

export function LandingTopology() {
  const [activeCluster, setActiveCluster] = useState<LatentCluster>(CLUSTERS[0]!);

  return (
    <section id="topology" className="scroll-mt-28 py-24 sm:py-32 px-6 sm:px-12 lg:px-16 max-w-[1600px] mx-auto border-b border-[#400849]/10">
      {/* Top Editorial Row */}
      <div className="pb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#9E64A5] mb-4">
            03 / Latent Theme Topology
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-[#26052B] leading-[1.08] max-w-2xl">
            Unsupervised discovery{" "}
            <span className="font-serif-luxury italic font-medium text-[#FF5A0A]">
              without human bias.
            </span>
          </h2>
        </div>
        <p className="text-sm font-medium text-[#6B3075] max-w-md">
          Non-Negative Matrix Factorization (NMF) extracts natural customer friction and delight clusters from high-dimensional TF-IDF term spaces without manual tag taxonomies.
        </p>
      </div>

      {/* Main Interactive Cluster Browser */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: List of 5 Discovered Clusters */}
        <div className="lg:col-span-5 space-y-3">
          {CLUSTERS.map((cluster) => {
            const isSelected = activeCluster.id === cluster.id;
            return (
              <button
                key={cluster.id}
                type="button"
                onClick={() => setActiveCluster(cluster)}
                className={`w-full p-5 rounded-2xl border text-left transition-all flex items-center justify-between gap-4 group ${
                  isSelected
                    ? "bg-white border-[#400849]/30 shadow-lg shadow-[#400849]/5"
                    : "bg-white/50 border-[#400849]/10 hover:bg-white hover:border-[#400849]/20"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#F5EDF4] flex items-center justify-center shrink-0">
                    {cluster.icon}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-[#26052B] group-hover:text-[#FF5A0A] transition-colors">
                      {cluster.name}
                    </div>
                    <div className="text-xs text-[#6B3075] mt-0.5">
                      {cluster.volume} Customer Reviews &bull; {cluster.percentage}% Volume
                    </div>
                  </div>
                </div>

                {/* Quick Sentiment Indicator Pill */}
                <div className="text-right shrink-0">
                  <span
                    className={`text-xs font-mono font-bold px-2.5 py-1 rounded-full ${
                      cluster.sentimentRatio.negative > 0.5
                        ? "bg-[#E11D48]/10 text-[#E11D48]"
                        : "bg-[#10B981]/10 text-[#10B981]"
                    }`}
                  >
                    {cluster.sentimentRatio.negative > 0.5
                      ? `${(cluster.sentimentRatio.negative * 100).toFixed(0)}% Friction`
                      : `${(cluster.sentimentRatio.positive * 100).toFixed(0)}% Delight`}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Column: Deep Inspection Panel for Selected Cluster */}
        <div className="lg:col-span-7 p-8 sm:p-10 rounded-3xl bg-white border border-[#400849]/15 shadow-xl shadow-[#400849]/5 space-y-8">
          {/* Header of Selected Cluster */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#400849]/10">
            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-[#9E64A5]">
                Cluster Vector Decomposition
              </div>
              <h3 className="text-2xl font-bold text-[#26052B] mt-1">{activeCluster.name}</h3>
            </div>

            <Link
              href={`/reviews?topic=${encodeURIComponent(activeCluster.name)}`}
              className="px-4 py-2 rounded-xl bg-[#400849] hover:bg-[#2F0536] text-white text-xs font-semibold tracking-wide flex items-center gap-2 self-start transition-all"
            >
              <span>Explore {activeCluster.volume} Reviews in Studio</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Narrative Summary */}
          <div className="space-y-2">
            <div className="text-xs font-semibold uppercase tracking-wider text-[#9E64A5]">
              Theme Synthesis
            </div>
            <p className="text-base text-[#6B3075] leading-relaxed font-normal">
              {activeCluster.summary}
            </p>
          </div>

          {/* Representative Customer Voice */}
          <div className="p-5 rounded-2xl bg-[#FBF8FA] border border-[#400849]/10 space-y-2">
            <div className="text-[11px] font-mono uppercase tracking-wider text-[#FF5A0A] font-semibold">
              Authentic Customer Voice
            </div>
            <p className="text-sm text-[#26052B] italic font-serif-luxury leading-relaxed">
              &ldquo;{activeCluster.representativeQuote}&rdquo;
            </p>
          </div>

          {/* Top Token Hyperplane Features */}
          <div className="space-y-3">
            <div className="text-xs font-semibold uppercase tracking-wider text-[#9E64A5]">
              Top Characteristic N-Grams (NMF Matrix H)
            </div>
            <div className="flex flex-wrap gap-2">
              {activeCluster.topTerms.map((term) => (
                <span
                  key={term}
                  className="px-3 py-1.5 rounded-lg bg-[#F5EDF4] border border-[#400849]/10 text-xs font-mono font-medium text-[#26052B]"
                >
                  &ldquo;{term}&rdquo;
                </span>
              ))}
            </div>
          </div>

          {/* Multi-Class Distribution & Action Directive */}
          <div className="pt-6 border-t border-[#400849]/10 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="text-xs font-semibold uppercase tracking-wider text-[#9E64A5]">
                Sentiment Polarity Breakdown
              </div>
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="text-[#10B981] font-bold">
                  {(activeCluster.sentimentRatio.positive * 100).toFixed(0)}% Pos
                </span>
                <span className="text-gray-400">/</span>
                <span className="text-amber-500 font-bold">
                  {(activeCluster.sentimentRatio.neutral * 100).toFixed(0)}% Neu
                </span>
                <span className="text-gray-400">/</span>
                <span className="text-[#E11D48] font-bold">
                  {(activeCluster.sentimentRatio.negative * 100).toFixed(0)}% Neg
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden flex">
                <div
                  className="h-full bg-[#10B981]"
                  style={{ width: `${activeCluster.sentimentRatio.positive * 100}%` }}
                />
                <div
                  className="h-full bg-amber-400"
                  style={{ width: `${activeCluster.sentimentRatio.neutral * 100}%` }}
                />
                <div
                  className="h-full bg-[#E11D48]"
                  style={{ width: `${activeCluster.sentimentRatio.negative * 100}%` }}
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-xs font-semibold uppercase tracking-wider text-[#9E64A5]">
                Executive Directive
              </div>
              <p className="text-xs text-[#26052B] font-medium leading-relaxed">
                {activeCluster.actionItem}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
