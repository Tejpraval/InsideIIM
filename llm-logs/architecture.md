# LLM Development Log: System Architecture & Workflow Design

This document details the prompts, AI recommendations, and architectural decisions made when designing the stateful orchestrator for the AI Investment Research Agent.

---

## 1. Initial Prompt: Architecting the Multi-Agent Pipeline
**Prompt:**
> "I need to build an AI Investment Research Agent for an internship take-home assignment. It needs to research a company on the web, compile SWOT analysis arrays, score its financial metrics out of 100, make a final investment recommendation (INVEST, WATCH, or PASS), and catalog deduplicated references.
> 
> Can I just do this with a single prompt to GPT-4 or Gemini, or should I structure it? I want to use Node.js, Express, React, and LangGraph.js. How should I architect the state and workflow?"

### AI Recommendations Received:
1. **Avoid Single-Prompt Monoliths**: A single prompt trying to research, evaluate, score, and summarize a company suffers from hallucination drift and cannot perform deterministic operations like mathematical scorecard indexing.
2. **Use LangGraph.js for State Orchestration**: Model the workspace as a stateful graph where each node represents a single, focused processing step (Research ➔ Analysis ➔ Scoring ➔ Decision ➔ Report).
3. **Structured Shared State**: Use a shared "blackboard" state pattern (`ResearchAgentState`) to carry inputs and outputs across nodes, ensuring clean data isolation.
4. **Parallel Retrieval**: Run web queries in parallel in the first node to fetch comprehensive data without sequential HTTP latency.

### Decisions Taken & Trade-offs:
* **Decision**: Adopted a 5-node acyclic LangGraph.js setup.
* **Trade-off**: Slightly higher development overhead in managing state classes and nodes compared to a single chain, but provides absolute auditability. Each node's inputs and outputs are isolated, making debugging simple.

---

## 2. Prompt: State Annotations and Schema Design
**Prompt:**
> "How do I define the LangGraph state schema in Javascript? I want to make sure each node has access to the search results, the qualitative analysis outputs, the scorecard metrics, the final recommendation, and compilation metadata."

### AI Recommendations Received:
Define the state schema as a JS object mapping to LangGraph properties. Ensure every field is cleanly initialized to avoid undefined errors during node updates:
* `company`: input string
* `research`: search lists object
* `analysis`: SWOT and qualitative object
* `score`: quantitative scorecard metrics
* `decision`: final recommendation strings
* `report`: formatted final JSON output
* `metadata`: execution durations and source tallies

### Decisions Taken:
* Created `state.js` exposing `ResearchAgentState`. Kept it simple and flat to facilitate Zod schema validation and REST transmission.

---

## 3. Prompt: Choosing Tavily Over Custom Scrapers
**Prompt:**
> "Should I write a custom web crawler using Puppeteer/JSDOM to search Google and fetch page contents, or use the Tavily Search API for the ResearchNode?"

### AI Recommendations Received:
* **Custom Scraper**: High maintenance, frequently blocked by CAPTCHAs, requires heavy resource parsing to extract clean text.
* **Tavily Search API**: Custom-built for AI agents. It searches the web, filters out search ads/garbage, extracts raw text snippets relevant to the query, and formats the output into clean JSON arrays containing `title`, `url`, and `content`.
* **Parallel Queries**: Execute 5 distinct facet queries (Overview, Competitors, News, Opportunities, Risks) in parallel using `Promise.all` to keep latency low.

### Decisions Taken:
* Selected **Tavily** for web retrieval. Enforced raw HTTP POST calls using Axios to avoid SDK overhead and maintain transparent control over timeouts.

---

## 4. Final Architecture Outcome
The final system is organized around a compile LangGraph workflow:
* **START** ➔ `ResearchNode` ➔ `AnalysisNode` ➔ `ScoringNode` ➔ `DecisionNode` ➔ `ReportNode` ➔ **END**
* Results in a completely explainable graph execution audit log returned to the client.
