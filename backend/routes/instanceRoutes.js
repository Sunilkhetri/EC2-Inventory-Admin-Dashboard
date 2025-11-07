// routes/ec2Routes.js
import express from "express";
import { fetchInstances, fetchSummary, fetchRegions, syncInstances } from "../controllers/instanceController.js";

const router = express.Router();

// GET /api/instances?page=1&limit=10&state=running&region=ap-south-1&search=web
router.get("/instances", fetchInstances);

// GET /api/instances/summary  -> [{ state: 'running', count: 8 }, ...]
router.get("/instances/summary", fetchSummary);

// GET /api/regions -> ["ap-south-1", "us-east-1", ...]
router.get("/regions", fetchRegions);

// POST /api/instances/sync -> fetch from AWS and upsert into DB (requires AWS creds)
router.post("/instances/sync", syncInstances);

export default router;
