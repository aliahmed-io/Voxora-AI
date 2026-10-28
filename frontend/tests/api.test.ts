import { describe, it, expect } from "vitest";
import { formatNumber, formatPercent, cn } from "@/lib/utils";
import { colors, spacing, typography } from "@/lib/tokens";

describe("Utility & Token Contracts", () => {
  it("formats numbers with locale thousands separator", () => {
    expect(formatNumber(1500)).toBe("1,500");
    expect(formatNumber(0)).toBe("0");
  });

  it("formats percentages with 1 decimal place", () => {
    expect(formatPercent(45.678)).toBe("45.7%");
    expect(formatPercent(100)).toBe("100.0%");
  });

  it("merges class names correctly with tailwind-merge", () => {
    expect(cn("px-4 py-2", "px-6")).toBe("py-2 px-6");
    expect(cn("bg-white", undefined, "text-black")).toBe("bg-white text-black");
  });

  it("exports valid design token constants matching Voxora brand palette", () => {
    expect(colors.primary).toBe("#6D4AFF");
    expect(colors.bgBase).toBe("#F5F2FF");
    expect(colors.ink).toBe("#161327");
    expect(spacing.grid).toBe(8);
    expect(typography.fonts.display).toContain("Plus Jakarta Sans");
  });
});
