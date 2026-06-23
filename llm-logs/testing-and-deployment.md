# LLM Development Log: Testing, Troubleshooting & Deployment

This document records the testing methodologies, bug fixes for free-tier rate limits, and configuration settings used to deploy the application to Vercel and Render.

---

## 1. Prompt: Local API Validation & Testing Scripts
**Prompt:**
> "I want to write a node script to test the graph pipeline locally with different inputs (valid, empty string, non-existent companies) and verify it returns correct JSON schemas without crashing the server. How should I write it?"

### AI Recommendations Received:
* Create a test utility `runFullTestSuite.js` that directly executes queries against the compiled graph workflow.
* Include assertions to check:
  * Proper HTTP response status codes.
  * Validation checks for empty inputs (`{ company: "" }`) or spacing.
  * Presence of final scorecard variables and reference citation arrays.
* Test against edge cases like rate limits to verify that the server catches the exception and falls back to structured objects rather than crashing.

### Decisions & Outcomes:
* Created [runFullTestSuite.js](file:///c:/downloads/InsideIIM/server/src/utils/runFullTestSuite.js) and [testGraph.js](file:///c:/downloads/InsideIIM/server/src/utils/testGraph.js). They verify the graph compiles, executes nodes in the correct order, and handles validation triggers properly.

---

## 2. Prompt: Troubleshooting Rate Limits & Timeout Errors
**Prompt:**
> "My frontend keeps timing out after 45 seconds when using a free Gemini key because Google returns 429 quota errors. LangChain's retry logic loops exponentially, keeping the request hanging until the client disconnects. How can I resolve this?"

### AI Recommendations Received:
1. **Reduce LLM Retry Cycles**: In your `ChatGoogleGenerativeAI` and `ChatOpenAI` options, configure `maxRetries: 1` (or `0`). This forces the client to fail fast and trigger the fallback `catch` block immediately instead of hanging in a retry loop.
2. **Increase Client Timeout**: Set the Axios client-side request timeout in `client/src/services/api.js` from `45000` to `90000` (90 seconds). This provides a safety buffer during slow LLM response generations under heavy server loads.
3. **Graceful SWOT Fallback**: In `AnalysisNode.js`, catch errors, log the API message, and return fallback values:
   ```javascript
   catch (error) {
     return {
       analysis: {
         strengths: ["Unable to analyze strengths due to API timeout/failure."],
         ...
       }
     }
   }
   ```

### Decisions & Outcomes:
* Set `maxRetries: 1` in `gemini.js`.
* Raised the Axios timeout in `api.js` to `90000ms`.
* Verified that when a 429 quota or 503 service overload occurs, the backend finishes and returns the complete scorecard and recommendation report to the React client in **under 6 seconds** instead of timing out.

---

## 3. Prompt: Production Deployments (Vercel & Render)
**Prompt:**
> "I'm deploying the backend to Render and the React/Vite frontend to Vercel. My project is a monorepo (client/ and server/ in the same repository). What are the exact build commands, start commands, root directories, and environment secrets I should configure?"

### AI Recommendations Received:
#### Backend (Render):
* **Root Directory**: `server`
* **Build Command**: `npm install`
* **Start Command**: `npm start`
* **Environment Variables**: Add your `TAVILY_API_KEY`, `OPENROUTER_API_KEY` (or `Google_GeminiAPI_KEY`), and `PORT` (e.g. `5000`).

#### Frontend (Vercel):
* **Root Directory**: `client`
* **Framework Preset**: `Vite`
* **Build Command**: `npm run build`
* **Output Directory**: `dist`
* **Environment Variables**: Add `VITE_API_URL` pointing to your deployed backend domain (e.g. `https://insideiim.onrender.com`).

### Decisions & Outcomes:
* Both configurations were successfully saved, and the production build compiles perfectly. The live app routes traffic seamlessly from the Vercel CDN to the Render server.
