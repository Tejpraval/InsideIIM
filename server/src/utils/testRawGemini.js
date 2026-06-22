import dotenv from "dotenv";
import { geminiModel } from "../config/gemini.js";
import { tavilyService } from "../services/tavilyService.js";

dotenv.config({ path: "./.env" });

async function runTests() {
  console.log("=== Fetching Raw Gemini Response ===");

  try {
    console.log("Researching Tesla to get context...");
    const research = await tavilyService.researchCompany("Tesla");
    
    const context = `
You are a Staff Investment Analyst. ground your analysis strictly on the facts and data provided below.
Output a valid JSON matching this schema:
{
  "strengths": ["string"],
  "weaknesses": ["string"],
  "opportunities": ["string"],
  "threats": ["string"],
  "marketPosition": "string",
  "growthPotential": "string",
  "confidenceScore": number
}

CRITICAL: Do not include unescaped newlines or unescaped double quotes inside the string values. Use single quotes for any nested quotes. Output ONLY the JSON block, enclosed in \`\`\`json and \`\`\` tags.

=== RESEARCH DATA ===
${JSON.stringify(research)}
`;

    console.log("Invoking model...");
    const response = await geminiModel.invoke([
      { role: "system", content: "You are an assistant that outputs JSON." },
      { role: "user", content: context }
    ]);
    
    console.log("\n--- RAW MODEL OUTPUT ---");
    console.log(response.content);
    console.log("------------------------");
    
    // Test parsing
    try {
      // Extract json block
      let text = response.content;
      const jsonStart = text.indexOf("```json");
      if (jsonStart !== -1) {
        text = text.substring(jsonStart + 7);
        const jsonEnd = text.indexOf("```");
        if (jsonEnd !== -1) {
          text = text.substring(0, jsonEnd);
        }
      }
      const parsed = JSON.parse(text.trim());
      console.log("\nParsed successfully!", parsed);
    } catch (parseError) {
      console.error("\nParse failed:", parseError.message);
    }

  } catch (error) {
    console.error("Invocation failed:", error);
  }
}

runTests();
