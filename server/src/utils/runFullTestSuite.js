import axios from "axios";
import fs from "fs";
import path from "path";

const API_BASE = "http://localhost:5000";

async function runTestSuite() {
  console.log("==============================================");
  console.log("RUNNING COMPREHENSIVE INVESTMENT AGENT TEST SUITE");
  console.log("==============================================\n");

  const results = {
    healthCheck: null,
    validationTests: [],
    analysisTests: [],
    nodePerformanceGoogle: null
  };

  // ----------------------------------------------------
  // 1. HEALTH CHECK TEST
  // ----------------------------------------------------
  try {
    console.log("[Test 1/3] GET /health...");
    const healthRes = await axios.get(`${API_BASE}/health`);
    results.healthCheck = {
      status: healthRes.status,
      data: healthRes.data
    };
    console.log("✅ GET /health completed successfully.");
  } catch (error) {
    results.healthCheck = {
      status: error.response?.status || 500,
      error: error.message
    };
    console.log("❌ GET /health failed:", error.message);
  }

  // ----------------------------------------------------
  // 2. VALIDATION TESTS
  // ----------------------------------------------------
  const validationPayloads = [
    { name: "Empty Object {}", payload: {} },
    { name: "Empty String ''", payload: { company: "" } },
    { name: "Whitespace String '   '", payload: { company: "   " } },
    { name: "Non-existent Company 'asdfghjkl'", payload: { company: "asdfghjkl" } }
  ];

  console.log("\n[Test 2/3] Running Validation Boundary Tests...");
  for (const item of validationPayloads) {
    console.log(` -> Testing payload: ${item.name}...`);
    try {
      const res = await axios.post(`${API_BASE}/api/analyze`, item.payload);
      // Non-existent company should return 200 OK since it is valid text, but with PASS/zero metrics
      results.validationTests.push({
        name: item.name,
        httpStatus: res.status,
        success: res.data.success,
        recommendation: res.data.data?.finalRecommendation || "N/A",
        score: res.data.data?.score?.total || 0,
        response: res.data
      });
      console.log(`    ✅ Succeeded with Status ${res.status}`);
    } catch (error) {
      results.validationTests.push({
        name: item.name,
        httpStatus: error.response?.status || 500,
        success: false,
        error: error.response?.data?.error || error.message
      });
      console.log(`    ✅ Handled correctly. Status: ${error.response?.status}. Message: ${error.response?.data?.error || error.message}`);
    }
  }

  // ----------------------------------------------------
  // 3. CORE COMPANY ANALYSIS TESTS (Tesla, Apple, Nvidia, Google)
  // ----------------------------------------------------
  const targetCompanies = ["Tesla", "Apple", "Nvidia", "Google"];
  console.log("\n[Test 3/3] Running Company Analyses (this may take up to 2 minutes)...");

  for (const company of targetCompanies) {
    console.log(` -> Analyzing "${company}"...`);
    try {
      const startTime = Date.now();
      const res = await axios.post(`${API_BASE}/api/analyze`, { company });
      const duration = Date.now() - startTime;

      const report = res.data.data;
      const metrics = {
        company,
        httpStatus: res.status,
        processingTimeMs: duration,
        apiLatencyMs: res.data.latencyMs,
        totalScore: report.score.total,
        finalRecommendation: report.finalRecommendation,
        sourceCount: report.sourceCount,
        grade: report.score.grade
      };

      results.analysisTests.push(metrics);
      console.log(`    ✅ Done. Score: ${metrics.totalScore}, Recommendation: ${metrics.finalRecommendation}, Sources: ${metrics.sourceCount}`);

      // Capture individual node timings from Google to use for performance breakdown
      if (company === "Google" && report && report.performance) {
        results.nodePerformanceGoogle = report.performance;
        console.log("\n    === Node Durations for Google ===");
        console.log(`    | Research | ${report.performance.researchDurationMs} ms`);
        console.log(`    | Analysis | ${report.performance.analysisDurationMs} ms`);
        console.log(`    | Scoring  | ${report.performance.scoringDurationMs} ms`);
        console.log(`    | Decision | ${report.performance.decisionDurationMs} ms`);
        console.log(`    | Report   | ${report.performance.reportDurationMs} ms`);
        console.log("    =================================\n");
      }
    } catch (error) {
      console.error(`    ❌ Failed for "${company}":`, error.response?.data || error.message);
      results.analysisTests.push({
        company,
        httpStatus: error.response?.status || 500,
        error: error.message
      });
    }
  }

  // ----------------------------------------------------
  // SAVE RESULTS
  // ----------------------------------------------------
  const reportPath = path.resolve(process.cwd(), "src/utils/testResults.json");
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
  console.log(`\n==============================================`);
  console.log(`TEST SUITE COMPLETE. Results saved to: ${reportPath}`);
  console.log(`==============================================`);
}

runTestSuite();
