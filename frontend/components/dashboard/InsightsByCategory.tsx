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
    { name: "Onboarding", percentage: 67, color: "#400849", icon: Compass },
    { name: "Integrations", percentage: 43, color: "#FF5A0A", icon: Link2 },
    { name: "Pricing", percentage: 31, color: "#E7B0DE", icon: DollarSign },
    { name: "Performance", percentage: 24, color: "#631A70", icon: Zap },
    { name: "Support", percentage: 17, color: "#E11D48", icon: Headphones },
  ];

  const items = categories && categories.length > 0
    ? categories.slice(0, 5).map((c, i) => {
        const fallback = defaultCategories[i] || defaultCategories[0];
        if (!fallback) {
          return {
            name: c.name,
            percentage: c.percentage,
            color: "#400849",
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
    <div className="p-5 rounded-3xl bg-white border border-[#E7B0DE]/40 shadow-sm flex flex-col justify-between h-full">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xs font-black text-[#400849] tracking-tight">
          Insights by Category
        </h2>
        <Link
          href="/topics"
          className="text-[11px] font-bold text-[#FF5A0A] hover:underline"
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
                style={{ backgroundColor: `${item.color}18`, color: item.color }}
              >
                <Icon className="w-3.5 h-3.5" />
              </div>

              <span className="text-xs font-bold text-[#400849] w-24 truncate">
                {item.name}
              </span>

              <div className="flex-1 h-1.5 rounded-full bg-[#F3DCF0] overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${item.percentage}%`,
                    backgroundColor: item.color,
                  }}
                />
              </div>

              <span className="text-xs font-black text-[#400849] w-8 text-right shrink-0">
                {item.percentage}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
