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
      avatarBg: "from-[#400849] to-[#631A70]",
      initials: "SC",
    },
    {
      name: "Michael Rodriguez",
      role: "Product Manager",
      date: "May 28, 2025",
      avatarBg: "from-[#FF5A0A] to-[#FF7A38]",
      initials: "MR",
    },
    {
      name: "Priya Patel",
      role: "Customer Success",
      date: "May 27, 2025",
      avatarBg: "from-[#631A70] to-[#E7B0DE]",
      initials: "PP",
    },
    {
      name: "David Kim",
      role: "Founder & CEO",
      date: "May 25, 2025",
      avatarBg: "from-[#400849] to-[#FF5A0A]",
      initials: "DK",
    },
  ];

  return (
    <div className="p-5 rounded-3xl bg-white border border-[#E7B0DE]/40 shadow-sm flex flex-col justify-between">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xs font-black text-[#400849] tracking-tight">
          Recent Reviews
        </h2>
        <Link
          href="/reviews"
          className="text-[11px] font-bold text-[#FF5A0A] hover:underline"
        >
          View all
        </Link>
      </div>

      <div className="space-y-3">
        {users.map((u) => (
          <Link
            key={u.name}
            href="/reviews"
            className="flex items-center justify-between p-1.5 rounded-xl hover:bg-[#FAF0F8] transition-colors group"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div
                className={`w-7 h-7 rounded-full bg-gradient-to-tr ${u.avatarBg} text-white font-black text-[10px] flex items-center justify-center shrink-0 shadow-2xs`}
              >
                {u.initials}
              </div>
              <div className="min-w-0">
                <span className="text-xs font-bold text-[#400849] group-hover:text-[#FF5A0A] transition-colors block truncate">
                  {u.name}
                </span>
                <span className="text-[10px] text-[#A872AF] block truncate">
                  {u.role}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <span className="text-[10px] text-[#A872AF] font-medium">{u.date}</span>
              <div className="w-5 h-5 rounded-full bg-[#FFF2EC] text-[#FF5A0A] flex items-center justify-center group-hover:bg-[#FF5A0A] group-hover:text-white transition-colors shadow-2xs">
                <ChevronRight className="w-3 h-3" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
