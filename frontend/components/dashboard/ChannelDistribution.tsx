"use client";

import React from "react";
import { ChannelStat } from "@/lib/types";
import { Headphones, Smartphone, Globe, MessageSquare } from "lucide-react";

interface ChannelDistributionProps {
  channels: ChannelStat[];
}

export function ChannelDistribution({ channels }: ChannelDistributionProps) {
  if (!channels || channels.length === 0) return null;

  const getChannelIcon = (name: string) => {
    const l = name.toLowerCase();
    if (l.includes("support")) return Headphones;
    if (l.includes("mobile") || l.includes("app")) return Smartphone;
    if (l.includes("web") || l.includes("portal")) return Globe;
    return MessageSquare;
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {channels.map((c) => {
        const Icon = getChannelIcon(c.channel);
        const scoreColor =
          c.score >= 4.0
            ? "text-[#10B981]"
            : c.score >= 3.0
            ? "text-[#FF5A0A]"
            : "text-[#E11D48]";

        return (
          <div
            key={c.channel}
            className="p-4 rounded-3xl bg-white border border-[#E7B0DE]/40 shadow-sm flex items-center justify-between voxora-card-hover"
          >
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#400849] mb-1">
                <Icon className="w-3.5 h-3.5 text-[#FF5A0A]" />
                <span className="truncate">{c.channel}</span>
              </div>
              <span className="text-[11px] font-semibold text-[#A872AF]">
                {c.reviews.toLocaleString()} verified revs
              </span>
            </div>
            <div className={`text-2xl font-black ${scoreColor}`}>
              {c.score.toFixed(1)}
            </div>
          </div>
        );
      })}
    </div>
  );
}
