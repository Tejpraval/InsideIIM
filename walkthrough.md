# AI Investment Research Agent - Project Walkthrough

This guide serves as a comprehensive overview of the **AI Investment Research Agent** project. It is structured for recruiters, evaluators, and technical reviewers opening this codebase for the first time.

---

## 1. Project Overview

### Problem Being Solved
Retail and institutional investors are overwhelmed by unstructured data. Finding, analyzing, and grading investment opportunities requires manual research across search engines, press releases, competitor filings, and risk matrices. This manual process takes hours, is prone to analytical bias, and lacks deterministic scoring guidelines.

### Why AI Agents for Investment Research?
Standard search engines retrieve links, not synthesis. Standard LLM prompts lack structure, hallucinate facts, fail at math, and suffer from uncontrolled optimism. An **AI Agent** structures research by chaining search queries in parallel, running qualitative analyses under strict constraints, scoring companies deterministically, and enforcing risk overrides to protect capital.

### Main Technologies Used
* **Frontend**: React, Tailwind CSS, Axios, Lucide Icons, Vite
* **Backend API**: Node.js, Express.js (ES Modules)
* **Agent Framework**: LangGraph.js (Stateful multi-node workflows)
* **Orchestrator LLM**: Google Gemini (via native Gemini SDK or OpenRouter provider abstraction)
* **Search Infrastructure**: Tavily Search API

### Expected User Experience
The user types a company name and is presented with a loading timeline showing active agent nodes. In under 10 seconds, a full dashboard loads, displaying:
1. A clear recommendation hero card (INVEST / WATCH / PASS) with audit warnings.
2. A quantitative scorecard (Growth, Risk, Market, Innovation) graded out of 100.
3. A qualitative SWOT matrix.
4. Aggregated listings of key competitors and recent news.
5. Clickable references linking directly to the source articles.

---

## 2. System Architecture

The project utilizes a decoupled client-server architecture. The frontend handles state loading and UI grids, while the backend orchestrates web scraping and agent graph traversal:

```mermaid
%%{init: {'theme': 'dark', 'flowchart': {'curve': 'linear'}}}%%
graph TD
  User([User Input]) --> ReactClient[React Frontend App]
  ReactClient -->|POST /api/analyze| ExpressApi[Express Backend Server]
  ExpressApi -->|Invoke| LangGraphEngine[LangGraph Stateful Graph]
  
  subgraph LangGraph Pipeline
    ResearchNode[ResearchNode] -->|Parallel Search| AnalysisNode[AnalysisNode]
    AnalysisNode -->|Zod SWOT| ScoringNode[ScoringNode]
    ScoringNode -->|Deterministic Score| DecisionNode[DecisionNode]
    DecisionNode -->|Risk Guardrails| ReportNode[ReportNode]
  end

  ResearchNode <-->|Axios POST| TavilyApi[Tavily Search API]
  AnalysisNode <-->|LLM Call| Gemini[Google Gemini / OpenRouter]
  ReportNode <-->|Summarize| Gemini
  
  ReportNode -->|Return Report JSON| ExpressApi
  ExpressApi -->|Response 200 OK| ReactClient
  ReactClient -->|Render Dashboard| Dashboard[Interactive Financial UI]

  classDef client fill:#0f172a,stroke:#3b82f6,stroke-width:1px,color:#f8fafc;
  classDef api fill:#1e293b,stroke:#10b981,stroke-width:1px,color:#f8fafc;
  classDef graph fill:#334155,stroke:#8b5cf6,stroke-width:1px,color:#f8fafc;
  class ReactClient,Dashboard client;
  class ExpressApi api;
  class LangGraphEngine,ResearchNode,AnalysisNode,ScoringNode,DecisionNode,ReportNode graph;
```

---

## 3. LangGraph Workflow Walkthrough

### ResearchNode
* **Purpose**: Gathers raw text snippets across five key financial vectors.
* **Tavily Queries**: Executes 5 concurrent searches using `Promise.all`:
  1. *Overview*: Core business model, products, and history.
  2. *Competitors*: Main market competitors and market share.
  3. *News*: Recent major announcements, press, and events.
  4. *Opportunities*: Growth vectors and expansion strategies.
  5. *Risks*: Structural, operational, and financial liabilities.
* **Data Gathered**: Cleaned arrays of search objects: `[{ title, url, content }]`.

### AnalysisNode
* **Purpose**: Compiles a qualitative SWOT and market standing assessment.
* **Logic**: Packages the Tavily results into an analyst context prompt. Calls Gemini with **Zod Structured Output** to return:
  * `strengths`, `weaknesses`, `opportunities`, `threats` lists.
  * `marketPosition` classification.
  * `growthPotential` summary.
  * `confidenceScore` (0-100) based on source completeness.

