"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Search,
  Bell,
  HelpCircle,
  Settings,
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

  const activeDataset = datasets.find((d) => d.id === currentDatasetId) || datasets[0];

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
    <header className="h-16 border-b border-[#ECE8F8] bg-white px-6 flex items-center justify-between sticky top-0 z-40">
      {/* Mobile Menu & Brand */}
      <div className="flex items-center gap-3 md:hidden">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1.5 rounded-lg text-[#161327] hover:bg-[#F5F2FF]"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
        <Link href="/">
          <Logo size="sm" />
        </Link>
      </div>

      {/* Global Search Bar (Matching reference image) */}
      <div className="hidden sm:flex items-center flex-1 max-w-md mr-4">
        <form onSubmit={handleSearchSubmit} className="relative w-full">
          <Search className="w-4 h-4 text-[#9B94B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search reviews, insights, topics..."
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-[#F8F9FE] border border-[#EBE8F8] text-[#161327] placeholder-[#9B94B8] focus:outline-none focus:border-[#6D4AFF] focus:bg-white transition-all"
          />
        </form>
      </div>

      {/* Top Header Navigation Tabs (Matching reference image) */}
      <nav className="hidden lg:flex items-center gap-1 h-full">
        {TOP_TABS.map((tab) => {
          const isActive = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "h-full px-3.5 flex items-center text-xs font-semibold border-b-2 transition-colors",
                isActive
                  ? "border-[#6D4AFF] text-[#6D4AFF]"
                  : "border-transparent text-[#625D7E] hover:text-[#161327]"
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
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[#ECE8F8] bg-[#F8F9FE] hover:bg-[#F3F0FF] text-xs font-semibold text-[#161327] transition-all"
          >
            <Database className="w-3.5 h-3.5 text-[#6D4AFF]" />
            <span className="max-w-[130px] sm:max-w-[170px] truncate">
              {activeDataset ? activeDataset.name : "Select Dataset"}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-[#9B94B8]" />
          </button>

          {isOpen && (
            <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white border border-[#ECE8F8] shadow-xl p-1.5 z-50">
              <div className="px-3 py-2 text-[10px] font-bold text-[#9B94B8] uppercase tracking-wider">
                Select Active Dataset
              </div>
              <div className="max-h-60 overflow-y-auto space-y-0.5">
                {datasets.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => {
                      if (onDatasetChange) onDatasetChange(d.id);
                      setIsOpen(false);
                    }}
                    className={cn(
                      "w-full text-left px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-between transition-colors",
                      d.id === currentDatasetId
                        ? "bg-[#EDE9FE] text-[#6D4AFF] font-bold"
                        : "text-[#161327] hover:bg-[#F8F9FE]"
                    )}
                  >
                    <span className="truncate">{d.name}</span>
                    <span className="text-[10px] text-[#9B94B8] shrink-0 ml-2">
                      {d.row_count.toLocaleString()} revs
                    </span>
                  </button>
                ))}
              </div>
              <div className="border-t border-[#ECE8F8] pt-1 mt-1">
                <Link
                  href="/upload"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-[#6D4AFF] hover:bg-[#F3F0FF] flex items-center gap-2"
                >
                  <UploadCloud className="w-3.5 h-3.5" />
                  <span>Upload New CSV...</span>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Action Icons */}
        <div className="hidden sm:flex items-center gap-1.5 text-[#625D7E]">
          <button
            className="relative p-2 rounded-xl hover:bg-[#F8F9FE] text-[#625D7E] hover:text-[#161327] transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="w-2 h-2 rounded-full bg-[#EC4899] absolute top-2 right-2 border-2 border-white" />
          </button>
          <button
            className="p-2 rounded-xl hover:bg-[#F8F9FE] text-[#625D7E] hover:text-[#161327] transition-colors"
            title="Help & Documentation"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
          <button
            className="p-2 rounded-xl hover:bg-[#F8F9FE] text-[#625D7E] hover:text-[#161327] transition-colors"
            title="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>

        {/* User Profile Avatar */}
        <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-[#ECE8F8] shrink-0 bg-gradient-to-tr from-[#6D4AFF] to-[#B6A4FF] flex items-center justify-center text-white text-xs font-bold shadow-sm">
          AL
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-16 bg-white border-b border-[#ECE8F8] text-[#161327] p-6 z-50 md:hidden flex flex-col space-y-3 shadow-2xl">
          <Link
            href="/dashboard"
            onClick={() => setMobileMenuOpen(false)}
            className="text-sm font-semibold py-2 border-b border-[#ECE8F8]"
          >
            Overview
          </Link>
          <Link
            href="/reviews"
            onClick={() => setMobileMenuOpen(false)}
            className="text-sm font-semibold py-2 border-b border-[#ECE8F8]"
          >
            Reviews
          </Link>
          <Link
            href="/topics"
            onClick={() => setMobileMenuOpen(false)}
            className="text-sm font-semibold py-2 border-b border-[#ECE8F8]"
          >
            Topics
          </Link>
          <Link
            href="/upload"
            onClick={() => setMobileMenuOpen(false)}
            className="text-sm font-semibold py-2 border-b border-[#ECE8F8]"
          >
            Upload CSV
          </Link>
          <Link
            href="/model"
            onClick={() => setMobileMenuOpen(false)}
            className="text-sm font-semibold py-2 border-b border-[#ECE8F8]"
          >
            Model Evaluation
          </Link>
          <Link
            href="/reports"
            onClick={() => setMobileMenuOpen(false)}
            className="text-sm font-semibold py-2 border-b border-[#ECE8F8]"
          >
            Reports
          </Link>
        </div>
      )}
    </header>
  );
}
