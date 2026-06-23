import axios from "axios";

// Create Axios client with default configurations
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
  timeout: 90000, // LangGraph execution can take up to 35-60s during deeper runs under free-tier rates
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Service to request investment research on a company.
 * @param {string} companyName - Target company name.
 * @returns {Promise<Object>} The API response payload.
 */
export async function analyzeCompany(companyName) {
  const response = await apiClient.post("/api/analyze", {
    company: companyName,
  });
  return response.data;
}

/**
 * Service to query health check diagnostics.
 * @returns {Promise<Object>}
 */
export async function checkServerHealth() {
  const response = await apiClient.get("/health");
  return response.data;
}
