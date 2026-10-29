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
    <div className="flex min-h-screen bg-[#FAF4F9] text-[#400849]">
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
              <span className="text-xs font-bold text-[#FF5A0A] uppercase tracking-wider">
                Intelligence Artifacts
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#400849] tracking-tight mt-1">
                Executive Reports & Data Export
              </h1>
              <p className="text-xs text-[#71367B] mt-1">
                Download publication-ready executive PDF summaries or export enriched customer reviews as CSV.
              </p>
            </div>

            {activeDatasetId && (
              <div className="flex items-center gap-3">
                <a
                  href={api.getCsvExportUrl(activeDatasetId)}
                  download
                  className="px-4 py-2.5 rounded-xl border border-[#E7B0DE]/60 bg-white hover:bg-[#FAF0F8] text-xs font-bold text-[#400849] transition-all flex items-center gap-2 shadow-xs"
                >
                  <FileSpreadsheet className="w-4 h-4 text-[#FF5A0A]" />
                  <span>Export CSV</span>
                </a>

                <a
                  href={api.getPdfReportUrl(activeDatasetId)}
                  download
                  className="px-5 py-2.5 rounded-xl bg-[#FF5A0A] hover:bg-[#E04D05] text-white text-xs font-extrabold shadow-md shadow-[#FF5A0A]/25 transition-all flex items-center gap-2"
                >
                  <Download className="w-4 h-4 stroke-[2.5]" />
                  <span>Download PDF Report</span>
                </a>
              </div>
            )}
          </div>

          {/* AI Executive Synthesis Section (Gemini / Audited Local) */}
          <div className="p-6 rounded-3xl bg-white border border-[#E7B0DE]/40 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E7B0DE]/30">
              <div className="flex items-center gap-2.5 text-xs font-black text-[#400849]">
                <Brain className="w-4 h-4 text-[#FF5A0A]" />
                <span>Executive Strategic Synthesis</span>
              </div>
              <span className="text-[10px] font-black text-[#10B981] bg-[#ECFDF5] px-2.5 py-0.5 rounded-full border border-[#10B981]/20">
                {aiSynthesis ? aiSynthesis.provider : "Loading AI Insights..."}
              </span>
            </div>

            {loadingAi ? (
              <div className="py-8 text-center text-xs font-bold text-[#71367B] animate-pulse">
                Synthesizing strategic customer takeaways...
              </div>
            ) : aiSynthesis ? (
              <div className="space-y-4 text-xs leading-relaxed">
                <div className="p-4 rounded-2xl bg-[#FAF0F8] border border-[#E7B0DE]/40 text-[#400849]">
                  <p className="whitespace-pre-line font-medium leading-relaxed">
                    {aiSynthesis.executive_summary}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-white border border-[#10B981]/20">
                    <span className="text-xs font-black text-[#10B981] block mb-2">
                      Key Organizational Strengths
                    </span>
                    <ul className="space-y-1.5 text-[#400849] font-medium">
                      {aiSynthesis.key_strengths.map((str, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981] shrink-0 mt-0.5" />
                          <span>{str}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 rounded-2xl bg-white border border-[#E11D48]/20">
                    <span className="text-xs font-black text-[#E11D48] block mb-2">
                      Urgent Friction Remediations
                    </span>
                    <ul className="space-y-1.5 text-[#400849] font-medium">
                      {aiSynthesis.urgent_interventions.map((intv, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <AlertCircle className="w-3.5 h-3.5 text-[#E11D48] shrink-0 mt-0.5" />
                          <span>{intv}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#FFF2EC] border border-[#FF5A0A]/20 text-[#400849] flex items-center justify-between">
                  <span className="font-black text-[#FF5A0A]">Quarterly Strategic Priority:</span>
                  <span className="font-bold text-right max-w-md">
                    {aiSynthesis.quarterly_recommendation}
                  </span>
                </div>
              </div>
            ) : null}
          </div>

          {/* Report Preview Document */}
          {stats && (
            <div className="p-8 rounded-3xl bg-white border border-[#E7B0DE]/40 shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#E7B0DE]/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#400849] text-[#FF5A0A] flex items-center justify-center font-black text-sm shadow-xs">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-[#400849]">
                      Voxora AI Intelligence Summary
                    </h3>
                    <p className="text-xs text-[#71367B]">
                      Dataset: {stats.dataset_name} &bull; Generated from verified ML inference
                    </p>
                  </div>
                </div>

                <span className="text-xs font-black px-3 py-1 rounded-full bg-[#ECFDF5] text-[#10B981] border border-[#10B981]/20">
                  Official Document
                </span>
              </div>

              {/* KPI Grid */}
              <div className="grid grid-cols-3 gap-4 p-4 rounded-2xl bg-[#FAF0F8] border border-[#E7B0DE]/40 text-center">
                <div>
                  <span className="text-[10px] text-[#A872AF] font-bold uppercase block">
                    Customer Sentiment Score
                  </span>
                  <span className="text-2xl font-black text-[#400849]">
                    {stats.sentiment_score} / 100
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-[#A872AF] font-bold uppercase block">
                    Total Volume
                  </span>
                  <span className="text-2xl font-black text-[#400849]">
                    {stats.total_reviews.toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-[#A872AF] font-bold uppercase block">
                    Sentiment Health
                  </span>
                  <span className="text-xs font-bold mt-1 block">
                    <span className="text-[#10B981]">{stats.percentages.positive}% Pos</span> &bull;{" "}
                    <span className="text-[#400849]">{stats.percentages.negative}% Neg</span>
                  </span>
                </div>
              </div>

              {/* Topics Breakdown Table */}
              <div>
                <h4 className="text-xs font-black text-[#400849] uppercase tracking-wider mb-2">
                  Discovered Topic Clusters & Dominant Keywords
                </h4>
                <div className="overflow-x-auto rounded-2xl border border-[#E7B0DE]/40">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-[#FAF0F8] text-[#A872AF] font-bold text-[10px] uppercase border-b border-[#E7B0DE]/40">
                        <th className="p-3">Topic</th>
                        <th className="p-3">Share</th>
                        <th className="p-3">Sentiment Split</th>
                        <th className="p-3">Keywords</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E7B0DE]/30 font-medium">
                      {stats.topics.map((t) => (
                        <tr key={t.topic_id}>
                          <td className="p-3 font-bold text-[#400849]">{t.name}</td>
                          <td className="p-3 font-bold">{t.percentage}%</td>
                          <td className="p-3">
                            <span className="text-[#10B981] font-bold">
                              {t.sentiment_distribution.positive} pos
                            </span>{" "}
                            /{" "}
                            <span className="text-[#E11D48] font-bold">
                              {t.sentiment_distribution.negative} neg
                            </span>
                          </td>
                          <td className="p-3 text-[#71367B]">
                            {t.top_keywords.slice(0, 4).join(", ")}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Methodology & Ethical Guarantee */}
              <div className="p-4 rounded-2xl bg-[#FAF0F8] border border-[#E7B0DE]/40 text-xs text-[#71367B] space-y-1">
                <span className="font-bold text-[#400849]">Report Methodology & Governance: </span>
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
