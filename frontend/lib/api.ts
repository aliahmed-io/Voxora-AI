/**
 * Typed API Client for Voxora AI Backend with Dynamic Port Auto-Discovery
 * and Self-Healing Network Retry.
 */

import {
  DatasetBrief,
  UploadPreviewResponse,
  StartAnalysisRequest,
  JobStatusResponse,
  DashboardStats,
  PaginatedReviews,
  ReviewDetail,
  TopicSummary,
  ModelEvaluationResponse,
  AIExecutiveSynthesis,
  SentimentLabel,
} from "./types";

const DEFAULT_API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8002";
const STORAGE_KEY = "voxora_verified_api_base";

// Candidate ports to probe in priority order
const CANDIDATE_PORTS = [8002, 8000, 8001, 8003, 8004, 8005];

let cachedApiBase: string | null = null;
let ongoingDiscovery: Promise<string> | null = null;

export function getApiBaseSync(): string {
  if (cachedApiBase) return cachedApiBase;
  if (typeof window !== "undefined") {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      if (stored) return stored;
    } catch {
      // ignore
    }
  }
  return DEFAULT_API_BASE;
}

/**
 * Pings candidate URL to verify it is specifically the Voxora AI FastAPI backend.
 */
async function verifyCandidate(baseUrl: string, parentSignal?: AbortSignal): Promise<string> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 600);
  if (parentSignal) {
    parentSignal.addEventListener("abort", () => {
      controller.abort();
    });
  }

  try {
    const res = await fetch(`${baseUrl}/api/health`, {
      method: "GET",
      signal: controller.signal,
      headers: { Accept: "application/json" },
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data && typeof data === "object" && data.service === "Voxora AI API") {
        return baseUrl;
      }
    }
    throw new Error(`Endpoint ${baseUrl} returned non-matching health check.`);
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
}

/**
 * Discovers the active backend URL by checking static metadata and probing candidate ports.
 */
export async function resolveApiBase(forceRefresh = false): Promise<string> {
  if (!forceRefresh && cachedApiBase) {
    return cachedApiBase;
  }

  if (typeof window === "undefined") {
    return DEFAULT_API_BASE;
  }

  if (ongoingDiscovery) {
    return ongoingDiscovery;
  }

  ongoingDiscovery = (async () => {
    // 1. Fast-path: Check DEFAULT_API_BASE first (< 5ms response when active)
    if (!forceRefresh) {
      try {
        const fastCheck = await verifyCandidate(DEFAULT_API_BASE);
        cachedApiBase = fastCheck;
        return fastCheck;
      } catch {
        // Default port not active, proceed to dynamic discovery
      }
    }

    // 2. Check metadata written by backend to public/backend_port.json
    try {
      const res = await fetch(`/backend_port.json?t=${Date.now()}`);
      if (res.ok) {
        const meta = await res.json();
        if (meta && typeof meta.url === "string") {
          const verified = await verifyCandidate(meta.url).catch(() => null);
          if (verified) {
            cachedApiBase = verified;
            return verified;
          }
        }
      }
    } catch {
      // ignore
    }

    // 3. Probe candidate ports with auto-cancel of losing requests
    const candidateUrls = CANDIDATE_PORTS.map((p) => `http://127.0.0.1:${p}`);
    const sharedAbort = new AbortController();

    try {
      const winner = await Promise.any(
        candidateUrls.map((url) => verifyCandidate(url, sharedAbort.signal))
      );
      sharedAbort.abort(); // Cancel all remaining pending probes immediately
      cachedApiBase = winner;
      return winner;
    } catch {
      sharedAbort.abort();
      cachedApiBase = DEFAULT_API_BASE;
      return DEFAULT_API_BASE;
    }
  })().finally(() => {
    ongoingDiscovery = null;
  });

  return ongoingDiscovery;
}

/**
 * Universal JSON fetcher with automated self-healing port reconnect.
 */
