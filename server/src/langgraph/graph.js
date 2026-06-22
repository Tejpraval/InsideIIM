import { StateGraph, START, END } from "@langchain/langgraph";
import { ResearchAgentState } from "./state.js";
import { ResearchNode } from "./nodes/ResearchNode.js";
import { AnalysisNode } from "./nodes/AnalysisNode.js";
import { ScoringNode } from "./nodes/ScoringNode.js";
import { DecisionNode } from "./nodes/DecisionNode.js";
import { ReportNode } from "./nodes/ReportNode.js";

/**
 * Assembles and compiles the LangGraph State Graph.
 * 
 * Explanations for interview:
 * 1. Why LangGraph: It allows us to build stateful multi-agent workflows as a cyclic or acyclic graph.
 * 2. Why node separation: Each node is responsible for a single logical task, following the Single Responsibility Principle.
 *    This makes testing, maintaining, and debugging extremely easy compared to a monolithic agent script.
 */

// Initialize the StateGraph with our predefined schema state
const workflow = new StateGraph(ResearchAgentState)
  // Add all processing nodes
  .addNode("ResearchNode", ResearchNode)
  .addNode("AnalysisNode", AnalysisNode)
  .addNode("ScoringNode", ScoringNode)
  .addNode("DecisionNode", DecisionNode)
  .addNode("ReportNode", ReportNode)

  // Define the workflow routing (START -> Research -> Analysis -> Scoring -> Decision -> Report -> END)
  .addEdge(START, "ResearchNode")
  .addEdge("ResearchNode", "AnalysisNode")
  .addEdge("AnalysisNode", "ScoringNode")
  .addEdge("ScoringNode", "DecisionNode")
  .addEdge("DecisionNode", "ReportNode")
  .addEdge("ReportNode", END);

// Compile the graph into a runnable instance
export const graph = workflow.compile();

/**
 * Utility function to obtain a Mermaid representation of the graph.
 * This can be loaded by the frontend or printed on the console to fulfill
 * the "graph visualization support" requirement.
 * @returns {string} Mermaid markdown syntax
 */
export function getMermaidDiagram() {
  try {
    return graph.getGraph().drawMermaid();
  } catch (error) {
    console.error("Failed to generate Mermaid diagram:", error.message);
    // Return hardcoded representation as fallback
    return `graph TD
  START --> ResearchNode
  ResearchNode --> AnalysisNode
  AnalysisNode --> ScoringNode
  ScoringNode --> DecisionNode
  DecisionNode --> ReportNode
  ReportNode --> END`;
  }
}
