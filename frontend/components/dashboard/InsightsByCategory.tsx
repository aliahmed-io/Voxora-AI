"use client";

import React from "react";
import Link from "next/link";
import {
  Compass,
  Link2,
  DollarSign,
  Zap,
  Headphones,
} from "lucide-react";

interface CategoryInsight {
  name: string;
  percentage: number;
  color: string;
  icon: React.ElementType;
}

interface InsightsByCategoryProps {
  categories?: Array<{ name: string; percentage: number }>;
  onSwitchMode?: () => void;
}

export function InsightsByCategory({ categories, onSwitchMode }: InsightsByCategoryProps) {
  const defaultCategories: CategoryInsight[] = [
    { name: "Customer Support", percentage: 33, color: "#400849", icon: Headphones },
    { name: "Platform Performance", percentage: 26, color: "#FF5A0A", icon: Zap },
    { name: "UI & Usability", percentage: 24, color: "#9B1C80", icon: Compass },
    { name: "Billing & Subscriptions", percentage: 14, color: "#D946EF", icon: DollarSign },
    { name: "Feature Requests", percentage: 3, color: "#FF7A38", icon: Link2 },
  ];

  const items = categories && categories.length > 0
    ? categories.slice(0, 5).map((c, i) => {
        const fallback = defaultCategories[i] || defaultCategories[0];
        if (!fallback) {
          return {
            name: c.name,
            percentage: c.percentage,
            color: "#400849",
            icon: Headphones,
          };
        }
        return {
          name: c.name,
          percentage: c.percentage,
          color: fallback.color,
          icon: fallback.icon,
        };
      })
    : defaultCategories;

  return (
    <div className="p-5 rounded-3xl bg-white border border-[#E7B0DE]/40 shadow-sm flex flex-col justify-between h-full">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xs font-black text-[#400849] tracking-tight">
          Feedback by Category
        </h2>
        <div className="flex items-center gap-2">
          {onSwitchMode && (
            <button
              onClick={onSwitchMode}
              className="px-2 py-0.5 rounded-lg bg-[#FAF0F8] hover:bg-[#F3DCF0] border border-[#E7B0DE]/40 text-[9px] font-black text-[#FF5A0A] transition-colors"
              title="Switch to 5-Axis Radar Vector"
            >
              Show Radar
            </button>
          )}
          <Link
            href="/topics"
            className="text-[11px] font-bold text-[#FF5A0A] hover:underline"
          >
            View all
          </Link>
        </div>
      </div>

      <div className="space-y-2.5">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.name} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 min-w-0">
                  <div
                    className="w-5 h-5 rounded-md flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${item.color}15`, color: item.color }}
                  >
                    <Icon className="w-3 h-3" />
                  </div>
                  <span className="font-bold text-[#400849] truncate text-[11px]">
                    {item.name}
                  </span>
                </div>
                <span className="font-black text-[#400849] text-[11px] shrink-0 ml-2">
                  {item.percentage}%
                </span>
              </div>

              {/* Full Width Progress Bar */}
              <div className="h-1.5 w-full rounded-full bg-[#FAF0F8] overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${item.percentage}%`,
                    backgroundColor: item.color,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