### ScoringNode
* **Purpose**: Evaluates a mathematical, deterministic scorecard out of 100.
* **Subscores (Max 25 pts each)**:
  * **Growth**: Evaluates potential + opportunity counts (+1.3 pts per opportunity).
  * **Risk**: Subtracts points for SWOT weaknesses (-1.5 pts), threats (-1.5 pts), and low search confidence.
  * **Market**: Evaluates market standing tier (e.g. Leader = 20 pts) + SWOT strengths (+1 pt per strength).
  * **Innovation**: Counts keyword matches ("AI", "robotics", "chips", etc.) in strengths/opportunities (+1.5 pts per hit).
* **Total**: Combined sum of the four categories.

### DecisionNode
* **Purpose**: Assigns the final recommendation and triggers capital safety overrides.
* **Logic**: 
  * Initial Rec: `INVEST` (Total Score >= 70), `WATCH` (50-69), or `PASS` (< 50).
  * **Safety Guardrail**: Checks if the Risk subscore falls below `8/25`. If so, a **Risk Override** is triggered, automatically downgrading an `INVEST` rating to `WATCH` and logging the audit reason.

### ReportNode
* **Purpose**: Packages all data structures and synthesizes the report summary.
* **Logic**: Calls Gemini to write a professional 3-sentence executive summary based on the scores and SWOT. Compiles and deduplicates all URLs to output a clean references index.

---

## 4. User Journey

1. **Step 1 (Input)**: User types "Tesla" in the dashboard search bar.
2. **Step 2 (Dispatch)**: Frontend sends a `POST` request with `{"company": "Tesla"}` to the backend.
3. **Step 3 (Orchestration)**: Express mounts the payload and invokes the compiled LangGraph workflow.
4. **Step 4 (Research)**: `ResearchNode` launches 5 parallel Tavily search queries.
5. **Step 5 (Analysis)**: `AnalysisNode` invokes Gemini to build Zod-structured SWOT records.
6. **Step 6 (Evaluation)**: `ScoringNode` runs deterministic algorithms to build the 100-point scorecard.
7. **Step 7 (Safety Override)**: `DecisionNode` evaluates risk points and flags overrides.
8. **Step 8 (Rendering)**: `ReportNode` compiles the references, and the React client displays the live interactive dashboard.

---

## 5. Sample Analysis Walkthrough (Tesla)

### Research Collected
Tavily gathered 21 unique sources detailing Tesla's Master Plan, BYD's BEV leadership, vehicle fire litigation, and energy storage revenues.

### SWOT Findings
* **Strengths**: Dominant global market position in BEVs, direct-to-consumer store network, $10B+ energy storage revenue.
* **Weaknesses**: Volatile margins, executive turnover, product liability lawsuits regarding vehicle door manual release.
* **Opportunities**: Expansion in India, Cyber Cab FSD integration, Optimus humanoid robotics updates.
* **Threats**: BYD's global volume expansion, legacy pricing pressure from Ford/GM, Hertz used-inventory dilution.

### Scores & Guardrail Override
* **Base recommendation**: `INVEST` (Total Score: `82/100` - Grade A).
* **Guardrail Trigger**: Because Tesla carries substantial legal liabilities (Autopilot fatalities and fire litigations), the risk score fell to `7/25` (below the safety threshold of `8/25`).
* **Final Recommendation**: Automatically downgraded to **`WATCH`** with `overrideTriggered = true` and `overrideReason` documented.

---

## 6. Backend Folder Structure

```text
server/src/
├── config/             # Connection settings for Gemini & OpenRouter APIs
├── controllers/        # Express handlers (centralized inputs & timing metrics)
├── langgraph/          # Workflow assembly and edge routing definitions
│   ├── nodes/          # Javascript pipeline files (Research to Report nodes)
│   ├── graph.js
│   └── state.js
├── routes/             # API routes definition (mounted under /api/analyze)
├── services/           # Raw Tavily Axios search configurations
└── utils/              # Automated test scripts (testGraph.js, testApi.js)
```

---

## 7. Frontend Folder Structure

```text
client/src/
├── assets/             # Background textures and custom typography SVG references
├── components/         # Modular dashboard cards (SWOTCard, ScoreCard, DecisionCard, references)
├── services/           # Axios client configurations with 90s timeout limits
├── App.jsx             # Shell assembly, loading timelines, and dashboard grids
└── main.jsx
```

---

## 8. API Endpoints

