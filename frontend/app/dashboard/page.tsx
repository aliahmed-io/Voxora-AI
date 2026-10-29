"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";
import { StatRibbon } from "@/components/dashboard/StatRibbon";
import { SentimentGauge } from "@/components/dashboard/SentimentGauge";
import { SentimentMap } from "@/components/dashboard/SentimentMap";
import { TimeSeriesChart } from "@/components/dashboard/TimeSeriesChart";
import { InsightsByCategory } from "@/components/dashboard/InsightsByCategory";
import { LatestInsights } from "@/components/dashboard/LatestInsights";
import { RecentFeedback } from "@/components/dashboard/RecentFeedback";
import { api } from "@/lib/api";
import { DashboardStats } from "@/lib/types";
import { UploadCloud } from "lucide-react";

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
    <div className="flex min-h-screen bg-[#FBF3F9] text-[#400849]">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar
          currentDatasetId={stats?.dataset_id}
          onDatasetChange={handleDatasetChange}
        />

        <main className="flex-1 p-5 md:p-6 space-y-5 max-w-[1700px] w-full mx-auto">
          {loading && (
            <div className="p-16 text-center rounded-3xl bg-white border border-[#E7B0DE]/40 shadow-sm space-y-3">
              <div className="w-8 h-8 rounded-full border-2 border-[#FF5A0A] border-t-transparent animate-spin mx-auto" />
              <p className="text-xs font-bold text-[#400849]">Loading intelligence metrics...</p>
            </div>
          )}

          {error && !loading && (
            <div className="p-12 text-center rounded-3xl bg-white border border-[#E7B0DE]/50 shadow-sm space-y-4 max-w-md mx-auto">
              <div className="w-12 h-12 rounded-2xl bg-[#FFF2EC] text-[#FF5A0A] flex items-center justify-center mx-auto shadow-xs">
                <UploadCloud className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-black text-[#400849]">No Dataset Ready</h3>
                <p className="text-xs text-[#71367B] mt-1 leading-relaxed">
                  {error}
                </p>
              </div>
              <div className="pt-2 flex justify-center gap-3">
                <Link
                  href="/upload"
                  className="px-5 py-2.5 rounded-xl bg-[#FF5A0A] hover:bg-[#E04D05] text-white text-xs font-extrabold shadow-md shadow-[#FF5A0A]/25"
                >
                  Upload Your First CSV
                </Link>
              </div>
            </div>
          )}

          {stats && !loading && (
            <>
              {/* Row 1: Top 6-Metric Stat Ribbon (60-30-10 Palette) */}
              <StatRibbon
                totalReviews={stats.total_reviews}
                positiveCount={stats.distribution.positive}
                neutralCount={stats.distribution.neutral}
                negativeCount={stats.distribution.negative}
                csatScore={stats.sentiment_score}
              />

              {/* Row 2: Main 3-Column Editorial Intelligence Grid */}
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
                {/* Left Column: Global Overview / Sentiment Gauge (3 cols) */}
                <div className="xl:col-span-3 h-full">
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

                {/* Middle Column: Customer Sentiment Map + TimeSeries & Categories (6 cols) */}
                <div className="xl:col-span-6 space-y-5">
                  <SentimentMap points={stats.sentiment_map} />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <TimeSeriesChart data={stats.trend} />
                    <InsightsByCategory
                      categories={stats.topics.map((t) => ({
                        name: t.name,
                        percentage: Math.round(t.percentage),
                      }))}
                    />
                  </div>
                </div>

                {/* Right Column: Latest Insights + Recent Feedback (3 cols) */}
                <div className="xl:col-span-3 space-y-5">
                  <LatestInsights />
                  <RecentFeedback />
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
