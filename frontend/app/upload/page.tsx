"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";
import { api } from "@/lib/api";
import { UploadPreviewResponse, JobStatusResponse } from "@/lib/types";
import {
  UploadCloud,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Database,
  Layers,
  RefreshCw,
} from "lucide-react";

export default function UploadPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<UploadPreviewResponse | null>(null);
  const [datasetName, setDatasetName] = useState("");
  const [textColumn, setTextColumn] = useState("");
  const [dateColumn, setDateColumn] = useState("");
  const [ratingColumn, setRatingColumn] = useState("");
  const [categoryColumn, setCategoryColumn] = useState("");

  const [jobStatus, setJobStatus] = useState<JobStatusResponse | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFileSelect = async (selectedFile: File) => {
    if (!selectedFile.name.toLowerCase().endsWith(".csv")) {
      setErrorMessage("Please select a standard comma-separated (.csv) file.");
      return;
    }

    try {
      setErrorMessage(null);
      setIsUploading(true);
      const res = await api.uploadCsv(selectedFile);
      setPreview(res);
      setDatasetName(selectedFile.name.replace(/\.[^/.]+$/, ""));
      setTextColumn(res.suggested_mapping.text_column || res.detected_columns[0] || "");
      setDateColumn(res.suggested_mapping.date_column || "");
      setRatingColumn(res.suggested_mapping.rating_column || "");
      setCategoryColumn(res.suggested_mapping.category_column || "");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Upload failed.";
      setErrorMessage(msg);
    } finally {
      setIsUploading(false);
    }
  };

  const handleLoadSample = async (sampleType: "saas" | "ecommerce" | "raw") => {
    try {
      setErrorMessage(null);
      setIsUploading(true);
      const res = await api.loadSample(sampleType);
      setPreview(res);
      const friendlyName =
        sampleType === "saas"
          ? "B2B SaaS Customer Feedback"
          : sampleType === "ecommerce"
          ? "E-Commerce Product Reviews"
          : "Raw Customer Voice Feedback";
      setDatasetName(friendlyName);
      setTextColumn(res.suggested_mapping.text_column || res.detected_columns[0] || "");
      setDateColumn(res.suggested_mapping.date_column || "");
      setRatingColumn(res.suggested_mapping.rating_column || "");
      setCategoryColumn(res.suggested_mapping.category_column || "");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load sample dataset.";
      setErrorMessage(msg);
    } finally {
      setIsUploading(false);
    }
  };

  const handleStartAnalysis = async () => {
    if (!preview || !textColumn) {
      setErrorMessage("Please select the text column containing review content.");
      return;
    }

    try {
      setErrorMessage(null);
      setIsAnalyzing(true);
      const job = await api.startAnalysis({
        file_id: preview.file_id,
        dataset_name: datasetName.trim() || preview.filename,
        text_column: textColumn,
        date_column: dateColumn || null,
        rating_column: ratingColumn || null,
        category_column: categoryColumn || null,
      });

      setJobStatus(job);

      // Poll job progress
      const pollInterval = setInterval(async () => {
        try {
          const status = await api.getJobStatus(job.job_id);
          setJobStatus(status);

          if (status.status === "completed") {
            clearInterval(pollInterval);
            setIsAnalyzing(false);
            setTimeout(() => {
              router.push("/dashboard");
            }, 1200);
          } else if (status.status === "failed") {
            clearInterval(pollInterval);
            setIsAnalyzing(false);
            setErrorMessage(status.error_message || "Analysis failed.");
          }
        } catch {
          clearInterval(pollInterval);
          setIsAnalyzing(false);
        }
      }, 800);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to trigger analysis.";
      setErrorMessage(msg);
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F5F2FF]">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />

        <main className="flex-1 p-6 md:p-8 space-y-6 max-w-5xl mx-auto w-full">
          <div>
            <span className="text-xs font-bold text-[#6D4AFF] uppercase tracking-wider">
              Data Ingestion
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#161327] tracking-tight mt-1">
              Upload & Map Customer Reviews
            </h1>
            <p className="text-xs text-[#625D7E] mt-1">
              Ingest any raw review CSV. Map schema columns to run sentiment and topic intelligence.
            </p>
          </div>

          {errorMessage && (
            <div className="p-4 rounded-2xl bg-[#FFF1F2] border border-[#F43F5E]/20 text-xs text-[#F43F5E] flex items-center gap-3">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Upload Dropzone */}
          {!preview && !isAnalyzing && (
            <div className="space-y-6">
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                    handleFileSelect(e.dataTransfer.files[0]);
                  }
                }}
                onClick={() => fileInputRef.current?.click()}
                className="p-12 rounded-3xl bg-white border-2 border-dashed border-[#6D4AFF]/30 hover:border-[#6D4AFF] cursor-pointer shadow-sm text-center transition-all hover:bg-[#FAF8FF] group"
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".csv"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileSelect(e.target.files[0]);
                    }
                  }}
                />
                <div className="w-16 h-16 rounded-2xl bg-[#ECE7FF] group-hover:bg-[#6D4AFF] text-[#6D4AFF] group-hover:text-white flex items-center justify-center mx-auto mb-4 transition-colors shadow-md shadow-[#6D4AFF]/20">
                  <UploadCloud className="w-8 h-8" />
                </div>
                <h3 className="text-base font-extrabold text-[#161327]">
                  {isUploading ? "Reading and validating CSV..." : "Drag & drop your reviews CSV here"}
                </h3>
                <p className="text-xs text-[#625D7E] mt-1 max-w-sm mx-auto">
                  Supports UTF-8 CSV exports from Zendesk, App Store, Google Play, Trustpilot, or internal databases (up to 25MB).
                </p>
                <button
                  type="button"
                  className="mt-6 px-5 py-2.5 rounded-xl bg-[#6D4AFF] text-white text-xs font-bold shadow-md shadow-[#6D4AFF]/20 hover:bg-[#5B39EE]"
                >
                  Browse Files
                </button>
              </div>

              {/* Sample Pre-loads */}
              <div className="p-6 rounded-2xl bg-white border border-[#6D4AFF]/10 shadow-sm">
                <span className="text-xs font-bold text-[#161327] block mb-1">
                  Or test immediately with pre-configured sample datasets:
                </span>
                <p className="text-xs text-[#625D7E] mb-4">
                  Curated benchmarks with realistic review texts, ratings, and timestamps.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    onClick={() => handleLoadSample("saas")}
                    className="p-4 rounded-xl bg-[#FAF8FF] hover:bg-[#ECE7FF]/60 border border-[#ECE7FF] hover:border-[#6D4AFF]/30 text-left transition-all group"
                  >
                    <div className="flex items-center gap-2 font-bold text-xs text-[#161327] group-hover:text-[#6D4AFF]">
                      <Sparkles className="w-4 h-4 text-[#6D4AFF]" />
                      <span>SaaS Feedback</span>
                    </div>
                    <p className="text-[11px] text-[#625D7E] mt-1">
                      Platform bugs, pricing, SSO, and UI adoption reviews.
                    </p>
                  </button>

                  <button
                    onClick={() => handleLoadSample("ecommerce")}
                    className="p-4 rounded-xl bg-[#FAF8FF] hover:bg-[#ECE7FF]/60 border border-[#ECE7FF] hover:border-[#6D4AFF]/30 text-left transition-all group"
                  >
                    <div className="flex items-center gap-2 font-bold text-xs text-[#161327] group-hover:text-[#6D4AFF]">
                      <Database className="w-4 h-4 text-[#6D4AFF]" />
                      <span>E-Commerce Reviews</span>
                    </div>
                    <p className="text-[11px] text-[#625D7E] mt-1">
                      Delivery delays, packaging quality, and refund complaints.
                    </p>
                  </button>

                  <button
                    onClick={() => handleLoadSample("raw")}
                    className="p-4 rounded-xl bg-[#FAF8FF] hover:bg-[#ECE7FF]/60 border border-[#ECE7FF] hover:border-[#6D4AFF]/30 text-left transition-all group"
                  >
                    <div className="flex items-center gap-2 font-bold text-xs text-[#161327] group-hover:text-[#6D4AFF]">
                      <Layers className="w-4 h-4 text-[#6D4AFF]" />
                      <span>Raw Unlabeled Feedback</span>
                    </div>
                    <p className="text-[11px] text-[#625D7E] mt-1">
                      Simulates raw customer survey imports without ratings.
                    </p>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Column Mapping Interface */}
          {preview && !isAnalyzing && (
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-white border border-[#6D4AFF]/10 shadow-sm space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-[#ECE7FF]">
                  <div>
                    <h3 className="text-base font-extrabold text-[#161327]">
                      Configure Dataset & Column Schema
                    </h3>
                    <p className="text-xs text-[#625D7E] mt-0.5">
                      Found <span className="font-bold text-[#161327]">{preview.total_rows.toLocaleString()}</span> records in{" "}
                      <span className="font-semibold text-[#6D4AFF]">{preview.filename}</span>
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setPreview(null);
                    }}
                    className="text-xs text-[#625D7E] hover:text-[#F43F5E] font-semibold"
                  >
                    Change File
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-[#161327] block mb-1">
                      Dataset Display Name
                    </label>
                    <input
                      type="text"
                      value={datasetName}
                      onChange={(e) => setDatasetName(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-[#6D4AFF]/15 bg-white text-xs text-[#161327] focus:outline-none focus:ring-2 focus:ring-[#6D4AFF]/20"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#161327] block mb-1">
                      Review Text Column <span className="text-[#F43F5E]">*</span>
                    </label>
                    <select
                      value={textColumn}
                      onChange={(e) => setTextColumn(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-[#6D4AFF]/20 bg-white text-xs font-semibold text-[#161327] focus:outline-none focus:ring-2 focus:ring-[#6D4AFF]/20"
                    >
                      <option value="">Select column...</option>
                      {preview.detected_columns.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#161327] block mb-1">
                      Date / Timestamp Column (Optional)
                    </label>
                    <select
                      value={dateColumn}
                      onChange={(e) => setDateColumn(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-[#6D4AFF]/15 bg-white text-xs text-[#161327] focus:outline-none"
                    >
                      <option value="">None (skip temporal trend)</option>
                      {preview.detected_columns.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#161327] block mb-1">
                      Original Rating Column (Optional)
                    </label>
                    <select
                      value={ratingColumn}
                      onChange={(e) => setRatingColumn(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-[#6D4AFF]/15 bg-white text-xs text-[#161327] focus:outline-none"
                    >
                      <option value="">None</option>
                      {preview.detected_columns.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* 5-Row Data Preview Table */}
                <div>
                  <span className="text-xs font-bold text-[#161327] block mb-2">
                    Data Sample Preview (First 5 Rows)
                  </span>
                  <div className="overflow-x-auto rounded-xl border border-[#ECE7FF]">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-[#FAF8FF] border-b border-[#ECE7FF] text-[#9B94B8] font-bold text-[10px] uppercase">
                          {preview.detected_columns.map((col) => (
                            <th key={col} className="p-2.5">
                              {col}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#ECE7FF]/60">
                        {preview.preview_rows.map((row, i) => (
                          <tr key={i} className="hover:bg-[#FAF8FF]">
                            {preview.detected_columns.map((col) => (
                              <td key={col} className="p-2.5 text-[#161327] max-w-xs truncate">
                                {String(row[col] ?? "")}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={handleStartAnalysis}
                    className="px-6 py-3 rounded-xl bg-[#6D4AFF] hover:bg-[#5B39EE] text-white text-xs font-bold shadow-md shadow-[#6D4AFF]/25 transition-all flex items-center gap-2"
                  >
                    <span>Run Model Inference Pipeline</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Running Analysis Progress State */}
          {isAnalyzing && (
            <div className="p-12 rounded-3xl bg-white border border-[#6D4AFF]/20 shadow-xl text-center space-y-6 max-w-lg mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-[#ECE7FF] text-[#6D4AFF] flex items-center justify-center mx-auto">
                <RefreshCw className="w-8 h-8 animate-spin" />
              </div>

              <div>
                <h3 className="text-lg font-extrabold text-[#161327]">
                  Analyzing Feedback Dataset...
                </h3>
                <p className="text-xs text-[#625D7E] mt-1">
                  Applying negation-aware TF-IDF, Calibrated Linear SVM, and NMF topic modeling.
                </p>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="w-full h-3 rounded-full bg-[#F5F2FF] overflow-hidden p-0.5 border border-[#6D4AFF]/10">
                  <div
                    className="h-full bg-gradient-to-r from-[#6D4AFF] to-[#B6A4FF] rounded-full transition-all duration-300"
                    style={{ width: `${jobStatus?.progress || 10}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs font-bold text-[#6D4AFF]">
                  <span>Progress</span>
                  <span>{jobStatus?.progress?.toFixed(0) || 10}%</span>
                </div>
              </div>

              <div className="text-[11px] text-[#9B94B8] font-medium pt-2">
                {jobStatus?.progress && jobStatus.progress < 40
                  ? "Ingesting records and normalizing negations..."
                  : jobStatus?.progress && jobStatus.progress < 70
                  ? "Evaluating sentiment probabilities..."
                  : "Discovering latent topic clusters and computing token attributions..."}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
