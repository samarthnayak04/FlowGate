const express = require("express");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());

/**
 * =============================
 * Health Check Route
 * =============================
 */

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "FlowGate backend is running",
  });
});

module.exports = app;
