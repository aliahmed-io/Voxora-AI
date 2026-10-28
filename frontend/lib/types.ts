/**
 * Voxora AI API & Data Types
 * Strict TypeScript types for all frontend-backend contracts.
 */

export type SentimentLabel = "positive" | "neutral" | "negative";

export interface DatasetBrief {
  id: string;
  name: string;
  filename: string;
  row_count: number;
  has_timestamps: boolean;
  status: "uploaded" | "analyzing" | "completed" | "failed";
  created_at: string;
}

export interface UploadPreviewResponse {
  file_id: string;
  filename: string;
  total_rows: number;
  detected_columns: string[];
  suggested_mapping: {
    text_column?: string | null;
    date_column?: string | null;
    rating_column?: string | null;
    category_column?: string | null;
  };
  preview_rows: Array<Record<string, string | number | null>>;
}

export interface StartAnalysisRequest {
  file_id: string;
  dataset_name: string;
  text_column: string;
  date_column?: string | null;
  rating_column?: string | null;
  category_column?: string | null;
}

export interface JobStatusResponse {
  job_id: string;
  dataset_id: string;
  status: "pending" | "processing" | "completed" | "failed";
  progress: number;
  error_message?: string | null;
}

export interface InfluentialTerm {
  term: string;
  weight: number;
  magnitude: number;
  polarity: SentimentLabel;
}

export interface ReviewDetail {
  id: string;
  dataset_id: string;
  original_text: string;
  review_date?: string | null;
  original_rating?: number | null;
  predicted_sentiment: SentimentLabel;
  confidence_score: number;
  polarity: number;
  topic_id: number;
  topic_name: string;
  influential_terms: InfluentialTerm[];
}

export interface PaginatedReviews {
  items: ReviewDetail[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface SentimentTrendPoint {
  date: string;
  average_score: number;
  positive_count: number;
  neutral_count: number;
  negative_count: number;
  total_count: number;
}

export interface SentimentMapPoint {
  id: string;
  x: number;
  y: number;
  sentiment: SentimentLabel;
  topic: string;
  preview: string;
}

export interface TopicSummary {
  topic_id: number;
  name: string;
  review_count: number;
  percentage: number;
  sentiment_distribution: {
    positive: number;
    neutral: number;
    negative: number;
  };
  top_keywords: string[];
  representative_reviews: string[];
}

export interface ComplaintCategory {
  category: string;
  negative_count: number;
  negative_percentage: number;
  primary_issues: string[];
}

export interface DashboardHighlight {
  id: string;
  tag: string;
  title: string;
  description: string;
  type: SentimentLabel;
}

export interface ChannelStat {
  channel: string;
  score: number;
  reviews: number;
}

export interface DashboardStats {
  dataset_id: string;
  dataset_name: string;
  total_reviews: number;
  sentiment_score: number;
  distribution: {
    positive: number;
    neutral: number;
    negative: number;
  };
  percentages: {
    positive: number;
    neutral: number;
    negative: number;
  };
  topics: TopicSummary[];
  top_complaints: ComplaintCategory[];
  highlights: DashboardHighlight[];
  trend: SentimentTrendPoint[];
  sentiment_map: SentimentMapPoint[];
  channels: ChannelStat[];
}

export interface ModelMetricScores {
  accuracy: number;
  macro_f1: number;
  weighted_f1: number;
  per_class: Record<
    SentimentLabel,
    {
      precision: number;
      recall: number;
      f1_score: number;
      support: number;
    }
  >;
  confusion_matrix: number[][];
  inference_latency_us: number;
  train_time_ms: number;
  val_macro_f1?: number;
}

export interface ModelEvaluationResponse {
  metadata: {
    champion_model: string;
    labels: string[];
    features_count: number;
    dataset_size: number;
    train_samples: number;
    val_samples: number;
    test_samples: number;
    trained_at: string;
    hyperparameters: Record<string, Record<string, string | number>>;
  };
  champion: {
    model_name: string;
    test_metrics: ModelMetricScores;
  };
  comparison: {
    "Logistic Regression": ModelMetricScores & { name: string };
    "Linear Support Vector Classifier": ModelMetricScores & { name: string };
  };
  class_distribution: Record<string, number>;
  labels_order: string[];
  methodology: {
    feature_engineering: string;
    model_selection: string;
    known_limitations: string[];
  };
}

export interface AIExecutiveSynthesis {
  provider: string;
  confidence: string;
  executive_summary: string;
  key_strengths: string[];
  urgent_interventions: string[];
  quarterly_recommendation: string;
}
