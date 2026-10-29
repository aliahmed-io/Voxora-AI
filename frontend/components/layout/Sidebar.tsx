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
      className="hidden md:flex flex-col w-64 bg-white text-[#400849] min-h-screen border-r border-[#E7B0DE]/40 select-none shrink-0"
    >
      {/* Brand Header with Custom 60-30-10 SVG Logo */}
      <div className="p-5 flex items-center justify-between border-b border-[#E7B0DE]/30">
        <Link href="/" className="group">
          <Logo size="md" />
        </Link>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 px-4 py-4 space-y-5 overflow-y-auto">
        {/* 10% High-Voltage Action Button (Signal Orange) */}
        <div>
          <Link
            href="/upload"
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#FF5A0A] hover:bg-[#E04D05] text-white font-extrabold text-xs shadow-md shadow-[#FF5A0A]/25 transition-all hover:scale-[1.01]"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>New Analysis</span>
          </Link>
        </div>

        {/* Primary Navigation Menu (30% Deep Eggplant Structure) */}
        <nav className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-150",
                  isActive
                    ? "bg-[#400849] text-white shadow-sm font-bold"
                    : "text-[#71367B] hover:text-[#400849] hover:bg-[#FAF0F8]"
                )}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    className={cn(
                      "w-4 h-4",
                      isActive ? "text-[#FF5A0A]" : "text-[#A872AF]"
                    )}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={cn(
                      "text-[10px] font-black px-2 py-0.5 rounded-full",
                      isActive
                        ? "bg-[#FF5A0A] text-white"
                        : "bg-[#FFF2EC] text-[#FF5A0A]"
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
        <div className="pt-2 border-t border-[#E7B0DE]/30">
          <div className="flex items-center justify-between px-3 pb-2">
            <span className="text-[11px] font-black tracking-wider text-[#A872AF] uppercase">
              Collections
            </span>
            <Link
              href="/topics"
              className="text-[#A872AF] hover:text-[#FF5A0A] transition-colors"
              title="View all topics"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
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
                    ? "text-[#400849] font-bold bg-[#FAEEF7]"
                    : "text-[#71367B] hover:text-[#400849] hover:bg-[#FAF0F8]"
                )}
              >
                <div className="flex items-center gap-2 truncate">
                  <Folder
                    className={cn(
                      "w-3.5 h-3.5 shrink-0",
                      col.active ? "text-[#FF5A0A]" : "text-[#A872AF]"
                    )}
                  />
                  <span className="truncate">{col.name}</span>
                </div>
                <span className="text-[10px] font-bold text-[#A872AF]">{col.count}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Upgrade / AI Synthesis Card (60% Pastel Orchid + 30% Eggplant Button) */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-[#FAEEF7] to-[#F3DCF0] border border-[#E7B0DE]/60 shadow-xs">
          <div className="flex items-center gap-1.5 mb-1 text-[#400849]">
            <Sparkles className="w-3.5 h-3.5 text-[#FF5A0A]" />
            <span className="text-xs font-black">AI Intelligence Active</span>
          </div>
          <p className="text-[11px] text-[#71367B] leading-relaxed mb-3">
            Calibrated Linear SVM & NMF topic modeling running autonomously on CPU.
          </p>
          <Link
            href="/reports"
            className="block text-center py-2 px-3 rounded-xl bg-[#400849] hover:bg-[#2F0536] text-white text-xs font-bold shadow-xs transition-all"
          >
            Export PDF Report
          </Link>
        </div>
      </div>

      {/* User / Workspace Profile Footer */}
      <div className="p-3.5 border-t border-[#E7B0DE]/30 flex items-center justify-between">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#400849] to-[#631A70] text-[#FF5A0A] text-xs font-black flex items-center justify-center shrink-0 shadow-xs">
            VX
          </div>
          <div className="min-w-0">
            <span className="text-xs font-bold text-[#400849] block truncate">
              Voxora Workspace
            </span>
            <span className="text-[10px] text-[#A872AF] block truncate">
              team@voxora.ai
            </span>
          </div>
        </div>
        <ChevronDown className="w-3.5 h-3.5 text-[#A872AF] shrink-0" />
      </div>
    </aside>
  );
}
