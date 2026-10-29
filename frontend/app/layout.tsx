import type { Metadata } from "next";
import React from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Voxora AI — Customer Feedback Intelligence Platform",
  description:
    "Defensible customer sentiment classification, NMF topic modeling, and token-level explainability for enterprise customer intelligence.",
  keywords: ["customer feedback", "sentiment analysis", "topic modeling", "NMF", "FastAPI", "Next.js"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#FAF4F9] text-[#400849] selection:bg-[#FF5A0A]/20">
        {children}
      </body>
    </html>
  );
}