async function fetchJson<T>(endpoint: string, options?: RequestInit, hasRetried = false): Promise<T> {
  const base = await resolveApiBase();
  const url = `${base}${endpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        Accept: "application/json",
        ...(options?.headers || {}),
      },
    });

    if (!response.ok) {
      let errorDetail = `Request failed with status ${response.status}`;
      try {
        const errorJson = await response.json();
        if (errorJson && typeof errorJson.detail === "string") {
          errorDetail = errorJson.detail;
        }
      } catch {
        // Ignore fallback
      }
      throw new Error(errorDetail);
    }

    return (await response.json()) as T;
  } catch (err: unknown) {
    // If connection refused / port moved and not yet retried, re-probe and retry once
    const isNetworkError =
      err instanceof TypeError ||
      (err instanceof Error &&
        (err.message.includes("Failed to fetch") ||
          err.message.includes("NetworkError") ||
          err.message.includes("fetch failed")));

    if (isNetworkError && !hasRetried) {
      cachedApiBase = null;
      await resolveApiBase(true);
      return fetchJson<T>(endpoint, options, true);
    }

    throw err;
  }
}

export const api = {
  // Expose resolver for diagnostics
  resolveApiBase,

  // Upload & Sampling
  async uploadCsv(file: File): Promise<UploadPreviewResponse> {
    const formData = new FormData();
    formData.append("file", file);

    const base = await resolveApiBase();
    try {
      const res = await fetch(`${base}/api/upload`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        let msg = "Upload failed";
        try {
          const json = await res.json();
          if (json && json.detail) msg = json.detail;
        } catch {}
        throw new Error(msg);
      }
      return (await res.json()) as UploadPreviewResponse;
    } catch {
      // Auto-healing retry for uploads
      cachedApiBase = null;
      const newBase = await resolveApiBase(true);
      const retryRes = await fetch(`${newBase}/api/upload`, {
        method: "POST",
        body: formData,
      });
      if (!retryRes.ok) {
        throw new Error("Upload failed after port reconnection.");
      }
      return (await retryRes.json()) as UploadPreviewResponse;
    }
  },

  async loadSample(sampleType: "saas" | "ecommerce" | "raw"): Promise<UploadPreviewResponse> {
    return fetchJson<UploadPreviewResponse>(`/api/load-sample/${sampleType}`, {
      method: "POST",
    });
  },

  // Analysis Jobs
  async startAnalysis(payload: StartAnalysisRequest): Promise<JobStatusResponse> {
    return fetchJson<JobStatusResponse>("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  },

  async getJobStatus(jobId: string): Promise<JobStatusResponse> {
    return fetchJson<JobStatusResponse>(`/api/jobs/${jobId}`);
  },

  // Datasets
  async getDatasets(): Promise<DatasetBrief[]> {
    return fetchJson<DatasetBrief[]>("/api/datasets");
  },

  async getDataset(id: string): Promise<DatasetBrief> {
    return fetchJson<DatasetBrief>(`/api/datasets/${id}`);
  },

  async deleteDataset(id: string): Promise<void> {
    const base = await resolveApiBase();
    const res = await fetch(`${base}/api/datasets/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete dataset");
  },

  // Dashboard KPIs
  async getDatasetDashboard(datasetId: string): Promise<DashboardStats> {
    return fetchJson<DashboardStats>(`/api/datasets/${datasetId}/dashboard`);
  },

  async getLatestDashboard(): Promise<DashboardStats> {
    return fetchJson<DashboardStats>("/api/dashboard/latest");
  },

  // Review Explorer
  async getReviews(
    datasetId: string,
    params: {
      sentiment?: SentimentLabel | "all";
      topic?: string;
      search?: string;
      min_confidence?: number;
      sort_by?: "date" | "confidence" | "polarity";
      sort_order?: "asc" | "desc";
      page?: number;
      page_size?: number;
    }
  ): Promise<PaginatedReviews> {
    const query = new URLSearchParams();
    if (params.sentiment && params.sentiment !== "all") {
      query.set("sentiment", params.sentiment);
    }
    if (params.topic) query.set("topic", params.topic);
    if (params.search) query.set("search", params.search);
    if (params.min_confidence) query.set("min_confidence", String(params.min_confidence));
    if (params.sort_by) query.set("sort_by", params.sort_by);
    if (params.sort_order) query.set("sort_order", params.sort_order);
    if (params.page) query.set("page", String(params.page));
    if (params.page_size) query.set("page_size", String(params.page_size));

    return fetchJson<PaginatedReviews>(`/api/datasets/${datasetId}/reviews?${query.toString()}`);
  },

  async getReviewDetail(reviewId: string): Promise<ReviewDetail> {
    return fetchJson<ReviewDetail>(`/api/reviews/${reviewId}`);
  },

  // Topics
  async getTopics(datasetId: string): Promise<TopicSummary[]> {
    return fetchJson<TopicSummary[]>(`/api/datasets/${datasetId}/topics`);
  },

  // Model Evaluation Tournament
  async getModelEvaluation(): Promise<ModelEvaluationResponse> {
    return fetchJson<ModelEvaluationResponse>("/api/model/evaluation");
  },

  // AI Executive Synthesis
  async getAiSynthesis(datasetId: string): Promise<AIExecutiveSynthesis> {
    return fetchJson<AIExecutiveSynthesis>(`/api/ai/synthesize/${datasetId}`, {
      method: "POST",
    });
  },

  // Live ML Sandbox Inference
  async predictReview(text: string): Promise<{
    text: string;
    clean_text: string;
    predicted_sentiment: SentimentLabel;
    confidence: number;
    polarity: number;
    probabilities: { positive: number; neutral: number; negative: number };
    topic_id: number;
    topic_name: string;
    influential_terms: Array<{ term: string; weight: number; polarity: "positive" | "negative" }>;
  }> {
    return fetchJson(`/api/model/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
  },

  // Report URLs for direct browser downloads
  getPdfReportUrl(datasetId: string): string {
    return `${getApiBaseSync()}/api/reports/${datasetId}/pdf`;
  },

  getCsvExportUrl(datasetId: string): string {
    return `${getApiBaseSync()}/api/reports/${datasetId}/csv`;
  },
};
