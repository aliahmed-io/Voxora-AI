"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, Users, Coins } from "lucide-react";

export function LatestInsights() {
  const insights = [
    {
      id: "1",
      icon: Sparkles,
      iconColor: "#6D4AFF",
      bgColor: "#EDE9FE",
      tag: "INSIGHT",
      tagColor: "bg-[#F3F0FF] text-[#6D4AFF]",
      title: "Users struggle with integration setup",
      description: "43% of users mention integration complexity",
      date: "May 30, 2025",
    },
    {
      id: "2",
      icon: Users,
      iconColor: "#EC4899",
      bgColor: "#FCE7F3",
      tag: "TREND",
      tagColor: "bg-[#FDF2F8] text-[#EC4899]",
      title: "Onboarding drop-off after step 2",
      description: "67% of users drop off during account setup",
      date: "May 28, 2025",
    },
    {
      id: "3",
      icon: Coins,
      iconColor: "#F59E0B",
      bgColor: "#FEF3C7",
      tag: "OPPORTUNITY",
      tagColor: "bg-[#FFFBEB] text-[#F59E0B]",
      title: "Automation is a top requested feature",
      description: "21% of users request more automation",
      date: "May 26, 2025",
    },
  ];

  return (
    <div className="p-5 rounded-3xl bg-white border border-[#ECE8F8] shadow-sm flex flex-col justify-between">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xs font-bold text-[#161327] tracking-tight">
          Latest Insights
        </h2>
        <Link
          href="/reviews"
          className="text-[11px] font-semibold text-[#6D4AFF] hover:underline"
        >
          View all
        </Link>
      </div>

      <div className="space-y-3">
        {insights.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.id} className="flex items-start gap-3 group cursor-pointer">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                style={{ backgroundColor: item.bgColor, color: item.iconColor }}
              >
                <Icon className="w-4 h-4" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-xs font-bold text-[#161327] group-hover:text-[#6D4AFF] transition-colors truncate">
                    {item.title}
                  </h3>
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase shrink-0 ${item.tagColor}`}
                  >
                    {item.tag}
                  </span>
                </div>
                <p className="text-[11px] text-[#625D7E] mt-0.5 line-clamp-1">
                  {item.description}
                </p>
                <span className="text-[10px] text-[#9B94B8] block mt-0.5">
                  {item.date}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
