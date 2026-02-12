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

router.get("/my", authMiddleware, getMyRequests);

module.exports = router;
