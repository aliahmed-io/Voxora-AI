"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

interface SectionMarker {
  id: string;
  num: string;
  label: string;
}

const SECTIONS: SectionMarker[] = [
  { id: "hero", num: "01", label: "Signal Pulse" },
  { id: "method", num: "02", label: "The Method" },
  { id: "laboratory", num: "03", label: "Laboratory" },
  { id: "topology", num: "04", label: "Topology" },
  { id: "defensibility", num: "05", label: "Defensibility" },
  { id: "datasets", num: "06", label: "Workspaces" },
];

export function LandingRail() {
  const [activeSection, setActiveSection] = useState("01");

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;

      const offsets = SECTIONS.map((sec) => {
        const el = document.getElementById(sec.id);
        return {
          id: sec.id,
          num: sec.num,
          top: el ? el.offsetTop - 120 : 0,
        };
      });

      for (let i = offsets.length - 1; i >= 0; i--) {
        const item = offsets[i];
        if (item && scrollY >= item.top - windowHeight / 3) {
          setActiveSection(item.num);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <aside className="hidden xl:flex fixed left-0 top-0 bottom-0 w-16 bg-[#18031D] text-white border-r border-white/10 z-40 flex-col justify-between items-center py-6 select-none">
      {/* Top Brand Monogram */}
      <Link
        href="/"
        className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#400849] to-[#24042C] border border-white/20 flex items-center justify-center text-[#FF5A0A] font-bold text-sm tracking-wider shadow-sm hover:scale-105 transition-transform"
        title="Voxora AI"
      >
        <span className="font-serif-luxury italic text-lg font-bold">V&bull;</span>
      </Link>

      {/* Vertical Brand Watermark */}
      <div className="rotate-180 [writing-mode:vertical-rl] text-[10px] tracking-[0.25em] font-bold uppercase text-white/40">
        Voxora Intelligence
      </div>

      {/* Section Index Markers */}
      <div className="flex flex-col items-center gap-3 text-xs font-mono">
        {SECTIONS.map((sec) => {
          const isActive = activeSection === sec.num;
          return (
            <a
              key={sec.id}
              href={`#${sec.id}`}
              className={`transition-all duration-200 text-[11px] ${
                isActive
                  ? "text-[#FF5A0A] font-bold scale-110"
                  : "text-white/40 hover:text-white/80"
              }`}
              title={sec.label}
            >
              {sec.num}
            </a>
          );
        })}
      </div>

      {/* Bottom Scroll Indicator */}
      <div className="rotate-180 [writing-mode:vertical-rl] text-[9px] tracking-[0.2em] uppercase text-white/30 font-semibold flex items-center gap-1.5">
        <span>Scroll to Explore &darr;</span>
      </div>
    </aside>
  );
}
