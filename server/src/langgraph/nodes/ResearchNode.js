import { tavilyService } from "../../services/tavilyService.js";

/**
 * ResearchNode
 * 
 * Responsibilities:
 * - Query Tavily search engine in parallel for 5 domains.
 * - Calculate metadata (sourceCount, execution time).
 * - Return structured data containing titles, urls, and content snippets.
 * - Keep data clean and structured to be consumed by the AnalysisNode.
 */
export async function ResearchNode(state) {
  const company = state.company;

  if (!company) {
    throw new Error("ResearchNode Error: Company name is missing from graph state.");
  }

  console.log(`[ResearchNode] Commencing research on: "${company}"`);
  
  const startTime = Date.now();

  try {
    // Perform parallel search across 5 key dimensions
    const searchData = await tavilyService.researchCompany(company);
    const duration = Date.now() - startTime;

    // Collect all URLs to calculate unique source count
    const allUrls = new Set();
    const categories = ["overview", "competitors", "recentNews", "opportunities", "risks"];
    
    categories.forEach(cat => {
      const results = searchData[cat] || [];
      results.forEach(item => {
        if (item.url) allUrls.add(item.url);
      });
    });

    console.log(`[ResearchNode] Completed in ${duration}ms. Unique sources found: ${allUrls.size}`);

    return {
      research: {
        overview: searchData.overview || [],
        competitors: searchData.competitors || [],
        recentNews: searchData.recentNews || [],
        opportunities: searchData.opportunities || [],
        risks: searchData.risks || [],
      },
      metadata: {
        sourceCount: allUrls.size,
        uniqueSources: Array.from(allUrls),
        researchDurationMs: duration,
        researchTimestamp: new Date().toISOString(),
      }
    };
  } catch (error) {
    console.error(`[ResearchNode] Error gathering research:`, error);
    // Return empty placeholders on error to prevent graph crash
    return {
      research: {
        overview: [],
        competitors: [],
        recentNews: [],
        opportunities: [],
        risks: [],
      },
      metadata: {
        sourceCount: 0,
        uniqueSources: [],
        researchDurationMs: Date.now() - startTime,
        researchError: error.message,
      }
    };
  }
}
