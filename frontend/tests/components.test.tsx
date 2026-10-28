import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SentimentGauge } from "@/components/dashboard/SentimentGauge";
import { HighlightsCard } from "@/components/dashboard/HighlightsCard";
import { ChannelDistribution } from "@/components/dashboard/ChannelDistribution";
import { ConfusionMatrixGrid } from "@/components/model/ConfusionMatrixGrid";

describe("Dashboard Components", () => {
  it("renders SentimentGauge with CSAT score and percentages", () => {
    render(
      <SentimentGauge
        score={87}
        positiveCount={800}
        neutralCount={150}
        negativeCount={50}
        positivePct={80.0}
        neutralPct={15.0}
        negativePct={5.0}
      />
    );

    expect(screen.getByText("Customer Sentiment Score")).toBeInTheDocument();
    expect(screen.getByText("87")).toBeInTheDocument();
    expect(screen.getByText("/ 100")).toBeInTheDocument();
    expect(screen.getByText("Positive")).toBeInTheDocument();
    expect(screen.getByText("800 (80%)")).toBeInTheDocument();
  });

  it("renders HighlightsCard with editorial findings", () => {
    const highlights = [
      {
        id: "1",
        tag: "Top Driver",
        title: "Customer Support Speed",
        description: "Accounts for 65% of all positive reviews.",
        type: "positive" as const,
      },
      {
        id: "2",
        tag: "Top Complaint",
        title: "Billing Invoices",
        description: "Friction point causing 25% of negative reviews.",
        type: "negative" as const,
      },
    ];

    render(<HighlightsCard highlights={highlights} />);

    expect(screen.getByText("Executive Highlights")).toBeInTheDocument();
    expect(screen.getByText("Customer Support Speed")).toBeInTheDocument();
    expect(screen.getByText("Billing Invoices")).toBeInTheDocument();
    expect(screen.getByText("Top Driver")).toBeInTheDocument();
  });

  it("renders ChannelDistribution items properly", () => {
    const channels = [
      { channel: "Customer Support", score: 4.8, reviews: 1200 },
      { channel: "Mobile App", score: 4.5, reviews: 850 },
    ];

    render(<ChannelDistribution channels={channels} />);

    expect(screen.getByText("Customer Support")).toBeInTheDocument();
    expect(screen.getByText("4.8")).toBeInTheDocument();
    expect(screen.getByText("Mobile App")).toBeInTheDocument();
    expect(screen.getByText("4.5")).toBeInTheDocument();
  });

  it("renders ConfusionMatrixGrid with class labels and counts", () => {
    const matrix = [
      [77, 0, 0],
      [0, 72, 0],
      [0, 0, 85],
    ];
    const labels = ["negative", "neutral", "positive"];

    render(<ConfusionMatrixGrid matrix={matrix} labels={labels} />);

    expect(screen.getByText("Confusion Matrix (Untouched Test Split)")).toBeInTheDocument();
    expect(screen.getByText("True: negative")).toBeInTheDocument();
    expect(screen.getByText("True: neutral")).toBeInTheDocument();
    expect(screen.getByText("True: positive")).toBeInTheDocument();
  });
});
