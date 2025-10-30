import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  console.log("\n==============================");
  console.log("🔐 Incoming Auth Request");
  console.log("📅 Time:", new Date().toLocaleString());
  console.log("🧠 Path:", req.originalUrl);

  const authHeader = req.headers.authorization;
  console.log("📬 Authorization Header:", authHeader || "❌ None provided");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.warn("⚠️ No Authorization header found or invalid format");
    console.log("==============================\n");
    return res.status(401).json({ error: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  console.log("🔑 Extracted JWT (first 30 chars):", token.substring(0, 30) + "...");
  console.log("🔧 Checking environment variable JWT_SECRET...");
  console.log(
    process.env.JWT_SECRET
      ? "✅ JWT_SECRET loaded successfully"
      : "❌ JWT_SECRET is missing!"
  );

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Token decoded successfully!");
    console.log("📦 Decoded payload:", decoded);

    // Handles both { id } and { userId } tokens
    req.userId = decoded.userId || decoded.id;
    console.log("👤 Assigned req.userId:", req.userId);

    console.log("==============================\n");
    next();
  } catch (err) {
    console.error("❌ Token verification failed!");
    console.error("🧩 Error message:", err.message);
    console.error("📘 Stack trace:", err.stack);
    console.log("==============================\n");
    return res.status(401).json({ error: "Invalid token" });
  }
};

