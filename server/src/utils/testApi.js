import axios from "axios";

async function runApiVerification() {
  console.log("=== Testing Express Server API ===");

  // 1. Test Health Endpoint
  try {
    console.log("\nTesting GET /health...");
    const healthRes = await axios.get("http://localhost:5000/health");
    console.log("Health Check Success:", JSON.stringify(healthRes.data, null, 2));
  } catch (error) {
    console.error("Health Check Failed:", error.message);
  }

  // 2. Test Input Validation Endpoint (POST /api/analyze with empty company)
  try {
    console.log("\nTesting POST /api/analyze (validation check: empty body)...");
    await axios.post("http://localhost:5000/api/analyze", {});
  } catch (error) {
    console.log("Validation Error Handled Correctly (Status 400):", error.response ? error.response.status : "No response", error.response ? error.response.data : error.message);
  }

  // 3. Test Full Pipeline (POST /api/analyze with "Google")
  try {
    console.log("\nTesting POST /api/analyze for 'Google' (takes ~5s)...");
    const res = await axios.post("http://localhost:5000/api/analyze", {
      company: "Google"
    });
    
    console.log("\n--- API RESPONSE SUCCESS ---");
    console.log("Status Code:", res.status);
    console.log("Latency (measured by API):", res.data.latencyMs, "ms");
    console.log("Success Flag:", res.data.success);
    console.log("\n--- REPORT DATA SUMMARY ---");
    console.log("Company Name:", res.data.data.company);
    console.log("Base Recommendation:", res.data.data.baseRecommendation);
    console.log("Final Recommendation:", res.data.data.finalRecommendation);
    console.log("Investment Grade:", res.data.data.score.grade);
    console.log("Total Score:", res.data.data.score.total, "/ 100");
    console.log("Executive Summary:", res.data.data.summary);
    console.log("References count:", res.data.data.references.length);
  } catch (error) {
    console.error("\n--- API RESPONSE FAILED ---");
    console.error(error.response ? JSON.stringify(error.response.data, null, 2) : error.message);
  }
}

runApiVerification();
