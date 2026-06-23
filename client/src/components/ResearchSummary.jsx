import React from "react";
import { Info, Clock, Link2, Calendar, CheckCircle2, AlertTriangle, ShieldAlert, Award } from "lucide-react";

/**
 * ResearchSummary Component
 * Redesigned as a Premium Large Recommendation Hero Card.
 * Combines the company overview, executive summary, latency metrics, and a large visual decision widget.
 */
export default function ResearchSummary({ report, latencyMs }) {
  const formattedDate = report.timestamp 
    ? new Date(report.timestamp).toLocaleDateString(undefined, { 
        year: "numeric", 
        month: "long", 
        day: "numeric" 
      }) 
    : new Date().toLocaleDateString();

  const isInvest = report.finalRecommendation === "INVEST";
  const isWatch = report.finalRecommendation === "WATCH";
  
  // Dynamic grading styles
  let cardBorder = "border-slate-800";
  let gradeBadgeColor = "text-accent border-accent/20 bg-accent/5";
  let heroBanner = "";
  let heroIcon = null;

  if (isInvest) {
    cardBorder = "border-emerald-500/30";
    gradeBadgeColor = "text-emerald-400 border-emerald-500/20 bg-emerald-500/5";
    heroBanner = "from-emerald-500/20 to-teal-500/5 border-emerald-500/30 text-emerald-400";
    heroIcon = <CheckCircle2 size={32} className="text-emerald-400 shrink-0" />;
  } else if (isWatch) {
    cardBorder = "border-amber-500/30";
    gradeBadgeColor = "text-amber-400 border-amber-500/20 bg-amber-500/5";
    heroBanner = "from-amber-500/20 to-yellow-500/5 border-amber-500/30 text-amber-400";
    heroIcon = <AlertTriangle size={32} className="text-amber-400 shrink-0" />;
  } else {
    cardBorder = "border-rose-500/30";
    gradeBadgeColor = "text-rose-400 border-rose-500/20 bg-rose-500/5";
    heroBanner = "from-rose-500/20 to-red-500/5 border-rose-500/30 text-rose-400";
    heroIcon = <ShieldAlert size={32} className="text-rose-400 shrink-0" />;
  }

  return (
    <div className={`bg-card border ${cardBorder} rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden bg-grid-pattern transition-all duration-300 hover:shadow-accent/5`}>
      {/* Visual decorative blur */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-accent/5 rounded-full filter blur-3xl pointer-events-none"></div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Columns: Company Details & Thesis */}
        <div className="lg:col-span-2 space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="px-3 py-1 bg-accent/10 border border-accent/20 rounded-full text-xs font-bold text-accent tracking-widest uppercase">
                Investment Analysis Report
              </span>
              {report.overrideTriggered && (
                <span className="px-3 py-1 bg-rose-500/10 border border-rose-500/20 rounded-full text-xs font-bold text-rose-400 tracking-widest uppercase flex items-center">
                  <AlertTriangle size={12} className="mr-1 animate-pulse" />
                  Risk Override Active
                </span>
              )}
            </div>

            <h2 className="text-4xl font-extrabold tracking-tight text-textPrimary leading-tight">
              {report.company}
            </h2>
            
            <p className="text-textSecondary leading-relaxed text-sm md:text-base">
              {report.overview}
            </p>
          </div>

          {/* Investment Thesis Statement */}
          <div className="p-5 bg-slate-900/60 border border-slate-800/80 rounded-2xl relative mt-4 shadow-inner">
            <div className="absolute top-0 left-0 bottom-0 w-1 bg-accent rounded-l-2xl"></div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-accent mb-2">
              Core Investment Thesis
            </h3>
            <p className="text-textPrimary leading-relaxed text-sm md:text-base italic">
              "{report.summary}"
            </p>
          </div>
          
          {/* Latency & Metadata row */}
          <div className="flex flex-wrap gap-4 text-xs text-textSecondary pt-4">
            <div className="flex items-center px-3 py-1.5 bg-slate-900/80 border border-slate-800 rounded-lg">
              <Clock size={14} className="text-accent mr-1.5" />
              <span>Time: {((latencyMs || report.latencyMs || 0) / 1000).toFixed(2)}s</span>
            </div>
            <div className="flex items-center px-3 py-1.5 bg-slate-900/80 border border-slate-800 rounded-lg">
              <Link2 size={14} className="text-green-500 mr-1.5" />
              <span>Sources: {report.sourceCount || 0} Sites</span>
            </div>
            <div className="flex items-center px-3 py-1.5 bg-slate-900/80 border border-slate-800 rounded-lg">
              <Calendar size={14} className="text-orange-500 mr-1.5" />
              <span>Date: {formattedDate}</span>
            </div>
          </div>
        </div>

        {/* Right 1 Column: Large Recommendation Hero Badge */}
        <div className="bg-slate-900/50 border border-slate-800/60 rounded-2xl p-6 flex flex-col justify-between items-center text-center shadow-inner relative">
          <div className="w-full text-left border-b border-slate-800 pb-3 mb-4">
            <span className="text-[10px] uppercase font-bold text-textSecondary tracking-widest block">Recommendation Rating</span>
          </div>

          <div className="my-auto space-y-5 py-4 w-full">
            {/* Big Status Badge */}
            <div className={`bg-gradient-to-br ${heroBanner} border rounded-2xl p-4 flex flex-col items-center justify-center space-y-2 shadow-lg`}>
              {heroIcon}
              <div className="text-[10px] uppercase tracking-widest font-black opacity-75">Final Recommendation</div>
              <div className="text-3xl font-black tracking-wider">{report.finalRecommendation}</div>
            </div>

            {/* Total Score & Grade side-by-side */}
            <div className="grid grid-cols-2 gap-3 w-full">
              <div className="p-3 bg-slate-950/60 border border-slate-900 rounded-xl">
                <span className="text-[9px] uppercase font-semibold text-textSecondary tracking-wider block mb-0.5">Total Score</span>
                <span className="text-2xl font-black text-accent">{report.score.total}</span>
                <span className="text-[10px] text-textSecondary">/100</span>
              </div>
              <div className="p-3 bg-slate-950/60 border border-slate-900 rounded-xl flex flex-col items-center justify-center">
                <span className="text-[9px] uppercase font-semibold text-textSecondary tracking-wider block mb-0.5">Grade</span>
                <span className="text-2xl font-black text-emerald-400 flex items-center">
                  <Award size={16} className="mr-0.5" />
                  {report.score.grade}
                </span>
              </div>
            </div>
          </div>

          {/* Sub-label */}
          <div className="w-full border-t border-slate-800 pt-3 mt-4">
            <span className="text-[10px] font-bold uppercase text-textSecondary block">
              Status Rating: {report.rating}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
