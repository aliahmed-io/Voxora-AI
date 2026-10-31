"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Logo } from "@/components/layout/Logo";
import { LandingRail } from "@/components/landing/LandingRail";
import { LandingHero } from "@/components/landing/LandingHero";
import { LandingMethod } from "@/components/landing/LandingMethod";
import { LandingLaboratory } from "@/components/landing/LandingLaboratory";
import { LandingTopology } from "@/components/landing/LandingTopology";
import { LandingDefensibility } from "@/components/landing/LandingDefensibility";
import { LandingDatasets } from "@/components/landing/LandingDatasets";
import { LandingCta } from "@/components/landing/LandingCta";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#FBF8FA] text-[#26052B] flex flex-col font-sans selection:bg-[#FF5A0A]/20">
      {/* 1. Left Architectural Navigation Rail (Visible on XL screens) */}
      <LandingRail />

      {/* 2. Global Editorial Top Navigation */}
      <header className="h-20 border-b border-[#400849]/10 bg-[#FBF8FA]/85 backdrop-blur-md px-6 sm:px-12 lg:px-16 xl:pl-24 flex items-center justify-between sticky top-0 z-30 transition-all">
        <Link href="/" className="group">
          <Logo size="md" />
        </Link>

        {/* Minimalist Editorial Navigation */}
        <nav className="hidden lg:flex items-center gap-8 text-xs font-semibold tracking-wide text-[#6B3075]">
          <a href="#method" className="hover:text-[#26052B] transition-colors">
            The Method
          </a>
          <a href="#laboratory" className="hover:text-[#26052B] transition-colors flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF5A0A] animate-pulse" />
            <span>Laboratory</span>
          </a>
          <a href="#topology" className="hover:text-[#26052B] transition-colors">
            Latent Topology
          </a>
          <a href="#defensibility" className="hover:text-[#26052B] transition-colors">
            Defensibility
          </a>
          <a href="#datasets" className="hover:text-[#26052B] transition-colors">
            Workspaces
          </a>
        </nav>

        {/* Action Header Links */}
        <div className="flex items-center gap-5">
          <Link
            href="/dashboard"
            className="hidden sm:inline-flex text-xs font-semibold text-[#6B3075] hover:text-[#26052B] transition-colors items-center gap-1"
          >
            <span>Open workspace</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>

          <Link
            href="/dashboard"
            className="px-5 py-2.5 rounded-full bg-[#400849] hover:bg-[#2F0536] text-white text-xs font-semibold tracking-wide shadow-sm transition-all hover:scale-105 flex items-center gap-2 group"
          >
            <span>Launch Studio</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </header>

      {/* 3. Main Landing Canvas (Framed with Left Margin on XL) */}
      <main className="flex-1 xl:pl-16">
        <div id="hero">
          <LandingHero />
        </div>

        <LandingMethod />

        <LandingLaboratory />

        <LandingTopology />

        <LandingDefensibility />

        <LandingDatasets />

        <LandingCta />
      </main>
    </div>
  );
}
