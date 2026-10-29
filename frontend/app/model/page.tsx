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
      <div className="flex min-h-screen bg-[#FAF4F9] text-[#400849]">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Navbar />
          <div className="p-16 text-center text-xs font-bold text-[#71367B]">
            Loading academic model evaluation metrics...
          </div>
        </div>
      </div>
    );
  }

  if (!evalData) {
    return (
      <div className="flex min-h-screen bg-[#FAF4F9] text-[#400849]">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Navbar />
          <div className="p-16 text-center text-xs text-[#E11D48] font-bold">
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
    <div className="flex min-h-screen bg-[#FAF4F9] text-[#400849]">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />

        <main className="flex-1 p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
          {/* Header */}
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#FF5A0A] uppercase tracking-wider">
                Senior Thesis Benchmark
              </span>
              <span className="text-[10px] text-[#A872AF] font-bold">
                &bull; Audited Partitions
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#400849] tracking-tight mt-1">
              Model Evaluation & Tournament Comparison
            </h1>
            <p className="text-xs text-[#71367B] mt-1">
              Transparent academic benchmark comparing Logistic Regression vs Linear SVM on untouched test split.
            </p>
          </div>

          {/* Champion Banner */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#280730] to-[#400849] text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6 border border-[#E7B0DE]/20">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF5A0A] text-white text-[11px] font-black mb-2 shadow-sm">
                <Trophy className="w-3.5 h-3.5" />
                <span>Tournament Champion Model</span>
              </div>
              <h2 className="text-2xl font-black tracking-tight text-white">
                {champ.model_name}
              </h2>
              <p className="text-xs text-[#E7B0DE] mt-1 max-w-xl leading-relaxed">
                Selected through validation partition tournament. Evaluated on untouched test partition (N = {evalData.metadata.test_samples}).
              </p>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-center">
                <span className="text-xs text-[#E7B0DE] font-bold uppercase block">
                  Test Accuracy
                </span>
                <span className="text-3xl font-black text-[#10B981]">
                  {(testM.accuracy * 100).toFixed(1)}%
                </span>
              </div>
              <div className="text-center">
                <span className="text-xs text-[#E7B0DE] font-bold uppercase block">
                  Macro F1
                </span>
                <span className="text-3xl font-black text-white">
                  {testM.macro_f1.toFixed(4)}
                </span>
              </div>
              <div className="text-center hidden sm:block">
                <span className="text-xs text-[#E7B0DE] font-bold uppercase block">
                  Inference Latency
                </span>
                <span className="text-3xl font-black text-[#FF5A0A]">
                  {testM.inference_latency_us} &micro;s
                </span>
              </div>
            </div>
          </div>

          {/* Tournament Comparison Table */}
          <div className="p-6 rounded-3xl bg-white border border-[#E7B0DE]/40 shadow-sm">
            <h3 className="text-xs font-black text-[#400849] tracking-tight mb-4">
              Model Tournament Benchmark (Logistic Regression vs Linear SVM)
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[#E7B0DE]/40 text-[#A872AF] font-bold text-[10px] uppercase bg-[#FAF0F8]">
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
                <tbody className="divide-y divide-[#E7B0DE]/30 font-medium">
                  <tr className="hover:bg-[#FAF0F8]">
                    <td className="p-3 font-bold text-[#400849]">
                      Linear Support Vector Classifier (Calibrated)
                    </td>
                    <td className="p-3 font-mono">{svm.val_macro_f1?.toFixed(4) || "—"}</td>
                    <td className="p-3 font-mono font-bold text-[#10B981]">
                      {(svm.accuracy * 100).toFixed(2)}%
                    </td>
                    <td className="p-3 font-mono font-bold">{svm.macro_f1.toFixed(4)}</td>
                    <td className="p-3 font-mono">{svm.weighted_f1.toFixed(4)}</td>
                    <td className="p-3 text-[#71367B]">{svm.train_time_ms} ms</td>
                    <td className="p-3 text-[#71367B]">{svm.inference_latency_us} &micro;s</td>
                    <td className="p-3">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#10B981]/15 text-[#10B981] font-black text-[10px] uppercase">
                        Champion
                      </span>
                    </td>
                  </tr>

                  <tr className="hover:bg-[#FAF0F8]">
                    <td className="p-3 font-bold text-[#400849]">
                      Multinomial Logistic Regression (L2 Regularized)
                    </td>
                    <td className="p-3 font-mono">{lr.val_macro_f1?.toFixed(4) || "—"}</td>
                    <td className="p-3 font-mono">{(lr.accuracy * 100).toFixed(2)}%</td>
                    <td className="p-3 font-mono">{lr.macro_f1.toFixed(4)}</td>
                    <td className="p-3 font-mono">{lr.weighted_f1.toFixed(4)}</td>
                    <td className="p-3 text-[#71367B]">{lr.train_time_ms} ms</td>
                    <td className="p-3 text-[#71367B]">{lr.inference_latency_us} &micro;s</td>
                    <td className="p-3 text-[#A872AF]">Baseline</td>
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
            <div className="p-6 rounded-3xl bg-white border border-[#E7B0DE]/40 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-black text-[#400849] tracking-tight mb-1">
                  Per-Class Performance Metrics
                </h3>
                <p className="text-[11px] text-[#A872AF] mb-4">
                  Precision, Recall, and F1-score across all genuine classes
                </p>

                <div className="space-y-3">
                  {(["positive", "neutral", "negative"] as const).map((lbl) => {
                    const row = testM.per_class[lbl];
                    if (!row) return null;
                    const color =
                      lbl === "positive"
                        ? "text-[#10B981] bg-[#10B981]/10"
                        : lbl === "negative"
                        ? "text-[#E11D48] bg-[#E11D48]/10"
                        : "text-[#FF5A0A] bg-[#FFF2EC]";

                    return (
                      <div
                        key={lbl}
                        className="p-3.5 rounded-2xl bg-[#FAF0F8] border border-[#E7B0DE]/40 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${color}`}>
                            {lbl}
                          </span>
                          <span className="text-xs text-[#71367B] font-medium">
                            (Support: {row.support})
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-xs font-mono font-bold">
                          <span>
                            Prec: <span className="text-[#400849] font-black">{row.precision.toFixed(3)}</span>
                          </span>
                          <span>
                            Rec: <span className="text-[#400849] font-black">{row.recall.toFixed(3)}</span>
                          </span>
                          <span>
                            F1: <span className="text-[#FF5A0A] font-black">{row.f1_score.toFixed(3)}</span>
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
            <div className="p-6 rounded-3xl bg-white border border-[#E7B0DE]/40 shadow-sm">
              <div className="flex items-center gap-2 text-[#FF5A0A] mb-3">
                <BookOpen className="w-4 h-4" />
                <h3 className="text-xs font-black text-[#400849]">
                  Dataset & Feature Engineering Pipeline
                </h3>
              </div>
              <ul className="space-y-2 text-xs text-[#71367B] leading-relaxed">
                <li>
                  <span className="font-bold text-[#400849]">&bull; Feature Representation: </span>
                  {evalData.methodology.feature_engineering}
                </li>
                <li>
                  <span className="font-bold text-[#400849]">&bull; Partitioning Protocol: </span>
                  {evalData.methodology.model_selection}
                </li>
                <li>
                  <span className="font-bold text-[#400849]">&bull; Vectorizer Vocabulary: </span>
                  {evalData.metadata.features_count.toLocaleString()} n-gram features fitted on Train partition only.
                </li>
              </ul>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-[#E7B0DE]/40 shadow-sm">
              <div className="flex items-center gap-2 text-[#FF5A0A] mb-3">
                <AlertTriangle className="w-4 h-4" />
                <h3 className="text-xs font-black text-[#400849]">
                  Known Limitations & Ethical Guardrails
                </h3>
              </div>
              <ul className="space-y-2 text-xs text-[#71367B] leading-relaxed">
                {evalData.methodology.known_limitations.map((lim, i) => (
                  <li key={i}>
                    <span className="font-bold text-[#400849]">&bull; </span>
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
