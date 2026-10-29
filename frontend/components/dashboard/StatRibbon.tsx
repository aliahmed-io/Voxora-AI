"use client";

import React from "react";
import {
  Users,
  UserCheck,
  Sparkles,
  AlertOctagon,
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
      value: totalReviews > 0 ? totalReviews.toLocaleString() : "986",
      change: "+18%",
      isPositive: true,
      icon: Users,
      iconColor: "#400849",
      bgColor: "#FAEEF7",
      barGrad: "from-[#400849] to-[#E7B0DE]",
    },
    {
      label: "Positive Feedback",
      value: positiveCount > 0 ? positiveCount.toLocaleString() : "379",
      change: "+11%",
      isPositive: true,
      icon: UserCheck,
      iconColor: "#10B981",
      bgColor: "#ECFDF5",
      barGrad: "from-[#10B981] to-[#A7F3D0]",
    },
    {
      label: "Neutral Feedback",
      value: neutralCount > 0 ? neutralCount.toLocaleString() : "296",
      change: "+32%",
      isPositive: true,
      icon: Sparkles,
      iconColor: "#FF5A0A",
      bgColor: "#FFF2EC",
      barGrad: "from-[#FF5A0A] to-[#FFA153]",
    },
    {
      label: "Negative Issues",
      value: negativeCount > 0 ? negativeCount.toLocaleString() : "311",
      change: "-12%",
      isPositive: false,
      icon: AlertOctagon,
      iconColor: "#E11D48",
      bgColor: "#FFE4E6",
      barGrad: "from-[#E11D48] to-[#FDA4AF]",
    },
    {
      label: "CSAT Score",
      value: `${csatScore || 53}/100`,
      change: "+7%",
      isPositive: true,
      icon: Target,
      iconColor: "#FF5A0A",
      bgColor: "#FFF2EC",
      barGrad: "from-[#FF5A0A] to-[#FFD0B5]",
    },
    {
      label: "Reviews Analyzed",
      value: analyzedCount !== undefined ? analyzedCount.toLocaleString() : (totalReviews > 0 ? (totalReviews * 3).toLocaleString() : "2,876"),
      change: "+21%",
      isPositive: true,
      icon: Eye,
      iconColor: "#400849",
      bgColor: "#FAEEF7",
      barGrad: "from-[#400849] to-[#631A70]",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3.5">
      {stats.map((s, idx) => {
        const Icon = s.icon;
        return (
          <div
            key={idx}
            className="p-3.5 pb-2.5 rounded-2xl bg-white border border-[#E7B0DE]/40 shadow-xs flex flex-col justify-between hover:shadow-md hover:border-[#E7B0DE] transition-all select-none group"
          >
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <span className="text-[10px] font-bold text-[#A872AF] block truncate">
                  {s.label}
                </span>
                <div className="flex items-baseline gap-1.5 mt-0.5">
                  <span className="text-base sm:text-lg font-black text-[#400849] tracking-tight">
                    {s.value}
                  </span>
                  <span
                    className={`text-[9px] font-black ${
                      s.isPositive ? "text-[#10B981]" : "text-[#E11D48]"
                    }`}
                  >
                    {s.change}
                  </span>
                </div>
              </div>

              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ml-2 shadow-2xs group-hover:scale-105 transition-transform"
                style={{ backgroundColor: s.bgColor, color: s.iconColor }}
              >
                <Icon className="w-4 h-4 stroke-[2.5]" />
              </div>
            </div>

            {/* Micro Indicator Line */}
            <div className="h-1 w-full rounded-full bg-[#FAF0F8] overflow-hidden mt-2.5">
              <div className={`h-full w-2/3 rounded-full bg-gradient-to-r ${s.barGrad}`} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
