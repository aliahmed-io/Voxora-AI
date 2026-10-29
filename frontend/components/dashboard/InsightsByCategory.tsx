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
}

export function InsightsByCategory({ categories }: InsightsByCategoryProps) {
  const defaultCategories: CategoryInsight[] = [
    { name: "Onboarding", percentage: 67, color: "#6D4AFF", icon: Compass },
    { name: "Integrations", percentage: 43, color: "#4F46E5", icon: Link2 },
    { name: "Pricing", percentage: 31, color: "#EC4899", icon: DollarSign },
    { name: "Performance", percentage: 24, color: "#F43F5E", icon: Zap },
    { name: "Support", percentage: 17, color: "#F59E0B", icon: Headphones },
  ];

  const items = categories && categories.length > 0
    ? categories.slice(0, 5).map((c, i) => {
        const fallback = defaultCategories[i] || defaultCategories[0];
        if (!fallback) {
          return {
            name: c.name,
            percentage: c.percentage,
            color: "#6D4AFF",
            icon: Compass,
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
    <div className="p-5 rounded-3xl bg-white border border-[#ECE8F8] shadow-sm flex flex-col justify-between h-full">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xs font-bold text-[#161327] tracking-tight">
          Insights by Category
        </h2>
        <Link
          href="/topics"
          className="text-[11px] font-semibold text-[#6D4AFF] hover:underline"
        >
          View all
        </Link>
      </div>

      <div className="space-y-3">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.name} className="flex items-center gap-3">
              <div
                className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0"
                style={{ backgroundColor: `${item.color}15`, color: item.color }}
              >
                <Icon className="w-3.5 h-3.5" />
              </div>

              <span className="text-xs font-medium text-[#161327] w-24 truncate">
                {item.name}
              </span>

              <div className="flex-1 h-1.5 rounded-full bg-[#F3F0FF] overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${item.percentage}%`,
                    backgroundColor: item.color,
                  }}
                />
              </div>

              <span className="text-xs font-bold text-[#161327] w-8 text-right shrink-0">
                {item.percentage}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
