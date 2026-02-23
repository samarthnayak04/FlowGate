const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();

const authRoutes = require("./routes/authRoutes");
const authMiddleware = require("./middleware/authMiddleware");
const requestRoutes = require("./routes/requestRoutes");
const userRoutes = require("./routes/userRoutes");

app.use(express.json());

app.use(cookieParser());
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGIN || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
    credentials: true, // ✅ required for cookies to work cross-origin
  }),
);
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/requests", requestRoutes);
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "FlowGate backend is running",
  });
});
app.get("/api/test", authMiddleware, (req, res) => {
  res.json({
    message: "Protected route working",
    user: req.user,
  });
});
module.exports = app;
