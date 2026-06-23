import React from "react";
import { PlusCircle, MinusCircle, ArrowUpRight, ShieldAlert } from "lucide-react";

/**
 * SWOTCard Component
 * Displays qualitative Strengths, Weaknesses, Opportunities, and Threats in a 2x2 grid layout.
 */
export default function SWOTCard({ report }) {
  const sections = [
    {
      title: "Strengths",
      items: report.strengths || [],
      bgColor: "bg-emerald-500/5",
      borderColor: "border-emerald-500/20",
      iconColor: "text-emerald-400",
      bulletColor: "bg-emerald-400",
      icon: <PlusCircle size={18} />,
    },
    {
      title: "Weaknesses",
      items: report.weaknesses || [],
      bgColor: "bg-rose-500/5",
      borderColor: "border-rose-500/20",
      iconColor: "text-rose-400",
      bulletColor: "bg-rose-400",
      icon: <MinusCircle size={18} />,
    },
    {
      title: "Opportunities",
      items: report.opportunities || [],
      bgColor: "bg-accent/5",
      borderColor: "border-accent/20",
      iconColor: "text-accent",
      bulletColor: "bg-accent",
      icon: <ArrowUpRight size={18} />,
    },
    {
      title: "Threats",
      items: report.threats || [],
      bgColor: "bg-orange-500/5",
      borderColor: "border-orange-500/20",
      iconColor: "text-orange-400",
      bulletColor: "bg-orange-400",
      icon: <ShieldAlert size={18} />,
    },
  ];

  return (
    <div className="bg-card border border-slate-800 rounded-2xl p-6 shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-700/60 pb-4 mb-6">
        <h3 className="text-lg font-bold tracking-tight text-textPrimary">
          Qualitative SWOT Analysis
        </h3>
        <div className="flex items-center space-x-3 text-xs text-textSecondary font-semibold">
          <span className="flex items-center">
            <span className="h-2 w-2 rounded-full bg-emerald-400 mr-1" />
            Market Standing: {report.marketPosition}
          </span>
          <span className="flex items-center">
            <span className="h-2 w-2 rounded-full bg-accent mr-1" />
            Growth: {report.growthPotential}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sections.map((sec, idx) => (
          <div 
            key={idx} 
            className={`${sec.bgColor} ${sec.borderColor} border rounded-xl p-5 shadow-sm`}
          >
            <div className={`flex items-center space-x-2 font-bold text-sm ${sec.iconColor} mb-4`}>
              {sec.icon}
              <h4 className="uppercase tracking-wider">{sec.title}</h4>
            </div>

            <ul className="space-y-3">
              {sec.items.length > 0 ? (
                sec.items.map((item, itemIdx) => (
                  <li key={itemIdx} className="flex items-start space-x-2 text-xs leading-relaxed text-textPrimary">
                    <span className={`h-1.5 w-1.5 rounded-full shrink-0 mt-1.5 ${sec.bulletColor}`} />
                    <span>{item}</span>
                  </li>
                ))
              ) : (
                <li className="text-xs text-textSecondary italic">No explicit data reported.</li>
              )}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
