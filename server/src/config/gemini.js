import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatOpenAI } from "@langchain/openai";
import dotenv from "dotenv";

dotenv.config();

// Ensure the API key is mapped to the standard env variable and trimmed of whitespace
const rawKey = process.env.OPENROUTER_API_KEY || process.env.Google_GeminiAPI_KEY || process.env.GEMINI_API_KEY || "";
const apiKey = rawKey.trim();

if (!apiKey) {
  console.warn("WARNING: Google_GeminiAPI_KEY or OPENROUTER_API_KEY is not defined in environment variables.");
} else {
  // Map key to GOOGLE_API_KEY as expected by the Google GenAI SDK
  process.env.GOOGLE_API_KEY = apiKey;
}

const isOpenRouter = apiKey.startsWith("sk-or-");

let geminiModel;

if (isOpenRouter) {
  // Map standard model names to OpenRouter equivalents if necessary
  let modelName = process.env.GEMINI_MODEL || "google/gemini-2.5-flash";
  if (!modelName.includes("/")) {
    if (modelName.includes("2.0-flash-lite")) {
      modelName = "google/gemini-2.0-flash-lite:free";
    } else if (modelName.includes("2.5-flash")) {
      modelName = "google/gemini-2.5-flash";
    } else if (modelName.includes("2.5-pro")) {
      modelName = "google/gemini-2.5-pro";
    } else if (modelName.includes("2.0-flash")) {
      modelName = "google/gemini-2.0-flash";
    } else {
      modelName = `google/${modelName}`;
    }
  }

  console.log(`[LLM] Initializing OpenRouter connection using model: "${modelName}"`);
  geminiModel = new ChatOpenAI({
    model: modelName,
    apiKey: apiKey,
    configuration: {
      baseURL: "https://openrouter.ai/api/v1",
      defaultHeaders: {
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "AI Investment Research Agent",
      }
    },
    temperature: 0.2,
    maxRetries: 1,
    maxTokens: 2000, // Restrict output size so it executes successfully on unfunded free OpenRouter accounts
  });
} else {
  // Default to native Google Gemini SDK
  const modelName = process.env.GEMINI_MODEL || "gemini-2.5-flash";
  console.log(`[LLM] Initializing Native Google Gemini connection using model: "${modelName}"`);
  geminiModel = new ChatGoogleGenerativeAI({
    model: modelName,
    temperature: 0.2,
    apiKey: apiKey,
    maxRetries: 1,
  });
}

export { geminiModel };
