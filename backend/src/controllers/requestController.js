const { Request } = require("../models/Request");
const { AuditLog } = require("../models/AuditLog");
const { REQUEST_STATUS, AUDIT_ACTIONS } = require("../utils/constants");
const { createAuditLog } = require("../services/auditService");

const isDev = process.env.NODE_ENV === "development";
const serverError = (res, error) =>
  res
    .status(500)
    .json({
      message: "Server error",
      error: isDev ? error.message : undefined,
    });

/**
 * 1️⃣ Create Request (Draft)
 */
const createRequest = async (req, res) => {
  try {
    const { title, type, description, assignedApprover } = req.body;

    const request = await Request.create({
      title,
      type,
      description,
      createdBy: req.user.id,
      assignedApprover,
    });

    await createAuditLog({
      requestId: request._id,
      action: AUDIT_ACTIONS.CREATE,
      fromStatus: null,
      toStatus: REQUEST_STATUS.DRAFT,
      performedBy: req.user.id,
    });

    res.status(201).json(request);
  } catch (error) {
    serverError(res, error);
  }
};

/**
 * 2️⃣ Edit Draft
 */
const updateRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);

    if (!request) return res.status(404).json({ message: "Request not found" });
    if (request.status !== REQUEST_STATUS.DRAFT)
      return res.status(400).json({ message: "Only draft can be edited" });
    if (request.createdBy.toString() !== req.user.id)
      return res.status(403).json({ message: "Not authorized" });

    const { title, type, description } = req.body;
    request.title = title || request.title;
    request.type = type || request.type;
    request.description = description || request.description;
    await request.save();

    await createAuditLog({
      requestId: request._id,
      action: AUDIT_ACTIONS.UPDATE,
      fromStatus: REQUEST_STATUS.DRAFT,
      toStatus: REQUEST_STATUS.DRAFT,
      performedBy: req.user.id,
    });

    res.json(request);
  } catch (error) {
    serverError(res, error);
  }
};

/**
 * 3️⃣ Submit Request
 */
const submitRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);

    if (!request) return res.status(404).json({ message: "Request not found" });
    if (request.status !== REQUEST_STATUS.DRAFT)
      return res.status(400).json({ message: "Only draft can be submitted" });
    if (request.createdBy.toString() !== req.user.id)
      return res.status(403).json({ message: "Not authorized" });

    const oldStatus = request.status;
    request.status = REQUEST_STATUS.SUBMITTED;
    await request.save();

    await createAuditLog({
      requestId: request._id,
      action: AUDIT_ACTIONS.SUBMIT,
      fromStatus: oldStatus,
      toStatus: REQUEST_STATUS.SUBMITTED,
      performedBy: req.user.id,
    });

    res.json(request);
  } catch (error) {
    serverError(res, error);
  }
};

/**
 * 4️⃣ Approve Request
 */
const approveRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);

    if (!request) return res.status(404).json({ message: "Request not found" });
    if (request.status !== REQUEST_STATUS.SUBMITTED)
      return res
        .status(400)
        .json({ message: "Only submitted requests can be approved" });
    if (request.assignedApprover.toString() !== req.user.id)
      return res.status(403).json({ message: "Not assigned approver" });

    const oldStatus = request.status;
    request.status = REQUEST_STATUS.APPROVED;
    await request.save();

    await createAuditLog({
      requestId: request._id,
      action: AUDIT_ACTIONS.APPROVE,
      fromStatus: oldStatus,
      toStatus: REQUEST_STATUS.APPROVED,
      performedBy: req.user.id,
    });

    res.json(request);
  } catch (error) {
    serverError(res, error);
  }
};

/**
 * 5️⃣ Reject Request
 */
const rejectRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);

    if (!request) return res.status(404).json({ message: "Request not found" });
    if (request.status !== REQUEST_STATUS.SUBMITTED)
      return res
        .status(400)
        .json({ message: "Only submitted requests can be rejected" });
    if (request.assignedApprover.toString() !== req.user.id)
      return res.status(403).json({ message: "Not assigned approver" });

    const oldStatus = request.status;
    request.status = REQUEST_STATUS.REJECTED;
    await request.save();

    await createAuditLog({
      requestId: request._id,
      action: AUDIT_ACTIONS.REJECT,
      fromStatus: oldStatus,
      toStatus: REQUEST_STATUS.REJECTED,
      performedBy: req.user.id,
    });

    res.json(request);
  } catch (error) {
    serverError(res, error);
  }
};

/**
 * 6️⃣ Get My Requests
 */
const getMyRequests = async (req, res) => {
  try {
    const requests = await Request.find({ createdBy: req.user.id });
    res.json(requests);
  } catch (error) {
    serverError(res, error);
  }
};

/**
 * 7️⃣ Get Request Logs
 */
const getRequestLogs = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);

    if (!request) return res.status(404).json({ message: "Request not found" });

    const isCreator = request.createdBy.toString() === req.user.id;
    const isApprover = request.assignedApprover.toString() === req.user.id;
    const isAdmin = req.user.role === "ADMIN";

    if (!isCreator && !isApprover && !isAdmin) {
      return res.status(403).json({ message: "Not authorized to view logs" });
    }

    const logs = await AuditLog.find({ request: request._id })
      .sort({ createdAt: -1 })
      .populate("performedBy", "name role");

    res.json(logs);
  } catch (error) {
    serverError(res, error);
  }
};

/**
 * 8️⃣ User Dashboard
 */
const getUserDashboard = async (req, res) => {
  try {
    const { status } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const query = { createdBy: req.user.id };
    if (status) query.status = status;

    const requests = await Request.find(query)
      .populate("createdBy", "name email")
      .populate("assignedApprover", "name email")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json(requests);
  } catch (error) {
    serverError(res, error);
  }
};

/**
 * 9️⃣ Pending Approvals
 */
const getPendingApprovals = async (req, res) => {
  try {
    const requests = await Request.find({
      assignedApprover: req.user.id,
      status: REQUEST_STATUS.SUBMITTED,
    })
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    serverError(res, error);
  }
};

/**
 * 🔟 Admin - All Requests
 */
const getAllRequestsAdmin = async (req, res) => {
  try {
    const { status, type, createdBy, page = 1, limit = 10 } = req.query;

    const query = {};
    if (status) query.status = status;
    if (type) query.type = type;
    if (createdBy) query.createdBy = createdBy;

    const requests = await Request.find(query)
      .populate("createdBy", "name email")
      .populate("assignedApprover", "name email")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json(requests);
  } catch (error) {
    serverError(res, error);
  }
};

/**
 * 1️⃣1️⃣ Get Request By ID
 */
const getRequestById = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id)
      .populate("createdBy", "name email role")
      .populate("assignedApprover", "name email role");

    if (!request) return res.status(404).json({ message: "Request not found" });

    const isCreator = request.createdBy._id.toString() === req.user.id;
    const isApprover = request.assignedApprover._id.toString() === req.user.id;
    const isAdmin = req.user.role === "ADMIN";

    if (!isCreator && !isApprover && !isAdmin) {
      return res.status(403).json({ message: "Not authorized" });
    }

    res.json(request);
  } catch (error) {
    serverError(res, error);
  }
};

module.exports = {
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
};
