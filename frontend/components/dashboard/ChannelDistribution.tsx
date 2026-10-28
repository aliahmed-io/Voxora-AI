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
            ? "text-[#6D4AFF]"
            : "text-[#F43F5E]";

        return (
          <div
            key={c.channel}
            className="p-4 rounded-2xl bg-white border border-[#6D4AFF]/10 shadow-sm flex items-center justify-between voxora-card-hover"
          >
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#625D7E] mb-1">
                <Icon className="w-3.5 h-3.5 text-[#6D4AFF]" />
                <span className="truncate">{c.channel}</span>
              </div>
              <span className="text-[11px] text-[#9B94B8]">
                {c.reviews.toLocaleString()} verified revs
              </span>
            </div>
            <div className={`text-2xl font-extrabold ${scoreColor}`}>
              {c.score.toFixed(1)}
            </div>
          </div>
        );
      })}
    </div>
  );
}