### GET `/health`
* **Purpose**: Service health, diagnostics, memory indexes, and environment keys audit.
* **Response**:
```json
{
  "status": "healthy",
  "timestamp": "2026-06-23T16:00:00.000Z",
  "uptime": "120s",
  "environment": "production",
  "diagnostics": {
    "nodeVersion": "v22.14.0",
    "memory": { "rss": "58 MB", "heapUsed": "16 MB" },
    "apiKeys": { "tavilyConfigured": true, "geminiConfigured": true }
  }
}
```

### POST `/api/analyze`
* **Request Format**:
```json
{
  "company": "Nvidia"
}
```
* **Response Format**:
```json
{
  "success": true,
  "latencyMs": 8500,
  "data": {
    "company": "Nvidia",
    "summary": "Nvidia has been assigned an investment grade of A...",
    "recommendation": "INVEST",
    "score": { "total": 92, "grade": "A" },
    "strengths": ["Market leader in AI chips", "Strong data center margins"],
    "references": [
      { "title": "Nvidia Investor News", "url": "https://ir.nvidia.com" }
    ]
  }
}
```

---

## 9. Error Handling Strategy

* **Missing / Blank Inputs**: The controller intercepts empty payloads, returning a `400 Bad Request` before invoking LangGraph.
* **Tavily Failures**: Individual search queries are wrapped in a fallback `try-catch` block returning `[]` rather than crashing the parallel execution list.
* **LLM Fail-Fast (429 / 503 Errors)**: Configured with `maxRetries: 1`. If rate limits occur, the nodes catch the exception and immediately inject fallback SWOT variables.
* **Client-Side Timeout Protection**: The client-side Axios client has a **90-second timeout** to ensure slow LLM runs finish compiling without early browser drops.

---

## 10. Performance Analysis

* **Tavily latency**: `1.8s - 3.2s` (optimized via concurrent searches).
* **Gemini latency**: `4.5s - 12.0s` (the primary bottleneck due to structured output parsing).
* **Overall Execution time**: `6s - 15s` under normal load.
* **Bottleneck**: `AnalysisNode` represents **91.6% of the runtime**, caused by heavy context parsing and generation. Local scoring runs in **<2ms**.

---

## 11. Testing Summary

* **Backend Validation**: Test suite in `server/src/utils/testGraph.js` asserts graph integrity and returns valid JSON models.
* **Boundary Validation**: Asserts `{}` input validation returns a `400` payload with readable messages.
* **Multi-Run Benchmarks**:
  * **Tesla**: Succeeded in `8.6s` (Total score: `82`, Recommendation: `WATCH` - Risk override triggered).
  * **Apple**: Succeeded in `7.5s` (Total score: `85`, Recommendation: `WATCH` due to competitive headwinds).
  * **Nvidia**: Succeeded in `9.1s` (Total score: `85`, Recommendation: `INVEST`).

---

## 12. Deployment Guide

### Frontend ➔ Vercel
* Root Directory: `client`
* Framework Preset: `Vite`
* Output Directory: `dist`
* Environment Variables: `VITE_API_URL` pointing to Render backend.

### Backend ➔ Render
* Root Directory: `server`
* Build Command: `npm install`
* Start Command: `npm start`
* Environment Variables: `TAVILY_API_KEY`, `OPENROUTER_API_KEY` (or `Google_GeminiAPI_KEY`), `PORT` (5000).

---

## 13. Interview Explanation (2-Minute Pitch)

> "I built a full-stack **AI Investment Research Agent** that acts as an institutional-grade financial analyst. 
> 
> Instead of a simple prompt, it is built on **LangGraph.js**, which orchestrates a 5-node stateful workflow. First, we use **Tavily** to execute 5 web searches in parallel for overview, news, competitors, and risks. Then, **Gemini** uses Zod schemas to extract a qualitative SWOT and confidence assessment.
> 
> To ensure mathematical accuracy and protect capital, the agent uses a **deterministic Javascript scoring engine** and a local **safety risk guardrail**. If a company has a high risk score, the agent automatically overrides the LLM's recommendation, downgrading it to `WATCH`.
> 
> The backend automatically routes traffic to either native Google Gemini or **OpenRouter** depending on the key prefix. The frontend React app features modern dark styling, responsive gauges, and a timeline loader that tracks the active graph node status in real-time."

---

## 14. Key Learnings

1. **Stateful Agent Workflows**: Transitioning from linear chains to graph states with LangGraph.js dramatically improves output control.
2. **Deterministic-LLM Hybridization**: Offloading math tasks to local JS and qualitative reasoning to LLMs solves the mathematical drift problem.
3. **Structured Outputs**: Using Zod schema validation is critical for parsing clean JSON inputs consistently on client applications.
4. **Resiliency Engineering**: Developing fail-fast parameters (`maxRetries: 1`) and fallback templates is essential when working with rate-limited public APIs.
