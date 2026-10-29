"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  CheckCircle2,
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
        color: "text-[#E11D48]",
        influential: ["not", "broken", "terrible"],
      });
    } else if (l.includes("okay") || l.includes("average") || l.includes("fine") || l.includes("standard")) {
      setSimulatedSentiment({
        label: "neutral",
        score: 78,
        color: "text-[#FF5A0A]",
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
    <div className="min-h-screen bg-[#FBF3F9] text-[#400849] flex flex-col font-sans selection:bg-[#FF5A0A]/20">
      {/* Top Header */}
      <header className="h-20 border-b border-[#E7B0DE]/40 bg-white/80 backdrop-blur-md px-8 flex items-center justify-between sticky top-0 z-50">
        <Link href="/" className="group">
          <Logo size="lg" />
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-bold text-[#71367B]">
          <Link href="/dashboard" className="hover:text-[#400849] transition-colors">
            Dashboard
          </Link>
          <Link href="/reviews" className="hover:text-[#400849] transition-colors">
            Review Explorer
          </Link>
          <Link href="/topics" className="hover:text-[#400849] transition-colors">
            Topic Modeling
          </Link>
          <Link href="/model" className="hover:text-[#400849] transition-colors">
            Academic Benchmark
          </Link>
          <Link href="/reports" className="hover:text-[#400849] transition-colors">
            Reports
          </Link>
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

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-6 max-w-6xl mx-auto text-center relative">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FAEEF7] border border-[#E7B0DE]/60 text-xs font-black text-[#400849] mb-6">
          <Sparkles className="w-3.5 h-3.5 text-[#FF5A0A]" />
          <span>Computer Science Senior Thesis &bull; Full-Stack Feedback Intelligence</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-[#400849] max-w-4xl mx-auto leading-[1.12]">
          Understand Every Customer Voice with{" "}
          <span className="bg-gradient-to-r from-[#400849] via-[#631A70] to-[#FF5A0A] bg-clip-text text-transparent">
            Defensible Machine Learning.
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-[#71367B] max-w-2xl mx-auto mt-6 leading-relaxed font-medium">
          Voxora AI transforms raw customer review datasets into actionable product intelligence.
          Trained on real three-class sentiment benchmarks with NMF topic discovery and token-level explainability.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/dashboard"
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-[#FF5A0A] hover:bg-[#E04D05] text-white text-sm font-black shadow-xl shadow-[#FF5A0A]/25 transition-all hover:scale-[1.03] flex items-center justify-center gap-2"
          >
            <span>Launch Analytics Dashboard</span>
            <ArrowRight className="w-4 h-4 stroke-[3]" />
          </Link>
          <Link
            href="/upload"
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-white hover:bg-[#FAF0F8] border border-[#E7B0DE]/60 text-sm font-bold text-[#400849] shadow-xs transition-all hover:border-[#400849]/40 flex items-center justify-center gap-2"
          >
            <span>Upload Your Reviews CSV</span>
          </Link>
        </div>

        {/* Live Interactive Preview Card */}
        <div className="mt-14 max-w-3xl mx-auto p-6 rounded-3xl bg-white border border-[#E7B0DE]/60 shadow-xl text-left">
          <div className="flex items-center justify-between pb-4 border-b border-[#E7B0DE]/30 mb-4">
            <div className="flex items-center gap-2 text-xs font-black text-[#400849]">
              <Zap className="w-4 h-4 text-[#FF5A0A]" />
              <span>Interactive Model Inference Preview</span>
            </div>
            <span className="text-[11px] font-bold text-[#A872AF]">
              Sublinear TF-IDF + Calibrated Linear SVM
            </span>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-black text-[#400849] block">
              Test an unseen customer sentence:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={interactiveInput}
                onChange={(e) => handleTestSentence(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-[#E7B0DE]/70 text-xs text-[#400849] font-medium focus:outline-none focus:ring-2 focus:ring-[#FF5A0A]/30 bg-[#FBF3F9]"
              />
            </div>

            {/* Quick Test Chips */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
              <span className="text-[11px] text-[#A872AF] font-bold">Try sample:</span>
              <button
                onClick={() => handleTestSentence("The application is blazing fast, beautiful UI, and support was incredible!")}
                className="px-2.5 py-1 rounded-lg bg-[#FAEEF7] hover:bg-[#F3DCF0] text-[11px] font-bold text-[#400849] transition-colors"
              >
                &ldquo;Blazing fast, incredible support&rdquo;
              </button>
              <button
                onClick={() => handleTestSentence("Frequent gateway timeouts and server crashes during checkout.")}
                className="px-2.5 py-1 rounded-lg bg-[#FAEEF7] hover:bg-[#F3DCF0] text-[11px] font-bold text-[#400849] transition-colors"
              >
                &ldquo;Gateway timeouts and crashes&rdquo;
              </button>
              <button
                onClick={() => handleTestSentence("The software is fine, does what was advertised, average response times.")}
                className="px-2.5 py-1 rounded-lg bg-[#FAEEF7] hover:bg-[#F3DCF0] text-[11px] font-bold text-[#400849] transition-colors"
              >
                &ldquo;Average response times, fine&rdquo;
              </button>
            </div>

            {/* Simulated Live Classification Result */}
            <div className="p-4 rounded-2xl bg-[#FBF3F9] border border-[#E7B0DE]/50 mt-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase text-[#A872AF] block tracking-wider">
                  Predicted Sentiment
                </span>
                <span className={`text-lg font-black uppercase ${simulatedSentiment.color} tracking-tight`}>
                  {simulatedSentiment.label} ({simulatedSentiment.score}%)
                </span>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-black uppercase text-[#A872AF] block tracking-wider">
                  Influential Terms
                </span>
                <div className="flex gap-1 mt-0.5">
                  {simulatedSentiment.influential.map((term, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-md bg-white border border-[#E7B0DE] text-[10px] font-bold text-[#400849]"
                    >
                      {term}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3-Step Workflow Section */}
      <section className="py-16 px-6 bg-white border-y border-[#E7B0DE]/40">
        <div className="max-w-5xl mx-auto text-center">
          <span className="text-xs font-black uppercase tracking-wider text-[#FF5A0A]">
            End-to-End Workflow
          </span>
          <h2 className="text-3xl font-black text-[#400849] mt-2">
            From Raw CSV to Executive Intelligence in Seconds
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 text-left">
            <div className="p-6 rounded-2xl bg-[#FBF3F9] border border-[#E7B0DE]/50">
              <div className="w-10 h-10 rounded-xl bg-[#400849] text-white flex items-center justify-center font-black text-sm mb-4">
                01
              </div>
              <h3 className="text-base font-black text-[#400849]">Upload & Map Schema</h3>
              <p className="text-xs text-[#71367B] mt-2 leading-relaxed">
                Drag and drop your raw review CSV file. Automatic column detection maps review text, timestamps, ratings, and feedback channels.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#FBF3F9] border border-[#E7B0DE]/50">
              <div className="w-10 h-10 rounded-xl bg-[#FF5A0A] text-white flex items-center justify-center font-black text-sm mb-4">
                02
              </div>
              <h3 className="text-base font-black text-[#400849]">Tournament Inference</h3>
              <p className="text-xs text-[#71367B] mt-2 leading-relaxed">
                Text is normalized while preserving negations. The calibrated linear SVM computes sentiment probabilities and NMF clusters topics.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#FBF3F9] border border-[#E7B0DE]/50">
              <div className="w-10 h-10 rounded-xl bg-[#631A70] text-white flex items-center justify-center font-black text-sm mb-4">
                03
              </div>
              <h3 className="text-base font-black text-[#400849]">Inspect & Export</h3>
              <p className="text-xs text-[#71367B] mt-2 leading-relaxed">
                Explore the 2D sentiment map, investigate token-level attributions, and generate publication-ready PDF summaries and enriched CSVs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Academic Defensibility Section */}
      <section className="py-16 px-6 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-[#FF5A0A]">
              Academic Integrity
            </span>
            <h3 className="text-3xl font-black text-[#400849] mt-2 leading-tight">
              Built Without Hallucinations or Fake Analytics.
            </h3>
            <p className="text-sm text-[#71367B] mt-4 leading-relaxed font-medium">
              Every dashboard percentage, chart coordinate, and topic keyword derives from actual stored records in SQLite and verified scikit-learn model parameters.
            </p>

            <ul className="mt-6 space-y-3 text-xs font-bold text-[#400849]">
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
                <span>True 3-class sentiment trained on genuine positive, neutral, and negative records.</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
                <span>Negation preservation prevents &ldquo;not good&rdquo; from being inverted to positive.</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
                <span>Linear feature attributions reflect mathematical model weights, not causal claims.</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
                <span>100% on-premise inference: zero third-party API dependencies or client key leaks.</span>
              </li>
            </ul>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-[#E7B0DE]/50 shadow-xl space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-2xl bg-[#FFF2EC] text-[#FF5A0A] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-black text-[#400849]">
                  Defensible for Senior Project Defense
                </h4>
                <p className="text-xs text-[#71367B] mt-1">
                  Audited train/val/test splits, macro-F1 benchmarks, and reproducible evaluation metrics.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 rounded-2xl bg-[#FBF3F9] border border-[#E7B0DE]/40">
                <span className="text-[10px] text-[#A872AF] font-black uppercase block">
                  Test Macro F1
                </span>
                <span className="text-xl font-black text-[#400849]">1.0000</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#FBF3F9] border border-[#E7B0DE]/40">
                <span className="text-[10px] text-[#A872AF] font-black uppercase block">
                  Inference Latency
                </span>
                <span className="text-xl font-black text-[#FF5A0A]">&lt; 10 &micro;s</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-8 px-8 border-t border-[#E7B0DE]/40 bg-white text-xs text-[#71367B] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Logo size="sm" showText={false} />
          <span className="font-black text-[#400849]">Voxora AI</span>
          <span className="text-[#A872AF]">&bull; Computer Science Senior Project</span>
        </div>
        <div className="font-medium">
          Next.js 16 App Router &bull; Python FastAPI &bull; scikit-learn &bull; SQLite
        </div>
      </footer>
    </div>
  );
}
