import React, { useState } from "react";
import { Search, Loader2 } from "lucide-react";

/**
 * SearchBar Component
 * Renders the primary input box for the company search.
 */
export default function SearchBar({ onSearch, isLoading }) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim() && !isLoading) {
      onSearch(query.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="relative flex items-center">
        <div className="absolute left-4 text-textSecondary pointer-events-none">
          <Search size={20} />
        </div>
        
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          disabled={isLoading}
          placeholder="Enter company name (e.g. Tesla, Apple, Nvidia...)"
          className="w-full pl-12 pr-32 py-4 bg-card border border-slate-700/60 rounded-xl text-textPrimary placeholder:text-textSecondary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all duration-200 shadow-lg disabled:opacity-50 text-base"
        />

        <div className="absolute right-2 top-2 bottom-2 flex">
          <button
            type="submit"
            disabled={!query.trim() || isLoading}
            className="flex items-center justify-center px-6 py-2 bg-accent hover:bg-accentHover disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-medium rounded-lg text-sm transition-colors shadow-md"
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="animate-spin mr-2" />
                Analyzing
              </>
            ) : (
              "Analyze"
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
