const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
  createRequest,
  updateRequest,
  submitRequest,
  approveRequest,
  rejectRequest,
  getRequestLogs,
  getUserDashboard,
  getPendingApprovals,
  getAllRequestsAdmin,
  getRequestById,
} = require("../controllers/requestController");

// ─── POST routes ────────────────────────────────────────────
router.post("/", authMiddleware, createRequest);
router.post("/:id/submit", authMiddleware, submitRequest);
router.post(
  "/:id/approve",
  authMiddleware,
  authorizeRoles("APPROVER"),
  approveRequest,
);
router.post(
  "/:id/reject",
  authMiddleware,
  authorizeRoles("APPROVER"),
  rejectRequest,
);

// ─── PUT routes ──────────────────────────────────────────────
router.put("/:id", authMiddleware, updateRequest);

// ─── GET static routes (must come before /:id) ──────────────
router.get("/my", authMiddleware, getUserDashboard);
router.get(
  "/pending",
  authMiddleware,
  authorizeRoles("APPROVER"),
  getPendingApprovals,
);
router.get(
  "/all",
  authMiddleware,
  authorizeRoles("ADMIN"),
  getAllRequestsAdmin,
);

// ─── GET dynamic routes (/:id must be last) ──────────────────
router.get("/:id/logs", authMiddleware, getRequestLogs);
router.get("/:id", authMiddleware, getRequestById);

module.exports = router;
