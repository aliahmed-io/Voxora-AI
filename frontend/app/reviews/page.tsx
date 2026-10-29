"use client";

import React, { useEffect, useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";
import { ReviewTable } from "@/components/reviews/ReviewTable";
import { ReviewDetailModal } from "@/components/reviews/ReviewDetailModal";
import { api } from "@/lib/api";
import { ReviewDetail, SentimentLabel } from "@/lib/types";

export default function ReviewsPage() {
  const [activeDatasetId, setActiveDatasetId] = useState<string>("");
  const [reviews, setReviews] = useState<ReviewDetail[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Filter state
  const [search, setSearch] = useState("");
  const [sentiment, setSentiment] = useState<SentimentLabel | "all">("all");
  const [topic, setTopic] = useState("");
  const [topicsList, setTopicsList] = useState<string[]>([]);
  const [selectedReview, setSelectedReview] = useState<ReviewDetail | null>(null);

  // Initial load
  useEffect(() => {
    let ignore = false;
    api.getDatasets().then((ds) => {
      if (!ignore && ds && ds.length > 0) {
        const id = ds[0]?.id ?? "";
        setActiveDatasetId(id);
      }
    });
    return () => {
      ignore = true;
    };
  }, []);

  // Fetch topics list for filter dropdown
  useEffect(() => {
    let ignore = false;
    if (activeDatasetId) {
      api.getTopics(activeDatasetId).then((tList) => {
        if (!ignore) {
          setTopicsList(tList.map((t) => t.name));
        }
      }).catch(() => {});
    }
    return () => {
      ignore = true;
    };
  }, [activeDatasetId]);

  // Fetch reviews on filter/page change
  useEffect(() => {
    if (!activeDatasetId) return;

    let ignore = false;
    const timeout = setTimeout(() => {
      api.getReviews(activeDatasetId, {
        sentiment,
        topic,
        search,
        page,
        page_size: 20,
      })
        .then((res) => {
          if (!ignore) {
            setReviews(res.items);
            setTotal(res.total);
            setTotalPages(res.total_pages);
          }
        })
        .catch(() => {});
    }, 250);

    return () => {
      ignore = true;
      clearTimeout(timeout);
    };
  }, [activeDatasetId, sentiment, topic, search, page]);

  return (
    <div className="flex min-h-screen bg-[#FAF4F9] text-[#400849]">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar
          currentDatasetId={activeDatasetId}
          onDatasetChange={(id) => {
            setActiveDatasetId(id);
            setPage(1);
          }}
        />

        <main className="flex-1 p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
          <div>
            <span className="text-xs font-bold text-[#FF5A0A] uppercase tracking-wider">
              Feedback Forensics
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#400849] tracking-tight mt-1">
              Review Explorer & Token Attribution
            </h1>
            <p className="text-xs text-[#71367B] mt-1">
              Search, filter, and inspect individual customer records. View exact linear feature attributions.
            </p>
          </div>

          <ReviewTable
            reviews={reviews}
            total={total}
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
            onSelectReview={setSelectedReview}
            search={search}
            onSearchChange={(v) => {
              setSearch(v);
              setPage(1);
            }}
            sentiment={sentiment}
            onSentimentChange={(v) => {
              setSentiment(v);
              setPage(1);
            }}
            topic={topic}
            onTopicChange={(v) => {
              setTopic(v);
              setPage(1);
            }}
            topicsList={topicsList}
          />

          {/* Review Detail Inspection Modal */}
          <ReviewDetailModal
            review={selectedReview}
            onClose={() => setSelectedReview(null)}
          />
        </main>
      </div>
    </div>
  );
}
