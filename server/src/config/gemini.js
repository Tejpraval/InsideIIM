import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import dotenv from "dotenv";

dotenv.config();

// Ensure the Gemini API key is mapped to the standard env variable and trimmed of whitespace
const rawKey = process.env.Google_GeminiAPI_KEY || process.env.GEMINI_API_KEY || "";
const apiKey = rawKey.trim();

if (!apiKey) {
  console.warn("WARNING: Google_GeminiAPI_KEY is not defined in environment variables.");
} else {
  // Map key to GOOGLE_API_KEY as expected by the Google GenAI SDK
  process.env.GOOGLE_API_KEY = apiKey;
}

// Allow model override from .env, defaulting to gemini-2.5-pro
const modelName = process.env.GEMINI_MODEL || "gemini-2.5-pro";

/**
 * ChatGoogleGenerativeAI instance configured for the research agent.
 * We use the model configured in .env (or 'gemini-2.5-flash' by default) for fast response times,
 * large context window, and excellent JSON/Structured Output support.
 */
export const geminiModel = new ChatGoogleGenerativeAI({
  model: modelName,
  temperature: 0.2, // Low temperature for deterministic financial/investment analysis
  apiKey: apiKey,
  maxRetries: 1, // Fail fast on rate limits (429) to trigger graceful fallbacks rather than hanging
});
