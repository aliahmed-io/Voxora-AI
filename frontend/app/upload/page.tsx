"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";
import { api } from "@/lib/api";
import { UploadPreviewResponse, JobStatusResponse } from "@/lib/types";
import { setStoredDatasetId } from "@/lib/dataset-store";
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
      setDatasetName(res.filename.replace(/\.[^/.]+$/, ""));
      setTextColumn(res.suggested_mapping.text_column || res.detected_columns[0] || "");
      setDateColumn(res.suggested_mapping.date_column || "");
      setRatingColumn(res.suggested_mapping.rating_column || "");
      setCategoryColumn(res.suggested_mapping.category_column || "");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load sample.";
      setErrorMessage(msg);
    } finally {
      setIsUploading(false);
    }
  };

  const handleStartAnalysis = async () => {
    if (!preview) return;
    if (!textColumn) {
      setErrorMessage("Please select which column contains the review text.");
      return;
    }

    try {
      setErrorMessage(null);
      setIsAnalyzing(true);

      const job = await api.startAnalysis({
        file_id: preview.file_id,
        dataset_name: datasetName.trim() || preview.filename,
        text_column: textColumn,
        date_column: dateColumn || undefined,
        rating_column: ratingColumn || undefined,
        category_column: categoryColumn || undefined,
      });

      // Poll job status until done
      const pollInterval = setInterval(async () => {
        try {
          const status = await api.getJobStatus(job.job_id);
          setJobStatus(status);

          if (status.status === "completed") {
            clearInterval(pollInterval);
            if (status.dataset_id) {
              setStoredDatasetId(status.dataset_id);
            }
            router.push("/dashboard");
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
    <div className="flex min-h-screen bg-[#FAF4F9] text-[#400849]">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />

        <main className="flex-1 p-6 md:p-8 space-y-6 max-w-5xl mx-auto w-full">
          <div>
            <span className="text-xs font-bold text-[#FF5A0A] uppercase tracking-wider">
              Data Ingestion
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#400849] tracking-tight mt-1">
              Upload & Map Customer Reviews
            </h1>
            <p className="text-xs text-[#71367B] mt-1">
              Ingest any raw review CSV. Map schema columns to run sentiment and topic intelligence.
            </p>
          </div>

          {errorMessage && (
            <div className="p-4 rounded-2xl bg-[#FFF1F2] border border-[#E11D48]/20 text-xs text-[#E11D48] flex items-center gap-3">
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
                className="p-12 rounded-3xl bg-white border-2 border-dashed border-[#E7B0DE] hover:border-[#FF5A0A] cursor-pointer shadow-sm text-center transition-all hover:bg-[#FAF0F8] group"
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
                <div className="w-16 h-16 rounded-2xl bg-[#FFF2EC] group-hover:bg-[#FF5A0A] text-[#FF5A0A] group-hover:text-white flex items-center justify-center mx-auto mb-4 transition-colors shadow-md shadow-[#FF5A0A]/20">
                  <UploadCloud className="w-8 h-8" />
                </div>
                <h3 className="text-base font-black text-[#400849]">
                  {isUploading ? "Reading and validating CSV..." : "Drag & drop your reviews CSV here"}
                </h3>
                <p className="text-xs text-[#71367B] mt-1 max-w-sm mx-auto">
                  Supports UTF-8 CSV exports from Zendesk, App Store, Google Play, Trustpilot, or internal databases (up to 25MB).
                </p>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  className="mt-6 px-5 py-2.5 rounded-xl bg-[#FF5A0A] text-white text-xs font-black shadow-md shadow-[#FF5A0A]/20 hover:bg-[#E04D05] transition-all"
                >
                  Browse Files
                </button>
              </div>

              {/* Sample Pre-loads */}
              <div className="p-6 rounded-3xl bg-white border border-[#E7B0DE]/40 shadow-sm">
                <span className="text-xs font-black text-[#400849] block mb-1">
                  Or test immediately with pre-configured sample datasets:
                </span>
                <p className="text-xs text-[#71367B] mb-4">
                  Curated benchmarks with realistic review texts, ratings, and timestamps.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    onClick={() => handleLoadSample("saas")}
                    className="p-4 rounded-2xl bg-[#FAF0F8] hover:bg-[#F3DCF0] border border-[#E7B0DE]/40 hover:border-[#FF5A0A]/40 text-left transition-all group"
                  >
                    <div className="flex items-center gap-2 font-black text-xs text-[#400849] group-hover:text-[#FF5A0A]">
                      <Sparkles className="w-4 h-4 text-[#FF5A0A]" />
                      <span>SaaS Feedback</span>
                    </div>
                    <p className="text-[11px] text-[#71367B] mt-1">
                      Platform bugs, pricing, SSO, and UI adoption reviews.
                    </p>
                  </button>

                  <button
                    onClick={() => handleLoadSample("ecommerce")}
                    className="p-4 rounded-2xl bg-[#FAF0F8] hover:bg-[#F3DCF0] border border-[#E7B0DE]/40 hover:border-[#FF5A0A]/40 text-left transition-all group"
                  >
                    <div className="flex items-center gap-2 font-black text-xs text-[#400849] group-hover:text-[#FF5A0A]">
                      <Database className="w-4 h-4 text-[#FF5A0A]" />
                      <span>E-Commerce Reviews</span>
                    </div>
                    <p className="text-[11px] text-[#71367B] mt-1">
                      Delivery delays, packaging quality, and refund complaints.
                    </p>
                  </button>

                  <button
                    onClick={() => handleLoadSample("raw")}
                    className="p-4 rounded-2xl bg-[#FAF0F8] hover:bg-[#F3DCF0] border border-[#E7B0DE]/40 hover:border-[#FF5A0A]/40 text-left transition-all group"
                  >
                    <div className="flex items-center gap-2 font-black text-xs text-[#400849] group-hover:text-[#FF5A0A]">
                      <Layers className="w-4 h-4 text-[#FF5A0A]" />
                      <span>Raw Unlabeled Feedback</span>
                    </div>
                    <p className="text-[11px] text-[#71367B] mt-1">
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
              <div className="p-6 rounded-3xl bg-white border border-[#E7B0DE]/40 shadow-sm space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-[#E7B0DE]/30">
                  <div>
                    <h3 className="text-base font-black text-[#400849]">
                      Configure Dataset & Column Schema
                    </h3>
                    <p className="text-xs text-[#71367B] mt-0.5">
                      Found <span className="font-bold text-[#400849]">{preview.total_rows.toLocaleString()}</span> records in{" "}
                      <span className="font-bold text-[#FF5A0A]">{preview.filename}</span>
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setPreview(null);
                    }}
                    className="text-xs text-[#71367B] hover:text-[#E11D48] font-bold"
                  >
                    Change File
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-black text-[#400849] block mb-1">
                      Dataset Display Name
                    </label>
                    <input
                      type="text"
                      value={datasetName}
                      onChange={(e) => setDatasetName(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-[#E7B0DE]/60 bg-white text-xs text-[#400849] focus:outline-none focus:ring-2 focus:ring-[#FF5A0A]/20"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-black text-[#400849] block mb-1">
                      Review Text Column <span className="text-[#E11D48]">*</span>
                    </label>
                    <select
                      value={textColumn}
                      onChange={(e) => setTextColumn(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-[#E7B0DE]/60 bg-white text-xs font-bold text-[#400849] focus:outline-none focus:ring-2 focus:ring-[#FF5A0A]/20"
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
                    <label className="text-xs font-black text-[#400849] block mb-1">
                      Date / Timestamp Column (Optional)
                    </label>
                    <select
                      value={dateColumn}
                      onChange={(e) => setDateColumn(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-[#E7B0DE]/60 bg-white text-xs text-[#400849] focus:outline-none"
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
                    <label className="text-xs font-black text-[#400849] block mb-1">
                      Original Rating Column (Optional)
                    </label>
                    <select
                      value={ratingColumn}
                      onChange={(e) => setRatingColumn(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-[#E7B0DE]/60 bg-white text-xs text-[#400849] focus:outline-none"
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
                  <span className="text-xs font-black text-[#400849] block mb-2">
                    Data Sample Preview (First 5 Rows)
                  </span>
                  <div className="overflow-x-auto rounded-2xl border border-[#E7B0DE]/40">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-[#FAF0F8] border-b border-[#E7B0DE]/40 text-[#A872AF] font-bold text-[10px] uppercase">
                          {preview.detected_columns.map((col) => (
                            <th key={col} className="p-2.5">
                              {col}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E7B0DE]/30">
                        {preview.preview_rows.map((row, i) => (
                          <tr key={i} className="hover:bg-[#FAF0F8]">
                            {preview.detected_columns.map((col) => (
                              <td key={col} className="p-2.5 text-[#400849] max-w-xs truncate">
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
                    className="px-6 py-3 rounded-xl bg-[#FF5A0A] hover:bg-[#E04D05] text-white text-xs font-black shadow-md shadow-[#FF5A0A]/25 transition-all flex items-center gap-2"
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
            <div className="p-12 rounded-3xl bg-white border border-[#E7B0DE]/40 shadow-xl text-center space-y-6 max-w-lg mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-[#FFF2EC] text-[#FF5A0A] flex items-center justify-center mx-auto">
                <RefreshCw className="w-8 h-8 animate-spin" />
              </div>

              <div>
                <h3 className="text-lg font-black text-[#400849]">
                  Analyzing Feedback Dataset...
                </h3>
                <p className="text-xs text-[#71367B] mt-1">
                  Applying negation-aware TF-IDF, Calibrated Linear SVM, and NMF topic modeling.
                </p>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="w-full h-3 rounded-full bg-[#FAF0F8] overflow-hidden p-0.5 border border-[#E7B0DE]/40">
                  <div
                    className="h-full bg-gradient-to-r from-[#FF5A0A] to-[#FFA153] rounded-full transition-all duration-300"
                    style={{ width: `${jobStatus?.progress || 10}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs font-black text-[#FF5A0A]">
                  <span>Progress</span>
                  <span>{jobStatus?.progress?.toFixed(0) || 10}%</span>
                </div>
              </div>

              <div className="text-[11px] text-[#A872AF] font-bold pt-2">
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
