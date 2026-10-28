"use client";

import React from "react";

interface ConfusionMatrixGridProps {
  matrix: number[][];
  labels: string[];
}

export function ConfusionMatrixGrid({ matrix, labels }: ConfusionMatrixGridProps) {
  if (!matrix || matrix.length === 0) return null;

  // Find max value in matrix for relative color opacity
  let maxVal = 1;
  matrix.forEach((row) => row.forEach((val) => {
    if (val > maxVal) maxVal = val;
  }));

  return (
    <div className="p-6 rounded-2xl bg-white border border-[#6D4AFF]/10 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-[#161327] tracking-tight">
            Confusion Matrix (Untouched Test Split)
          </h3>
          <p className="text-xs text-[#625D7E] mt-0.5">
            Cross-tabulation of ground-truth test labels vs champion model predictions
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1.5 text-[#6D4AFF] font-semibold text-[11px]">
            <span className="w-2.5 h-2.5 rounded bg-[#6D4AFF]" /> Correct Predictions
          </span>
          <span className="flex items-center gap-1.5 text-[#F43F5E] font-semibold text-[11px]">
            <span className="w-2.5 h-2.5 rounded bg-[#F43F5E]" /> Classification Errors
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-center border-collapse text-xs">
          <thead>
            <tr>
              <th className="p-2 text-left font-bold text-[#9B94B8] uppercase text-[10px]">
                True \ Predicted
              </th>
              {labels.map((lbl) => (
                <th key={lbl} className="p-2 font-bold text-[#161327] uppercase text-[11px]">
                  Pred: {lbl}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {labels.map((trueLbl, rIdx) => (
              <tr key={trueLbl} className="border-t border-[#ECE7FF]">
                <td className="p-3 text-left font-bold text-[#161327] uppercase text-[11px] bg-[#FAF8FF]">
                  True: {trueLbl}
                </td>
                {matrix[rIdx]?.map((val, cIdx) => {
                  const isDiagonal = rIdx === cIdx;
                  const cellClass =
                    isDiagonal && val > 0
                      ? "bg-[#6D4AFF]/15 text-[#6D4AFF] font-extrabold"
                      : !isDiagonal && val > 0
                      ? "bg-[#F43F5E]/15 text-[#F43F5E] font-bold"
                      : "bg-white text-[#161327]";

                  return (
                    <td
                      key={cIdx}
                      className={`p-3 text-sm transition-colors border border-[#ECE7FF] ${cellClass}`}
                    >
                      <div className="flex flex-col items-center justify-center">
                        <span className="font-mono text-base">{val}</span>
                        <span className="text-[10px] opacity-70">
                          {isDiagonal ? "Hit" : val > 0 ? "Miss" : "—"}
                        </span>
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
