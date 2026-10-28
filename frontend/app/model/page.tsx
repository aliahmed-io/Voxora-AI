"use client";

import React, { useEffect, useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";
import { ConfusionMatrixGrid } from "@/components/model/ConfusionMatrixGrid";
import { api } from "@/lib/api";
import { ModelEvaluationResponse } from "@/lib/types";
import {
  Trophy,
  AlertTriangle,
  BookOpen,
} from "lucide-react";

export default function ModelEvaluationPage() {
  const [evalData, setEvalData] = useState<ModelEvaluationResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;
    api.getModelEvaluation()
      .then((data) => {
        if (!ignore) setEvalData(data);
      })
      .catch(() => {})
      .finally(() => {
        if (!ignore) setLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-[#F5F2FF]">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Navbar />
          <div className="p-16 text-center text-sm font-semibold text-[#625D7E]">
            Loading academic model evaluation metrics...
          </div>
        </div>
      </div>
    );
  }

  if (!evalData) {
    return (
      <div className="flex min-h-screen bg-[#F5F2FF]">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Navbar />
          <div className="p-16 text-center text-sm text-[#F43F5E]">
            Evaluation artifacts not found. Please train models first.
          </div>
        </div>
      </div>
    );
  }

  const champ = evalData.champion;
  const testM = champ.test_metrics;
  const lr = evalData.comparison["Logistic Regression"];
  const svm = evalData.comparison["Linear Support Vector Classifier"];

  return (
    <div className="flex min-h-screen bg-[#F5F2FF]">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />

        <main className="flex-1 p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
          {/* Header */}
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#6D4AFF] uppercase tracking-wider">
                Senior Thesis Benchmark
              </span>
              <span className="text-[10px] text-[#9B94B8] font-semibold">
                &bull; Audited Partitions
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#161327] tracking-tight mt-1">
              Model Evaluation & Tournament Comparison
            </h1>
            <p className="text-xs text-[#625D7E] mt-1">
              Transparent academic benchmark comparing Logistic Regression vs Linear SVM on untouched test split.
            </p>
          </div>

          {/* Champion Banner */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-[#161327] to-[#2B234A] text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6 border border-white/10">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#6D4AFF] text-white text-[11px] font-bold mb-2 shadow-sm">
                <Trophy className="w-3.5 h-3.5" />
                <span>Tournament Champion Model</span>
              </div>
              <h2 className="text-2xl font-extrabold tracking-tight">
                {champ.model_name}
              </h2>
              <p className="text-xs text-[#B6A4FF] mt-1 max-w-xl leading-relaxed">
                Selected through validation partition tournament. Evaluated on untouched test partition (N = {evalData.metadata.test_samples}).
              </p>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-center">
                <span className="text-xs text-[#9B94B8] font-bold uppercase block">
                  Test Accuracy
                </span>
                <span className="text-3xl font-extrabold text-[#10B981]">
                  {(testM.accuracy * 100).toFixed(1)}%
                </span>
              </div>
              <div className="text-center">
                <span className="text-xs text-[#9B94B8] font-bold uppercase block">
                  Macro F1
                </span>
                <span className="text-3xl font-extrabold text-white">
                  {testM.macro_f1.toFixed(4)}
                </span>
              </div>
              <div className="text-center hidden sm:block">
                <span className="text-xs text-[#9B94B8] font-bold uppercase block">
                  Inference Latency
                </span>
                <span className="text-3xl font-extrabold text-[#B6A4FF]">
                  {testM.inference_latency_us} &micro;s
                </span>
              </div>
            </div>
          </div>

          {/* Tournament Comparison Table */}
          <div className="p-6 rounded-2xl bg-white border border-[#6D4AFF]/10 shadow-sm">
            <h3 className="text-sm font-bold text-[#161327] tracking-tight mb-4">
              Model Tournament Benchmark (Logistic Regression vs Linear SVM)
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[#ECE7FF] text-[#9B94B8] font-bold text-[10px] uppercase bg-[#FAF8FF]">
                    <th className="p-3">Model Architecture</th>
                    <th className="p-3">Validation F1</th>
                    <th className="p-3">Test Accuracy</th>
                    <th className="p-3">Test Macro F1</th>
                    <th className="p-3">Weighted F1</th>
                    <th className="p-3">Train Time</th>
                    <th className="p-3">Inference / Item</th>
                    <th className="p-3">Selection</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#ECE7FF]/60 font-medium">
                  <tr className="hover:bg-[#FAF8FF]">
                    <td className="p-3 font-bold text-[#161327]">
                      Linear Support Vector Classifier (Calibrated)
                    </td>
                    <td className="p-3 font-mono">{svm.val_macro_f1?.toFixed(4) || "—"}</td>
                    <td className="p-3 font-mono font-bold text-[#10B981]">
                      {(svm.accuracy * 100).toFixed(2)}%
                    </td>
                    <td className="p-3 font-mono font-bold">{svm.macro_f1.toFixed(4)}</td>
                    <td className="p-3 font-mono">{svm.weighted_f1.toFixed(4)}</td>
                    <td className="p-3 text-[#625D7E]">{svm.train_time_ms} ms</td>
                    <td className="p-3 text-[#625D7E]">{svm.inference_latency_us} &micro;s</td>
                    <td className="p-3">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#10B981]/15 text-[#10B981] font-bold text-[10px] uppercase">
                        Champion
                      </span>
                    </td>
                  </tr>

                  <tr className="hover:bg-[#FAF8FF]">
                    <td className="p-3 font-bold text-[#161327]">
                      Multinomial Logistic Regression (L2 Regularized)
                    </td>
                    <td className="p-3 font-mono">{lr.val_macro_f1?.toFixed(4) || "—"}</td>
                    <td className="p-3 font-mono">{(lr.accuracy * 100).toFixed(2)}%</td>
                    <td className="p-3 font-mono">{lr.macro_f1.toFixed(4)}</td>
                    <td className="p-3 font-mono">{lr.weighted_f1.toFixed(4)}</td>
                    <td className="p-3 text-[#625D7E]">{lr.train_time_ms} ms</td>
                    <td className="p-3 text-[#625D7E]">{lr.inference_latency_us} &micro;s</td>
                    <td className="p-3 text-[#9B94B8]">Baseline</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Confusion Matrix & Class Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ConfusionMatrixGrid
              matrix={testM.confusion_matrix}
              labels={evalData.labels_order}
            />

            {/* Per-Class Precision & Recall */}
            <div className="p-6 rounded-2xl bg-white border border-[#6D4AFF]/10 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-[#161327] tracking-tight mb-1">
                  Per-Class Performance Metrics
                </h3>
                <p className="text-xs text-[#625D7E] mb-4">
                  Precision, Recall, and F1-score across all 3 genuine classes
                </p>

                <div className="space-y-3">
                  {(["positive", "neutral", "negative"] as const).map((lbl) => {
                    const row = testM.per_class[lbl];
                    if (!row) return null;
                    const color =
                      lbl === "positive"
                        ? "text-[#10B981] bg-[#10B981]/10"
                        : lbl === "negative"
                        ? "text-[#F43F5E] bg-[#F43F5E]/10"
                        : "text-[#F59E0B] bg-[#F59E0B]/10";

                    return (
                      <div
                        key={lbl}
                        className="p-3.5 rounded-xl bg-[#FAF8FF] border border-[#ECE7FF] flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${color}`}>
                            {lbl}
                          </span>
                          <span className="text-xs text-[#625D7E]">
                            (Support: {row.support})
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-xs font-mono font-bold">
                          <span>
                            Prec: <span className="text-[#161327]">{row.precision.toFixed(3)}</span>
                          </span>
                          <span>
                            Rec: <span className="text-[#161327]">{row.recall.toFixed(3)}</span>
                          </span>
                          <span>
                            F1: <span className="text-[#6D4AFF]">{row.f1_score.toFixed(3)}</span>
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Academic Methodology & Known Limitations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-white border border-[#6D4AFF]/10 shadow-sm">
              <div className="flex items-center gap-2 text-[#6D4AFF] mb-3">
                <BookOpen className="w-4 h-4" />
                <h3 className="text-sm font-bold text-[#161327]">
                  Dataset & Feature Engineering Pipeline
                </h3>
              </div>
              <ul className="space-y-2 text-xs text-[#625D7E] leading-relaxed">
                <li>
                  <span className="font-bold text-[#161327]">&bull; Feature Representation: </span>
                  {evalData.methodology.feature_engineering}
                </li>
                <li>
                  <span className="font-bold text-[#161327]">&bull; Partitioning Protocol: </span>
                  {evalData.methodology.model_selection}
                </li>
                <li>
                  <span className="font-bold text-[#161327]">&bull; Vectorizer Vocabulary: </span>
                  {evalData.metadata.features_count.toLocaleString()} n-gram features fitted on Train partition only.
                </li>
              </ul>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#6D4AFF]/10 shadow-sm">
              <div className="flex items-center gap-2 text-[#F59E0B] mb-3">
                <AlertTriangle className="w-4 h-4" />
                <h3 className="text-sm font-bold text-[#161327]">
                  Known Limitations & Ethical Guardrails
                </h3>
              </div>
              <ul className="space-y-2 text-xs text-[#625D7E] leading-relaxed">
                {evalData.methodology.known_limitations.map((lim, i) => (
                  <li key={i}>
                    <span className="font-bold text-[#161327]">&bull; </span>
                    {lim}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
