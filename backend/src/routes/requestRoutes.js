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
  getMyRequests,
  getRequestLogs,

  getUserDashboard,
  getPendingApprovals,
  getAllRequestsAdmin,
  getRequestById,
} = require("../controllers/requestController");

router.post("/", authMiddleware, createRequest);
router.put("/:id", authMiddleware, updateRequest);
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

// router.get("/my", authMiddleware, getMyRequests);
router.get("/:id/logs", authMiddleware, getRequestLogs);
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

router.get("/:id", authMiddleware, getRequestById);

module.exports = router;
