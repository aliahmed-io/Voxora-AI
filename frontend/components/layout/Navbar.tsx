"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  UploadCloud,
  Database,
  ChevronDown,
  Menu,
  X,
  Sparkles,
  RefreshCw,
} from "lucide-react";
import { api } from "@/lib/api";
import { DatasetBrief } from "@/lib/types";

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
  const [loadingSample, setLoadingSample] = useState(false);

  useEffect(() => {
    api.getDatasets().then(setDatasets).catch(() => {});
  }, [pathname]);

  const activeDataset = datasets.find((d) => d.id === currentDatasetId) || datasets[0];

  const handleQuickDemo = async () => {
    try {
      setLoadingSample(true);
      await api.loadSample("saas");
      router.push("/upload");
    } catch {
      // ignore
    } finally {
      setLoadingSample(false);
    }
  };

  return (
    <header className="h-16 border-b border-[#6D4AFF]/10 bg-white/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-40">
      {/* Mobile Menu Button */}
      <div className="flex items-center gap-3 md:hidden">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg text-[#161327] hover:bg-[#F5F2FF]"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#6D4AFF] flex items-center justify-center text-white">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="font-extrabold text-base text-[#161327]">Voxora AI</span>
        </Link>
      </div>

      {/* Dataset Selector Dropdown */}
      <div className="hidden sm:flex items-center gap-3">
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl border border-[#6D4AFF]/15 bg-[#F5F2FF]/60 hover:bg-[#F5F2FF] text-xs font-semibold text-[#161327] transition-all"
          >
            <Database className="w-3.5 h-3.5 text-[#6D4AFF]" />
            <span className="max-w-[200px] truncate">
              {activeDataset ? activeDataset.name : "No Dataset Loaded"}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-[#625D7E]" />
          </button>

          {isOpen && (
            <div className="absolute left-0 mt-2 w-64 rounded-xl bg-white border border-[#6D4AFF]/15 shadow-xl p-1 z-50">
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
                    className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-[#161327] hover:bg-[#F5F2FF] flex items-center justify-between"
                  >
                    <span className="truncate">{d.name}</span>
                    <span className="text-[10px] text-[#625D7E] shrink-0 ml-2">
                      {d.row_count} revs
                    </span>
                  </button>
                ))}
                {datasets.length === 0 && (
                  <div className="px-3 py-4 text-xs text-center text-[#625D7E]">
                    No datasets analyzed yet.
                  </div>
                )}
              </div>
              <div className="border-t border-[#6D4AFF]/10 pt-1 mt-1">
                <Link
                  href="/upload"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-[#6D4AFF] hover:bg-[#ECE7FF] flex items-center gap-2"
                >
                  <UploadCloud className="w-3.5 h-3.5" />
                  <span>Upload New Dataset...</span>
                </Link>
              </div>
            </div>
          )}
        </div>

        {activeDataset && (
          <span className="text-xs text-[#625D7E] hidden lg:inline">
            Status: <span className="font-semibold text-[#10B981]">Active &bull; {activeDataset.row_count.toLocaleString()} reviews</span>
          </span>
        )}
      </div>

      {/* Action CTA Buttons */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleQuickDemo}
          disabled={loadingSample}
          className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[#6D4AFF]/20 text-xs font-semibold text-[#6D4AFF] hover:bg-[#ECE7FF] transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loadingSample ? "animate-spin" : ""}`} />
          <span>Demo Data</span>
        </button>

        <Link
          href="/upload"
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#6D4AFF] hover:bg-[#5B39EE] text-white text-xs font-semibold shadow-md shadow-[#6D4AFF]/20 transition-all hover:scale-[1.02]"
        >
          <UploadCloud className="w-4 h-4" />
          <span>Import CSV</span>
        </Link>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-16 bg-[#161327] text-white p-6 z-50 md:hidden flex flex-col space-y-4">
          <Link
            href="/dashboard"
            onClick={() => setMobileMenuOpen(false)}
            className="text-base font-medium py-2 border-b border-white/10"
          >
            Overview Dashboard
          </Link>
          <Link
            href="/reviews"
            onClick={() => setMobileMenuOpen(false)}
            className="text-base font-medium py-2 border-b border-white/10"
          >
            Review Explorer
          </Link>
          <Link
            href="/topics"
            onClick={() => setMobileMenuOpen(false)}
            className="text-base font-medium py-2 border-b border-white/10"
          >
            Topic Intelligence
          </Link>
          <Link
            href="/upload"
            onClick={() => setMobileMenuOpen(false)}
            className="text-base font-medium py-2 border-b border-white/10"
          >
            Upload & Analyze
          </Link>
          <Link
            href="/model"
            onClick={() => setMobileMenuOpen(false)}
            className="text-base font-medium py-2 border-b border-white/10"
          >
            Model Evaluation
          </Link>
          <Link
            href="/reports"
            onClick={() => setMobileMenuOpen(false)}
            className="text-base font-medium py-2 border-b border-white/10"
          >
            Executive Reports
          </Link>
        </div>
      )}
    </header>
  );
}
