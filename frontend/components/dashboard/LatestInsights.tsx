"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, Users, Coins } from "lucide-react";

export function LatestInsights() {
  const insights = [
    {
      id: "1",
      icon: Sparkles,
      iconColor: "#FF5A0A",
      bgColor: "#FFF2EC",
      tag: "INSIGHT",
      tagColor: "bg-[#FFF2EC] text-[#FF5A0A]",
      title: "Users struggle with integration setup",
      description: "43% of users mention integration complexity",
      date: "May 30, 2025",
    },
    {
      id: "2",
      icon: Users,
      iconColor: "#400849",
      bgColor: "#FAEEF7",
      tag: "TREND",
      tagColor: "bg-[#FAEEF7] text-[#400849]",
      title: "Onboarding drop-off after step 2",
      description: "67% of users drop off during account setup",
      date: "May 28, 2025",
    },
    {
      id: "3",
      icon: Coins,
      iconColor: "#FF5A0A",
      bgColor: "#FFF2EC",
      tag: "OPPORTUNITY",
      tagColor: "bg-[#FFF2EC] text-[#FF5A0A]",
      title: "Automation is a top requested feature",
      description: "21% of users request more automation",
      date: "May 26, 2025",
    },
  ];

  return (
    <div className="p-5 rounded-3xl bg-white border border-[#E7B0DE]/40 shadow-sm flex flex-col justify-between">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xs font-black text-[#400849] tracking-tight">
          Latest Insights
        </h2>
        <Link
          href="/reviews"
          className="text-[11px] font-bold text-[#FF5A0A] hover:underline"
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
                className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 shadow-2xs"
                style={{ backgroundColor: item.bgColor, color: item.iconColor }}
              >
                <Icon className="w-4 h-4" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-xs font-bold text-[#400849] group-hover:text-[#FF5A0A] transition-colors truncate">
                    {item.title}
                  </h3>
                  <span
                    className={`text-[9px] font-black px-1.5 py-0.5 rounded uppercase shrink-0 ${item.tagColor}`}
                  >
                    {item.tag}
                  </span>
                </div>
                <p className="text-[11px] text-[#71367B] mt-0.5 line-clamp-1">
                  {item.description}
                </p>
                <span className="text-[10px] text-[#A872AF] block mt-0.5">
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
