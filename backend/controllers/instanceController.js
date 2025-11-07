// controllers/ec2Controller.js
import { getInstances, getInstancesSummaryByState, getAllRegions } from "../models/instanceModel.js";
import { syncEC2InstancesFromAWS } from "../awsSync.js";

export async function fetchInstances(req, res) {
  try {
    const { page = 1, limit = 10, state, region, search } = req.query;
    const data = await getInstances({ page, limit, state, region, search });
    return res.json(data);
  } catch (err) {
    console.error("fetchInstances error:", err);
    return res.status(500).json({ error: "Failed to fetch instances" });
  }
}

export async function fetchSummary(req, res) {
  try {
    const data = await getInstancesSummaryByState();
    return res.json(data);
  } catch (err) {
    console.error("fetchSummary error:", err);
    return res.status(500).json({ error: "Failed to fetch summary" });
  }
}

export async function fetchRegions(req, res) {
  try {
    const regions = await getAllRegions();
    return res.json(regions);
  } catch (err) {
    console.error("fetchRegions error:", err);
    return res.status(500).json({ error: "Failed to fetch regions" });
  }
}

export async function syncInstances(req, res) {
  try {
    const instances = await syncEC2InstancesFromAWS();
    return res.json({ success: true, count: instances.length });
  } catch (err) {
    console.error("syncInstances error:", err);
    return res.status(500).json({ error: "Failed to sync from AWS", details: err.message });
  }
}
