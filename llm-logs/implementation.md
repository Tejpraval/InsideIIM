# LLM Development Log: System Implementation & Node Logic

This document details the prompts, AI recommendations, and coding logic used to implement the individual graph nodes and the React frontend.

---

## 1. Prompt: Qualitative SWOT Analysis with Zod
**Prompt:**
> "How do I force the LLM (Gemini 2.5 Flash) to return a strictly structured JSON object containing SWOT bullet arrays, market position class, growthpotential summary, and confidence score? I want to enforce this using Zod schema validation."

### AI Recommendations Received:
* Use `@langchain/google-genai` and invoke the model with `.withStructuredOutput(zodSchema)`.
* Define the Zod schema explicitly:
  ```javascript
  const analysisSchema = z.object({
    strengths: z.array(z.string()),
    weaknesses: z.array(z.string()),
    opportunities: z.array(z.string()),
    threats: z.array(z.string()),
    marketPosition: z.string(),
    growthPotential: z.string(),
    confidenceScore: z.number().min(0).max(100)
  });
  ```
* Handle connection fallbacks: wrap the LLM call in a `try-catch` block and return pre-formatted error strings (fallback SWOT) so the node never crashes if the API is rate-limited.

### Decisions & Implementation:
* Implemented structured output inside `AnalysisNode.js`. Added a custom system prompt instructing Gemini to avoid unescaped double quotes to prevent parsing errors.

---

## 2. Prompt: Rules-Based Scoring & Risk Override Guardrails
**Prompt:**
> "I want to score the company out of 100 on the server. I don't want the LLM to decide the final score because it's inconsistent. How should I write a local rules-based scoring function?
> Also, if the risk score is too high (risk points < 8/25), I want to force the decision node to downgrade the rating from INVEST to WATCH to protect investor capital. How do we code this?"

### AI Recommendations Received:
1. **Deterministic Scoring**: Divide the scorecard into 4 categories (Growth, Risk, Market, Innovation) each worth 25 points. Calculate the subscores locally in Javascript:
   * **Growth**: Base growth rating modulated by the count of opportunities found (+1.3 pts per SWOT opportunity).
   * **Risk**: Modulated by the count of weaknesses (-1.5 pts) and threats (-1.5 pts) + confidence deductions.
   * **Market**: Modulated by market standing + strengths (+1 pt per SWOT strength).
   * **Innovation**: Count occurrence of keywords like "AI", "cloud", "robotics", "battery", etc. (+1.5 pts per hit).
2. **Safety Override**: Inside the `DecisionNode`, evaluate the final recommendation. If the calculated risk sub-score is less than 8 out of 25:
   * Override the recommendation from `INVEST` to `WATCH`.
   * Set `overrideTriggered = true` and log `overrideReason` for auditing.

### Decisions & Implementation:
* Coded this strictly in `ScoringNode.js` and `DecisionNode.js`. This guarantees that financial scoring remains auditable, deterministic, and safe against raw LLM optimism.

---

## 3. Prompt: Dual API Support (Google Gemini vs OpenRouter)
**Prompt:**
> "I want my backend server to support both a native Google Gemini API key and an OpenRouter API key without changing any code files. How can I write this dynamic configuration?"

### AI Recommendations Received:
Detect the key prefix in your environment variables:
* Native Google keys start with `AIzaSy`.
* OpenRouter keys start with `sk-or-`.
If `sk-or-` is detected:
* Initialize `ChatOpenAI` from `@langchain/openai` and set the `baseURL` to OpenRouter's endpoint: `https://openrouter.ai/api/v1`.
* Map standard model names to OpenRouter equivalents (e.g. `google/gemini-2.5-flash`).
Otherwise, instantiate `ChatGoogleGenerativeAI` natively.

### Decisions & Implementation:
* Rewrote `gemini.js` to dynamically load the correct class depending on `process.env.Google_GeminiAPI_KEY` or `process.env.OPENROUTER_API_KEY`. Added a `maxTokens: 2000` cap to ensure OpenRouter free-tier accounts can execute requests without hitting credit balance limits.

---

## 4. Prompt: Premium Dashboard Frontend UI
**Prompt:**
> "Design a premium React dashboard layout using Tailwind CSS. It should have a dark, modern look, an active loading timeline showing which node is executing, progress bars for scores, a large hero card for the recommendation, SWOT grid cards, and an index of references."

### AI Recommendations Received:
* **Timeline Loader**: Simulate progressive status text ("Querying Tavily...", "Analyzing SWOT with Gemini...") on the client side using intervals to keep the user engaged.
* **Responsive Grid Layout**:
  * Hero banner at the top showing the name, overview, and processing duration.
  * Split column view for the Recommendation Hero Card (with warning alerts if safety overrides triggered) and subscore progress bars.
  * 2x2 grid representing Strengths, Weaknesses, Opportunities, and Threats with Harmonious HSL tailwind colors (emerald, rose, blue, amber).
  * Citations index listing unique URLs at the bottom.

### Decisions & Implementation:
* Created [App.jsx](file:///c:/downloads/InsideIIM/client/src/App.jsx) and modular components. Set the background to a sleek grid pattern (`bg-grid-pattern`) for premium texture.
