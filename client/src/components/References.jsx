import React from "react";
import { Quote, ExternalLink } from "lucide-react";

/**
 * References Component
 * Renders the deduplicated list of unique research references gathered during analysis.
 */
export default function References({ references }) {
  return (
    <div className="bg-card border border-slate-800 rounded-2xl p-6 shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-700/60 pb-4 mb-5">
        <h3 className="text-lg font-bold tracking-tight text-textPrimary flex items-center">
          <Quote size={20} className="text-accent mr-2" />
          Research Sources & Citations
        </h3>
        <span className="text-xs text-textSecondary uppercase tracking-widest font-semibold">
          Source Index
        </span>
      </div>

      {references && references.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {references.map((ref, idx) => (
            <a
              key={idx}
              href={ref.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-3 p-3 bg-slate-900 border border-slate-800/80 rounded-xl hover:border-accent hover:bg-slate-800/50 transition-all duration-200 group"
            >
              <div className="h-6 w-6 rounded-md bg-slate-800 border border-slate-700/60 flex items-center justify-center text-[10px] font-bold text-textSecondary group-hover:text-accent group-hover:bg-slate-700 transition-colors shrink-0">
                {idx + 1}
              </div>
              <div className="overflow-hidden min-w-0 flex-1">
                <span className="text-xs font-semibold text-textPrimary block truncate group-hover:text-accent transition-colors">
                  {ref.title}
                </span>
                <span className="text-[10px] text-textSecondary block truncate flex items-center">
                  {ref.url.replace(/https?:\/\/(www\.)?/, "")}
                  <ExternalLink size={10} className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                </span>
              </div>
            </a>
          ))}
        </div>
      ) : (
        <div className="text-sm text-textSecondary italic py-4 text-center">
          No external references cataloged.
        </div>
      )}
    </div>
  );
}
