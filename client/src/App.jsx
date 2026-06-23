import React, { useState } from "react";
import SearchBar from "./components/SearchBar";
import LoadingState from "./components/LoadingState";
import ResearchSummary from "./components/ResearchSummary";
import DecisionCard from "./components/DecisionCard";
import ScoreCard from "./components/ScoreCard";
import SWOTCard from "./components/SWOTCard";
import CompetitorCard from "./components/CompetitorCard";
import NewsCard from "./components/NewsCard";
import References from "./components/References";
import { analyzeCompany } from "./services/api";
import { AlertCircle, TrendingUp, Cpu, Users2 } from "lucide-react";

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [report, setReport] = useState(null);
  const [error, setError] = useState(null);
  const [latencyMs, setLatencyMs] = useState(0);

  const handleSearch = async (companyName) => {
    setIsLoading(true);
    setError(null);
    setReport(null);
    const startTime = Date.now();

    try {
      const response = await analyzeCompany(companyName);
      if (response.success) {
        setReport(response.data);
        setLatencyMs(response.latencyMs || (Date.now() - startTime));
      } else {
        throw new Error(response.error || "Analysis failed to complete.");
      }
    } catch (err) {
      console.error("Analysis Request Error:", err);
      setError(
        err.response?.data?.error || 
        err.message || 
        "A network connection error occurred. Make sure the backend server is active."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-textPrimary bg-grid-pattern pb-20">
      {/* Header Bar */}
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-accent p-2 rounded-lg text-white shadow-md">
              <TrendingUp size={20} />
            </div>
            <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              AI Investment Research Agent
            </span>
          </div>

          <div className="flex items-center space-x-6 text-xs text-textSecondary font-semibold">
            <span className="flex items-center"><Cpu size={14} className="mr-1 text-accent" /> Gemini 2.5 Flash</span>
            <span className="flex items-center"><Users2 size={14} className="mr-1 text-green-500" /> Tavily Search API</span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 space-y-10">
        {/* Title and Intro */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight">
            AI Investment <span className="bg-gradient-to-r from-accent to-blue-400 bg-clip-text text-transparent">Research Agent</span>
          </h1>
          <p className="text-textSecondary text-base sm:text-lg">
            Perform institutional-grade quantitative and qualitative investment analysis in seconds.
            Powered by LangGraph multi-node workflows and Gemini.
          </p>
        </div>

        {/* Search Bar section */}
        <div className="py-2 space-y-4">
          <SearchBar onSearch={handleSearch} isLoading={isLoading} />
          
          {/* Quick Actions */}
          <div className="flex flex-wrap items-center justify-center gap-3 text-xs sm:text-sm text-textSecondary">
            <span className="font-semibold">Quick Actions:</span>
            {["Tesla", "Apple", "Nvidia", "Microsoft"].map((name) => (
              <button
                key={name}
                type="button"
                onClick={() => handleSearch(name)}
                disabled={isLoading}
                className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700/80 border border-slate-700/40 hover:border-accent text-textPrimary font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 hover:scale-[1.03] active:scale-[0.97]"
              >
                {name}
              </button>
            ))}
          </div>
        </div>

        {/* Error State Display */}
        {error && (
          <div className="max-w-2xl mx-auto p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-start space-x-3 text-sm animate-pulse-slow">
            <AlertCircle className="text-rose-400 shrink-0 mt-0.5" size={18} />
            <div>
              <span className="font-bold text-rose-400 block mb-0.5">Analysis Request Failed</span>
              <p className="text-textSecondary text-xs">{error}</p>
            </div>
          </div>
        )}

        {/* Loading Skeleton */}
        {isLoading && <LoadingState />}

        {/* Final Analysis Report Dashboard */}
        {report && !isLoading && (
          <div className="space-y-8 animate-fadeIn">
            {/* Top Level Summary Cards */}
            <ResearchSummary report={report} latencyMs={latencyMs} />

            {/* Decision & Score Matrix */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <DecisionCard report={report} />
              <ScoreCard score={report.score} />
            </div>

            {/* SWOT Cards Grid */}
            <SWOTCard report={report} />

            {/* Competitors & News citation decks */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <CompetitorCard competitors={report.competitors} />
              <NewsCard news={report.recentNews} />
            </div>

            {/* Sources Index */}
            <References references={report.references} />
          </div>
        )}
      </main>
    </div>
  );
}
