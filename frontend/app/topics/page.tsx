"use client";

import React, { useEffect, useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";
import { TopicCard } from "@/components/topics/TopicCard";
import { TopicRadarChart } from "@/components/dashboard/TopicRadarChart";
import { api } from "@/lib/api";
import { TopicSummary } from "@/lib/types";
import { resolveDefaultDataset, setStoredDatasetId } from "@/lib/dataset-store";
import { HelpCircle } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";

export default function TopicsPage() {
  const [activeDatasetId, setActiveDatasetId] = useState<string>("");
  const [topics, setTopics] = useState<TopicSummary[]>([]);

  useEffect(() => {
    let ignore = false;
    api.getDatasets().then((ds) => {
      if (!ignore && ds && ds.length > 0) {
        const chosen = resolveDefaultDataset(ds);
        if (chosen) {
          setActiveDatasetId(chosen.id);
        }
      }
    });

    const handleDatasetEvent = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      if (customEvent.detail) {
        setActiveDatasetId(customEvent.detail);
      }
    };

    window.addEventListener("voxora:dataset-change", handleDatasetEvent);
    return () => {
      ignore = true;
      window.removeEventListener("voxora:dataset-change", handleDatasetEvent);
    };
  }, []);

  useEffect(() => {
    if (!activeDatasetId) return;
    let ignore = false;
    api.getTopics(activeDatasetId)
      .then((data) => {
        if (!ignore) setTopics(data);
      })
      .catch(() => {});
    return () => {
      ignore = true;
    };
  }, [activeDatasetId]);

  // Chart data: stacked sentiment per topic
  const chartData = topics.map((t) => ({
    name: t.name.length > 16 ? t.name.slice(0, 14) + "..." : t.name,
    fullName: t.name,
    positive: t.sentiment_distribution.positive,
    neutral: t.sentiment_distribution.neutral,
    negative: t.sentiment_distribution.negative,
    total: t.review_count,
  }));

  return (
    <div className="flex min-h-screen bg-[#FAF4F9] text-[#400849]">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar
          currentDatasetId={activeDatasetId}
          onDatasetChange={(id) => {
            setStoredDatasetId(id);
            setActiveDatasetId(id);
          }}
        />

        <main className="flex-1 p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
          <div>
            <span className="text-xs font-bold text-[#FF5A0A] uppercase tracking-wider">
              Latent Semantic Analysis
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#400849] tracking-tight mt-1">
              Topic Intelligence (NMF Modeling)
            </h1>
            <p className="text-xs text-[#71367B] mt-1">
              Non-Negative Matrix Factorization discovers recurring customer conversation themes separate from sentiment classification.
            </p>
          </div>

          {/* Academic Topic Modeling Note */}
          <div className="p-4 rounded-2xl bg-[#FAF0F8] border border-[#E7B0DE]/50 flex items-start gap-3 text-xs text-[#71367B]">
            <HelpCircle className="w-5 h-5 text-[#FF5A0A] shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-[#400849]">Methodological Separation: </span>
              In accordance with academic standards, topic modeling is trained independently from sentiment prediction.
              NMF factorizes the document-term TF-IDF matrix into interpretable components.
              Topic titles are human-curated based on dominant keyword clusters.
            </div>
          </div>

          {/* Visual Analytics Row: Radar Chart + Cross-Topic Bar Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* 5-Axis Topic Resonance Vector */}
            <div className="lg:col-span-5 h-full">
              <TopicRadarChart />
            </div>

            {/* Cross-Topic Sentiment Breakdown Chart */}
            <div className="lg:col-span-7 p-6 rounded-3xl bg-white border border-[#E7B0DE]/40 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xs font-black text-[#400849] tracking-tight">
                    Cross-Topic Sentiment Comparison
                  </h2>
                  <p className="text-[11px] text-[#A872AF] mt-0.5">
                    Positive, neutral, and negative review distribution across each discovered cluster
                  </p>
                </div>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#FAF0F8" />
                    <XAxis
                      dataKey="name"
                      stroke="#A872AF"
                      fontSize={10}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="#A872AF"
                      fontSize={10}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length > 0) {
                          const item = payload[0]?.payload as (typeof chartData)[0] | undefined;
                          if (!item) return null;
                          return (
                            <div className="p-3 rounded-xl bg-[#400849] text-white shadow-xl text-xs space-y-1 border border-[#E7B0DE]/40">
                              <p className="font-bold text-[#E7B0DE]">{item.fullName}</p>
                              <p className="text-[#10B981]">Positive: {item.positive}</p>
                              <p className="text-[#FF5A0A]">Neutral: {item.neutral}</p>
                              <p className="text-[#E11D48]">Negative: {item.negative}</p>
                              <p className="text-[10px] text-white/70 border-t border-white/10 pt-1">
                                Total Volume: {item.total}
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Legend
                      wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }}
                      formatter={(val) => <span className="capitalize text-[#400849] font-bold">{val}</span>}
                    />
                    <Bar dataKey="positive" fill="#10B981" stackId="a" radius={[0, 0, 0, 0]} isAnimationActive={false} />
                    <Bar dataKey="neutral" fill="#FF5A0A" stackId="a" radius={[0, 0, 0, 0]} isAnimationActive={false} />
                    <Bar dataKey="negative" fill="#400849" stackId="a" radius={[4, 4, 0, 0]} isAnimationActive={false} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Topic Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topics.map((t) => (
              <TopicCard key={t.topic_id} topic={t} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
