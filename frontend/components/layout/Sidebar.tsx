"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MessageSquareText,
  Layers,
  UploadCloud,
  Cpu,
  FileSpreadsheet,
  Sparkles,
  Home,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Review Explorer", href: "/reviews", icon: MessageSquareText },
  { label: "Topic Intelligence", href: "/topics", icon: Layers },
  { label: "Upload & Analyze", href: "/upload", icon: UploadCloud },
  { label: "Model Evaluation", href: "/model", icon: Cpu },
  { label: "Executive Reports", href: "/reports", icon: FileSpreadsheet },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      aria-label="Sidebar Navigation"
      className="hidden md:flex flex-col w-64 bg-[#161327] text-white min-h-screen border-r border-white/5 select-none shrink-0"
    >
      {/* Brand Header */}
      <div className="p-6 flex items-center justify-between border-b border-white/10">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#6D4AFF] to-[#B6A4FF] flex items-center justify-center shadow-lg shadow-[#6D4AFF]/30 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-white to-[#B6A4FF] bg-clip-text text-transparent">
              Voxora AI
            </span>
            <span className="block text-[10px] text-[#9B94B8] font-medium uppercase tracking-wider">
              Feedback Intelligence
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-4 py-6 space-y-1.5">
        <div className="px-3 pb-2 text-[11px] font-semibold tracking-wider text-[#9B94B8] uppercase">
          Intelligence Suite
        </div>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150",
                isActive
                  ? "bg-[#6D4AFF] text-white shadow-md shadow-[#6D4AFF]/30 font-semibold"
                  : "text-[#B6A4FF]/80 hover:text-white hover:bg-white/5"
              )}
            >
              <Icon className={cn("w-4 h-4", isActive ? "text-white" : "text-[#B6A4FF]")} />
              <span>{item.label}</span>
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white shadow-sm" />
              )}
            </Link>
          );
        })}

        <div className="pt-6 px-3 pb-2 text-[11px] font-semibold tracking-wider text-[#9B94B8] uppercase">
          Quick Access
        </div>
        <Link
          href="/"
          className={cn(
            "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 text-[#B6A4FF]/80 hover:text-white hover:bg-white/5",
            pathname === "/" && "bg-white/10 text-white"
          )}
        >
          <Home className="w-4 h-4 text-[#B6A4FF]" />
          <span>Product Landing</span>
        </Link>
      </nav>

      {/* Footer System Status */}
      <div className="p-4 m-4 rounded-xl bg-white/[0.04] border border-white/5">
        <div className="flex items-center gap-2 mb-1.5">
          <div className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
          <span className="text-xs font-semibold text-white">Local ML Pipeline</span>
        </div>
        <p className="text-[11px] text-[#9B94B8] leading-relaxed">
          TF-IDF &bull; Linear SVM &bull; NMF Modeling active. 100% private inference.
        </p>
      </div>
    </aside>
  );
}
