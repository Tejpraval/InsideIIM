import React from "react";
import { Users, ExternalLink } from "lucide-react";

/**
 * CompetitorCard Component
 * Displays competitor analysis and market comparison citations.
 */
export default function CompetitorCard({ competitors }) {
  return (
    <div className="bg-card border border-slate-800 rounded-2xl p-6 shadow-xl h-full">
      <div className="flex items-center justify-between border-b border-slate-700/60 pb-4 mb-5">
        <h3 className="text-lg font-bold tracking-tight text-textPrimary flex items-center">
          <Users size={20} className="text-accent mr-2" />
          Competitor Analysis
        </h3>
        <span className="text-xs text-textSecondary uppercase tracking-widest font-semibold">
          Market Landscape
        </span>
      </div>

      <div className="space-y-4">
        {competitors && competitors.length > 0 ? (
          competitors.map((comp, idx) => (
            <div 
              key={idx} 
              className="p-4 bg-slate-900 border border-slate-800/80 rounded-xl hover:border-accent/40 transition-colors group"
            >
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <h4 className="text-sm font-bold text-textPrimary leading-snug group-hover:text-accent transition-colors">
                  {comp.title}
                </h4>
                {comp.url && (
                  <a 
                    href={comp.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-textSecondary hover:text-accent shrink-0"
                    title="View Source Article"
                  >
                    <ExternalLink size={14} />
                  </a>
                )}
              </div>
              <p className="text-xs text-textSecondary leading-relaxed line-clamp-3">
                {comp.snippet}
              </p>
            </div>
          ))
        ) : (
          <div className="text-sm text-textSecondary italic py-4 text-center">
            No competitor details cataloged in search.
          </div>
        )}
      </div>
    </div>
  );
}
