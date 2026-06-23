import React from "react";
import { Newspaper, ExternalLink } from "lucide-react";

/**
 * NewsCard Component
 * Displays recent news search results and headlines.
 */
export default function NewsCard({ news }) {
  return (
    <div className="bg-card border border-slate-800 rounded-2xl p-6 shadow-xl h-full">
      <div className="flex items-center justify-between border-b border-slate-700/60 pb-4 mb-5">
        <h3 className="text-lg font-bold tracking-tight text-textPrimary flex items-center">
          <Newspaper size={20} className="text-accent mr-2" />
          Recent News & Events
        </h3>
        <span className="text-xs text-textSecondary uppercase tracking-widest font-semibold">
          Press Feed
        </span>
      </div>

      <div className="space-y-4">
        {news && news.length > 0 ? (
          news.map((item, idx) => (
            <div 
              key={idx} 
              className="p-4 bg-slate-900 border border-slate-800/80 rounded-xl hover:border-accent/40 transition-colors group"
            >
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <h4 className="text-sm font-bold text-textPrimary leading-snug group-hover:text-accent transition-colors">
                  {item.title}
                </h4>
                {item.url && (
                  <a 
                    href={item.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-textSecondary hover:text-accent shrink-0"
                    title="Read Original Article"
                  >
                    <ExternalLink size={14} />
                  </a>
                )}
              </div>
              <p className="text-xs text-textSecondary leading-relaxed line-clamp-3">
                {item.snippet}
              </p>
            </div>
          ))
        ) : (
          <div className="text-sm text-textSecondary italic py-4 text-center">
            No recent news headlines cataloged in search.
          </div>
        )}
      </div>
    </div>
  );
}
