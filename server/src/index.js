import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import analyzeRouter from "./routes/analyze.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS so the React frontend can query this API
app.use(cors());

// Parse incoming JSON requests
app.use(express.json());

// Mount the API Router under /api prefix
app.use("/api", analyzeRouter);

// Upgraded Health Check Endpoint (Diagnostics & Audit)
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: `${Math.round(process.uptime())}s`,
    environment: process.env.NODE_ENV || "development",
    diagnostics: {
      nodeVersion: process.version,
      memory: {
        rss: `${Math.round(process.memoryUsage().rss / 1024 / 1024)} MB`,
        heapUsed: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)} MB`,
      },
      apiKeys: {
        tavilyConfigured: !!process.env.TAVILY_API_KEY,
        geminiConfigured: !!process.env.Google_GeminiAPI_KEY || !!process.env.GOOGLE_API_KEY,
      }
    }
  });
});

// Centralized error handling middleware
app.use((err, req, res, next) => {
  console.error("Global Error Handler caught:", err.stack || err);
  
  const statusCode = err.status || 500;
  
  res.status(statusCode).json({
    success: false,
    statusCode,
    error: err.message || "An unexpected internal server error occurred."
  });
});

// Start the Express server
app.listen(PORT, () => {
  console.log(`=================================================`);
  console.log(`AI Investment Research Agent Server is Active`);
  console.log(`Port: ${PORT}`);
  console.log(`Health Check: http://localhost:${PORT}/health`);
  console.log(`API Endpoint: http://localhost:${PORT}/api/analyze`);
  console.log(`=================================================`);
});
