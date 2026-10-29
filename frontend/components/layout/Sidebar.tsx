"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MessageSquareText,
  Layers,
  Cpu,
  FileSpreadsheet,
  Plus,
  Folder,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "./Logo";

const NAV_ITEMS = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Reviews", href: "/reviews", icon: MessageSquareText, badge: "986" },
  { label: "Topics", href: "/topics", icon: Layers, badge: "5" },
  { label: "Model Evaluation", href: "/model", icon: Cpu, badge: "100%" },
  { label: "Reports", href: "/reports", icon: FileSpreadsheet },
];

const TOPIC_COLLECTIONS = [
  { name: "Customer Support", count: 276, active: false },
  { name: "Platform Stability", count: 414, active: true },
  { name: "UI & Usability", count: 177, active: false },
  { name: "Pricing & Billing", count: 85, active: false },
  { name: "Feature Requests", count: 34, active: false },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      aria-label="Sidebar Navigation"
      className="hidden md:flex flex-col w-64 bg-white text-[#161327] min-h-screen border-r border-[#ECE8F8] select-none shrink-0"
    >
      {/* Brand Header with Custom SVG Logo */}
      <div className="p-5 flex items-center justify-between border-b border-[#ECE8F8]/80">
        <Link href="/" className="group">
          <Logo size="md" />
        </Link>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 px-4 py-4 space-y-5 overflow-y-auto">
        {/* "+ New Research / Import CSV" Action Button */}
        <div>
          <Link
            href="/upload"
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#6D4AFF] hover:bg-[#5B3CE6] text-white font-semibold text-xs shadow-sm shadow-[#6D4AFF]/25 transition-all hover:scale-[1.01]"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>New Analysis</span>
          </Link>
        </div>

        {/* Primary Navigation Menu */}
        <nav className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-medium transition-all duration-150",
                  isActive
                    ? "bg-[#EDE9FE] text-[#6D4AFF] font-semibold"
                    : "text-[#625D7E] hover:text-[#161327] hover:bg-[#F8F9FE]"
                )}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    className={cn(
                      "w-4 h-4",
                      isActive ? "text-[#6D4AFF]" : "text-[#9B94B8]"
                    )}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={cn(
                      "text-[10px] font-semibold px-2 py-0.5 rounded-full",
                      isActive
                        ? "bg-[#6D4AFF] text-white"
                        : "bg-[#F3F0FF] text-[#6D4AFF]"
                    )}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Collections / Topic Clusters Section */}
        <div className="pt-2 border-t border-[#ECE8F8]">
          <div className="flex items-center justify-between px-3 pb-2">
            <span className="text-[11px] font-bold tracking-wider text-[#9B94B8] uppercase">
              Collections
            </span>
            <Link
              href="/topics"
              className="text-[#9B94B8] hover:text-[#6D4AFF] transition-colors"
              title="View all topics"
            >
              <Plus className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-1">
            {TOPIC_COLLECTIONS.map((col) => (
              <Link
                key={col.name}
                href={`/reviews?topic=${encodeURIComponent(col.name)}`}
                className={cn(
                  "flex items-center justify-between px-3.5 py-1.5 rounded-lg text-xs transition-colors",
                  col.active
                    ? "text-[#6D4AFF] font-semibold bg-[#F5F2FF]"
                    : "text-[#625D7E] hover:text-[#161327] hover:bg-[#F8F9FE]"
                )}
              >
                <div className="flex items-center gap-2 truncate">
                  <Folder
                    className={cn(
                      "w-3.5 h-3.5 shrink-0",
                      col.active ? "text-[#6D4AFF]" : "text-[#9B94B8]"
                    )}
                  />
                  <span className="truncate">{col.name}</span>
                </div>
                <span className="text-[10px] text-[#9B94B8]">{col.count}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Upgrade / AI Synthesis Card */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-[#FAF8FF] to-[#EDE9FE]/80 border border-[#DDD6FE]/70 shadow-sm">
          <div className="flex items-center gap-1.5 mb-1 text-[#6D4AFF]">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="text-xs font-bold">AI Synthesis Active</span>
          </div>
          <p className="text-[11px] text-[#625D7E] leading-relaxed mb-3">
            Local Calibrated Linear SVM & NMF topic modeling running autonomously.
          </p>
          <Link
            href="/reports"
            className="block text-center py-2 px-3 rounded-xl bg-[#6D4AFF] hover:bg-[#5B3CE6] text-white text-xs font-semibold shadow-sm transition-all"
          >
            Export PDF Report
          </Link>
        </div>
      </div>

      {/* User / Workspace Profile Footer */}
      <div className="p-3.5 border-t border-[#ECE8F8] flex items-center justify-between">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#6D4AFF] to-[#B6A4FF] flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-sm">
            VX
          </div>
          <div className="min-w-0">
            <span className="text-xs font-bold text-[#161327] block truncate">
              Voxora Workspace
            </span>
            <span className="text-[10px] text-[#9B94B8] block truncate">
              team@voxora.ai
            </span>
          </div>
        </div>
        <ChevronDown className="w-3.5 h-3.5 text-[#9B94B8] shrink-0" />
      </div>
    </aside>
  );
}
