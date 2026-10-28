"use client";

import React, { useEffect, useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";
import { api } from "@/lib/api";
import { DashboardStats, AIExecutiveSynthesis } from "@/lib/types";
import {
  FileSpreadsheet,
  Download,
  CheckCircle2,
  AlertCircle,
  FileText,
  Brain,
} from "lucide-react";

export default function ReportsPage() {
  const [activeDatasetId, setActiveDatasetId] = useState<string>("");
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [aiSynthesis, setAiSynthesis] = useState<AIExecutiveSynthesis | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  useEffect(() => {
    let ignore = false;
    api.getDatasets().then((ds) => {
      if (!ignore && ds && ds.length > 0) {
        const id = ds[0]?.id ?? "";
        setActiveDatasetId(id);
      }
    });
    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    if (!activeDatasetId) return;

    let ignore = false;
    api.getDatasetDashboard(activeDatasetId)
      .then((data) => {
        if (!ignore) {
          setStats(data);
          setLoadingAi(true);
          api.getAiSynthesis(activeDatasetId)
            .then((res) => {
              if (!ignore) setAiSynthesis(res);
            })
            .catch(() => {})
            .finally(() => {
              if (!ignore) setLoadingAi(false);
            });
        }
      })
      .catch(() => {});

    return () => {
      ignore = true;
    };
  }, [activeDatasetId]);

  return (
    <div className="flex min-h-screen bg-[#F5F2FF]">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar
          currentDatasetId={activeDatasetId}
          onDatasetChange={setActiveDatasetId}
        />

        <main className="flex-1 p-6 md:p-8 space-y-6 max-w-5xl mx-auto w-full">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-[#6D4AFF] uppercase tracking-wider">
                Intelligence Artifacts
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#161327] tracking-tight mt-1">
                Executive Reports & Data Export
              </h1>
              <p className="text-xs text-[#625D7E] mt-1">
                Download publication-ready executive PDF summaries or export enriched customer reviews as CSV.
              </p>
            </div>

            {activeDatasetId && (
              <div className="flex items-center gap-3">
                <a
                  href={api.getCsvExportUrl(activeDatasetId)}
                  download
                  className="px-4 py-2.5 rounded-xl border border-[#6D4AFF]/20 bg-white hover:bg-[#FAF8FF] text-xs font-semibold text-[#161327] transition-all flex items-center gap-2 shadow-sm"
                >
                  <FileSpreadsheet className="w-4 h-4 text-[#6D4AFF]" />
                  <span>Export CSV</span>
                </a>

                <a
                  href={api.getPdfReportUrl(activeDatasetId)}
                  download
                  className="px-5 py-2.5 rounded-xl bg-[#6D4AFF] hover:bg-[#5B39EE] text-white text-xs font-bold shadow-md shadow-[#6D4AFF]/25 transition-all flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download PDF Report</span>
                </a>
              </div>
            )}
          </div>

          {/* AI Executive Synthesis Section (Gemini / Audited Local) */}
          <div className="p-6 rounded-3xl bg-white border border-[#6D4AFF]/15 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#ECE7FF]">
              <div className="flex items-center gap-2.5 text-xs font-bold text-[#6D4AFF]">
                <Brain className="w-4 h-4" />
                <span>Executive Strategic Synthesis</span>
              </div>
              <span className="text-[11px] font-semibold text-[#10B981] bg-[#10B981]/10 px-2.5 py-0.5 rounded-full">
                {aiSynthesis ? aiSynthesis.provider : "Loading AI Insights..."}
              </span>
            </div>

            {loadingAi ? (
              <div className="py-8 text-center text-xs text-[#625D7E] animate-pulse">
                Synthesizing strategic customer takeaways...
              </div>
            ) : aiSynthesis ? (
              <div className="space-y-4 text-xs leading-relaxed">
                <div className="p-4 rounded-2xl bg-[#FAF8FF] border border-[#ECE7FF] text-[#161327]">
                  <p className="whitespace-pre-line font-medium leading-relaxed">
                    {aiSynthesis.executive_summary}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-white border border-[#10B981]/20">
                    <span className="text-xs font-bold text-[#10B981] block mb-2">
                      Key Organizational Strengths
                    </span>
                    <ul className="space-y-1.5 text-[#161327]">
                      {aiSynthesis.key_strengths.map((str, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981] shrink-0 mt-0.5" />
                          <span>{str}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 rounded-2xl bg-white border border-[#F43F5E]/20">
                    <span className="text-xs font-bold text-[#F43F5E] block mb-2">
                      Urgent Friction Remediations
                    </span>
                    <ul className="space-y-1.5 text-[#161327]">
                      {aiSynthesis.urgent_interventions.map((intv, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <AlertCircle className="w-3.5 h-3.5 text-[#F43F5E] shrink-0 mt-0.5" />
                          <span>{intv}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#ECE7FF]/60 border border-[#6D4AFF]/15 text-[#161327] flex items-center justify-between">
                  <span className="font-bold text-[#6D4AFF]">Quarterly Strategic Priority:</span>
                  <span className="font-semibold text-right max-w-md">
                    {aiSynthesis.quarterly_recommendation}
                  </span>
                </div>
              </div>
            ) : null}
          </div>

          {/* Report Preview Document */}
          {stats && (
            <div className="p-8 rounded-3xl bg-white border border-[#6D4AFF]/15 shadow-xl space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#ECE7FF]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#6D4AFF] text-white flex items-center justify-center font-extrabold text-sm shadow-md shadow-[#6D4AFF]/25">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-extrabold text-[#161327]">
                      Voxora AI Intelligence Summary
                    </h3>
                    <p className="text-xs text-[#625D7E]">
                      Dataset: {stats.dataset_name} &bull; Generated from verified ML inference
                    </p>
                  </div>
                </div>

                <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#10B981]/15 text-[#10B981]">
                  Official Document
                </span>
              </div>

              {/* KPI Grid */}
              <div className="grid grid-cols-3 gap-4 p-4 rounded-2xl bg-[#FAF8FF] border border-[#ECE7FF] text-center">
                <div>
                  <span className="text-[10px] text-[#9B94B8] font-bold uppercase block">
                    Customer Sentiment Score
                  </span>
                  <span className="text-2xl font-extrabold text-[#6D4AFF]">
                    {stats.sentiment_score} / 100
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-[#9B94B8] font-bold uppercase block">
                    Total Volume
                  </span>
                  <span className="text-2xl font-extrabold text-[#161327]">
                    {stats.total_reviews.toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-[#9B94B8] font-bold uppercase block">
                    Sentiment Health
                  </span>
                  <span className="text-xs font-bold mt-1 block">
                    <span className="text-[#10B981]">{stats.percentages.positive}% Pos</span> &bull;{" "}
                    <span className="text-[#F43F5E]">{stats.percentages.negative}% Neg</span>
                  </span>
                </div>
              </div>

              {/* Topics Breakdown Table */}
              <div>
                <h4 className="text-xs font-bold text-[#161327] uppercase tracking-wider mb-2">
                  Discovered Topic Clusters & Dominant Keywords
                </h4>
                <div className="overflow-x-auto rounded-xl border border-[#ECE7FF]">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-[#FAF8FF] text-[#9B94B8] font-bold text-[10px] uppercase border-b border-[#ECE7FF]">
                        <th className="p-3">Topic</th>
                        <th className="p-3">Share</th>
                        <th className="p-3">Sentiment Split</th>
                        <th className="p-3">Keywords</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#ECE7FF]/60 font-medium">
                      {stats.topics.map((t) => (
                        <tr key={t.topic_id}>
                          <td className="p-3 font-bold text-[#161327]">{t.name}</td>
                          <td className="p-3">{t.percentage}%</td>
                          <td className="p-3">
                            <span className="text-[#10B981] font-bold">
                              {t.sentiment_distribution.positive} pos
                            </span>{" "}
                            /{" "}
                            <span className="text-[#F43F5E] font-bold">
                              {t.sentiment_distribution.negative} neg
                            </span>
                          </td>
                          <td className="p-3 text-[#625D7E]">
                            {t.top_keywords.slice(0, 4).join(", ")}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Methodology & Ethical Guarantee */}
              <div className="p-4 rounded-xl bg-[#FAF8FF] border border-[#ECE7FF] text-xs text-[#625D7E] space-y-1">
                <span className="font-bold text-[#161327]">Report Methodology & Governance: </span>
                <p>
                  Classifications generated by scikit-learn Linear Support Vector Machine with Platt scaling calibration.
                  Features extracted using sublinear TF-IDF (1, 2) n-grams preserving natural language negations.
                  No generative hallucinations or ungrounded statistics.
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
