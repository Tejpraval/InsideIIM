import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { tavilyService } from "../services/tavilyService.js";

// Try resolving absolute path
const envPath = path.resolve(process.cwd(), ".env");
console.log("Current working directory:", process.cwd());
console.log("Looking for .env file at:", envPath);
console.log("Does .env file exist?", fs.existsSync(envPath));

const result = dotenv.config({ path: envPath });
if (result.error) {
  console.error("Dotenv config error:", result.error);
}

// Log keys (safely masked)
const tKey = process.env.TAVILY_API_KEY;
console.log("TAVILY_API_KEY loaded:", tKey ? `${tKey.substring(0, 10)}...` : "UNDEFINED");
console.log("Google_GeminiAPI_KEY loaded:", process.env.Google_GeminiAPI_KEY ? `${process.env.Google_GeminiAPI_KEY.substring(0, 10)}...` : "UNDEFINED");

async function runTest() {
  try {
    const results = await tavilyService.researchCompany("Apple");
    console.log("\n--- TEST SUCCESSFUL ---");
    console.log(`Overview results found: ${results.overview.length}`);
  } catch (error) {
    console.error("\n--- TEST FAILED ---");
    console.error(error);
  }
}

runTest();
