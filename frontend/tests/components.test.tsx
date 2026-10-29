import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SentimentGauge } from "@/components/dashboard/SentimentGauge";
import { StatRibbon } from "@/components/dashboard/StatRibbon";
import { HighlightsCard } from "@/components/dashboard/HighlightsCard";
import { ChannelDistribution } from "@/components/dashboard/ChannelDistribution";
import { ConfusionMatrixGrid } from "@/components/model/ConfusionMatrixGrid";
import { Logo } from "@/components/layout/Logo";

describe("Dashboard Components & Custom Logo", () => {
  it("renders custom SVG Logo component with trademark geometric mark", () => {
    const { container } = render(<Logo size="md" />);
    expect(screen.getByText("Voxora")).toBeInTheDocument();
    expect(screen.getByText("AI")).toBeInTheDocument();
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("renders SentimentGauge with CSAT score, breakdown bars and stat cards", () => {
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

    expect(screen.getByText("Global Overview")).toBeInTheDocument();
    expect(screen.getByText("87")).toBeInTheDocument();
    expect(screen.getByText("/100")).toBeInTheDocument();
    expect(screen.getByText("Positive")).toBeInTheDocument();
    expect(screen.getByText("800 (80%)")).toBeInTheDocument();
    expect(screen.getByText("Top Pain Point")).toBeInTheDocument();
    expect(screen.getByText("Top Opportunity")).toBeInTheDocument();
  });

  it("renders StatRibbon with 6 top metrics", () => {
    render(
      <StatRibbon
        totalReviews={3842}
        positiveCount={2156}
        neutralCount={874}
        negativeCount={1248}
        csatScore={87}
        analyzedCount={2876}
      />
    );

    expect(screen.getByText("Total Reviews")).toBeInTheDocument();
    expect(screen.getByText("3,842")).toBeInTheDocument();
    expect(screen.getByText("Positive Feedback")).toBeInTheDocument();
    expect(screen.getByText("2,156")).toBeInTheDocument();
    expect(screen.getByText("Neutral Feedback")).toBeInTheDocument();
    expect(screen.getByText("Negative Issues")).toBeInTheDocument();
    expect(screen.getByText("CSAT Score")).toBeInTheDocument();
    expect(screen.getByText("Reviews Analyzed")).toBeInTheDocument();
    expect(screen.getByText("2,876")).toBeInTheDocument();
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
