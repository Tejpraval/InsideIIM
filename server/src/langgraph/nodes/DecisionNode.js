/**
 * DecisionNode
 * 
 * Responsibilities:
 * - Perform two-stage investment evaluation: score-based (base) vs. risk-adjusted (final).
 * - Enforce a cascading downgrade rule if Risk Score < 8 (extremely high risk):
 *   - "INVEST" -> Downgraded to "WATCH"
 *   - "WATCH"  -> Downgraded to "PASS"
 *   - "PASS"   -> Remains "PASS"
 * - Output detailed audit fields: baseRecommendation, finalRecommendation, overrideTriggered, overrideReason.
 */
export async function DecisionNode(state) {
  const score = state.score;
  const analysis = state.analysis;

  if (!score || typeof score.total !== "number") {
    throw new Error("DecisionNode Error: Quantitative scorecard score is missing from state.");
  }

  const startTime = Date.now();
  console.log(`[DecisionNode] Evaluating investment decision for: "${state.company}"`);

  // Retrieve scores
  const totalScore = score.total;
  const riskScore = score.risk; // High score = low risk; low score = high risk

  // 1. Calculate Base (Score-based) Recommendation
  let baseRecommendation = "PASS";
  let baseRating = "Pass";
  const reasoning = [];

  if (totalScore >= 80) {
    baseRecommendation = "INVEST";
    baseRating = "Strong Invest";
    reasoning.push(`Score-based evaluation suggests INVEST (Strong Invest) with a score of ${totalScore}/100.`);
  } else if (totalScore >= 60) {
    baseRecommendation = "INVEST";
    baseRating = "Invest";
    reasoning.push(`Score-based evaluation suggests INVEST (Invest) with a score of ${totalScore}/100.`);
  } else if (totalScore >= 40) {
    baseRecommendation = "WATCH";
    baseRating = "Watch";
    reasoning.push(`Score-based evaluation suggests WATCH (Watch / Hold) with a score of ${totalScore}/100.`);
  } else {
    baseRecommendation = "PASS";
    baseRating = "Pass";
    reasoning.push(`Score-based evaluation suggests PASS with a low score of ${totalScore}/100.`);
  }

  // 2. Evaluate Risk Guardrail
  const RISK_THRESHOLD = 8;
  const overrideTriggered = riskScore < RISK_THRESHOLD;
  let overrideReason = "";
  let finalRecommendation = baseRecommendation;
  let finalRating = baseRating;

  if (overrideTriggered) {
    overrideReason = `Risk Score is ${riskScore}/25, which falls below the safe threshold of ${RISK_THRESHOLD}/25 (signaling severe weaknesses or external threats).`;
    reasoning.push(`CRITICAL GUARDRAIL TRIGGERED: ${overrideReason}`);
    
    // Apply cascading downgrade rule
    if (baseRecommendation === "INVEST") {
      finalRecommendation = "WATCH";
      finalRating = "WATCH (Risk Downgrade)";
      reasoning.push("Risk Downgrade: Recommendation adjusted from INVEST to WATCH due to extreme risk profile.");
    } else if (baseRecommendation === "WATCH") {
      finalRecommendation = "PASS";
      finalRating = "PASS (Risk Downgrade)";
      reasoning.push("Risk Downgrade: Recommendation adjusted from WATCH to PASS due to extreme risk profile.");
    } else {
      finalRecommendation = "PASS";
      finalRating = "Pass";
      reasoning.push("Risk Profile: Remained PASS as base score-based recommendation is already PASS.");
    }
  } else {
    reasoning.push(`Risk profile is within acceptable boundaries (Risk Score ${riskScore}/25 is above the safe threshold of ${RISK_THRESHOLD}/25).`);
  }

  // Formulate a concise summary
  let summary = "";
  if (finalRecommendation === "INVEST") {
    summary = `Recommend INVEST for ${state.company}. The scorecard (${totalScore}/100) and risk profile meet all target criteria.`;
  } else if (finalRecommendation === "WATCH") {
    if (overrideTriggered) {
      summary = `Recommend WATCH (Risk Downgrade) for ${state.company}. While overall indicators (${totalScore}/100) warrant investment, the high risk profile (Risk Score: ${riskScore}/25) triggers a downgrade to WATCH.`;
    } else {
      summary = `Recommend WATCH for ${state.company}. The overall scorecard (${totalScore}/100) indicates the company is a hold/watch candidate.`;
    }
  } else {
    if (overrideTriggered) {
      summary = `Recommend PASS (Risk Downgrade) for ${state.company}. Highly speculative indicators and severe risk scores (Risk Score: ${riskScore}/25) trigger a safety override to PASS.`;
    } else {
      summary = `Recommend PASS for ${state.company}. The overall scorecard (${totalScore}/100) does not meet target investment criteria.`;
    }
  }

  const confidence = analysis.confidenceScore || 0;

  console.log(`[DecisionNode] Base: ${baseRecommendation}, Final: ${finalRecommendation}, Override Triggered: ${overrideTriggered}`);

  const duration = Date.now() - startTime;
  return {
    decision: {
      baseRecommendation,
      finalRecommendation,
      rating: finalRating,
      confidence,
      summary,
      reasoning,
      overrideTriggered,
      overrideReason
    },
    metadata: {
      decisionDurationMs: duration
    }
  };
}
