/**
 * ScoringNode
 * 
 * Responsibilities:
 * - Deterministically calculate financial sub-scores from qualitative classifications.
 * - Categorize: Growth (0-25), Risk (0-25), Market Position (0-25), Innovation (0-25).
 * - Risk Score is inverted: a high score (e.g. 22/25) means low risk (positive), while a low score (e.g. 8/25) means high risk (negative).
 * - Assign an Investment Grade: A+ (>=90), A (80-89), B (65-79), C (50-64), D (<50).
 * - Provide a transparent, rule-based reason for each sub-score to show interview explainability.
 */
export async function ScoringNode(state) {
  const analysis = state.analysis;
  
  if (!analysis) {
    throw new Error("ScoringNode Error: Qualitative analysis is missing from state.");
  }

  const startTime = Date.now();
  console.log("[ScoringNode] Calculating quantitative scorecard...");

  // ----------------------------------------------------
  // 1. GROWTH SCORE (0-25)
  // ----------------------------------------------------
  let growthScore = 10; // Base score
  let growthReason = "";
  
  const growthPot = (analysis.growthPotential || "").toLowerCase();
  if (growthPot.includes("high growth")) {
    growthScore = 20;
    growthReason = "High Growth potential classification";
  } else if (growthPot.includes("moderate growth") || growthPot.includes("steady growth")) {
    growthScore = 15;
    growthReason = "Moderate or steady growth potential classification";
  } else if (growthPot.includes("stagnant") || growthPot.includes("low growth")) {
    growthScore = 8;
    growthReason = "Stagnant or low growth potential classification";
  } else if (growthPot.includes("declining")) {
    growthScore = 3;
    growthReason = "Declining growth potential classification";
  } else {
    growthReason = "Standard growth potential classification";
  }

  // Adjust based on count of qualitative opportunities (+1.25 per opportunity, max +5)
  const oppCount = analysis.opportunities ? analysis.opportunities.length : 0;
  const growthAdjustment = Math.min(oppCount * 1.25, 5);
  growthScore += growthAdjustment;
  growthReason += ` augmented by ${oppCount} identified growth opportunities (+${growthAdjustment.toFixed(1)} pts).`;
  growthScore = Math.min(Math.max(growthScore, 0), 25);

  // ----------------------------------------------------
  // 2. RISK SCORE (0-25) -> Note: High score = Low risk
  // ----------------------------------------------------
  let riskScore = 25; // Start with perfect score (zero risk)
  let riskReason = "Base low-risk rating";

  // Subtract for weaknesses (-1.5 per weakness, max -10)
  const weakCount = analysis.weaknesses ? analysis.weaknesses.length : 0;
  const weakDeduction = Math.min(weakCount * 1.5, 10);
  riskScore -= weakDeduction;

  // Subtract for threats (-1.5 per threat, max -10)
  const threatCount = analysis.threats ? analysis.threats.length : 0;
  const threatDeduction = Math.min(threatCount * 1.5, 10);
  riskScore -= threatDeduction;

  // Deduction based on data confidence score
  const confidence = analysis.confidenceScore || 0;
  let confidenceDeduction = 0;
  if (confidence < 40) {
    confidenceDeduction = 5;
  } else if (confidence < 70) {
    confidenceDeduction = 2;
  }
  riskScore -= confidenceDeduction;

  riskReason = `Calculated from: ${weakCount} weaknesses (-${weakDeduction.toFixed(1)} pts), ${threatCount} threats (-${threatDeduction.toFixed(1)} pts), and research confidence deduction of -${confidenceDeduction} pts (High score means low risk).`;
  riskScore = Math.min(Math.max(riskScore, 0), 25);

  // ----------------------------------------------------
  // 3. MARKET POSITION SCORE (0-25)
  // ----------------------------------------------------
  let marketScore = 12; // Base score
  let marketReason = "";

  const marketPos = (analysis.marketPosition || "").toLowerCase();
  if (marketPos.includes("leader") || marketPos.includes("dominant")) {
    marketScore = 20;
    marketReason = "Dominant market leader classification";
  } else if (marketPos.includes("challenger") || marketPos.includes("strong")) {
    marketScore = 15;
    marketReason = "Strong market challenger classification";
  } else if (marketPos.includes("niche")) {
    marketScore = 10;
    marketReason = "Niche competitor classification";
  } else if (marketPos.includes("weak") || marketPos.includes("struggling")) {
    marketScore = 5;
    marketReason = "Weak or struggling market competitor classification";
  } else {
    marketReason = "Standard market position classification";
  }

  // Adjust based on count of qualitative strengths (+1.0 per strength, max +5)
  const strengthCount = analysis.strengths ? analysis.strengths.length : 0;
  const marketAdjustment = Math.min(strengthCount * 1.0, 5);
  marketScore += marketAdjustment;
  marketReason += ` supported by ${strengthCount} core strengths (+${marketAdjustment.toFixed(1)} pts).`;
  marketScore = Math.min(Math.max(marketScore, 0), 25);

  // ----------------------------------------------------
  // 4. INNOVATION SCORE (0-25)
  // ----------------------------------------------------
  let innovationScore = 10; // Base score
  let innovationReason = "Base innovation capacity";

  const innovationKeywords = [
    "innovat", "ai", "robot", "software", "technology", "battery", 
    "pioneer", "r&d", "autonomous", "patent", "tech", "proprietary",
    "chip", "hardware", "automated", "digit"
  ];

  // Scan strengths and opportunities for innovation keywords
  let keywordMatches = 0;
  const textToScan = [
    ...(analysis.strengths || []),
    ...(analysis.opportunities || [])
  ].map(t => t.toLowerCase());

  textToScan.forEach(text => {
    innovationKeywords.forEach(kw => {
      if (text.includes(kw)) keywordMatches++;
    });
  });

  // Scale score based on keyword counts (+1.5 per keyword match, max +15)
  const innovationAdjustment = Math.min(keywordMatches * 1.5, 15);
  innovationScore += innovationAdjustment;
  innovationReason = `Calculated from ${keywordMatches} innovation keyword markers found in SWOT strengths and opportunities (+${innovationAdjustment.toFixed(1)} pts).`;
  innovationScore = Math.min(Math.max(innovationScore, 0), 25);

  // ----------------------------------------------------
  // TOTAL & GRADE CALCULATION (0-100)
  // ----------------------------------------------------
  // Convert scores to integers for clean display
  const finalGrowth = Math.round(growthScore);
  const finalRisk = Math.round(riskScore);
  const finalMarket = Math.round(marketScore);
  const finalInnovation = Math.round(innovationScore);
  const totalScore = finalGrowth + finalRisk + finalMarket + finalInnovation;

  let grade = "D";
  if (totalScore >= 90) {
    grade = "A+";
  } else if (totalScore >= 80) {
    grade = "A";
  } else if (totalScore >= 65) {
    grade = "B";
  } else if (totalScore >= 50) {
    grade = "C";
  }

  console.log(`[ScoringNode] Scorecard finalized. Total: ${totalScore}/100, Grade: ${grade}`);

  const duration = Date.now() - startTime;
  return {
    score: {
      growth: finalGrowth,
      risk: finalRisk,
      market: finalMarket,
      innovation: finalInnovation,
      total: totalScore,
      grade: grade,
      breakdown: {
        growthReason,
        riskReason,
        marketReason,
        innovationReason
      }
    },
    metadata: {
      scoringDurationMs: duration
    }
  };
}
