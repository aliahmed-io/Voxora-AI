"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Search,
  ChevronDown,
  Database,
  UploadCloud,
  Menu,
  X,
} from "lucide-react";
import { api } from "@/lib/api";
import { DatasetBrief } from "@/lib/types";
import { Logo } from "./Logo";
import { cn } from "@/lib/utils";
import { resolveDefaultDataset, setStoredDatasetId } from "@/lib/dataset-store";

interface NavbarProps {
  currentDatasetId?: string;
  onDatasetChange?: (id: string) => void;
}

export function Navbar({ currentDatasetId, onDatasetChange }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [datasets, setDatasets] = useState<DatasetBrief[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    api.getDatasets().then(setDatasets).catch(() => {});
  }, [pathname]);

  const activeDataset =
    datasets.find((d) => d.id === currentDatasetId) || resolveDefaultDataset(datasets);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/reviews?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const TOP_TABS = [
    { label: "Overview", href: "/dashboard" },
    { label: "Reviews", href: "/reviews" },
    { label: "Topics", href: "/topics" },
    { label: "Model", href: "/model" },
    { label: "Reports", href: "/reports" },
  ];

  return (
    <header className="h-16 border-b border-[#E7B0DE]/40 bg-white/90 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-40">
      {/* Mobile Menu & Brand */}
      <div className="flex items-center gap-3 md:hidden">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1.5 rounded-lg text-[#400849] hover:bg-[#FAF0F8]"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
        <Link href="/">
          <Logo size="sm" />
        </Link>
      </div>

      {/* Global Search Bar (60% Orchid tinted background + 30% Eggplant text) */}
      <div className="hidden sm:flex items-center flex-1 max-w-md mr-4">
        <form onSubmit={handleSearchSubmit} className="relative w-full">
          <Search className="w-4 h-4 text-[#A872AF] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search reviews, insights, topics..."
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-[#FBF3F9] border border-[#E7B0DE]/60 text-[#400849] placeholder-[#A872AF] focus:outline-none focus:border-[#400849] focus:bg-white transition-all font-medium"
          />
        </form>
      </div>

      {/* Top Header Navigation Tabs (Active tab underline in Signal Orange) */}
      <nav className="hidden lg:flex items-center gap-1 h-full">
        {TOP_TABS.map((tab) => {
          const isActive = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "h-full px-4 flex items-center text-xs font-bold border-b-2 transition-colors",
                isActive
                  ? "border-[#FF5A0A] text-[#400849]"
                  : "border-transparent text-[#71367B] hover:text-[#400849]"
              )}
            >
              {tab.label}
            </Link>
          );
        })}
      </nav>

      {/* Right Controls: Dataset Switcher + Action Icons + User Avatar */}
      <div className="flex items-center gap-3">
        {/* Dataset Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-[#E7B0DE]/60 bg-[#FAF0F8] hover:bg-[#F3DCF0] text-xs font-bold text-[#400849] transition-all"
          >
            <Database className="w-3.5 h-3.5 text-[#FF5A0A]" />
            <span className="max-w-[130px] sm:max-w-[170px] truncate">
              {activeDataset ? activeDataset.name : "Select Dataset"}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-[#A872AF]" />
          </button>

          {isOpen && (
            <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white border border-[#E7B0DE]/60 shadow-xl p-1.5 z-50">
              <div className="px-3 py-2 text-[10px] font-black text-[#A872AF] uppercase tracking-wider">
                Select Active Dataset
              </div>
              <div className="max-h-60 overflow-y-auto space-y-0.5">
                {datasets.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => {
                      setStoredDatasetId(d.id);
                      if (onDatasetChange) onDatasetChange(d.id);
                      setIsOpen(false);
                    }}
                    className={cn(
                      "w-full text-left px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-between transition-colors",
                      d.id === currentDatasetId
                        ? "bg-[#400849] text-white font-bold"
                        : "text-[#400849] hover:bg-[#FAF0F8]"
                    )}
                  >
                    <span className="truncate">{d.name}</span>
                    <span className="text-[10px] text-[#A872AF] shrink-0 ml-2">
                      {d.row_count.toLocaleString()} revs
                    </span>
                  </button>
                ))}
              </div>
              <div className="border-t border-[#E7B0DE]/40 pt-1 mt-1">
                <Link
                  href="/upload"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-[#FF5A0A] hover:bg-[#FFF2EC] flex items-center gap-2"
                >
                  <UploadCloud className="w-3.5 h-3.5" />
                  <span>Upload New CSV...</span>
                </Link>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-16 bg-white border-b border-[#E7B0DE] text-[#400849] p-6 z-50 md:hidden flex flex-col space-y-3 shadow-2xl">
          <Link
            href="/dashboard"
            onClick={() => setMobileMenuOpen(false)}
            className="text-sm font-bold py-2 border-b border-[#E7B0DE]/40"
          >
            Overview
          </Link>
          <Link
            href="/reviews"
            onClick={() => setMobileMenuOpen(false)}
            className="text-sm font-bold py-2 border-b border-[#E7B0DE]/40"
          >
            Reviews
          </Link>
          <Link
            href="/topics"
            onClick={() => setMobileMenuOpen(false)}
            className="text-sm font-bold py-2 border-b border-[#E7B0DE]/40"
          >
            Topics
          </Link>
          <Link
            href="/upload"
            onClick={() => setMobileMenuOpen(false)}
            className="text-sm font-bold py-2 border-b border-[#E7B0DE]/40"
          >
            Upload CSV
          </Link>
          <Link
            href="/model"
            onClick={() => setMobileMenuOpen(false)}
            className="text-sm font-bold py-2 border-b border-[#E7B0DE]/40"
          >
            Model Evaluation
          </Link>
          <Link
            href="/reports"
            onClick={() => setMobileMenuOpen(false)}
            className="text-sm font-bold py-2 border-b border-[#E7B0DE]/40"
          >
            Reports
          </Link>
        </div>
      )}
    </header>
  );
}
