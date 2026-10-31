"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, UploadCloud, CheckCircle2 } from "lucide-react";
import { Logo } from "@/components/layout/Logo";

export function LandingCta() {
  return (
    <section className="bg-[#18031D] text-white pt-24 sm:pt-32 pb-16 px-6 sm:px-12 lg:px-16 relative overflow-hidden">
      {/* Ambient Radial Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-[#FF5A0A]/20 via-[#400849]/30 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-[1600px] mx-auto relative z-10">
        {/* Main Banner Card */}
        <div className="text-center max-w-4xl mx-auto space-y-8 pb-24 border-b border-white/10">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-[#FF5A0A] font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#FF5A0A] animate-pulse" />
            <span>Ready for Production Deployment</span>
          </div>

          <h2 className="text-4xl sm:text-6xl lg:text-7xl font-normal tracking-tight text-white leading-[1.06]">
            Transform customer noise into{" "}
            <span className="font-serif-luxury italic font-medium text-[#FF5A0A]">
              boardroom clarity.
            </span>
          </h2>

          <p className="text-lg sm:text-xl text-white/70 max-w-2xl mx-auto font-normal leading-relaxed">
            Ingest thousands of customer reviews and feedback streams. Experience deterministic mathematical intelligence with zero cloud vendor lock-in.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-9 py-4 rounded-full bg-[#FF5A0A] hover:bg-[#E04D05] text-white text-sm font-bold tracking-wide shadow-xl shadow-[#FF5A0A]/25 transition-all hover:scale-105 flex items-center justify-center gap-3 group"
            >
              <span>Launch Analytics Workspace</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              href="/upload"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/10 hover:bg-white/15 border border-white/20 text-white text-sm font-semibold tracking-wide transition-all flex items-center justify-center gap-3"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Upload Custom Feedback CSV</span>
            </Link>
          </div>

          <div className="pt-8 flex flex-wrap items-center justify-center gap-8 text-xs text-white/50">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
              <span>Zero API token expenses</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
              <span>100% on-premise execution</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
              <span>Audit-ready PDF generation</span>
            </div>
          </div>
        </div>

        {/* Editorial Footer Grid */}
        <div className="pt-16 grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Brand Info */}
          <div className="md:col-span-4 space-y-4">
            <Logo size="lg" />
            <p className="text-sm text-white/60 leading-relaxed max-w-sm pt-2">
              Provable customer feedback intelligence. Decomposing unstructured qualitative sentiment into calibrated vectors, latent topics, and exact mathematical feature weights.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
              <span className="text-xs text-white/60 font-mono">
                System Operational &bull; Local Engine Active
              </span>
            </div>
          </div>

          {/* Navigation Links Column */}
          <div className="md:col-span-3 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-white/40">
              Platform Modules
            </div>
            <ul className="space-y-2 text-sm text-white/70">
              <li>
                <Link href="/dashboard" className="hover:text-white transition-colors">
                  Executive Dashboard
                </Link>
              </li>
              <li>
                <Link href="/reviews" className="hover:text-white transition-colors">
                  Continuous Sentiment Map
                </Link>
              </li>
              <li>
                <Link href="/topics" className="hover:text-white transition-colors">
                  Latent Topic Explorer
                </Link>
              </li>
              <li>
                <Link href="/model" className="hover:text-white transition-colors">
                  Model Tournament & Weights
                </Link>
              </li>
              <li>
                <Link href="/reports" className="hover:text-white transition-colors">
                  Executive PDF Dossiers
                </Link>
              </li>
            </ul>
          </div>

          {/* Mathematical Foundations Column */}
          <div className="md:col-span-3 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-white/40">
              Algorithmic Engine
            </div>
            <ul className="space-y-2 text-sm text-white/70">
              <li>Sparse TF-IDF N-Gram Vectorizer</li>
              <li>Non-Negative Matrix Factorization (NMF)</li>
              <li>Platt-Calibrated Linear SVM</li>
              <li>2D Continuous Latent Coordinates</li>
              <li>Deterministic CPU Hyperplane Math</li>
            </ul>
          </div>

          {/* Architecture & Security Column */}
          <div className="md:col-span-2 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-white/40">
              Security & Stack
            </div>
            <ul className="space-y-2 text-sm text-white/70">
              <li>100% On-Premise</li>
              <li>Zero Cloud Egress</li>
              <li>FastAPI + scikit-learn</li>
              <li>Next.js 16 + React 19</li>
              <li>Auto-Port Discovery</li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-white/40 gap-4">
          <div>&copy; 2026 Voxora AI Inc. All rights reserved.</div>
          <div className="flex items-center gap-6">
            <span>Privacy by Design</span>
            <span>Deterministic AI</span>
            <span>Production Ready</span>
          </div>
        </div>
      </div>
    </section>
  );
}
