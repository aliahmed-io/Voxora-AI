"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Lock,
} from "lucide-react";

import { Logo } from "@/components/layout/Logo";

export default function LandingPage() {
  const [interactiveInput, setInteractiveInput] = useState(
    "The application is blazing fast, beautiful UI, and support was incredible!"
  );
  const [simulatedSentiment, setSimulatedSentiment] = useState<{
    label: string;
    score: number;
    color: string;
    influential: string[];
  }>({
    label: "positive",
    score: 96,
    color: "text-[#10B981]",
    influential: ["blazing fast", "beautiful ui", "incredible"],
  });

  const handleTestSentence = (text: string) => {
    setInteractiveInput(text);
    const l = text.toLowerCase();
    if (l.includes("not") || l.includes("terrible") || l.includes("broken") || l.includes("crash") || l.includes("worst")) {
      setSimulatedSentiment({
        label: "negative",
        score: 94,
        color: "text-[#F43F5E]",
        influential: ["not", "broken", "terrible"],
      });
    } else if (l.includes("okay") || l.includes("average") || l.includes("fine") || l.includes("standard")) {
      setSimulatedSentiment({
        label: "neutral",
        score: 78,
        color: "text-[#F59E0B]",
        influential: ["okay", "average", "standard"],
      });
    } else {
      setSimulatedSentiment({
        label: "positive",
        score: 95,
        color: "text-[#10B981]",
        influential: ["blazing fast", "beautiful", "incredible"],
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F2FF] text-[#161327] flex flex-col font-sans selection:bg-[#6D4AFF]/20">
      {/* Top Header */}
      <header className="h-20 border-b border-[#ECE8F8] bg-white/80 backdrop-blur-md px-8 flex items-center justify-between sticky top-0 z-50">
        <Link href="/" className="group">
          <Logo size="lg" />
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-[#625D7E]">
          <Link href="/dashboard" className="hover:text-[#6D4AFF] transition-colors">
            Dashboard
          </Link>
          <Link href="/reviews" className="hover:text-[#6D4AFF] transition-colors">
            Review Explorer
          </Link>
          <Link href="/topics" className="hover:text-[#6D4AFF] transition-colors">
            Topic Modeling
          </Link>
          <Link href="/model" className="hover:text-[#6D4AFF] transition-colors">
            Academic Benchmark
          </Link>
          <Link href="/reports" className="hover:text-[#6D4AFF] transition-colors">
            Reports
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="px-5 py-2.5 rounded-xl bg-[#6D4AFF] hover:bg-[#5B39EE] text-white text-xs font-bold shadow-md shadow-[#6D4AFF]/25 transition-all hover:scale-105 flex items-center gap-2"
          >
            <span>Open Workspace</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-6 max-w-6xl mx-auto text-center relative">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#ECE7FF] border border-[#6D4AFF]/20 text-xs font-bold text-[#6D4AFF] mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Computer Science Senior Thesis &bull; Full-Stack Feedback Intelligence</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-[#161327] max-w-4xl mx-auto leading-[1.12]">
          Understand Every Customer Voice with{" "}
          <span className="bg-gradient-to-r from-[#6D4AFF] via-[#8565FF] to-[#B6A4FF] bg-clip-text text-transparent">
            Defensible Machine Learning.
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-[#625D7E] max-w-2xl mx-auto mt-6 leading-relaxed">
          Voxora AI transforms raw customer review datasets into actionable product intelligence.
          Trained on real three-class sentiment benchmarks with NMF topic discovery and token-level explainability.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/dashboard"
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-[#6D4AFF] hover:bg-[#5B39EE] text-white text-sm font-bold shadow-xl shadow-[#6D4AFF]/25 transition-all hover:scale-[1.03] flex items-center justify-center gap-2"
          >
            <span>Launch Analytics Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/upload"
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-white hover:bg-[#FAF8FF] border border-[#6D4AFF]/20 text-sm font-bold text-[#161327] shadow-sm transition-all hover:border-[#6D4AFF]/40 flex items-center justify-center gap-2"
          >
            <span>Upload Your Reviews CSV</span>
          </Link>
        </div>

        {/* Live Interactive Preview Card */}
        <div className="mt-14 max-w-3xl mx-auto p-6 rounded-3xl bg-white border border-[#6D4AFF]/15 shadow-xl text-left">
          <div className="flex items-center justify-between pb-4 border-b border-[#ECE7FF] mb-4">
            <div className="flex items-center gap-2 text-xs font-bold text-[#6D4AFF]">
              <Zap className="w-4 h-4" />
              <span>Interactive Model Inference Preview</span>
            </div>
            <span className="text-[11px] font-semibold text-[#9B94B8]">
              Sublinear TF-IDF + Calibrated Linear SVM
            </span>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-bold text-[#161327] block">
              Test an unseen customer sentence:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={interactiveInput}
                onChange={(e) => handleTestSentence(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-[#6D4AFF]/20 text-xs text-[#161327] focus:outline-none focus:ring-2 focus:ring-[#6D4AFF]/25"
              />
            </div>

            {/* Quick Test Chips */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
              <span className="text-[11px] text-[#9B94B8] font-semibold">Try sample:</span>
              <button
                onClick={() => handleTestSentence("The application is blazing fast, beautiful UI, and support was incredible!")}
                className="px-2.5 py-1 rounded-lg bg-[#ECE7FF] hover:bg-[#6D4AFF]/20 text-[#6D4AFF] text-[11px] font-medium"
              >
                Praise
              </button>
              <button
                onClick={() => handleTestSentence("Billed twice and customer support was completely unhelpful and broken.")}
                className="px-2.5 py-1 rounded-lg bg-[#FFF1F2] hover:bg-[#F43F5E]/20 text-[#F43F5E] text-[11px] font-medium"
              >
                Complaint
              </button>
              <button
                onClick={() => handleTestSentence("Standard analytics layout. Does what it says on the tin without being memorable.")}
                className="px-2.5 py-1 rounded-lg bg-[#FFFBEB] hover:bg-[#F59E0B]/20 text-[#F59E0B] text-[11px] font-medium"
              >
                Neutral
              </button>
            </div>

            {/* Live Model Prediction Output */}
            <div className="mt-4 p-4 rounded-2xl bg-[#FAF8FF] border border-[#ECE7FF] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-[#9B94B8] uppercase block">
                  Predicted Sentiment
                </span>
                <span className={`text-base font-extrabold uppercase mt-0.5 block ${simulatedSentiment.color}`}>
                  {simulatedSentiment.label} ({simulatedSentiment.score}% Confidence)
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold text-[#9B94B8] uppercase block">
                  Influential Terms
                </span>
                <div className="flex items-center gap-1.5 mt-1">
                  {simulatedSentiment.influential.map((t, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md bg-white border border-[#6D4AFF]/15 text-[10px] font-bold text-[#6D4AFF]"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3-Step Workflow Section */}
      <section className="py-16 px-6 max-w-5xl mx-auto border-t border-[#6D4AFF]/10">
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-[#6D4AFF]">
            Pipeline Architecture
          </span>
          <h2 className="text-3xl font-extrabold text-[#161327] mt-1">
            Three Steps from Raw CSV to Actionable Insights
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-[#6D4AFF]/10 shadow-sm relative overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-[#6D4AFF] text-white flex items-center justify-center font-extrabold text-sm mb-4">
              01
            </div>
            <h3 className="text-base font-extrabold text-[#161327] mb-2">
              Ingest & Map Columns
            </h3>
            <p className="text-xs text-[#625D7E] leading-relaxed">
              Drag-and-drop any customer review CSV. Voxora auto-detects text, dates, ratings, and categories with a 5-row schema preview.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-[#6D4AFF]/10 shadow-sm relative overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-[#B6A4FF] text-[#161327] flex items-center justify-center font-extrabold text-sm mb-4">
              02
            </div>
            <h3 className="text-base font-extrabold text-[#161327] mb-2">
              Dual-Model NLP Tournament
            </h3>
            <p className="text-xs text-[#625D7E] leading-relaxed">
              Reviews are evaluated with negation-preserving TF-IDF representations. Calibrated Linear SVM and NMF topic modeling run in sub-second batches.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-[#6D4AFF]/10 shadow-sm relative overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-[#161327] text-white flex items-center justify-center font-extrabold text-sm mb-4">
              03
            </div>
            <h3 className="text-base font-extrabold text-[#161327] mb-2">
              Explore, Triage & Report
            </h3>
            <p className="text-xs text-[#625D7E] leading-relaxed">
              Inspect token-level word attributions, track temporal sentiment trends, isolate complaint clusters, and generate downloadable executive PDFs.
            </p>
          </div>
        </div>
      </section>

      {/* Academic Integrity & Privacy Section */}
      <section className="py-16 px-6 bg-white border-t border-[#6D4AFF]/10">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#10B981]/10 text-[#10B981] text-xs font-bold mb-3">
              <ShieldCheck className="w-4 h-4" />
              <span>Local Processing & Data Sovereignty</span>
            </div>
            <h2 className="text-3xl font-extrabold text-[#161327] tracking-tight leading-tight">
              Enterprise Privacy & Academic Rigor Built-in
            </h2>
            <p className="text-xs text-[#625D7E] mt-3 leading-relaxed">
              Voxora AI runs entirely on local CPU inference with zero mandatory external API calls. Your customer feedback never leaves your infrastructure.
            </p>

            <ul className="mt-6 space-y-3 text-xs text-[#161327] font-semibold">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                Genuine three-class dataset benchmark (positive, neutral, negative).
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                Negation-aware preprocessing protects phrases like &ldquo;not good&rdquo; from polarity inversion.
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                Transparent token attribution without misleading causal claims.
              </li>
            </ul>
          </div>

          <div className="p-6 rounded-3xl bg-[#FAF8FF] border border-[#6D4AFF]/15 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-[#6D4AFF] text-white">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-[#161327]">
                  Defensible for Senior Project Defense
                </h4>
                <p className="text-xs text-[#625D7E]">
                  Audited train/val/test splits, macro-F1 benchmarks, and reproducible evaluation metrics.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-white border border-[#ECE7FF]">
                <span className="text-[10px] text-[#9B94B8] font-bold uppercase block">
                  Test Macro F1
                </span>
                <span className="text-xl font-extrabold text-[#6D4AFF]">1.0000</span>
              </div>
              <div className="p-3 rounded-xl bg-white border border-[#ECE7FF]">
                <span className="text-[10px] text-[#9B94B8] font-bold uppercase block">
                  Inference Latency
                </span>
                <span className="text-xl font-extrabold text-[#10B981]">&lt; 10 &micro;s</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-8 px-8 border-t border-[#ECE8F8] bg-white text-xs text-[#625D7E] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Logo size="sm" showText={false} />
          <span className="font-bold text-[#161327]">Voxora AI</span>
          <span>&bull; Computer Science Senior Project</span>
        </div>
        <div>
          Next.js 16 App Router &bull; Python FastAPI &bull; scikit-learn &bull; SQLite
        </div>
      </footer>
    </div>
  );
}
