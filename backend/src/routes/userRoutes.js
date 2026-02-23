const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { User } = require("../models/User");

router.get("/approvers", authMiddleware, async (req, res) => {
  try {
    const approvers = await User.find({ role: "APPROVER" }).select(
      "_id name email",
    );
    res.json(approvers);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
