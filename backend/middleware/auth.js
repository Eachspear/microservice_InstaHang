import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.warn("⚠️ No Authorization header found");
    return res.status(401).json({ error: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  console.log("🔑 Received JWT:", token.substring(0, 20) + "...");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Token decoded successfully:", decoded);

    // ✅ Handles both { id } and { userId } tokens
    req.userId = decoded.userId || decoded.id;

    next();
  } catch (err) {
    console.error("❌ Token verification failed:", err.message);
    return res.status(401).json({ error: "Invalid token" });
  }
};
