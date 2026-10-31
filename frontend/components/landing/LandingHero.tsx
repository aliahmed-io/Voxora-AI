"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, Play, Activity, ShieldCheck } from "lucide-react";

interface TelemetryReading {
  label: string;
  value: string;
  unit?: string;
  sublabel: string;
  type: "waveform" | "sparkline" | "dial";
}

const READINGS: TelemetryReading[] = [
  {
    label: "CSAT HARMONIC",
    value: "78.4",
    unit: "/ 100",
    sublabel: "Continuous polarity integration",
    type: "waveform",
  },
  {
    label: "INFERENCE VELOCITY",
    value: "0.12",
    unit: "ms",
    sublabel: "Sub-millisecond CPU runtime",
    type: "sparkline",
  },
  {
    label: "PLATT CALIBRATION",
    value: "96.8%",
    sublabel: "Deterministic SVM posterior",
    type: "dial",
  },
];

export function LandingHero() {
  const [activeTab, setActiveTab] = useState<"stream" | "topology" | "microscope">("stream");

  return (
    <section className="relative w-full border-b border-[#400849]/10 bg-[#FBF8FA] overflow-hidden">
      {/* Background Architectural Grid Lines */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #400849 1px, transparent 1px), linear-gradient(to bottom, #400849 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      <div className="max-w-[1600px] mx-auto min-h-[calc(100vh-80px)] flex flex-col lg:flex-row items-stretch">
        {/* ================= LEFT CANVAS: Editorial Narrative & Telemetry ================= */}
        <div className="flex-1 px-6 sm:px-12 lg:px-16 pt-12 lg:pt-20 pb-16 flex flex-col justify-between relative z-10">
          <div>
            {/* Architectural Eyebrow */}
            <div className="flex items-center gap-3 mb-8">
              <span className="w-2 h-2 rounded-full bg-[#FF5A0A] animate-pulse" />
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#6B3075]">
                Feedback Intelligence Engine &bull; Deterministic Machine Learning
              </span>
            </div>

            {/* Monumental Editorial Headline */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[76px] font-normal tracking-tight text-[#26052B] leading-[1.04] max-w-2xl">
              Every customer voice,{" "}
              <span className="font-serif-luxury italic font-medium text-[#FF5A0A]">
                quantified.
              </span>
            </h1>

            {/* Editorial Lead Paragraph */}
            <p className="mt-8 text-lg sm:text-xl text-[#6B3075] font-normal leading-relaxed max-w-xl">
              A clearer picture of customer sentiment and product friction. Voxora AI transforms
              thousands of raw user reviews, tickets, and feedback streams into calibrated
              probabilistic vectors, latent topic clusters, and token-level mathematical attributions.
            </p>

            {/* Action Buttons Group */}
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                href="/dashboard"
                className="px-8 py-4 rounded-full bg-[#400849] hover:bg-[#2F0536] text-white text-sm font-semibold tracking-wide shadow-lg shadow-[#400849]/20 transition-all hover:scale-[1.02] flex items-center gap-3 group"
              >
                <span>Explore Live Telemetry</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>

              <a
                href="#laboratory"
                className="px-6 py-4 rounded-full bg-white hover:bg-[#F5EDF4] border border-[#400849]/15 text-[#26052B] text-sm font-semibold tracking-wide transition-all hover:border-[#400849]/40 flex items-center gap-3"
              >
                <div className="w-6 h-6 rounded-full bg-[#FF5A0A]/10 text-[#FF5A0A] flex items-center justify-center">
                  <Play className="w-3 h-3 fill-current ml-0.5" />
                </div>
                <span>Test Live Sentence Classifier</span>
              </a>
            </div>

            {/* Trust Baseline Pill */}
            <div className="mt-8 flex items-center gap-3 text-xs text-[#6B3075] font-medium">
              <ShieldCheck className="w-4 h-4 text-[#10B981]" />
              <span>100% on-premise execution &bull; Zero external API token billing &bull; Deterministic reproduction</span>
            </div>
          </div>

          {/* Telemetry Inset Readings (Mechora-style Instruments) */}
          <div className="mt-16 pt-10 border-t border-[#400849]/10 grid grid-cols-1 sm:grid-cols-3 gap-8">
            {READINGS.map((reading) => (
              <div key={reading.label} className="space-y-2">
                <div className="text-[10px] font-bold tracking-[0.16em] uppercase text-[#9E64A5]">
                  {reading.label}
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl font-light tracking-tight text-[#26052B]">
                    {reading.value}
                  </span>
                  {reading.unit && (
                    <span className="text-xs font-semibold text-[#6B3075]">
                      {reading.unit}
                    </span>
                  )}
                </div>

                {/* SVG Visual Instrument */}
                {reading.type === "waveform" && (
                  <div className="h-6 w-full flex items-center">
                    <svg viewBox="0 0 160 24" className="w-full h-full overflow-visible">
                      <path
                        d="M0,12 L20,12 L30,4 L40,20 L50,8 L60,16 L70,2 L80,22 L90,6 L100,18 L110,12 L160,12"
                        fill="none"
                        stroke="#FF5A0A"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                )}

                {reading.type === "sparkline" && (
                  <div className="h-6 w-full flex items-center">
                    <svg viewBox="0 0 160 24" className="w-full h-full overflow-visible">
                      <path
                        d="M0,18 Q30,16 60,10 T120,6 T160,2"
                        fill="none"
                        stroke="#400849"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                )}

                {reading.type === "dial" && (
                  <div className="h-6 w-full flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full border-2 border-[#10B981] border-t-transparent animate-spin" />
                    <span className="text-[11px] text-[#10B981] font-semibold">Platt-Calibrated</span>
                  </div>
                )}

                <div className="text-[11px] text-[#6B3075] font-normal leading-tight">
                  {reading.sublabel}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ================= RIGHT CANVAS: Dramatic Perspective Instrument ================= */}
        <div className="w-full lg:w-[52%] xl:w-[50%] bg-[#18031D] relative overflow-hidden flex flex-col justify-between p-6 sm:p-10 lg:p-12 text-white border-l border-[#400849]/20">
          {/* Subtle Ambient Radial Lighting */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-[#FF5A0A]/20 via-[#E7B0DE]/10 to-transparent blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#400849]/50 blur-3xl pointer-events-none" />

          {/* Header Controls for Hero Instrument */}
          <div className="relative z-10 flex items-center justify-between pb-6 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#10B981]" />
              <span className="text-xs uppercase tracking-[0.16em] font-semibold text-white/70">
                Live Sensor Telemetry &bull; SaaS Enterprise (986 Records)
              </span>
            </div>

            {/* Switcher Tabs */}
            <div className="flex items-center gap-1 p-1 rounded-full bg-white/5 border border-white/10 text-xs">
              <button
                type="button"
                onClick={() => setActiveTab("stream")}
                className={`px-3 py-1 rounded-full transition-all text-xs font-medium ${
                  activeTab === "stream"
                    ? "bg-[#FF5A0A] text-white shadow-sm"
                    : "text-white/60 hover:text-white"
                }`}
              >
                Signal Stream
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("topology")}
                className={`px-3 py-1 rounded-full transition-all text-xs font-medium ${
                  activeTab === "topology"
                    ? "bg-[#FF5A0A] text-white shadow-sm"
                    : "text-white/60 hover:text-white"
                }`}
              >
                2D Geometry
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("microscope")}
                className={`px-3 py-1 rounded-full transition-all text-xs font-medium ${
                  activeTab === "microscope"
                    ? "bg-[#FF5A0A] text-white shadow-sm"
                    : "text-white/60 hover:text-white"
                }`}
              >
                Token Weights
              </button>
            </div>
          </div>

          {/* Main Visual Display inside Instrument */}
          <div className="relative z-10 my-8 flex-1 flex flex-col justify-center">
            {activeTab === "stream" && (
              <div className="space-y-4">
                {/* Live Card 1: Critical Churn Alert */}
                <div className="p-5 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md space-y-3 transition-all hover:bg-white/[0.07] hover:border-white/20">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#E11D48]/20 text-[#FF6E85] border border-[#E11D48]/30">
                      System Friction &bull; High Churn Risk
                    </span>
                    <span className="text-xs font-mono text-white/50">Rec #842 &bull; 98.4% Confidence</span>
                  </div>
                  <p className="text-sm text-white/90 font-light leading-relaxed">
                    &ldquo;Frequent 504 gateway timeouts and broken webhook payloads during checkout. We lost over $18,000 in transactions this morning.&rdquo;
                  </p>
                  <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
                    <span className="px-2 py-0.5 rounded-md bg-[#E11D48]/30 text-white font-mono text-[11px]">
                      504 timeout <strong className="font-semibold text-[#FF8599]">-0.92</strong>
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-[#E11D48]/20 text-white font-mono text-[11px]">
                      broken webhooks <strong className="font-semibold text-[#FF8599]">-0.84</strong>
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-[#E11D48]/20 text-white font-mono text-[11px]">
                      lost transactions <strong className="font-semibold text-[#FF8599]">-0.78</strong>
                    </span>
                  </div>
                </div>

                {/* Live Card 2: Enterprise Delight */}
                <div className="p-5 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md space-y-3 transition-all hover:bg-white/[0.07] hover:border-white/20">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#10B981]/20 text-[#34D399] border border-[#10B981]/30">
                      Delight Champion &bull; Expansion Candidate
                    </span>
                    <span className="text-xs font-mono text-white/50">Rec #319 &bull; 97.2% Confidence</span>
                  </div>
                  <p className="text-sm text-white/90 font-light leading-relaxed">
                    &ldquo;The sub-second analytics dashboard and automated PDF reports transformed our monthly executive reviews. Outstanding speed.&rdquo;
                  </p>
                  <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
                    <span className="px-2 py-0.5 rounded-md bg-[#10B981]/30 text-white font-mono text-[11px]">
                      sub-second <strong className="font-semibold text-[#6EE7B7]">+0.89</strong>
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-[#10B981]/20 text-white font-mono text-[11px]">
                      transformed <strong className="font-semibold text-[#6EE7B7]">+0.81</strong>
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-[#10B981]/20 text-white font-mono text-[11px]">
                      outstanding speed <strong className="font-semibold text-[#6EE7B7]">+0.76</strong>
                    </span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "topology" && (
              <div className="p-6 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md space-y-4">
                <div className="flex items-center justify-between text-xs text-white/70">
                  <span>Continuous 2D Sentiment Plane</span>
                  <span className="font-mono text-[#FF5A0A]">&Delta; Polarity &times; Severity</span>
                </div>
                {/* 2D Plane Coordinate Canvas Visual */}
                <div className="relative h-60 w-full rounded-xl bg-black/40 border border-white/5 overflow-hidden flex items-center justify-center p-4">
                  {/* Grid Lines */}
                  <div className="absolute inset-0 border-b border-t border-white/5 top-1/2" />
                  <div className="absolute inset-0 border-l border-r border-white/5 left-1/2" />

                  {/* Scatter Cluster Nodes */}
                  <div className="absolute top-[25%] left-[75%] w-3 h-3 rounded-full bg-[#10B981] shadow-[0_0_12px_#10B981]" />
                  <div className="absolute top-[30%] left-[70%] w-2.5 h-2.5 rounded-full bg-[#10B981]/70" />
                  <div className="absolute top-[20%] left-[80%] w-2 h-2 rounded-full bg-[#10B981]/60" />
                  <span className="absolute top-[16%] left-[68%] text-[10px] font-mono text-[#34D399]">
                    Delight Cluster (+0.82)
                  </span>

                  <div className="absolute top-[70%] left-[25%] w-3 h-3 rounded-full bg-[#E11D48] shadow-[0_0_12px_#E11D48]" />
                  <div className="absolute top-[65%] left-[20%] w-2.5 h-2.5 rounded-full bg-[#E11D48]/70" />
                  <div className="absolute top-[75%] left-[30%] w-2 h-2 rounded-full bg-[#E11D48]/60" />
                  <span className="absolute top-[82%] left-[16%] text-[10px] font-mono text-[#FF6E85]">
                    Friction Cluster (-0.79)
                  </span>

                  <div className="absolute top-[48%] left-[50%] w-2 h-2 rounded-full bg-white/40" />
                  <span className="absolute top-[52%] left-[52%] text-[9px] font-mono text-white/40">
                    Baseline (0.00)
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-white/60">
                  <span>986 reviews vectorized onto continuous latent manifold</span>
                  <Link href="/dashboard" className="text-[#FF5A0A] hover:underline font-semibold">
                    Launch Interactive Map &rarr;
                  </Link>
                </div>
              </div>
            )}

            {activeTab === "microscope" && (
              <div className="p-6 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md space-y-4">
                <div className="flex items-center justify-between text-xs text-white/70">
                  <span>Linear SVM Hyperplane Weight Coefficients</span>
                  <span className="font-mono text-[#34D399]">Deterministic Math</span>
                </div>
                <div className="space-y-2.5 text-xs">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                    <span className="font-mono text-white/90">&ldquo;seamless integration&rdquo;</span>
                    <span className="font-mono font-bold text-[#34D399]">+0.9412</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                    <span className="font-mono text-white/90">&ldquo;instantaneous velocity&rdquo;</span>
                    <span className="font-mono font-bold text-[#34D399]">+0.8250</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                    <span className="font-mono text-white/90">&ldquo;unresponsive support&rdquo;</span>
                    <span className="font-mono font-bold text-[#FF6E85]">-0.8874</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                    <span className="font-mono text-white/90">&ldquo;504 gateway timeout&rdquo;</span>
                    <span className="font-mono font-bold text-[#FF6E85]">-0.9163</span>
                  </div>
                </div>
                <p className="text-[11px] text-white/50 leading-tight">
                  Unlike black-box LLMs, Linear SVM coefficients provide mathematically provable attributions directly from the decision boundary.
                </p>
              </div>
            )}
          </div>

          {/* Bottom Telemetry Footer */}
          <div className="relative z-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-[#FF5A0A]">
                <Activity className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-semibold text-white">Active scikit-learn Pipeline</div>
                <div className="text-[11px] text-white/50">TF-IDF &bull; NMF (5 Topics) &bull; Linear SVM</div>
              </div>
            </div>

            <Link
              href="/dashboard"
              className="text-xs font-semibold text-white/80 hover:text-white flex items-center gap-1.5 transition-colors group"
            >
              <span>Open live workspace</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
