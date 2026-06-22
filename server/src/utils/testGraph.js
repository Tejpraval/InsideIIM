import dotenv from "dotenv";
import { graph, getMermaidDiagram } from "../langgraph/graph.js";

dotenv.config();

async function verifyGraphCompilation() {
  console.log("=== LangGraph Verification ===");
  
  // 1. Get Mermaid Diagram
  console.log("\nGenerating Graph Visualization (Mermaid):");
  const diagram = getMermaidDiagram();
  console.log("-----------------------------------------");
  console.log(diagram);
  console.log("-----------------------------------------");

  // 2. Invoke Graph (using current stub nodes to verify connectivity)
  console.log("\nInvoking compiled graph with stubs for 'Tesla'...");
  try {
    const initialState = { company: "Tesla" };
    const finalState = await graph.invoke(initialState);
    
    console.log("\nFinal state returned successfully!");
    console.log("\n--- METADATA ---");
    console.log(JSON.stringify(finalState.metadata, null, 2));
    console.log("\n--- QUALITATIVE ANALYSIS FROM GEMINI ---");
    console.log(JSON.stringify(finalState.analysis, null, 2));
    console.log("\n--- REPORT OVERVIEW ---");
    console.log({
      company: finalState.report.company,
      summary: finalState.report.summary,
      recommendation: finalState.report.recommendation,
      score: finalState.report.score,
      overviewLength: finalState.report.overview ? "Exists" : "Empty",
      strengthsCount: finalState.report.strengths?.length,
      weaknessesCount: finalState.report.weaknesses?.length,
      competitorsCount: finalState.report.competitors?.length,
      newsCount: finalState.report.recentNews?.length
    });
  } catch (error) {
    console.error("Compilation / invocation failed:", error);
  }
}

verifyGraphCompilation();
