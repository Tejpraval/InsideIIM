import axios from "axios";

/**
 * Service to interact with Tavily Search API
 * Designed with interview-level explainability: we use raw HTTP POST requests to the Tavily endpoint.
 * This avoids SDK overhead, allows custom timeouts, and makes the API interaction transparent.
 */
export class TavilyService {
  constructor() {
    this.baseUrl = "https://api.tavily.com/search";
  }

  get apiKey() {
    const key = process.env.TAVILY_API_KEY;
    if (!key) {
      console.warn("WARNING: TAVILY_API_KEY is not defined in environment variables.");
    }
    return key;
  }

  /**
   * Performs a single search query on Tavily
   * @param {string} query - The search query
   * @param {string} depth - "basic" or "advanced" (default is basic for speed)
   * @param {number} maxResults - Number of results to return
   * @returns {Promise<Array>} List of search results [{title, url, content}]
   */
  async search(query, depth = "basic", maxResults = 5) {
    try {
      const key = this.apiKey;
      if (!key) {
        throw new Error("Tavily API key is missing. Please set TAVILY_API_KEY in your .env file.");
      }

      const response = await axios.post(
        this.baseUrl,
        {
          api_key: key,
          query: query,
          search_depth: depth,
          include_answer: false,
          include_images: false,
          max_results: maxResults,
        },
        {
          timeout: 10000, // 10s timeout to prevent hanging
        }
      );

      return response.data.results || [];
    } catch (error) {
      console.error(`Tavily search failed for query "${query}":`, error.message);
      // Fallback: return empty array rather than failing the entire graph if one query fails
      return [];
    }
  }

  /**
   * Researches a company across 5 distinct domains in parallel.
   * Production best practice: parallel execution with Promise.all reduces latency.
   * @param {string} companyName - Name of the company to research
   * @returns {Promise<Object>} Structured research findings
   */
  async researchCompany(companyName) {
    console.log(`[Tavily] Initiating parallel research for: "${companyName}"`);

    const queries = {
      overview: `${companyName} company overview history business model core products`,
      competitors: `${companyName} main competitors market share competition analysis`,
      recentNews: `${companyName} recent news major announcements events latest updates`,
      opportunities: `${companyName} future growth opportunities market expansion plans`,
      risks: `${companyName} risks challenges potential threats liabilities`,
    };

    // Run all 5 search queries in parallel
    const [overview, competitors, recentNews, opportunities, risks] = await Promise.all([
      this.search(queries.overview, "basic", 4),
      this.search(queries.competitors, "basic", 4),
      this.search(queries.recentNews, "basic", 5),
      this.search(queries.opportunities, "basic", 4),
      this.search(queries.risks, "basic", 4),
    ]);

    console.log(`[Tavily] Parallel research completed for "${companyName}".`);

    return {
      companyName,
      overview,
      competitors,
      recentNews,
      opportunities,
      risks,
    };
  }
}

// Export a singleton instance
export const tavilyService = new TavilyService();
