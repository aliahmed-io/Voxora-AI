"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";
import { ReviewTable } from "@/components/reviews/ReviewTable";
import { ReviewDetailModal } from "@/components/reviews/ReviewDetailModal";
import { api } from "@/lib/api";
import { ReviewDetail, SentimentLabel } from "@/lib/types";
import { resolveDefaultDataset, setStoredDatasetId } from "@/lib/dataset-store";

function ReviewsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Derive filter state directly from URL searchParams (canonical React pattern)
  const topic = searchParams.get("topic") || "";
  const search = searchParams.get("search") || "";
  const sentiment = (searchParams.get("sentiment") as SentimentLabel) || "all";

  const [activeDatasetId, setActiveDatasetId] = useState<string>("");
  const [reviews, setReviews] = useState<ReviewDetail[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [topicsList, setTopicsList] = useState<string[]>([]);
  const [selectedReview, setSelectedReview] = useState<ReviewDetail | null>(null);

  // Initial load: get datasets and resolve active dataset
  useEffect(() => {
    let ignore = false;
    api.getDatasets().then((ds) => {
      if (!ignore && ds && ds.length > 0) {
        const urlDs = searchParams.get("dataset");
        const found = urlDs ? ds.find((d) => d.id === urlDs) : undefined;
        const chosen = found || resolveDefaultDataset(ds);
        if (chosen) {
          setActiveDatasetId(chosen.id);
        }
      }
    });

    const handleDatasetEvent = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      if (customEvent.detail) {
        setActiveDatasetId(customEvent.detail);
        setPage(1);
      }
    };

    window.addEventListener("voxora:dataset-change", handleDatasetEvent);
    return () => {
      ignore = true;
      window.removeEventListener("voxora:dataset-change", handleDatasetEvent);
    };
  }, [searchParams]);

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

  const handleTopicChange = (newTopic: string) => {
    setPage(1);
    const params = new URLSearchParams(searchParams.toString());
    if (newTopic) {
      params.set("topic", newTopic);
    } else {
      params.delete("topic");
    }
    router.replace(`/reviews?${params.toString()}`);
  };

  const handleSearchChange = (newSearch: string) => {
    setPage(1);
    const params = new URLSearchParams(searchParams.toString());
    if (newSearch) {
      params.set("search", newSearch);
    } else {
      params.delete("search");
    }
    router.replace(`/reviews?${params.toString()}`);
  };

  const handleSentimentChange = (newSentiment: SentimentLabel | "all") => {
    setPage(1);
    const params = new URLSearchParams(searchParams.toString());
    if (newSentiment && newSentiment !== "all") {
      params.set("sentiment", newSentiment);
    } else {
      params.delete("sentiment");
    }
    router.replace(`/reviews?${params.toString()}`);
  };

  return (
    <div className="flex min-h-screen bg-[#FAF4F9] text-[#400849]">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar
          currentDatasetId={activeDatasetId}
          onDatasetChange={(id) => {
            setStoredDatasetId(id);
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
            onSearchChange={handleSearchChange}
            sentiment={sentiment}
            onSentimentChange={handleSentimentChange}
            topic={topic}
            onTopicChange={handleTopicChange}
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

export default function ReviewsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#FAF4F9] text-[#400849]">
          <div className="text-xs font-bold animate-pulse text-[#71367B]">
            Loading Review Explorer...
          </div>
        </div>
      }
    >
      <ReviewsContent />
    </Suspense>
  );
}
