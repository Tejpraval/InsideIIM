import { z } from "zod";
import { geminiModel } from "../../config/gemini.js";

// Define the strict Zod schema for structured output validation
const analysisSchema = z.object({
  strengths: z.array(z.string()).describe("Top 3 to 6 qualitative strengths of the company derived strictly from research."),
  weaknesses: z.array(z.string()).describe("Top 3 to 6 qualitative weaknesses or operational challenges derived strictly from research."),
  opportunities: z.array(z.string()).describe("Top 3 to 6 future growth opportunities derived strictly from research."),
  threats: z.array(z.string()).describe("Top 3 to 6 external threats, competitors, or industry headwinds derived strictly from research."),
  marketPosition: z.string().describe("Market position classification (e.g., 'Market Leader', 'Dominant Player', 'Strong Challenger', 'Niche Player')."),
  growthPotential: z.string().describe("Evaluation of growth potential (e.g., 'High Growth', 'Moderate Growth', 'Stagnant') with a brief 1-sentence rationale."),
  confidenceScore: z.number().min(0).max(100).describe("Confidence score (0-100) based on availability, consistency, and depth of the search data.")
});

/**
 * AnalysisNode
 * 
 * Responsibilities:
 * - Format search findings into readable sections.
 * - Call Google Gemini using structured output to ensure strict JSON adherence.
 * - Perform grounded qualitative SWOT, market positioning, and growth evaluation.
 * - Inject a confidence score for research depth.
 */
export async function AnalysisNode(state) {
  const company = state.company;
  const research = state.research;

  if (!research || !research.overview) {
    throw new Error("AnalysisNode Error: Missing research data in graph state.");
  }

  console.log(`[AnalysisNode] Beginning qualitative LLM analysis for: "${company}"`);

  // Format the Tavily search data into structured context blocks for the LLM
  const formatList = (items) => {
    if (!items || items.length === 0) return "No information found.";
    return items.map((item, idx) => `[Result #${idx + 1}]\nTitle: ${item.title}\nSource: ${item.url}\nContent: ${item.content}`).join("\n\n");
  };

  const context = `
You are a Staff Investment Analyst at a premium research firm.
Your job is to analyze the following research data gathered for "${company}" and output a strict qualitative analysis.

CRITICAL INSTRUCTIONS:
1. Ground your analysis STRICTLY on the facts and data provided below. Do not make unsupported assumptions, do not hallucinate facts, and do not reference external information not present.
2. If certain information is missing, evaluate it conservatively and reflect it in the confidence score.
3. SWOT items must be concrete, specific, and actionable bullet points.

=== RESEARCH DATA FOR ${company.toUpperCase()} ===

--- SECTION 1: COMPANY OVERVIEW & HISTORY ---
${formatList(research.overview)}

--- SECTION 2: COMPETITIVE LANDSCAPE & MARKET SHARE ---
${formatList(research.competitors)}

--- SECTION 3: RECENT PRESS & NEWS ---
${formatList(research.recentNews)}

--- SECTION 4: GROWTH OPPORTUNITIES ---
${formatList(research.opportunities)}

--- SECTION 5: OPERATIONAL & INVESTMENT RISKS ---
${formatList(research.risks)}
`;

  try {
    // Bind structured output schema to the Gemini Model
    const structuredLlm = geminiModel.withStructuredOutput(analysisSchema);

    // Call the model
    const response = await structuredLlm.invoke([
      {
        role: "system",
        content: "You are a professional investment research assistant. You MUST output your analysis in strict JSON matching the schema. CRITICAL: Ensure all text string values are clean, contain no raw newlines, and contain NO unescaped double quotes. Use single quotes instead of double quotes for internal punctuation (e.g. use 'Tesla' instead of \"Tesla\").",
      },
      {
        role: "user",
        content: context,
      },
    ]);

    console.log(`[AnalysisNode] Completed qualitative analysis. Confidence Score: ${response.confidenceScore}/100`);

    return {
      analysis: {
        strengths: response.strengths,
        weaknesses: response.weaknesses,
        opportunities: response.opportunities,
        threats: response.threats,
        marketPosition: response.marketPosition,
        growthPotential: response.growthPotential,
        confidenceScore: response.confidenceScore,
      }
    };
  } catch (error) {
    console.error("[AnalysisNode] LLM invocation failed:", error);
    // Graceful fallback to prevent total execution failure
    return {
      analysis: {
        strengths: ["Unable to analyze strengths due to API timeout/failure."],
        weaknesses: ["Unable to analyze weaknesses due to API timeout/failure."],
        opportunities: ["Unable to analyze opportunities due to API timeout/failure."],
        threats: ["Unable to analyze threats due to API timeout/failure."],
        marketPosition: "Unknown",
        growthPotential: "Unknown",
        confidenceScore: 0,
        error: error.message
      }
    };
  }
}
