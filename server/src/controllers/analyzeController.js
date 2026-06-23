import { graph } from "../langgraph/graph.js";

/**
 * Controller to handle investment research requests.
 * 
 * Explanations for interview:
 * 1. Centralized Input Validation: Ensures company name is provided, is a valid string, and prevents empty queries.
 * 2. Timing Metrics: Captures overall execution time to measure API latency.
 * 3. Clean JSON Output: Returns standard success envelopes `{ success: true, data: ..., latencyMs: ... }`.
 */
export async function analyzeCompany(req, res, next) {
  const { company } = req.body;
  const startTime = Date.now();

  // 1. Validation
  if (!company || typeof company !== "string" || company.trim().length === 0) {
    return res.status(400).json({
      success: false,
      error: "Validation Error: 'company' field is required and must be a non-empty string."
    });
  }

  const sanitizedCompany = company.trim();
  console.log(`[API] Received request to analyze: "${sanitizedCompany}"`);

  try {
    // 2. Invoke the compiled LangGraph workflow
    const finalState = await graph.invoke({
      company: sanitizedCompany
    });

    // Verify that the report was generated successfully
    if (!finalState.report || !finalState.report.company) {
      throw new Error("Workflow failed to assemble final report output.");
    }

    const latencyMs = Date.now() - startTime;
    console.log(`[API] Analysis completed for "${sanitizedCompany}" in ${latencyMs}ms`);

    // 3. Return clean JSON response
    return res.status(200).json({
      success: true,
      latencyMs,
      data: finalState.report
    });

  } catch (error) {
    console.error(`[API] Error during analysis of "${sanitizedCompany}":`, error);
    // Forward to centralized Express error handler
    next(error);
  }
}
