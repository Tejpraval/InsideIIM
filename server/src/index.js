import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS so the React frontend can query this API
app.use(cors());

// Parse incoming JSON requests
app.use(express.json());

// Basic health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    message: "Investment Research Agent backend is running."
  });
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error("Global Error Handler caught:", err.stack || err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || "An internal server error occurred."
  });
});

// Start the Express server
app.listen(PORT, () => {
  console.log(`=================================================`);
  console.log(`Server is running in ${process.env.NODE_ENV || "development"} mode`);
  console.log(`Port: ${PORT}`);
  console.log(`Health Check: http://localhost:${PORT}/health`);
  console.log(`=================================================`);
});
