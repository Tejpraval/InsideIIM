import React from "react";
import { Award, ShieldCheck, Flame, Cpu, BarChart3 } from "lucide-react";

/**
 * ScoreCard Component
 * Displays the cumulative total score, investment grade, and sub-score metrics (Growth, Risk, Market, Innovation).
 */
export default function ScoreCard({ score }) {
  // Helpers to color sub-scores
  const getScoreColor = (value, max = 25) => {
    const ratio = value / max;
    if (ratio >= 0.75) return "bg-emerald-500";
    if (ratio >= 0.5) return "bg-amber-500";
    return "bg-rose-500";
  };

  const getScoreTextColor = (value, max = 25) => {
    const ratio = value / max;
    if (ratio >= 0.75) return "text-emerald-400";
    if (ratio >= 0.5) return "text-amber-400";
    return "text-rose-400";
  };

  const breakdown = score.breakdown || {};

  const metrics = [
    {
      title: "Growth Potential",
      value: score.growth,
      max: 25,
      icon: <Flame size={16} className="text-orange-400" />,
      reason: breakdown.growthReason || "Calculated based on company trajectory and opportunities.",
    },
    {
      title: "Risk Tolerance (Low Risk = High Pts)",
      value: score.risk,
      max: 25,
      icon: <ShieldCheck size={16} className="text-blue-400" />,
      reason: breakdown.riskReason || "Deducted based on qualitative weaknesses, threats, and context.",
    },
    {
      title: "Market Position",
      value: score.market,
      max: 25,
      icon: <BarChart3 size={16} className="text-emerald-400" />,
      reason: breakdown.marketReason || "Evaluated based on leadership standing and brand strengths.",
    },
    {
      title: "Innovation Index",
      value: score.innovation,
      max: 25,
      icon: <Cpu size={16} className="text-indigo-400" />,
      reason: breakdown.innovationReason || "Calculated from technical/AI keywords in research nodes.",
    },
  ];

  return (
    <div className="bg-card border border-slate-800 rounded-2xl p-6 shadow-xl h-full flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between border-b border-slate-700/60 pb-4 mb-6">
          <h3 className="text-lg font-bold tracking-tight text-textPrimary">
            Quantitative Scorecard
          </h3>
          <span className="text-xs text-textSecondary uppercase tracking-widest font-semibold">
            Scoring Node
          </span>
        </div>

        {/* Total Score & Grade Header */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col items-center justify-center text-center">
            <span className="text-xs text-textSecondary uppercase tracking-wider block mb-1">Total Score</span>
            <div className="flex items-baseline space-x-1">
              <span className="text-4xl font-extrabold text-accent">{score.total}</span>
              <span className="text-sm text-textSecondary">/100</span>
            </div>
          </div>
          
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col items-center justify-center text-center">
            <span className="text-xs text-textSecondary uppercase tracking-wider block mb-1">Investment Grade</span>
            <div className="flex items-center text-emerald-400 font-black text-3xl">
              <Award size={24} className="mr-1.5" />
              {score.grade}
            </div>
          </div>
        </div>

        {/* Sub-score Progress Bars */}
        <div className="space-y-5">
          {metrics.map((m, idx) => {
            const percent = (m.value / m.max) * 100;
            return (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <div className="flex items-center space-x-1.5 text-textPrimary">
                    {m.icon}
                    <span>{m.title}</span>
                  </div>
                  <span className={getScoreTextColor(m.value, m.max)}>
                    {m.value} / {m.max}
                  </span>
                </div>
                
                {/* Progress bar line */}
                <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800/80">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${getScoreColor(m.value, m.max)}`}
                    style={{ width: `${percent}%` }}
                  />
                </div>

                <p className="text-[10px] text-textSecondary leading-relaxed">
                  {m.reason}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
