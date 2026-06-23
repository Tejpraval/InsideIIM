import { z } from "zod";
import { geminiModel } from "../../config/gemini.js";

// Zod schema for structured summary output
const summarySchema = z.object({
  summary: z.string().describe("A professional, 3-sentence investment executive summary highlighting the final investment thesis, grade, and key constraints."),
  overview: z.string().describe("A concise, 2-sentence description of the company's core business model and products.")
});

/**
 * ReportNode
 * 
 * Responsibilities:
 * - Aggregate findings from all previous steps (Research, Analysis, Scoring, Decision).
 * - Invoke Google Gemini using structured output to generate a professional investment summary and company overview.
 * - Compile a clean references index (deduplicated URLs and titles of Tavily sources).
 * - Return a complete, polished, frontend-ready JSON report.
 */
export async function ReportNode(state) {
  const company = state.company;
  const analysis = state.analysis;
  const score = state.score;
  const decision = state.decision;
  const research = state.research;

  if (!analysis || !score || !decision) {
    throw new Error("ReportNode Error: Required state variables (analysis, score, or decision) are missing.");
  }

  const startTime = Date.now();
  console.log(`[ReportNode] Generating final executive summary and report structure for: "${company}"`);

  // Context for Gemini to synthesize summary and overview
  const context = `
You are a Lead Investment Editor formatting a research report for "${company}".
We have performed research, calculated a scorecard, and reached an investment decision:

Investment Grade: ${score.grade}
Total Score: ${score.total}/100
Base Recommendation: ${decision.baseRecommendation}
Final Recommendation: ${decision.finalRecommendation}
Decision Summary: ${decision.summary}

SWOT ANALYSIS:
- Strengths: ${analysis.strengths ? analysis.strengths.join("; ") : "N/A"}
- Weaknesses: ${analysis.weaknesses ? analysis.weaknesses.join("; ") : "N/A"}
- Opportunities: ${analysis.opportunities ? analysis.opportunities.join("; ") : "N/A"}
- Threats: ${analysis.threats ? analysis.threats.join("; ") : "N/A"}
`;

  let synthesized = {
    summary: `Investment review for ${company}. Score: ${score.total}/100. Grade: ${score.grade}. Decision: ${decision.finalRecommendation}.`,
    overview: `${company} is a global company operating in the technology and commercial sectors.`
  };

  try {
    const structuredLlm = geminiModel.withStructuredOutput(summarySchema);
    const response = await structuredLlm.invoke([
      {
        role: "system",
        content: "You are a professional investment editor. Synthesize brief summaries and overviews based strictly on the provided research summaries. Keep sentences clear, formal, and objective.",
      },
      {
        role: "user",
        content: context,
      },
    ]);
    
    synthesized = response;
  } catch (error) {
    console.error("[ReportNode] Gemini summary synthesis failed, falling back to template:", error.message);
  }

  // 3. Compile references with URLs and titles (Deduplicated)
  const referencesMap = new Map();
  const categories = ["overview", "competitors", "recentNews", "opportunities", "risks"];
  
  categories.forEach(cat => {
    const items = research[cat] || [];
    items.forEach(item => {
      if (item.url && item.title) {
        referencesMap.set(item.url, {
          title: item.title,
          url: item.url
        });
      }
    });
  });

  const referencesList = Array.from(referencesMap.values());

  // Compile simplified list of competitors, recent news, and risks for frontend rendering
  const competitors = (research.competitors || []).map(c => ({ title: c.title, url: c.url, snippet: c.content }));
  const recentNews = (research.recentNews || []).map(n => ({ title: n.title, url: n.url, snippet: n.content }));
  const risks = (research.risks || []).map(r => ({ title: r.title, url: r.url, snippet: r.content }));

  console.log(`[ReportNode] Final report compiled successfully. Source references cataloged: ${referencesList.length}`);

  const duration = Date.now() - startTime;

  return {
    report: {
      company: company,
      summary: synthesized.summary,
      overview: synthesized.overview,
      
      // Qualitative Analysis lists
      strengths: analysis.strengths || [],
      weaknesses: analysis.weaknesses || [],
      opportunities: analysis.opportunities || [],
      threats: analysis.threats || [],
      marketPosition: analysis.marketPosition || "Unknown",
      growthPotential: analysis.growthPotential || "Unknown",
      confidenceScore: analysis.confidenceScore || 0,
      
      // Flat details of research categories for frontend components
      competitors,
      recentNews,
      risks,
      
      // Scorecard metrics
      score: {
        growth: score.growth,
        risk: score.risk,
        market: score.market,
        innovation: score.innovation,
        total: score.total,
        grade: score.grade,
        breakdown: score.breakdown
      },
      
      // Decision properties
      baseRecommendation: decision.baseRecommendation,
      finalRecommendation: decision.finalRecommendation,
      recommendation: decision.finalRecommendation, // matches original "INVEST/PASS" requirement
      overrideTriggered: decision.overrideTriggered,
      overrideReason: decision.overrideReason,
      reasoning: decision.reasoning,
      
      // Audit references
      references: referencesList,
      sourceCount: state.metadata?.sourceCount || referencesList.length,
      timestamp: new Date().toISOString(),
      
      // Performance timing metrics for every node
      performance: {
        researchDurationMs: state.metadata?.researchDurationMs || 0,
        analysisDurationMs: state.metadata?.analysisDurationMs || 0,
        scoringDurationMs: state.metadata?.scoringDurationMs || 0,
        decisionDurationMs: state.metadata?.decisionDurationMs || 0,
        reportDurationMs: duration
      }
    },
    metadata: {
      reportDurationMs: duration
    }
  };
}
