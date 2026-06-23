import React from "react";
import { CheckCircle2, AlertTriangle, HelpCircle, ShieldAlert } from "lucide-react";

/**
 * DecisionCard Component
 * Displays the final investment recommendation, override guardrails, and audit reasoning list.
 */
export default function DecisionCard({ report }) {
  const isInvest = report.finalRecommendation === "INVEST";
  const isWatch = report.finalRecommendation === "WATCH";
  const isPass = report.finalRecommendation === "PASS";

  // Determine styles and icons based on final recommendation
  let bannerClass = "";
  let icon = null;
  let ratingLabel = report.rating || report.finalRecommendation;

  if (isInvest) {
    bannerClass = "from-emerald-500/20 to-teal-500/5 border-emerald-500/30 text-emerald-400";
    icon = <CheckCircle2 size={24} className="text-emerald-400" />;
  } else if (isWatch) {
    bannerClass = "from-amber-500/20 to-yellow-500/5 border-amber-500/30 text-amber-400";
    icon = <AlertTriangle size={24} className="text-amber-400" />;
  } else {
    bannerClass = "from-rose-500/20 to-red-500/5 border-rose-500/30 text-rose-400";
    icon = <ShieldAlert size={24} className="text-rose-400" />;
  }

  return (
    <div className="bg-card border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between border-b border-slate-700/60 pb-4 mb-5">
          <h3 className="text-lg font-bold tracking-tight text-textPrimary">
            Investment Recommendation
          </h3>
          <span className="text-xs text-textSecondary uppercase tracking-widest font-semibold">
            Decision Node
          </span>
        </div>

        {/* Big Recommendation Banner */}
        <div className={`bg-gradient-to-r ${bannerClass} border rounded-xl p-5 flex items-center justify-between mb-6 shadow-inner`}>
          <div className="flex items-center space-x-3">
            {icon}
            <div>
              <div className="text-xs uppercase tracking-wider font-bold opacity-80">Recommendation</div>
              <div className="text-2xl font-black tracking-wide">{report.finalRecommendation}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs uppercase tracking-wider font-bold opacity-80">Status Category</div>
            <div className="text-sm font-extrabold">{ratingLabel}</div>
          </div>
        </div>

        {/* Audit Details */}
        <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
          <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
            <span className="text-xs text-textSecondary block">Score-based recommendation</span>
            <span className="font-semibold text-textPrimary">{report.baseRecommendation}</span>
          </div>
          <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
            <span className="text-xs text-textSecondary block">Audit Confidence</span>
            <span className="font-semibold text-textPrimary">{report.confidenceScore || report.confidence || 0}%</span>
          </div>
        </div>

        {/* Override Guardrails Banner */}
        {report.overrideTriggered && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl mb-6 flex items-start space-x-3 text-sm">
            <AlertTriangle className="text-rose-400 shrink-0 mt-0.5" size={18} />
            <div>
              <span className="font-bold text-rose-400 block mb-0.5">Risk Override Guardrail Triggered</span>
              <p className="text-textSecondary text-xs leading-relaxed">
                {report.overrideReason}
              </p>
            </div>
          </div>
        )}

        {/* Reasoning Path */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-textSecondary mb-3">
            Decision Audit Trail & Logic
          </h4>
          <ul className="space-y-2.5">
            {(report.reasoning || []).map((reason, idx) => {
              const isOverrideStep = reason.includes("GUARDRAIL") || reason.includes("Downgrade") || reason.includes("Override");
              return (
                <li key={idx} className="flex items-start space-x-2 text-xs leading-relaxed">
                  <span className={`h-1.5 w-1.5 rounded-full shrink-0 mt-1.5 ${isOverrideStep ? 'bg-rose-500 animate-ping' : 'bg-accent'}`} />
                  <span className={isOverrideStep ? "text-rose-400 font-medium" : "text-textSecondary"}>
                    {reason}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <div className="mt-8 pt-4 border-t border-slate-700/60 text-[10px] text-textSecondary text-center">
        ⚠️ DISCLAIMER: This is an educational research assistant and is NOT formal financial advice.
      </div>
    </div>
  );
}
