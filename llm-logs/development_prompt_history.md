# LLM Chat Logs & Prompt Engineering History

This folder contains a summary of the LLM-assisted development process, key prompts, and architectural refinement notes used to build the AI Investment Research Agent.

## 1. Initial Prompt: Graph Architecture & Setup
**Prompt:**
> "I need to build an AI Investment Research Agent for an internship take-home assignment. It needs to query Tavily search, run qualitative analysis, score companies out of 100, make an investment decision (INVEST/WATCH/PASS), and compile references. I want to build it using Node.js, Express, React, and LangGraph.js. Please help me architect a stateful graph where each step is a separate node."

**Refinement:**
- The graph was structured as: `START -> ResearchNode -> AnalysisNode -> ScoringNode -> DecisionNode -> ReportNode -> END`.
- Designed a custom state schema (`ResearchAgentState`) to hold state data blackboards across node transitions.

## 2. Prompt: Quantitative Scorecard & Guardrail Logic
**Prompt:**
> "Write the logic for a scoring node and decision node. I want to score Growth, Risk, Market, and Innovation out of 100 using rules-based checks. If the risk is too high (risk score < 8/25), I want to downgrade the final decision to WATCH, even if the base score is high. Provide clean JS code."

**Refinement:**
- Implemented a regex/keyword search on SWOT bullet points to count positive/negative sentiment indicators and dynamically adjust the score.
- Added a strict safety override inside `DecisionNode` to downgrade the final decision based on risk thresholds.

## 3. Prompt: Rate Limit and Error Resilience Debugging
**Prompt:**
> "My Gemini API keys are hitting 429 rate limits and 503 service unavailable errors on the free tier. This is causing the Express server to hang because LangChain retries indefinitely. How do I make the app fail fast and return fallback data?"

**Refinement:**
- Configured `maxRetries: 1` on the `ChatGoogleGenerativeAI` and `ChatOpenAI` constructors.
- Added robust `try-catch` blocks inside `AnalysisNode.js` and `ReportNode.js` to return pre-formatted fallback templates.
- Added support for OpenRouter keys (`sk-or-`) and set `maxTokens: 2000` to bypass free-tier token size blocks.
