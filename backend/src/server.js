// src/server.js

require("dotenv").config();
const mongoose = require("mongoose");
const app = require("./app");

// ✅ Fail fast if critical env vars are missing
if (!process.env.JWT_SECRET) {
  console.error("FATAL: JWT_SECRET is not set.");
  process.exit(1);
}

if (!process.env.MONGO_URI) {
  console.error("FATAL: MONGO_URI is not set.");
  process.exit(1);
}

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  });
