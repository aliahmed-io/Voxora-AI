/**
 * Typed API Client for Voxora AI Backend
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

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

async function fetchJson<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
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
      if (errorJson.detail) {
        errorDetail = errorJson.detail;
      }
    } catch {
      // Ignore fallback
    }
    throw new Error(errorDetail);
  }

  return response.json() as Promise<T>;
}

export const api = {
  // Upload & Sampling
  async uploadCsv(file: File): Promise<UploadPreviewResponse> {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`${API_BASE}/api/upload`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      let msg = "Upload failed";
      try {
        const json = await res.json();
        if (json.detail) msg = json.detail;
      } catch {}
      throw new Error(msg);
    }
    return res.json() as Promise<UploadPreviewResponse>;
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
    const res = await fetch(`${API_BASE}/api/datasets/${id}`, {
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

  // Report URLs for direct browser downloads
  getPdfReportUrl(datasetId: string): string {
    return `${API_BASE}/api/reports/${datasetId}/pdf`;
  },

  getCsvExportUrl(datasetId: string): string {
    return `${API_BASE}/api/reports/${datasetId}/csv`;
  },
};
