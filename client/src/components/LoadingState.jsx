import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

/**
 * LoadingState Component
 * Simulates progressive status updates based on typical node timings to keep user engaged.
 */
export default function LoadingState() {
  const [statusIdx, setStatusIdx] = useState(0);

  const statuses = [
    "Waking up research agent and setting up memory blackboard...",
    "Querying Tavily Search engine across 5 distinct company facets...",
    "Retrieving articles, news summaries, and competitor details...",
    "Invoking Google Gemini to analyze strengths, weaknesses, and market position...",
    "Calculating quantitative score metrics (Growth, Risk, Innovation, Market)...",
    "Running risk-adjusted decision framework and verifying safety guardrails...",
    "Synthesizing executive summaries and compiling citation index...",
    "Finalizing financial report formatting..."
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setStatusIdx((prev) => (prev < statuses.length - 1 ? prev + 1 : prev));
    }, 3500); // Progressively update status text every 3.5 seconds

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto py-12 px-4 flex flex-col items-center">
      {/* Dynamic spinner with status */}
      <div className="flex flex-col items-center justify-center space-y-4 mb-10">
        <div className="p-4 bg-slate-800 rounded-full border border-slate-700/60 shadow-lg">
          <Loader2 size={36} className="text-accent animate-spin" />
        </div>
        <p className="text-lg font-medium text-textPrimary text-center max-w-lg transition-all duration-300">
          {statuses[statusIdx]}
        </p>
        <span className="text-xs text-textSecondary uppercase tracking-widest font-semibold">
          Processing Pipeline (Phase {statusIdx + 1} of 8)
        </span>
      </div>

      {/* Premium Skeleton Loader */}
      <div className="w-full space-y-6">
        {/* Header Skeleton */}
        <div className="h-12 bg-slate-800 rounded-xl animate-pulse-slow w-2/3"></div>

        {/* Two Columns Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-48 bg-slate-800 rounded-xl animate-pulse-slow md:col-span-2"></div>
          <div className="h-48 bg-slate-800 rounded-xl animate-pulse-slow"></div>
        </div>

        {/* Detailed Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-64 bg-slate-800 rounded-xl animate-pulse-slow"></div>
          <div className="h-64 bg-slate-800 rounded-xl animate-pulse-slow"></div>
        </div>
      </div>
    </div>
  );
}
