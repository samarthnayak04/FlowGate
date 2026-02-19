// src/middleware/authMiddleware.js

const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    // ✅ Read token from HTTP-only cookie instead of Authorization header
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;
    // decoded contains { id, role }

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = authMiddleware;
