import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import personalityRoutes from "./routes/personality.js";
import matchRoutes from "./routes/match.js";
import { authMiddleware } from "./middleware/auth.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// ✅ MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.log(err));

// ✅ Routes (with authentication)
app.use("/api/personality", authMiddleware, personalityRoutes);
app.use("/api/match", authMiddleware, matchRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
