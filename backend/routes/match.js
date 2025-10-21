import express from "express";
import User from "../models/User.js";

const router = express.Router();

function cosineSimilarity(a, b) {
  const dot = a.reduce((sum, v, i) => sum + v * b[i], 0);
  const magA = Math.sqrt(a.reduce((s, v) => s + v*v, 0));
  const magB = Math.sqrt(b.reduce((s, v) => s + v*v, 0));
  return dot / (magA * magB);
}

router.get("/recommendations/:userId", async (req, res) => {
  try {
    const current = await User.findById(req.params.userId);
    const users = await User.find({ _id: { $ne: current._id } });

    const currentVec = Object.values(current.personality || {});
    const results = users.map(u => {
      const vec = Object.values(u.personality || {});
      return { user: u, similarity: cosineSimilarity(currentVec, vec) };
    });

    results.sort((a, b) => b.similarity - a.similarity);
    res.json(results.slice(0, 5));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Match computation failed" });
  }
});

export default router;
