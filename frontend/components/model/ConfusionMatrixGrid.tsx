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
    <div className="p-6 rounded-3xl bg-white border border-[#E7B0DE]/40 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-xs font-black text-[#400849] tracking-tight">
            Confusion Matrix (Untouched Test Split)
          </h3>
          <p className="text-[11px] text-[#A872AF] mt-0.5">
            Cross-tabulation of ground-truth test labels vs champion model predictions
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1.5 text-[#10B981] font-bold text-[10px] uppercase">
            <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" /> Hits
          </span>
          <span className="flex items-center gap-1.5 text-[#E11D48] font-bold text-[10px] uppercase">
            <span className="w-2.5 h-2.5 rounded-full bg-[#E11D48]" /> Errors
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-center border-collapse text-xs">
          <thead>
            <tr className="bg-[#FAF0F8]">
              <th className="p-2.5 text-left font-black text-[#A872AF] uppercase text-[10px]">
                True \ Predicted
              </th>
              {labels.map((lbl) => (
                <th key={lbl} className="p-2.5 font-black text-[#400849] uppercase text-[10px]">
                  Pred: {lbl}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {labels.map((trueLbl, rIdx) => (
              <tr key={trueLbl} className="border-t border-[#E7B0DE]/30">
                <td className="p-3 text-left font-bold text-[#400849] uppercase text-[10px] bg-[#FAF0F8]">
                  True: {trueLbl}
                </td>
                {matrix[rIdx]?.map((val, cIdx) => {
                  const isDiagonal = rIdx === cIdx;
                  const cellClass =
                    isDiagonal && val > 0
                      ? "bg-[#10B981]/15 text-[#10B981] font-black"
                      : !isDiagonal && val > 0
                      ? "bg-[#FFE4E6] text-[#E11D48] font-black"
                      : "bg-white text-[#400849]";

                  return (
                    <td
                      key={cIdx}
                      className={`p-3 text-sm transition-colors border border-[#E7B0DE]/30 ${cellClass}`}
                    >
                      <div className="flex flex-col items-center justify-center">
                        <span className="font-mono text-base">{val}</span>
                        <span className="text-[9.5px] uppercase font-black opacity-80">
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
