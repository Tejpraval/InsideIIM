import dotenv from "dotenv";
import { z } from "zod";
import { geminiModel } from "../config/gemini.js";
import { tavilyService } from "../services/tavilyService.js";

dotenv.config({ path: "./.env" });

const testSchema = z.object({
  strengths: z.array(z.string()).describe("Top strengths"),
  weaknesses: z.array(z.string()).describe("Top weaknesses"),
  opportunities: z.array(z.string()).describe("Top opportunities"),
  threats: z.array(z.string()).describe("Top threats"),
  marketPosition: z.string().describe("Market position"),
  growthPotential: z.string().describe("Growth potential"),
  confidenceScore: z.number().describe("Confidence score"),
});

async function runTests() {
  console.log("=== Testing Gemini with jsonSchema Method ===");

  try {
    console.log("\nResearching Tesla to get full context...");
    const research = await tavilyService.researchCompany("Tesla");
    
    const context = `
You are a Staff Investment Analyst. Ground analysis strictly on facts.
${JSON.stringify(research, null, 2)}
`;

    console.log("\nInvoking with method: 'jsonSchema'...");
    const structuredLlmJsonSchema = geminiModel.withStructuredOutput(testSchema, { method: "jsonSchema" });
    const result = await structuredLlmJsonSchema.invoke([
      { role: "system", content: "You are an assistant. Output JSON matching the schema." },
      { role: "user", content: context }
    ]);
    console.log("jsonSchema Method Success:", result);
  } catch (error) {
    console.error("jsonSchema Method Failed:", error);
  }
}

runTests();
