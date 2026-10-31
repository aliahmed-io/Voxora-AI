"use client";

import { useEffect, useState, useCallback } from "react";
import { DatasetBrief } from "./types";

const STORAGE_KEY = "voxora_active_dataset_id";
const EVENT_NAME = "voxora:dataset-change";

export function getStoredDatasetId(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

export function setStoredDatasetId(id: string): void {
  if (typeof window === "undefined" || !id) return;
  try {
    localStorage.setItem(STORAGE_KEY, id);
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: id }));
  } catch {
    // Non-blocking fallback for private browsing / blocked storage
  }
}

export function resolveDefaultDataset(datasets: DatasetBrief[]): DatasetBrief | undefined {
  if (!datasets || datasets.length === 0) return undefined;

  const storedId = getStoredDatasetId();
  if (storedId) {
    const matched = datasets.find((d) => d.id === storedId);
    if (matched) return matched;
  }

  // Prefer the canonical seed SaaS dataset if present
  const seedDataset = datasets.find(
    (d) => d.id === "seed-voxora-saas-2026" || d.name.toLowerCase().includes("voxora")
  );
  if (seedDataset) return seedDataset;

  return datasets[0];
}

export function useActiveDataset(initialDatasets?: DatasetBrief[]) {
  const [activeDatasetId, setActiveIdState] = useState<string>(() => {
    return (
      getStoredDatasetId() ||
      (initialDatasets && initialDatasets.length > 0
        ? resolveDefaultDataset(initialDatasets)?.id || ""
        : "")
    );
  });

  const changeDataset = useCallback((id: string) => {
    setActiveIdState(id);
    setStoredDatasetId(id);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleCustomChange = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      if (customEvent.detail && customEvent.detail !== activeDatasetId) {
        setActiveIdState(customEvent.detail);
      }
    };

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue && e.newValue !== activeDatasetId) {
        setActiveIdState(e.newValue);
      }
    };

    window.addEventListener(EVENT_NAME, handleCustomChange);
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener(EVENT_NAME, handleCustomChange);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [activeDatasetId]);

  return {
    activeDatasetId,
    setActiveDatasetId: changeDataset,
  };
}
