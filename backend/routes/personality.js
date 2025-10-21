import express from "express";
import axios from "axios";
import { answersToText } from "../utils/answersToText.js";

const router = express.Router();

/* 🧠 Analyze personality using FastAPI model and forward results */
router.post("/analyze", async (req, res) => {
  try {
    const { answers } = req.body;
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: "Missing Authorization header" });
    }

    console.log("🧠 Incoming personality analysis request");

    if (!Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({ error: "Invalid or missing answers array" });
    }

    // Convert answers → descriptive text for model
    const text = answersToText(answers);
    console.log("📝 Generated text:", text);

    // Call the FastAPI service
    const modelResponse = await axios.post("http://localhost:8001/predict", { text });

    if (!modelResponse.data || !modelResponse.data.personality) {
      console.error("❌ Invalid model response:", modelResponse.data);
      return res.status(500).json({ error: "Model returned invalid data" });
    }

    const traits = modelResponse.data.personality;
    const summaryFromModel = modelResponse.data.summary || "No summary available.";
    console.log("✅ Model traits:", traits);
    console.log("🧭 Model summary:", summaryFromModel);

    // Normalize between 0–1 for safety
    const normalized = Object.fromEntries(
      Object.entries(traits).map(([key, val]) => [key, Math.min(Math.max(val, 0), 1)])
    );

    // Forward personality data to main InstaHang backend
    try {
      await axios.post(
        "http://localhost:8500/interests/updatePersonality",
        { personality: normalized, summary: summaryFromModel },
        { headers: { Authorization: authHeader } }
      );
      console.log("💾 Personality + summary successfully forwarded to main backend.");
    } catch (forwardError) {
      console.warn("⚠️ Error forwarding to InstaHang backend:", forwardError.message);
    }

    // Final response to frontend
    res.json({
      success: true,
      personality: normalized,
      summary: summaryFromModel,
      generatedText: text,
    });
  } catch (err) {
    console.error("🔥 Personality analyze error:", err.message);
    res.status(500).json({
      error: "Personality analysis failed",
      details: err.message,
    });
  }
});

export default router;
