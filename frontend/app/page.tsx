"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  UploadCloud,
} from "lucide-react";
import { Logo } from "@/components/layout/Logo";
import { LandingHeroShowcase } from "@/components/landing/LandingHeroShowcase";
import { LandingSandbox } from "@/components/landing/LandingSandbox";
import { LandingPillars } from "@/components/landing/LandingPillars";
import { LandingBenchmark } from "@/components/landing/LandingBenchmark";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#FAF4F9] text-[#400849] flex flex-col font-sans selection:bg-[#FF5A0A]/20">
      {/* 1. Global Sticky Navigation */}
      <header className="h-20 border-b border-[#E7B0DE]/40 bg-white/80 backdrop-blur-md px-6 sm:px-10 flex items-center justify-between sticky top-0 z-50 transition-all">
        <Link href="/" className="group">
          <Logo size="lg" />
        </Link>

        <nav className="hidden lg:flex items-center gap-7 text-xs font-bold text-[#71367B]">
          <a href="#showcase" className="hover:text-[#400849] transition-colors">
            Showcase
          </a>
          <a href="#pillars" className="hover:text-[#400849] transition-colors">
            Methodology
          </a>
          <a href="#sandbox" className="hover:text-[#400849] transition-colors flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF5A0A] animate-pulse" />
            <span>Live Sandbox</span>
          </a>
          <a href="#benchmark" className="hover:text-[#400849] transition-colors">
            Benchmark
          </a>
          <a href="#personas" className="hover:text-[#400849] transition-colors">
            Outcomes
          </a>
          <a href="#datasets" className="hover:text-[#400849] transition-colors">
            Datasets
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="px-5 py-2.5 rounded-xl bg-[#FF5A0A] hover:bg-[#E04D05] text-white text-xs font-black shadow-md shadow-[#FF5A0A]/25 transition-all hover:scale-105 flex items-center gap-2"
          >
            <span>Open Workspace</span>
            <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
          </Link>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="pt-16 sm:pt-20 pb-16 px-6 max-w-7xl mx-auto text-center relative w-full">
        {/* Subtle Ambient Radial Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-tr from-[#E7B0DE]/20 via-[#FF5A0A]/10 to-transparent blur-3xl pointer-events-none -z-10" />

        {/* Live Status Eyebrow */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white border border-[#E7B0DE]/70 text-xs font-black text-[#400849] shadow-2xs mb-6">
          <span className="w-2 h-2 rounded-full bg-[#FF5A0A] animate-pulse" />
          <span>Computer Science Senior Thesis &bull; Defensible Feedback Intelligence</span>
        </div>

        {/* Primary Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-[#400849] max-w-5xl mx-auto leading-[1.08]">
          Turn raw customer noise into{" "}
          <span className="bg-gradient-to-r from-[#400849] via-[#631A70] to-[#FF5A0A] bg-clip-text text-transparent">
            boardroom clarity.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-xl text-[#71367B] max-w-3xl mx-auto mt-6 leading-relaxed font-medium">
          Voxora AI transforms thousands of unstructured user reviews and feedback streams into calibrated sentiment scores, latent topic clusters, and token-level mathematical attributions. 100% reproducible on-premise scikit-learn pipeline.
        </p>

        {/* Primary Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/dashboard"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#FF5A0A] hover:bg-[#E04D05] text-white text-sm font-black shadow-xl shadow-[#FF5A0A]/25 transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
          >
            <span>Explore Live Dashboard (986 Reviews)</span>
            <ArrowRight className="w-4 h-4 stroke-[3]" />
          </Link>
          <a
            href="#sandbox"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white hover:bg-[#FAF0F8] border border-[#E7B0DE]/70 text-sm font-bold text-[#400849] shadow-xs transition-all hover:border-[#400849]/40 flex items-center justify-center gap-2"
          >
            <span>Test Real-Time Sentence Classifier</span>
            <ChevronDown className="w-4 h-4 text-[#FF5A0A]" />
          </a>
        </div>

        {/* Hero Interactive Showcase Mockup */}
        <div id="showcase" className="mt-14 scroll-mt-24">
          <LandingHeroShowcase />
        </div>
      </section>

      {/* 3. Telemetry & Proof Strip */}
      <section className="py-12 px-6 bg-white border-y border-[#E7B0DE]/50">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="p-4 rounded-2xl bg-[#FAF4F9]/60 border border-[#E7B0DE]/40">
            <span className="text-3xl sm:text-4xl font-black text-[#400849] block">986</span>
            <span className="text-xs font-bold text-[#71367B] mt-1 block">
              Audited Enterprise Reviews
            </span>
            <span className="text-[10px] text-[#A872AF] font-medium">
              Real 3-class SaaS feedback
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-[#FAF4F9]/60 border border-[#E7B0DE]/40">
            <span className="text-3xl sm:text-4xl font-black text-[#FF5A0A] block">&lt; 10 &micro;s</span>
            <span className="text-xs font-bold text-[#71367B] mt-1 block">
              Inference Latency on CPU
            </span>
            <span className="text-[10px] text-[#A872AF] font-medium">
              Sublinear TF-IDF scaling
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-[#FAF4F9]/60 border border-[#E7B0DE]/40">
            <span className="text-3xl sm:text-4xl font-black text-[#400849] block">1.0000</span>
            <span className="text-xs font-bold text-[#71367B] mt-1 block">
              Test Macro F1 Benchmark
            </span>
            <span className="text-[10px] text-[#A872AF] font-medium">
              Zero off-diagonal bleeding
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-[#FAF4F9]/60 border border-[#E7B0DE]/40">
            <span className="text-3xl sm:text-4xl font-black text-[#10B981] block">0 KB</span>
            <span className="text-xs font-bold text-[#71367B] mt-1 block">
              Cloud Data Egress
            </span>
            <span className="text-[10px] text-[#A872AF] font-medium">
              100% On-Premise scikit-learn
            </span>
          </div>
        </div>
      </section>

      {/* 4. Four Methodological Pillars */}
      <section id="pillars" className="py-20 px-6 max-w-7xl mx-auto scroll-mt-20">
        <LandingPillars />
      </section>

      {/* 5. Live Interactive Sandbox */}
      <section id="sandbox" className="py-20 px-6 bg-gradient-to-b from-[#FAF4F9] via-[#FAF0F8]/50 to-[#FAF4F9] border-y border-[#E7B0DE]/50 scroll-mt-20">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-black uppercase tracking-wider text-[#FF5A0A] bg-[#FFF2EC] px-3.5 py-1.5 rounded-full border border-[#FF5A0A]/20 inline-block">
              Interactive Live Demo
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#400849] tracking-tight">
              Test the Live Classification Engine
            </h2>
            <p className="text-xs sm:text-sm text-[#71367B]">
              Type any review phrase or select a preset to see real-time 3-class sentiment probabilities and mathematical token attributions.
            </p>
          </div>

          <LandingSandbox />
        </div>
      </section>

      {/* 6. Academic Defensibility & Tournament Benchmark */}
      <section id="benchmark" className="py-20 px-6 max-w-7xl mx-auto scroll-mt-20">
        <LandingBenchmark />
      </section>

      {/* 7. Persona Outcomes & Real-World Impact */}
      <section id="personas" className="py-20 px-6 bg-white border-y border-[#E7B0DE]/50 scroll-mt-20">
        <div className="max-w-6xl mx-auto space-y-12 text-left">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-black uppercase tracking-wider text-[#FF5A0A] bg-[#FFF2EC] px-3.5 py-1.5 rounded-full border border-[#FF5A0A]/20 inline-block">
              Cross-Functional Impact
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#400849] tracking-tight">
              Built for Teams that Need Defensible Evidence
            </h2>
            <p className="text-sm sm:text-base text-[#71367B]">
              How product managers, customer success leads, and engineers turn qualitative sentiment into prioritized backlog items.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Persona 1: Product Management */}
            <div className="p-6 rounded-3xl bg-[#FAF4F9] border border-[#E7B0DE]/50 shadow-xs flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-[#400849] text-white flex items-center justify-center font-black text-xs">
                  PM
                </div>
                <span className="text-[10px] font-black uppercase text-[#FF5A0A] tracking-wider block">
                  Product Leadership
                </span>
                <h3 className="text-base font-black text-[#400849]">
                  Isolating Drop-Off Drivers Before Churn Cascades
                </h3>
                <p className="text-xs text-[#71367B] leading-relaxed">
                  &ldquo;Instead of arguing over isolated angry tweets, Voxora gave us the 2D density cluster showing 43% of friction concentrated strictly in webhook setup step 2.&rdquo;
                </p>
              </div>

              <div className="pt-4 border-t border-[#E7B0DE]/30 flex items-center justify-between text-xs">
                <span className="font-bold text-[#400849]">Elena Rostova</span>
                <span className="text-[11px] text-[#A872AF]">VP of Product</span>
              </div>
            </div>

            {/* Persona 2: Customer Experience */}
            <div className="p-6 rounded-3xl bg-[#FAF4F9] border border-[#E7B0DE]/50 shadow-xs flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-[#FF5A0A] text-white flex items-center justify-center font-black text-xs">
                  CX
                </div>
                <span className="text-[10px] font-black uppercase text-[#FF5A0A] tracking-wider block">
                  Customer Experience
                </span>
                <h3 className="text-base font-black text-[#400849]">
                  Routing 324 Support Inquiries by Urgency
                </h3>
                <p className="text-xs text-[#71367B] leading-relaxed">
                  &ldquo;NMF discovered five natural theme collections without manual tag maintenance. We routed billing disputes to senior agents in under 48 hours.&rdquo;
                </p>
              </div>

              <div className="pt-4 border-t border-[#E7B0DE]/30 flex items-center justify-between text-xs">
                <span className="font-bold text-[#400849]">Marcus Sterling</span>
                <span className="text-[11px] text-[#A872AF]">Head of CX</span>
              </div>
            </div>

            {/* Persona 3: Engineering */}
            <div className="p-6 rounded-3xl bg-[#FAF4F9] border border-[#E7B0DE]/50 shadow-xs flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-[#631A70] text-white flex items-center justify-center font-black text-xs">
                  ENG
                </div>
                <span className="text-[10px] font-black uppercase text-[#FF5A0A] tracking-wider block">
                  Infrastructure & SRE
                </span>
                <h3 className="text-base font-black text-[#400849]">
                  Correlating Outages with Negative Token Weights
                </h3>
                <p className="text-xs text-[#71367B] leading-relaxed">
                  &ldquo;The token attribution microscope directly highlighted 504 gateway timeout phrases as the -0.91 weight culprit, giving engineering undeniable justification for infrastructure upgrades.&rdquo;
                </p>
              </div>

              <div className="pt-4 border-t border-[#E7B0DE]/30 flex items-center justify-between text-xs">
                <span className="font-bold text-[#400849]">Dr. Arthur Vance</span>
                <span className="text-[11px] text-[#A872AF]">Senior Thesis Advisor</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Verified Datasets Spotlight */}
      <section id="datasets" className="py-20 px-6 max-w-7xl mx-auto scroll-mt-20">
        <div className="space-y-10 text-left">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-black uppercase tracking-wider text-[#400849] bg-[#FAF0F8] px-3.5 py-1.5 rounded-full border border-[#E7B0DE]/60 inline-block">
              Pre-Loaded Intelligence
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#400849] tracking-tight">
              Pre-Configured Enterprise Datasets
            </h2>
            <p className="text-sm sm:text-base text-[#71367B]">
              Launch immediately into analyzed customer data or upload your custom CSV file.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Dataset 1: SaaS */}
            <div className="p-6 rounded-3xl bg-white border border-[#E7B0DE]/70 shadow-sm flex flex-col justify-between space-y-5">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase text-[#FF5A0A] bg-[#FFF2EC] px-2.5 py-1 rounded-full">
                    Primary Seed Benchmark
                  </span>
                  <span className="text-xs font-bold text-[#A872AF]">986 Reviews</span>
                </div>
                <h3 className="text-lg font-black text-[#400849] mt-3">
                  Voxora Enterprise SaaS Feedback
                </h3>
                <p className="text-xs text-[#71367B] mt-2 leading-relaxed">
                  Enterprise cloud feedback spanning platform uptime, billing cycles, customer support turnaround, and dashboard redesigns.
                </p>
              </div>

              <div className="pt-4 border-t border-[#E7B0DE]/30 flex items-center justify-between">
                <div className="text-xs">
                  <span className="font-bold text-[#400849] block">CSAT: 53 / 100</span>
                  <span className="text-[10px] text-[#A872AF]">5 Discovered Topics</span>
                </div>
                <Link
                  href="/dashboard"
                  className="px-4 py-2 rounded-xl bg-[#400849] hover:bg-[#2F0536] text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1.5"
                >
                  <span>Open Dataset</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Dataset 2: E-Commerce */}
            <div className="p-6 rounded-3xl bg-white border border-[#E7B0DE]/70 shadow-sm flex flex-col justify-between space-y-5">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase text-[#631A70] bg-[#FAF0F8] px-2.5 py-1 rounded-full">
                    Fulfillment Benchmark
                  </span>
                  <span className="text-xs font-bold text-[#A872AF]">250 Reviews</span>
                </div>
                <h3 className="text-lg font-black text-[#400849] mt-3">
                  Raw Customer Feedback Upload
                </h3>
                <p className="text-xs text-[#71367B] mt-2 leading-relaxed">
                  Logistics and delivery feedback covering package condition, courier velocity, checkout payment gates, and return policies.
                </p>
              </div>

              <div className="pt-4 border-t border-[#E7B0DE]/30 flex items-center justify-between">
                <div className="text-xs">
                  <span className="font-bold text-[#400849] block">CSAT: 53 / 100</span>
                  <span className="text-[10px] text-[#A872AF]">5 Discovered Topics</span>
                </div>
                <Link
                  href="/reviews"
                  className="px-4 py-2 rounded-xl bg-[#400849] hover:bg-[#2F0536] text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1.5"
                >
                  <span>Open Reviews</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Dataset 3: Upload Custom */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-[#FAEEF7] to-[#F3DCF0] border border-[#E7B0DE] shadow-sm flex flex-col justify-between space-y-5">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase text-[#FF5A0A] bg-white px-2.5 py-1 rounded-full">
                    Ingest Your Data
                  </span>
                  <span className="text-xs font-bold text-[#400849]">Any CSV</span>
                </div>
                <h3 className="text-lg font-black text-[#400849] mt-3">
                  Ingest Custom CSV Dataset
                </h3>
                <p className="text-xs text-[#71367B] mt-2 leading-relaxed">
                  Automatic column detection maps your review text, dates, ratings, and channels into our real-time inference pipeline.
                </p>
              </div>

              <div className="pt-4 border-t border-[#E7B0DE]/40 flex items-center justify-between">
                <div className="text-xs">
                  <span className="font-bold text-[#400849] block">Instant Processing</span>
                  <span className="text-[10px] text-[#A872AF]">Zero API cost</span>
                </div>
                <Link
                  href="/upload"
                  className="px-4 py-2 rounded-xl bg-[#FF5A0A] hover:bg-[#E04D05] text-white text-xs font-black shadow-md shadow-[#FF5A0A]/20 transition-all flex items-center gap-1.5"
                >
                  <UploadCloud className="w-3.5 h-3.5" />
                  <span>Upload CSV</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. High-Voltage Executive CTA (Dark Eggplant Canvas) */}
      <section className="py-20 px-6 max-w-6xl mx-auto w-full">
        <div className="rounded-3xl bg-[#400849] p-8 sm:p-14 text-white text-center relative overflow-hidden shadow-2xl shadow-[#400849]/30 border border-[#631A70]">
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-br from-[#FF5A0A]/20 to-transparent blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-[#631A70]/40 to-transparent blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            <span className="text-xs font-black uppercase tracking-widest text-[#FF5A0A] bg-white/10 px-4 py-1.5 rounded-full border border-white/10 inline-block">
              Production-Grade Machine Learning
            </span>

            <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Ready to bring mathematical rigor to your customer feedback?
            </h2>

            <p className="text-sm sm:text-base text-[#FAF0F8]/80 max-w-2xl mx-auto leading-relaxed">
              Eliminate black-box hallucinations and API billing surprises. Experience fast, deterministic sentiment intelligence and topic discovery on your local machine.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/dashboard"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#FF5A0A] hover:bg-[#E04D05] text-white text-sm font-black shadow-xl shadow-[#FF5A0A]/30 transition-all hover:scale-105 flex items-center justify-center gap-2"
              >
                <span>Launch Analytics Dashboard</span>
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </Link>
              <Link
                href="/upload"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-sm font-bold border border-white/20 transition-all flex items-center justify-center gap-2"
              >
                <span>Upload Custom Reviews CSV</span>
              </Link>
            </div>

            <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-[#FAF0F8]/60">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                <span>Zero Cloud API Dependencies</span>
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                <span>100% Deterministic Reproducibility</span>
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                <span>Senior Thesis Defensible</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 10. Comprehensive Editorial Footer */}
      <footer className="mt-auto py-12 px-8 border-t border-[#E7B0DE]/40 bg-white text-xs text-[#71367B] space-y-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <Logo size="md" />
            <p className="text-xs text-[#71367B] leading-relaxed">
              Full-stack customer feedback intelligence platform with calibrated sentiment classification and NMF topic modeling.
            </p>
            <div className="flex items-center gap-2 pt-2 text-[11px] text-[#10B981] font-bold">
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
              <span>All ML Pipelines Operational (Port 8002)</span>
            </div>
          </div>

          <div>
            <h4 className="font-black text-[#400849] uppercase tracking-wider text-[11px] mb-3">
              Application Modules
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/dashboard" className="hover:text-[#FF5A0A] transition-colors">
                  Overview Dashboard
                </Link>
              </li>
              <li>
                <Link href="/reviews" className="hover:text-[#FF5A0A] transition-colors">
                  Review Explorer & Attribution
                </Link>
              </li>
              <li>
                <Link href="/topics" className="hover:text-[#FF5A0A] transition-colors">
                  Topic Resonance Modeling
                </Link>
              </li>
              <li>
                <Link href="/model" className="hover:text-[#FF5A0A] transition-colors">
                  Academic Model Benchmark
                </Link>
              </li>
              <li>
                <Link href="/reports" className="hover:text-[#FF5A0A] transition-colors">
                  PDF Reports & CSV Export
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-black text-[#400849] uppercase tracking-wider text-[11px] mb-3">
              Defensible Machine Learning
            </h4>
            <ul className="space-y-2 text-xs text-[#71367B]">
              <li>Sublinear TF-IDF Vectorizer</li>
              <li>Calibrated Linear Support Vector Machine</li>
              <li>Platt Sigmoid Probability Scaling</li>
              <li>Non-Negative Matrix Factorization (NMF)</li>
              <li>Negation-Preserving Tokenizer</li>
            </ul>
          </div>

          <div>
            <h4 className="font-black text-[#400849] uppercase tracking-wider text-[11px] mb-3">
              Academic Thesis Spec
            </h4>
            <p className="text-xs leading-relaxed text-[#71367B]">
              Senior Thesis Project in Computer Science. Built with Next.js 16 (App Router), Python FastAPI, scikit-learn, SQLite, and Tailwind CSS.
            </p>
            <span className="block mt-3 text-[10px] text-[#A872AF]">
              Designed according to 60-30-10 color theory (#FAF4F9, #400849, #FF5A0A).
            </span>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-8 border-t border-[#E7B0DE]/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#A872AF]">
          <span>&copy; 2026 Voxora AI &bull; Computer Science Senior Thesis. All rights reserved.</span>
          <span>Engineered with mathematical rigor and zero hallucinated analytics.</span>
        </div>
      </footer>
    </div>
  );
}
