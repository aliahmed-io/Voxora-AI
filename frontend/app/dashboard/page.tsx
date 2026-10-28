"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";
import { SentimentGauge } from "@/components/dashboard/SentimentGauge";
import { TimeSeriesChart } from "@/components/dashboard/TimeSeriesChart";
import { SentimentMap } from "@/components/dashboard/SentimentMap";
import { HighlightsCard } from "@/components/dashboard/HighlightsCard";
import { ChannelDistribution } from "@/components/dashboard/ChannelDistribution";
import { api } from "@/lib/api";
import { DashboardStats } from "@/lib/types";
import {
  MessageSquare,
  Sparkles,
  AlertTriangle,
  UploadCloud,
  FileSpreadsheet,
  ArrowRight,
  Layers,
} from "lucide-react";

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;
    async function load() {
      try {
        const data = await api.getLatestDashboard();
        if (!ignore) setStats(data);
      } catch (err: unknown) {
        if (!ignore) {
          const msg = err instanceof Error ? err.message : "Failed to load dashboard data.";
          setError(msg);
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    load();
    return () => {
      ignore = true;
    };
  }, []);

  const handleDatasetChange = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getDatasetDashboard(id);
      setStats(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load dashboard data.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F5F2FF]">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar
          currentDatasetId={stats?.dataset_id}
          onDatasetChange={handleDatasetChange}
        />

        <main className="flex-1 p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
          {/* Dashboard Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-[#6D4AFF] uppercase tracking-wider">
                  Voice of Customers
                </span>
                <span className="text-[10px] text-[#9B94B8] font-semibold">
                  &bull; Live Intelligence
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#161327] tracking-tight">
                {stats ? stats.dataset_name : "Executive Overview"}
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/reviews"
                className="px-4 py-2 rounded-xl border border-[#6D4AFF]/20 bg-white hover:bg-[#FAF8FF] text-xs font-semibold text-[#161327] transition-all flex items-center gap-1.5"
              >
                <span>Inspect Reviews</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/reports"
                className="px-4 py-2 rounded-xl bg-[#6D4AFF] hover:bg-[#5B39EE] text-white text-xs font-semibold shadow-md shadow-[#6D4AFF]/20 transition-all flex items-center gap-1.5"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Executive Report</span>
              </Link>
            </div>
          </div>

          {loading && (
            <div className="p-16 text-center rounded-3xl bg-white border border-[#6D4AFF]/10 shadow-sm space-y-3">
              <div className="w-8 h-8 rounded-full border-2 border-[#6D4AFF] border-t-transparent animate-spin mx-auto" />
              <p className="text-sm font-semibold text-[#161327]">Loading intelligence metrics...</p>
            </div>
          )}

          {error && !loading && (
            <div className="p-12 text-center rounded-3xl bg-white border border-[#6D4AFF]/15 shadow-sm space-y-4 max-w-md mx-auto">
              <div className="w-12 h-12 rounded-2xl bg-[#ECE7FF] text-[#6D4AFF] flex items-center justify-center mx-auto">
                <UploadCloud className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-[#161327]">No Dataset Ready</h3>
                <p className="text-xs text-[#625D7E] mt-1 leading-relaxed">
                  {error}
                </p>
              </div>
              <div className="pt-2 flex justify-center gap-3">
                <Link
                  href="/upload"
                  className="px-5 py-2.5 rounded-xl bg-[#6D4AFF] text-white text-xs font-bold shadow-md shadow-[#6D4AFF]/25"
                >
                  Upload Your First CSV
                </Link>
              </div>
            </div>
          )}

          {stats && !loading && (
            <>
              {/* Top Stats KPI Bar */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-white border border-[#6D4AFF]/10 shadow-sm flex items-center justify-between voxora-card-hover">
                  <div>
                    <span className="text-[11px] font-semibold text-[#9B94B8] uppercase block">
                      Reviews Analyzed
                    </span>
                    <span className="text-2xl font-extrabold text-[#161327] mt-0.5 block">
                      {stats.total_reviews.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-[#ECE7FF] text-[#6D4AFF] flex items-center justify-center">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-[#6D4AFF]/10 shadow-sm flex items-center justify-between voxora-card-hover">
                  <div>
                    <span className="text-[11px] font-semibold text-[#9B94B8] uppercase block">
                      Sentiment Index
                    </span>
                    <span className="text-2xl font-extrabold text-[#6D4AFF] mt-0.5 block">
                      {stats.sentiment_score} / 100
                    </span>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-[#ECE7FF] text-[#6D4AFF] flex items-center justify-center">
                    <Sparkles className="w-5 h-5" />
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-[#6D4AFF]/10 shadow-sm flex items-center justify-between voxora-card-hover">
                  <div>
                    <span className="text-[11px] font-semibold text-[#9B94B8] uppercase block">
                      Active Topics
                    </span>
                    <span className="text-2xl font-extrabold text-[#161327] mt-0.5 block">
                      {stats.topics.length} Clusters
                    </span>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-[#FAF8FF] text-[#161327] flex items-center justify-center border border-[#ECE7FF]">
                    <Layers className="w-5 h-5" />
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-[#6D4AFF]/10 shadow-sm flex items-center justify-between voxora-card-hover">
                  <div>
                    <span className="text-[11px] font-semibold text-[#9B94B8] uppercase block">
                      Negative Dissatisfaction
                    </span>
                    <span className="text-2xl font-extrabold text-[#F43F5E] mt-0.5 block">
                      {stats.percentages.negative}%
                    </span>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-[#FFF1F2] text-[#F43F5E] flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                </div>
              </div>

              {/* Channels Row */}
              <ChannelDistribution channels={stats.channels} />

              {/* Main Analytical Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Sentiment Gauge */}
                <div className="lg:col-span-1">
                  <SentimentGauge
                    score={stats.sentiment_score}
                    positiveCount={stats.distribution.positive}
                    neutralCount={stats.distribution.neutral}
                    negativeCount={stats.distribution.negative}
                    positivePct={stats.percentages.positive}
                    neutralPct={stats.percentages.neutral}
                    negativePct={stats.percentages.negative}
                  />
                </div>

                {/* Temporal Time Series Area Chart */}
                <div className="lg:col-span-2">
                  <TimeSeriesChart data={stats.trend} />
                </div>
              </div>

              {/* Customer Sentiment 2D Map & Highlights */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* 2D Sentiment Map */}
                <div className="lg:col-span-2">
                  <SentimentMap points={stats.sentiment_map} />
                </div>

                {/* Highlights Card */}
                <div className="lg:col-span-1">
                  <HighlightsCard highlights={stats.highlights} />
                </div>
              </div>

              {/* Frequent Complaints & Friction Points */}
              <div className="p-6 rounded-2xl bg-white border border-[#6D4AFF]/10 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-sm font-bold text-[#161327] tracking-tight">
                      Top Customer Complaints & Friction Drivers
                    </h2>
                    <p className="text-xs text-[#625D7E] mt-0.5">
                      Isolated from negative review clusters and NMF component terms
                    </p>
                  </div>
                  <Link
                    href="/topics"
                    className="text-xs font-semibold text-[#6D4AFF] hover:underline"
                  >
                    View All Topics &rarr;
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {stats.top_complaints.map((c, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-xl bg-[#FAF8FF] border border-[#ECE7FF] flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xs font-bold text-[#161327] truncate">
                            {c.category}
                          </span>
                          <span className="text-[10px] font-extrabold text-[#F43F5E] bg-[#FFF1F2] px-2 py-0.5 rounded-full">
                            {c.negative_count} complaints
                          </span>
                        </div>
                        <p className="text-[11px] text-[#625D7E]">
                          Accounts for{" "}
                          <span className="font-bold text-[#161327]">
                            {c.negative_percentage}%
                          </span>{" "}
                          of all negative customer dissatisfaction.
                        </p>
                      </div>

                      <div className="mt-3 pt-2 border-t border-[#ECE7FF] flex flex-wrap gap-1">
                        {c.primary_issues.map((term, tIdx) => (
                          <span
                            key={tIdx}
                            className="px-2 py-0.5 rounded bg-white text-[10px] font-semibold text-[#F43F5E] border border-[#F43F5E]/20"
                          >
                            {term}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
