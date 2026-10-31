"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface DatasetCard {
  id: string;
  title: string;
  industry: string;
  records: number;
  csat: string;
  topics: number;
  description: string;
  topTheme: string;
  status: string;
}

const DATASETS: DatasetCard[] = [
  {
    id: "saas-986",
    title: "Voxora Enterprise SaaS Feedback",
    industry: "B2B Cloud Software",
    records: 986,
    csat: "78.4",
    topics: 5,
    description:
      "Enterprise customer feedback across multi-tenant infrastructure, webhook SLAs, SAML SSO migrations, and billing itemization.",
    topTheme: "Platform Performance & Webhook Timeouts",
    status: "Active In-Memory Corpus",
  },
  {
    id: "ecommerce-500",
    title: "Global E-Commerce Customer Experience",
    industry: "Consumer Retail & D2C",
    records: 500,
    csat: "64.2",
    topics: 4,
    description:
      "Cross-channel review data covering checkout conversion drop-off, courier delivery tracking, return logistics, and product packaging.",
    topTheme: "Last-Mile Delivery Delays",
    status: "Pre-Configured Benchmark",
  },
  {
    id: "fintech-420",
    title: "Fintech Mobile Banking CSAT",
    industry: "Financial Services",
    records: 420,
    csat: "82.1",
    topics: 4,
    description:
      "Customer support telemetry evaluating wire transfer verification velocity, biometric authentication, and fraud prevention alerts.",
    topTheme: "Biometric Login Reliability",
    status: "Pre-Configured Benchmark",
  },
];

export function LandingDatasets() {
  return (
    <section id="datasets" className="scroll-mt-28 py-24 sm:py-32 px-6 sm:px-12 lg:px-16 max-w-[1600px] mx-auto border-b border-[#400849]/10">
      {/* Top Editorial Row */}
      <div className="pb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#9E64A5] mb-4">
            05 / Curated Workspaces
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-[#26052B] leading-[1.08] max-w-2xl">
            Pre-loaded corpora,{" "}
            <span className="font-serif-luxury italic font-medium text-[#FF5A0A]">
              ready for analysis.
            </span>
          </h2>
        </div>
        <p className="text-sm font-medium text-[#6B3075] max-w-md">
          Explore fully vectorized datasets with pre-computed NMF latent representations, Platt posterior calibrations, and 2D continuous coordinates.
        </p>
      </div>

      {/* 3 Dataset Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {DATASETS.map((dataset) => (
          <div
            key={dataset.id}
            className="p-8 rounded-3xl bg-white border border-[#400849]/15 shadow-xl shadow-[#400849]/5 flex flex-col justify-between space-y-6 hover:border-[#FF5A0A]/40 transition-all hover:shadow-2xl group"
          >
            <div className="space-y-4">
              {/* Badge & Records */}
              <div className="flex items-center justify-between text-xs">
                <span className="px-3 py-1 rounded-full bg-[#F5EDF4] text-[#400849] font-bold tracking-wider uppercase text-[10px]">
                  {dataset.industry}
                </span>
                <span className="font-mono text-[#9E64A5] text-xs font-semibold">
                  {dataset.records} Records
                </span>
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-[#26052B] group-hover:text-[#FF5A0A] transition-colors">
                {dataset.title}
              </h3>

              {/* Description */}
              <p className="text-xs sm:text-sm text-[#6B3075] leading-relaxed font-normal">
                {dataset.description}
              </p>

              {/* Telemetry Micro Stats */}
              <div className="pt-4 border-t border-[#400849]/10 grid grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="text-[10px] uppercase font-mono text-[#9E64A5]">Harmonic CSAT</div>
                  <div className="text-lg font-bold text-[#26052B] mt-0.5">{dataset.csat} / 100</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase font-mono text-[#9E64A5]">Latent Topics</div>
                  <div className="text-lg font-bold text-[#26052B] mt-0.5">{dataset.topics} Clusters</div>
                </div>
              </div>

              {/* Top Friction Theme */}
              <div className="p-3 rounded-xl bg-[#FBF8FA] border border-[#400849]/10 text-xs">
                <span className="text-[10px] font-mono text-[#9E64A5] uppercase tracking-wider block">
                  Top Discovered Friction
                </span>
                <span className="font-semibold text-[#26052B] mt-0.5 block">{dataset.topTheme}</span>
              </div>
            </div>

            {/* Action Button */}
            <Link
              href="/dashboard"
              className="w-full py-3 px-4 rounded-xl bg-[#400849] group-hover:bg-[#FF5A0A] text-white text-xs font-bold tracking-wide transition-all flex items-center justify-center gap-2"
            >
              <span>Launch Studio with this Corpus</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
