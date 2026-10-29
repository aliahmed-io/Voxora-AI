"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export function RecentFeedback() {
  const users = [
    {
      name: "Sarah Chen",
      role: "Head of Product",
      date: "May 30, 2025",
      avatarBg: "from-[#6D4AFF] to-[#8B5CF6]",
      initials: "SC",
    },
    {
      name: "Michael Rodriguez",
      role: "Product Manager",
      date: "May 28, 2025",
      avatarBg: "from-[#3B82F6] to-[#60A5FA]",
      initials: "MR",
    },
    {
      name: "Priya Patel",
      role: "Customer Success",
      date: "May 27, 2025",
      avatarBg: "from-[#EC4899] to-[#F472B6]",
      initials: "PP",
    },
    {
      name: "David Kim",
      role: "Founder & CEO",
      date: "May 25, 2025",
      avatarBg: "from-[#10B981] to-[#34D399]",
      initials: "DK",
    },
  ];

  return (
    <div className="p-5 rounded-3xl bg-white border border-[#ECE8F8] shadow-sm flex flex-col justify-between">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xs font-bold text-[#161327] tracking-tight">
          Recent Reviews
        </h2>
        <Link
          href="/reviews"
          className="text-[11px] font-semibold text-[#6D4AFF] hover:underline"
        >
          View all
        </Link>
      </div>

      <div className="space-y-3">
        {users.map((u) => (
          <Link
            key={u.name}
            href="/reviews"
            className="flex items-center justify-between p-1.5 rounded-xl hover:bg-[#F8F9FE] transition-colors group"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div
                className={`w-7 h-7 rounded-full bg-gradient-to-tr ${u.avatarBg} text-white font-bold text-[10px] flex items-center justify-center shrink-0 shadow-sm`}
              >
                {u.initials}
              </div>
              <div className="min-w-0">
                <span className="text-xs font-bold text-[#161327] group-hover:text-[#6D4AFF] transition-colors block truncate">
                  {u.name}
                </span>
                <span className="text-[10px] text-[#9B94B8] block truncate">
                  {u.role}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <span className="text-[10px] text-[#9B94B8]">{u.date}</span>
              <div className="w-5 h-5 rounded-full bg-[#F3F0FF] text-[#6D4AFF] flex items-center justify-center group-hover:bg-[#6D4AFF] group-hover:text-white transition-colors">
                <ChevronRight className="w-3 h-3" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
