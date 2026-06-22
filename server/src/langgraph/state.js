import { Annotation } from "@langchain/langgraph";

/**
 * Defines the state schema for our Investment Research Agent using LangGraph's Annotation API.
 * This represents the "blackboard" that is updated by each isolated node in sequence.
 * 
 * Explanations for interview:
 * 1. Simple state object where keys map to the output of their respective nodes.
 * 2. Standard state flow allows each node to read previous states and append its new findings.
 */
export const ResearchAgentState = Annotation.Root({
  // The company name entered by the user
  company: Annotation({
    reducer: (x, y) => y ?? x,
    default: () => "",
  }),
  
  // Research output from ResearchNode (Tavily search results)
  research: Annotation({
    reducer: (x, y) => ({ ...x, ...y }),
    default: () => ({}),
  }),
  
  // Qualitative analysis from AnalysisNode (SWOT, market position)
  analysis: Annotation({
    reducer: (x, y) => ({ ...x, ...y }),
    default: () => ({}),
  }),
  
  // Quantitative scorecard from ScoringNode (Growth, Risk, Market, Innovation)
  score: Annotation({
    reducer: (x, y) => ({ ...x, ...y }),
    default: () => ({}),
  }),
  
  // Recommendation decision and justification from DecisionNode
  decision: Annotation({
    reducer: (x, y) => ({ ...x, ...y }),
    default: () => ({}),
  }),
  
  // Final formatted output report for the frontend client from ReportNode
  report: Annotation({
    reducer: (x, y) => ({ ...x, ...y }),
    default: () => ({}),
  }),

  // Metadata tracker (e.g. source counts, query times, tokens)
  metadata: Annotation({
    reducer: (x, y) => ({ ...x, ...y }),
    default: () => ({}),
  }),
});
