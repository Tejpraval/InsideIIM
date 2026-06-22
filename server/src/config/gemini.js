import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import dotenv from "dotenv";

dotenv.config();

// Ensure the Gemini API key is mapped to the standard env variable used by the SDK
const apiKey = process.env.Google_GeminiAPI_KEY || process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn("WARNING: Google_GeminiAPI_KEY is not defined in environment variables.");
} else {
  // Map key to GOOGLE_API_KEY as expected by the Google GenAI SDK
  process.env.GOOGLE_API_KEY = apiKey;
}

/**
 * ChatGoogleGenerativeAI instance configured for the research agent.
 * We use the 'gemini-2.5-flash' model for fast response times, large context window, 
 * and excellent JSON/Structured Output support.
 */
export const geminiModel = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash",
  temperature: 0.2, // Low temperature for deterministic financial/investment analysis
  apiKey: apiKey,
});
