import { Router } from "express";
import { analyzeCompany } from "../controllers/analyzeController.js";

const router = Router();

/**
 * Route: POST /api/analyze
 * Body: { "company": "Company Name" }
 */

router.post("/analyze", analyzeCompany);

export default router;
