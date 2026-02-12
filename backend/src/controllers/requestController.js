const { Request } = require("../models/Request");
const { AuditLog } = require("../models/AuditLog");
const { REQUEST_STATUS, AUDIT_ACTIONS } = require("../utils/constants");
const { createAuditLog } = require("../services/auditService");

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
    res.status(500).json({ message: error.message });
  }
};

/**
 * 2️⃣ Edit Draft
 */
const updateRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (request.status !== REQUEST_STATUS.DRAFT) {
      return res.status(400).json({ message: "Only draft can be edited" });
    }

    if (request.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

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
    res.status(500).json({ message: error.message });
  }
};

/**
 * 3️⃣ Submit Request
 */
const submitRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (request.status !== REQUEST_STATUS.DRAFT) {
      return res.status(400).json({ message: "Only draft can be submitted" });
    }

    if (request.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

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
    res.status(500).json({ message: error.message });
  }
};

/**
 * 4️⃣ Approve Request
 */
const approveRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (request.status !== REQUEST_STATUS.SUBMITTED) {
      return res
        .status(400)
        .json({ message: "Only submitted requests can be approved" });
    }

    if (request.assignedApprover.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not assigned approver" });
    }

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
    res.status(500).json({ message: error.message });
  }
};

/**
 * 5️⃣ Reject Request
 */
const rejectRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (request.status !== REQUEST_STATUS.SUBMITTED) {
      return res
        .status(400)
        .json({ message: "Only submitted requests can be rejected" });
    }

    if (request.assignedApprover.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not assigned approver" });
    }

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
    res.status(500).json({ message: error.message });
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
    res.status(500).json({ message: error.message });
  }
};

/**
 * 7️⃣ Get Request Logs
 */
const getRequestLogs = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

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
    res.status(500).json({ message: error.message });
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
};
