"use client";

import React from "react";
import {
  Users,
  UserCheck,
  Sparkles,
  FileText,
  Target,
  Eye,
} from "lucide-react";

interface StatRibbonProps {
  totalReviews: number;
  positiveCount: number;
  neutralCount: number;
  negativeCount: number;
  csatScore: number;
  analyzedCount?: number;
}

export function StatRibbon({
  totalReviews,
  positiveCount,
  neutralCount,
  negativeCount,
  csatScore,
  analyzedCount,
}: StatRibbonProps) {
  const stats = [
    {
      label: "Total Reviews",
      value: totalReviews > 0 ? totalReviews.toLocaleString() : "3,842",
      change: "+18%",
      isPositive: true,
      icon: Users,
      iconColor: "#6D4AFF",
      bgColor: "#EDE9FE",
    },
    {
      label: "Positive Feedback",
      value: positiveCount > 0 ? positiveCount.toLocaleString() : "2,156",
      change: "+11%",
      isPositive: true,
      icon: UserCheck,
      iconColor: "#3B82F6",
      bgColor: "#DBEAFE",
    },
    {
      label: "Neutral Feedback",
      value: neutralCount > 0 ? neutralCount.toLocaleString() : "874",
      change: "+32%",
      isPositive: true,
      hasSparkline: true,
      icon: Sparkles,
      iconColor: "#8B5CF6",
      bgColor: "#F3E8FF",
    },
    {
      label: "Negative Issues",
      value: negativeCount > 0 ? negativeCount.toLocaleString() : "1,248",
      change: "-12%",
      isPositive: false,
      icon: FileText,
      iconColor: "#F43F5E",
      bgColor: "#FFE4E6",
    },
    {
      label: "CSAT Score",
      value: `${csatScore || 87}/100`,
      change: "+7%",
      isPositive: true,
      icon: Target,
      iconColor: "#6D4AFF",
      bgColor: "#EDE9FE",
    },
    {
      label: "Reviews Analyzed",
      value: analyzedCount !== undefined ? analyzedCount.toLocaleString() : "2,876",
      change: "+21%",
      isPositive: true,
      icon: Eye,
      iconColor: "#6D4AFF",
      bgColor: "#EDE9FE",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
      {stats.map((s, idx) => {
        const Icon = s.icon;
        return (
          <div
            key={idx}
            className="p-3.5 rounded-2xl bg-white border border-[#ECE8F8] shadow-sm flex items-center justify-between hover:shadow-md transition-shadow select-none"
          >
            <div className="min-w-0">
              <span className="text-[10px] font-semibold text-[#9B94B8] block truncate">
                {s.label}
              </span>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-base sm:text-lg font-black text-[#161327] tracking-tight">
                  {s.value}
                </span>
                <span
                  className={`text-[9px] font-bold ${
                    s.isPositive ? "text-[#10B981]" : "text-[#F43F5E]"
                  }`}
                >
                  {s.change}
                </span>
              </div>
            </div>

            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ml-2"
              style={{ backgroundColor: s.bgColor, color: s.iconColor }}
            >
              <Icon className="w-4 h-4" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
